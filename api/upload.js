const aws = require('aws-sdk');
const multer = require('multer');
const util = require('util');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

// Configure AWS S3
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

const s3 = new aws.S3();

// Multer setup for file uploads
const storage = multer.memoryStorage();  // In serverless, memory storage is ideal
const upload = multer({ storage });

const uploadToS3 = async (file) => {
  const uploadParams = {
    Bucket: 'thegroveryfiles',
    Key: file.originalname,
    Body: file.buffer,  // File stored in memory buffer for serverless
    ContentType: file.mimetype,
  };

  return s3.upload(uploadParams).promise();
};

// Serverless function handler
export default async (req, res) => {
  if (req.method === 'POST') {
    // Parse the incoming file using multer
    const multerUpload = util.promisify(upload.single('file'));
    await multerUpload(req, res);

    try {
      const result = await uploadToS3(req.file);
      res.status(200).json({ message: 'File uploaded successfully to S3', s3Url: result.Location });
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      res.status(500).json({ message: 'Error uploading file to S3' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
