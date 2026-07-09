# 📌 Reno Notice Board

A modern Notice Board web application built with **Next.js**, **Prisma ORM**, **TiDB Cloud**, and **Tailwind CSS**. The application allows users to create, view, update, and delete notices with server-side validation and persistent database storage.

---

## 🚀 Features

- Create, Read, Update and Delete (CRUD) notices
- Delete confirmation before removing a notice
- Search notices
- Filter by category
- Board View & Grid View
- Upload notice images
- Urgent notices displayed before Normal notices (database-level ordering)
- Responsive user interface built with Tailwind CSS
- Server-side validation
- Prisma ORM with TiDB Cloud database

---

## 🛠 Tech Stack

### Frontend
- Next.js (Pages Router)
- React
- Tailwind CSS
- Axios

### Backend
- Next.js API Routes
- Prisma ORM

### Database
- TiDB Cloud (MySQL Compatible)

### Tools
- Prisma Migrate
- ESLint
- Git & GitHub

---

# Project Structure

```
reno-notice-board
│
├── components/
│   ├── Layout.js
│   ├── NoticeCard.js
│   ├── NoticeForm.js
│   ├── DeleteConfirmationModal.js
│   └── Loading.js
│
├── pages/
│   ├── index.js
│   ├── notice/
│   │     ├── new.js
│   │     └── [id].js
│   │
│   └── api/
│         ├── notices/
│         ├── upload.js
│         └── image.js
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
│     └── uploads/
│
├── styles/
├── lib/
├── utils/
└── README.md
```

---

# Database Schema

Notice Model

| Field | Type |
|--------|------|
| id | Int |
| title | String |
| body | String |
| category | String |
| priority | String |
| publishDate | DateTime |
| image | String |
| createdAt | DateTime |

---

# API Endpoints

| Method | Endpoint | Description |
|----------|----------------|----------------------|
| GET | /api/notices | Fetch all notices |
| POST | /api/notices | Create notice |
| PUT | /api/notices/:id | Update notice |
| DELETE | /api/notices/:id | Delete notice |

---

# Validation

Validation is performed **inside the API routes** before writing to the database.

Checks include:

- Title is required
- Body is required
- Category is valid
- Priority is valid
- Publish Date is valid
- Empty values are rejected

Appropriate HTTP status codes are returned.

---

# Notice Ordering

Urgent notices are displayed before Normal notices using Prisma's `orderBy`.

Example:

```js
orderBy: [
  { priority: "desc" },
  { publishDate: "desc" }
]
```

Sorting is performed on the database side instead of the browser.

---

# How to Run Locally

## 1. Clone Repository

```bash
git clone <repository-url>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file.

Example:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@HOST:4000/DATABASE?sslaccept=strict"
```

Replace the values with your TiDB Cloud connection string.

---

## 4. Run Prisma Migration

```bash
npx prisma migrate dev
```

---

## 5. Generate Prisma Client

```bash
npx prisma generate
```

---

## 6. Start Development Server

```bash
npm run dev
```

Application will run on

```
http://localhost:3000
```

---

# CRUD Workflow

### Create

- Fill notice form
- POST request to API
- Server validation
- Prisma stores data
- Redirect to homepage

### Read

- GET request
- Prisma fetches notices
- Ordered by Priority then Publish Date

### Update (Secure Inline Modal)

- Admin clicks "Edit" on a notice card
- React state stores the notice being edited (`editingNotice`)
- An overlay modal containing the edit form is rendered in place on the dashboard (the notice ID is never exposed in the URL)
- PUT request is sent to `/api/notices/:id`
- The database is updated, the modal is closed, and the board reloads dynamically
- Direct manual navigation to `/notice/[id]` automatically redirects back to the home page `/`

### Delete

- Confirmation dialog
- DELETE request
- Notice removed from database

---

# Assignment Requirements Covered

✅ Create Notice

✅ Read Notices

✅ Update Notice

✅ Delete Notice

✅ API Routes

✅ Prisma ORM

✅ TiDB Cloud Database

✅ Server-side Validation

✅ Persistent Database Storage

✅ Urgent-first Database Ordering

✅ Delete Confirmation

---

# One Thing I Would Improve With More Time

If given more time, I would extend the project with several production-ready features, including:

- User authentication and authorization
- Image upload to cloud storage (AWS S3 or Cloudinary)
- Pagination for large numbers of notices
- Rich text editor for notice content
- Role-based access control so that only authorized users could create, edit, or delete  notices. 
- Automated testing (Jest & Cypress)
- Docker deployment
- CI/CD pipeline using GitHub Actions
- Improved accessibility and SEO
- Dark mode support

---

# AI Usage

AI was used as a **development assistant**, not as a replacement for software engineering knowledge.

Specifically, AI helped with:

- Generating boilerplate code
- Explaining Prisma and Next.js concepts
- Debugging runtime and database errors
- Suggesting cleaner component structures
- Improving UI layout and styling
- Providing code refactoring suggestions
- Reviewing validation logic
- Writing documentation

All generated code was manually reviewed, integrated, modified, and tested before being included in the project. I understood the implementation, made project-specific adjustments, and verified that the application satisfied the assignment requirements.

Using AI significantly reduced repetitive coding time and allowed me to focus more on application architecture, debugging, and functionality rather than manually writing every boilerplate section.

---

# Author

**Bishal Maity**

B.Tech Computer Science & Engineering

Full Stack Web Developer