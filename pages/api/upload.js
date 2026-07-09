import fs from 'fs';
import path from 'path';
import { EXT_TO_MIME, MIME_TO_EXT } from '../../utils/image';

export const config = {
  api: {
    bodyParser: false,
  },
};

const sendError = async (req, res, status, message) => {
  req.on('data', () => {});
  await new Promise((resolve) => {
    req.on('end', resolve);
    req.on('error', resolve);
  });
  return res.status(status).json({ error: message });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return sendError(req, res, 405, `Method ${req.method} Not Allowed`);
  }

  let contentType = req.headers['content-type'] || '';
  const filenameHeader = req.headers['x-file-name'] || '';

  console.log('UPLOAD REQUEST:', {
    method: req.method,
    contentType,
    filenameHeader,
  });

  if ((contentType === 'application/octet-stream' || !contentType) && filenameHeader) {
    const extName = path.extname(filenameHeader).toLowerCase();
    if (EXT_TO_MIME[extName]) {
      contentType = EXT_TO_MIME[extName];
    }
  }

  if (!contentType.startsWith('image/')) {
    return sendError(req, res, 400, 'Only image files are allowed.');
  }

  const ext = MIME_TO_EXT[contentType] || '.jpg';
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (err) {
    console.error('Error creating upload directory:', err);
    return sendError(req, res, 500, 'Internal Server Error');
  }

  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filePath = path.join(uploadDir, filename);
  const fileStream = fs.createWriteStream(filePath);
  
  let bytesWritten = 0;
  const maxLimit = 10 * 1024 * 1024; // 10MB limit
  let limitExceeded = false;

  try {
    await new Promise((resolve, reject) => {
      const cleanupAndReject = (err) => {
        fileStream.destroy();
        fs.unlink(filePath, () => {});
        reject(err);
      };

      req.on('data', (chunk) => {
        bytesWritten += chunk.length;
        if (bytesWritten > maxLimit) {
          limitExceeded = true;
          req.destroy();
          cleanupAndReject(new Error('LimitExceeded'));
        } else {
          fileStream.write(chunk);
        }
      });

      req.on('end', () => {
        if (!limitExceeded) {
          fileStream.end();
          resolve();
        }
      });

      req.on('error', cleanupAndReject);
      req.on('aborted', () => cleanupAndReject(new Error('Aborted')));
      fileStream.on('error', cleanupAndReject);
    });

    const imageUrl = `/uploads/${filename}`;
    return res.status(200).json({ url: imageUrl });
  } catch (error) {
    if (error.message === 'LimitExceeded') {
      return res.status(400).json({ error: 'File size exceeds the 10MB limit.' });
    }
    if (error.message === 'Aborted') {
      return res.status(400).json({ error: 'Upload aborted by client.' });
    }
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'File upload failed.' });
  }
}
