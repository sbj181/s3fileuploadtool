import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FiShare2, FiDownload } from 'react-icons/fi'; // Import icons for sharing and downloading

function App() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // To track success or error status
  const [s3Url, setS3Url] = useState(''); // Store the S3 URL of the uploaded file

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => setFiles(acceptedFiles),
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      setStatusMessage('No files selected for upload.');
      setIsSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      // Reset progress and status
      setProgress(0);
      setStatusMessage('Uploading...');
      setIsSuccess(false);
      setS3Url(''); // Reset the S3 URL

      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });
      

      // On success, save the S3 URL and display it
      setS3Url(response.data.s3Url);
      setStatusMessage(`File uploaded successfully!`);
      setIsSuccess(true);
      setProgress(100);
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatusMessage('Error uploading file to S3.');
      setIsSuccess(false);
      setProgress(0);
    }
  };

  // Function to copy the S3 URL to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(s3Url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center w-96">
        <h1 className="text-xl font-bold mb-5">Upload Your File</h1>

        {/* Drag and Drop Area */}
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-400 p-5 rounded-lg cursor-pointer mb-5"
        >
          <input {...getInputProps()} />
          <p>Drag & drop files here, or click to select files</p>
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <ul className="mb-5">
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        )}

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-4 mb-5">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>

        {/* Status Message */}
        {statusMessage && (
          <div className='overflow-auto'>
          <p
            className={`mt-4 ${
              isSuccess ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {statusMessage}
          </p>
          </div>
        )}

        {/* Display S3 Link with Share and Download Icons */}
        {isSuccess && s3Url && (
          <div className="mt-4 text-left">
            <a
              href={s3Url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Click here to view the uploaded file
            </a>
            <div className="flex mt-2 space-x-2">
              {/* Copy to Clipboard (Share Icon) */}
              <button
                onClick={handleCopyToClipboard}
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
              >
                <FiShare2 className="w-5 h-5" />
                <span>Copy Link</span>
              </button>

              {/* Download Icon */}
              <a
                href={s3Url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
              >
                <FiDownload className="w-5 h-5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
