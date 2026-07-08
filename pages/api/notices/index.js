import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          {
            priority: 'desc', // 'Urgent' before 'Normal' (alphabetically 'U' > 'N', so desc puts 'Urgent' first)
          },
          {
            publishDate: 'desc', // Newest first within same priority
          },
        ],
      });
      return res.status(200).json(notices);
    } catch (error) {
      console.error('Error fetching notices:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
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

      // Create notice in the database
      const newNotice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image && image.trim() !== '' ? image.trim() : null,
        },
      });

      return res.status(201).json(newNotice);
    } catch (error) {
      console.error('Error creating notice:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

