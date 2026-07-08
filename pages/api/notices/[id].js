import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  const noticeId = parseInt(id, 10);

  if (isNaN(noticeId)) {
    return res.status(400).json({ error: 'Invalid notice ID' });
  }

  // Load notice by id to check if it exists
  let notice;
  try {
    notice = await prisma.notice.findUnique({
      where: { id: noticeId },
    });
  } catch (error) {
    console.error('Error finding notice:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  if (!notice) {
    return res.status(404).json({ error: 'Notice not found' });
  }

  if (req.method === 'PUT') {
    try {
      const { title, body, category, priority, publishDate, image } = req.body || {};

      // Server-side validation
      const errors = {};

      if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.title = 'Title is required and cannot be empty.';
      }

      if (!body || typeof body !== 'string' || body.trim() === '') {
        errors.body = 'Body is required and cannot be empty.';
      }

      const validCategories = ['Exam', 'Event', 'General'];
      if (!category || !validCategories.includes(category)) {
        errors.category = `Category must be one of: ${validCategories.join(', ')}.`;
      }

      const validPriorities = ['Normal', 'Urgent'];
      if (!priority || !validPriorities.includes(priority)) {
        errors.priority = `Priority must be one of: ${validPriorities.join(', ')}.`;
      }

      if (!publishDate) {
        errors.publishDate = 'Publish date is required.';
      } else {
        const parsedDate = new Date(publishDate);
        if (isNaN(parsedDate.getTime())) {
          errors.publishDate = 'Publish date must be a valid date.';
        }
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      // Update notice
      const updatedNotice = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image && image.trim() !== '' ? image.trim() : null,
        },
      });

      return res.status(200).json(updatedNotice);
    } catch (error) {
      console.error('Error updating notice:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.notice.delete({
        where: { id: noticeId },
      });
      return res.status(200).json({ message: 'Notice deleted successfully' });
    } catch (error) {
      console.error('Error deleting notice:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
