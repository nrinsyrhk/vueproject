const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to get GMT+8 date
function getGMTPlus8Date() {
  const date = new Date();
  date.setHours(date.getHours() + 8);
  return date;
}

/**
 * @swagger
 * /api/lampiran:
 *   get:
 *     summary: Retrieve all records from TblLampiran
 *     tags:
 *       - Lampiran
 *     description: Fetches all records from TblLampiran and returns them as an array of objects.
 *     responses:
 *       200:
 *         description: Successfully retrieved all records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID:
 *                     type: integer
 *                     description: The ID of the record
 *                     example: 101
 *                   MohonID:
 *                     type: string
 *                     description: The MohonID associated with the record
 *                     example: "1234567890"
 *                   FailPathUrl:
 *                     type: string
 *                     description: URL path to the file
 *                     example: "http://minio-server:9000/krln/uploads/file1.txt"
 *                   CreatedDate:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time the record was created
 *                     example: "2024-11-06T12:34:56+08:00"
 *                   UpdatedDate:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time the record was last updated
 *                     example: "2024-11-06T13:34:56+08:00"
 *       404:
 *         description: No records found
 *       500:
 *         description: Internal Server Error
 */
router.get('/lampiran', async (req, res) => {
  try {
    const lampiranRecords = await prisma.tblLampiran.findMany();
    if (lampiranRecords.length === 0) {
      return res.status(404).json({ error: 'No records found' });
    }
    res.status(200).json(lampiranRecords);
  } catch (error) {
    console.error('Error fetching records from TblLampiran:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/lampiran/getByID:
 *   post:
 *     summary: Retrieve records from TblLampiran by MohonID
 *     tags:
 *       - Lampiran
 *     description: Fetches all records from TblLampiran that match the provided MohonID, passed in the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: string
 *                 description: The MohonID for which to retrieve the records
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID:
 *                     type: integer
 *                     example: 101
 *                   MohonID:
 *                     type: string
 *                     example: "1234567890"
 *                   FailPathUrl:
 *                     type: string
 *                     example: "http://minio-server:9000/krln/uploads/file1.txt"
 *                   CreatedDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-06T12:34:56+08:00"
 */

router.post('/lampiran/getByID', async (req, res) => {
  const { MohonID } = req.body;
  if (!MohonID) {
    return res.status(400).json({ error: 'MohonID is required' });
  }
  try {
    const lampiranRecords = await prisma.tblLampiran.findMany({
      where: { MohonID }
    });
    if (lampiranRecords.length === 0) {
      return res.status(404).json({ error: `No records found for MohonID ${MohonID}` });
    }
    res.status(200).json(lampiranRecords);
  } catch (error) {
    console.error('Error fetching records from TblLampiran:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/lampiran:
 *   post:
 *     summary: Insert a new record into TblLampiran
 *     tags:
 *       - Lampiran
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: string
 *                 example: "1234567890"
 *               FailPathUrl:
 *                 type: string
 *                 example: "http://minio-server:9000/krln/uploads/file1.txt"
 *     responses:
 *       201:
 *         description: Lampiran inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 LampiranID:
 *                   type: integer
 *                   example: 101
 *       400:
 *         description: Invalid request format
 *       500:
 *         description: Internal Server Error
 */
router.post('/lampiran', async (req, res) => {
  const { MohonID, FailPathUrl } = req.body;
  if (!MohonID || !FailPathUrl) {
    return res.status(400).json({ error: 'MohonID and FailPathUrl are required' });
  }
  try {
    const newLampiran = await prisma.tblLampiran.create({
      data: {
        MohonID,
        CreatedDate: getGMTPlus8Date(),
        UpdatedDate: null,
        FailPathUrl
      }
    });
    res.status(201).json({ LampiranID: newLampiran.ID });
  } catch (error) {
    console.error('Failed to insert record into TblLampiran:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/lampiran/update:
 *   post:
 *     summary: Update a record in TblLampiran
 *     tags:
 *       - Lampiran
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID:
 *                 type: integer
 *                 example: 101
 *               MohonID:
 *                 type: string
 *                 example: "1234567890"
 *               FailPathUrl:
 *                 type: string
 *                 example: "http://minio-server:9000/krln/uploads/updated_file.txt"
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/lampiran/update', async (req, res) => {
  const { ID, MohonID, FailPathUrl } = req.body;
  if (!ID) {
    return res.status(400).json({ error: 'ID is required to update a record.' });
  }
  try {
    const updatedLampiran = await prisma.tblLampiran.update({
      where: { ID },
      data: {
        MohonID,
        FailPathUrl,
        UpdatedDate: getGMTPlus8Date()
      }
    });
    res.status(200).json(updatedLampiran);
  } catch (error) {
    console.error('Failed to update record in TblLampiran:', error.message);
    if (error.code === 'P2025') {
      res.status(404).json({ error: `Record with ID ${ID} not found` });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

/**
 * @swagger
 * /api/lampiran/deleteByMohonID:
 *   post:
 *     summary: Delete all records in TblLampiran by MohonID
 *     tags:
 *       - Lampiran
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Records deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "2 record(s) deleted successfully."
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "MohonID is required"
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No records found for MohonID 1234567890"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.post('/lampiran/deleteByMohonID', async (req, res) => {
  const { MohonID } = req.body;
  if (!MohonID) {
    return res.status(400).json({ error: 'MohonID is required' });
  }
  try {
    const deletedRecords = await prisma.tblLampiran.deleteMany({
      where: { MohonID }
    });
    if (deletedRecords.count === 0) {
      return res.status(404).json({ error: `No records found for MohonID ${MohonID}` });
    }
    res.status(200).json({ message: `${deletedRecords.count} record(s) deleted successfully.` });
  } catch (error) {
    console.error('Error deleting records from TblLampiran:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/lampiran/deleteByID:
 *   post:
 *     summary: Delete a record in TblLampiran by ID and MohonID
 *     tags:
 *       - Lampiran
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID:
 *                 type: string
 *                 example: "abc123"
 *               MohonID:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Record(s) deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "1 record(s) deleted successfully."
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID and MohonID are required"
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No records found for ID abc123 with MohonID 1234567890"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.post('/lampiran/deleteByID', async (req, res) => {
  let { ID, MohonID } = req.body;

  // Check for both ID and MohonID in the request body
  if (!ID || !MohonID) {
    return res.status(400).json({ error: 'ID and MohonID are required' });
  }
  ID = parseInt(ID)
  try {
    const deletedRecords = await prisma.tblLampiran.deleteMany({
      where: {
        AND: [
          { ID },
          { MohonID }
        ]
      }
    });

    if (deletedRecords.count === 0) {
      return res.status(404).json({ error: `No records found for ID ${ID} with MohonID ${MohonID}` });
    }

    res.status(200).json({ message: `${deletedRecords.count} record(s) deleted successfully.` });
  } catch (error) {
    console.error('Error deleting records from TblLampiran:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
