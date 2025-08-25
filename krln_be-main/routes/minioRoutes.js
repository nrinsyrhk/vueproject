const express = require('express');
const Minio = require('minio');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// This line is good, it loads environment variables from your .env file
require('dotenv').config();

// Initialize the MinIO client using environment variables.
// It's a good practice to handle the case where env variables are missing.
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost', // Fallback to 'localhost' if not defined
  port: parseInt(process.env.MINIO_PORT) || 9000,     // Use a port from env, fallback to 9000
  useSSL: process.env.MINIO_USE_SSL === 'true',      // Use env variable to decide on SSL
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// A helper function to get the current date adjusted to GMT+8
const getGMTPlus8Date = () => {
  const date = new Date();
  date.setHours(date.getHours() + 8);
  return date;
};

// --- Minio Routes ---
/**
 * @swagger
 * tags:
 * name: Minio
 * description: Minio file storage operations
 */

/**
 * @swagger
 * /api/minio/upload:
 * post:
 * summary: Upload a file to MinIO
 * tags: [Minio]
 * description: Uploads a single file to a specified folder in a MinIO bucket.
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * file:
 * type: string
 * format: binary
 * description: The file to upload.
 * customName:
 * type: string
 * description: Optional custom name for the uploaded file.
 * example: "my_custom_file.txt"
 * folderName:
 * type: string
 * description: Optional folder path to upload the file into.
 * example: "uploads/documents"
 * responses:
 * 200:
 * description: File uploaded successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "File uploaded successfully."
 * url:
 * type: string
 * example: "http://localhost:9000/krln/uploads/documents/my_custom_file.txt"
 * etag:
 * type: string
 * example: "f2c4174d1a01b6e4e5b7661b369c3a64"
 * 400:
 * description: Bad Request (e.g., no file provided)
 * 500:
 * description: Server error (e.g., upload failure)
 */
router.post('/upload', (req, res) => {
  // We need to ensure that the file exists from the multipart form data
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file was uploaded.');
  }
  const file = req.files.file;

  const customName = req.body.customName || file.name;
  const folderName = req.body.folderName || '';
  const metaData = { 'Content-Type': file.mimetype };

  // Construct full object path, including the folder
  const objectName = folderName ? `${folderName}/${customName}` : customName;

  minioClient.putObject('krln', objectName, file.data, metaData, (err, etag) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while uploading the file.' });
    }

    // Construct a publicly accessible URL for the uploaded file
    const minioUrl = `http://${minioClient.endPoint}:${minioClient.port}/krln/${objectName}`;

    res.status(200).json({
      message: `File uploaded successfully.`,
      url: minioUrl,
      etag: etag
    });
  });
});

/**
 * @swagger
 * /api/minio/download:
 * get:
 * summary: Download a file
 * tags: [Minio]
 * description: Downloads a file from MinIO storage.
 * parameters:
 * - in: query
 * name: fileName
 * schema:
 * type: string
 * required: true
 * description: The name of the file to download (e.g., "example.txt").
 * - in: query
 * name: folderName
 * schema:
 * type: string
 * description: The folder name containing the file (e.g., "folder/subfolder").
 * responses:
 * 200:
 * description: File downloaded successfully
 * content:
 * application/octet-stream:
 * schema:
 * type: string
 * format: binary
 * 400:
 * description: Bad Request (missing file name)
 * 404:
 * description: File not found
 * 500:
 * description: Server error
 */
