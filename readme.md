# Grovery File Upload Tool

This is a full-stack file upload tool built using **React** for the frontend and **Express** for the backend. The tool allows users to upload files to an **AWS S3** bucket, and it provides a shareable link to the uploaded file. It also includes drag-and-drop functionality, a progress bar, and clickable icons for sharing and downloading the file.

## Features

- Drag-and-drop file upload
- File upload progress bar
- Uploads files directly to AWS S3
- Displays shareable links with options to copy or download
- Frontend built with React and Tailwind CSS
- Backend handled via serverless functions using Express-like APIs on Vercel

## Project Structure

```bash
groveryfileupload/
├── client/            # React frontend
│   ├── public/        # Public files (favicon, etc.)
│   ├── src/           # React components and assets
│   └── package.json   # Frontend dependencies
├── api/               # Serverless backend for file uploads
│   └── upload.js      # AWS S3 file upload logic
├── .gitignore         # Git ignore file
├── package.json       # Root package file (backend dependencies)
├── vercel.json        # Vercel configuration for deploying frontend and backend
└── README.md          # Project readme
