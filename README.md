# Reno Notice Board CRUD Application

A premium, company-grade Notice Board application featuring full Create, Read, Update, and Delete (CRUD) operations. Built strictly adhering to the requested Next.js Pages Router JavaScript stack, utilizing Prisma ORM to interact with a hosted TiDB Cloud MySQL database, styled with Tailwind CSS, and optimized for Vercel deployment.

---

## 🛠️ Tech Stack
- **Framework**: Next.js (Pages Router)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS (v4)
- **Database ORM**: Prisma ORM
- **Database**: TiDB Cloud (MySQL-compatible)
- **Deployment**: Vercel

---

## 🚀 How to Run the Project Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18 or higher recommended) and `npm` installed.

### 2. Clone the Repository & Install Dependencies
```bash
git clone <repository-url>
cd reno-notice-board
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory of the project and define your `DATABASE_URL` connecting to your TiDB Cloud (or any MySQL-compatible) database:
```env
DATABASE_URL="mysql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?sslaccept=strict"
```

### 4. Setup the Database Schema
Sync the Prisma schema with your database and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 💡 What to Improve with More Time

Given more time, the key improvement would be **Direct File Upload Integration**:
- Setting up a cloud storage provider (e.g., **Vercel Blob** or **Cloudinary**) to allow users to directly upload local images (drag-and-drop or select file) when publishing a notice, rather than typing in a raw external image URL.
- This would involve writing an API handler to secure temporary upload signatures, saving local copies temporarily, or using a serverless upload stream to return CDN image links for high-performance content delivery.

---

## 🤖 AI Usage Description

This project was built in active pair-programming collaboration with **Antigravity** (an AI coding assistant developed by Google DeepMind):

- **Folder & Project Setup**: Guided the initial layout structure matching the Next.js Pages Router routing conventions.
- **Prisma & MySQL Schema Design**: Assisted in structuring the `Notice` model with appropriate field constraints (like `@db.Text` for longer notice bodies) and generating the schema.
- **API Implementation**: Pair-programmed the REST endpoints (`GET`, `POST`, `PUT`, `DELETE` under `pages/api/notices/`) with proper HTTP methods, status codes, server-side data validations, and database queries.
- **Frontend Components & Pages**: Assisted with implementing responsive layouts, reusable card cards mapping category badges, a custom modal for confirmations, and integrating client-side form controls using `react-hook-form` and `axios`.
- **UI & Aesthetic Polish**: Handled the implementation of a Tailwind CSS-driven class theme toggle, dark mode persistency, and visual card designs styled after the Reno Platform theme.