// Changed from POST to GET for a more RESTful approach to downloading files
router.get('/download', (req, res) => {
  const { fileName, folderName } = req.query; // Use query parameters for GET request
  if (!fileName) {
    return res.status(400).send('File name is required');
  }

  const objectName = folderName ? `${folderName}/${fileName}` : fileName;

  // We should fetch the file's metadata first to get the correct Content-Type
  minioClient.statObject('krln', objectName, (statErr, stat) => {
    if (statErr) {
      // Check if the error indicates the file was not found
      if (statErr.code === 'NotFound') {
        return res.status(404).send('File not found in MinIO.');
      }
      console.error('Error getting file stats:', statErr);
      return res.status(500).send('Error getting file stats.');
    }

    // Get the file stream from MinIO
    minioClient.getObject('krln', objectName, (err, dataStream) => {
      if (err) {
        console.error('Error fetching file from MinIO:', err);
        return res.status(500).send('Error fetching file from MinIO');
      }

      // Set headers dynamically based on file's metadata
      res.setHeader('Content-Type', stat.metaData['content-type'] || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      // Pipe the data stream to the response
      dataStream.pipe(res);
      dataStream.on('error', (streamErr) => {
        console.error('Error downloading file stream:', streamErr);
        // The headers may have already been sent, so we log the error instead of trying to send a new response
      });
    });
  });
});

/**
 * @swagger
 * /api/minio/fullUpload:
 * post:
 * summary: Upload a PDF file, check for existing file, and save record to database
 * tags: [Minio]
 * description: Uploads a PDF file to a specified folder in MinIO, checks if the file already exists, and if not, creates records in TblLampiran and TblAuditTrail.
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * file:
 * type: string
 * format: binary
 * description: The PDF file to upload.
 * customName:
 * type: string
 * description: Optional custom name for the file.
 * example: "custom_filename.pdf"
 * folderName:
 * type: string
 * description: Optional folder within MinIO to store the file.
 * example: "uploads/documents"
 * MohonID:
 * type: string
 * description: ID associated with the file record in TblLampiran.
 * example: "1234567890"
 * responses:
 * 201:
 * description: File uploaded successfully, and database records created.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * LampiranID:
 * type: integer
 * example: 101
 * message:
 * type: string
 * example: "File uploaded and record created successfully."
 * 400:
 * description: Bad Request (e.g., no file, wrong file type, or file already exists)
 * 500:
 * description: Server error (e.g., MinIO or database failure)
 */
router.post('/fullUpload', async (req, res) => {
  try {
    // Input validation
    if (!req.files || !req.files.file || !req.body.MohonID) {
      return res.status(400).json({ error: 'Missing required fields: file or MohonID.' });
    }

    const file = req.files.file;
    const customName = req.body.customName || file.name;
    const folderName = req.body.folderName || '';
    const metaData = { 'Content-Type': file.mimetype };
    const { MohonID } = req.body;

    // Check if the file is a PDF
    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed.' });
    }

    const objectName = folderName ? `${folderName}/${customName}` : customName;

    // Await statObject to handle the check properly
    try {
      await new Promise((resolve, reject) => {
        minioClient.statObject('krln', objectName, (err, stat) => {
          if (stat) { // If stat object exists, the file exists
            reject({ status: 400, message: `File "${customName}" already exists in "${folderName}".` });
          } else if (err && err.code === 'NotFound') {
            resolve(); // File not found, proceed
          } else {
            reject({ status: 500, message: 'MinIO statObject error.' });
          }
        });
      });
    } catch (checkErr) {
      return res.status(checkErr.status).json({ error: checkErr.message });
    }

    // Now, upload the file
    minioClient.putObject('krln', objectName, file.data, metaData, async (uploadErr, etag) => {
      if (uploadErr) {
        console.error('Failed to upload file to MinIO:', uploadErr);
        return res.status(500).json({ error: 'Failed to upload file to MinIO.' });
      }

      try {
        const minioUrl = `http://${minioClient.endPoint}:${minioClient.port}/krln/${objectName}`;

        const existingPermohonan = await prisma.tblPermohonan.findMany({
          where: { MohonID: MohonID },
        });

        if (existingPermohonan.length === 0) {
          // If the associated record doesn't exist, remove the file from MinIO
          // to avoid orphaned files.
          minioClient.removeObject('krln', objectName, (removeErr) => {
            if (removeErr) console.error('Failed to remove orphaned file:', removeErr);
          });
          return res.status(400).json({ error: `MohonID "${MohonID}" not found.` });
        }

        const newLampiran = await prisma.tblLampiran.create({
          data: {
            MohonID: MohonID,
            CreatedDate: getGMTPlus8Date(),
            NamaFail: customName,
            // You might want to store the URL here too
            // Url: minioUrl,
          },
        });

        await prisma.tblAuditTrail.create({
          data: {
            MohonID: existingPermohonan[0].MohonID,
            PenggunaID: existingPermohonan[0].PenggunaID,
            action: 'UPLOAD LAMPIRAN',
            TableName: 'tblLampiran',
            RecordID: String(newLampiran.ID),
            Reason: 'Update permohonan draf',
            Application: 'api/minio/fullUpload', // Corrected application name
            actiontime: getGMTPlus8Date(),
          },
        });

        res.status(201).json({
          LampiranID: newLampiran.ID,
          url: minioUrl,
          message: `File uploaded and record created successfully`,
        });
      } catch (dbError) {
        console.error('Failed to insert record into TblLampiran:', dbError);
        res.status(500).json({ error: 'Internal Server Error while creating record' });
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/minio/delete:
 * delete:
 * summary: Delete a file from MinIO
 * tags: [Minio]
 * description: Deletes a file from a specified folder in MinIO storage.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * fileName:
 * type: string
 * description: Name of the file to delete
 * example: "file_to_delete.txt"
 * folderName:
 * type: string
 * description: Folder containing the file to delete (optional)
 * example: "uploads/folderName"
 * responses:
 * 200:
 * description: File deleted successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: 'File "file_to_delete.txt" deleted successfully'
 * 400:
 * description: Bad Request (e.g., missing file name)
 * 500:
 * description: Server error (e.g., failed to delete file from MinIO)
 */
// Changed from POST to DELETE for a more RESTful API
router.delete('/delete', (req, res) => {
  const { fileName, folderName = '' } = req.body;
  if (!fileName) {
    return res.status(400).json({ error: 'File name is required.' });
  }

  const objectName = folderName ? `${folderName}/${fileName}` : fileName;

  minioClient.removeObject('krln', objectName, (err) => {
    if (err) {
      console.error('Error deleting file from MinIO:', err);
      return res.status(500).json({ error: 'Error deleting file from MinIO.' });
    }
    res.status(200).json({ message: `File "${fileName}" deleted successfully` });
  });
});


module.exports = router;