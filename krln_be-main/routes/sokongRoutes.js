const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to get GMT+8 time
function getGMTPlus8Date() {
  const date = new Date();
  date.setHours(date.getHours() + 8); // Adjust by 8 hours for GMT+8
  return date;
}

/**
 * @swagger
 * /api/sokong:
 *   post:
 *     summary: Create a new Sokong entry
 *     tags:
 *       - Sokong
 *     description: Creates a new Sokong entry in the database and logs the action in the audit trail. The MohonID must exist in tblPermohonan.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: integer
 *                 description: The ID of the Permohonan associated with the Sokong entry.
 *                 example: 123
 *               PindaanID:
 *                 type: integer
 *                 description: The ID of the Pindaan associated with the Sokong entry.
 *                 example: 456
 *               SemakID:
 *                 type: integer
 *                 description: The ID of the Semak associated with the Sokong entry.
 *                 example: 789
 *               TindakanID:
 *                 type: integer
 *                 description: The ID of the Tindakan associated with the Sokong entry.
 *                 example: 321
 *               Ulasan:
 *                 type: string
 *                 description: Comments or feedback for the Sokong entry.
 *                 example: "This is a test comment."
 *               PenyokongID:
 *                 type: integer
 *                 description: The ID of the Penyokong creating the Sokong entry.
 *                 example: 654
 *     responses:
 *       201:
 *         description: Sokong entry successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 SokongID:
 *                   type: integer
 *                   description: The ID of the newly created Sokong entry.
 *                   example: 1234
 *                 MohonID:
 *                   type: integer
 *                   description: The MohonID of the Sokong entry.
 *                   example: 123
 *                 PindaanID:
 *                   type: integer
 *                   description: The PindaanID of the Sokong entry.
 *                   example: 456
 *                 SemakID:
 *                   type: integer
 *                   description: The SemakID of the Sokong entry.
 *                   example: 789
 *                 TindakanID:
 *                   type: integer
 *                   description: The TindakanID of the Sokong entry.
 *                   example: 321
 *                 Ulasan:
 *                   type: string
 *                   description: The comment or feedback for the Sokong entry.
 *                   example: "This is a test comment."
 *                 PenyokongID:
 *                   type: integer
 *                   description: The PenyokongID of the Sokong entry.
 *                   example: 654
 *                 TkhSokong:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the Sokong entry was created.
 *                   example: "2024-12-12T08:00:00Z"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "`MohonID` is required"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal Server Error"
 */

router.post('/', async (req, res) => {
    const { MohonID, PindaanID, SemakID, TindakanID, Ulasan, PenyokongID } = req.body;
  
    if (!MohonID) {
      return res.status(400).json({ error: '`MohonID` is required' });
    }
  
    try {
      // Check if MohonID exists in tblPermohonan
      const permohonan = await prisma.tblPermohonan.findFirst({
        where: { MohonID: MohonID }, // Use `findFirst` to check existence
      });
  
      if (!permohonan) {
        return res.status(400).json({ error: '`MohonID` does not exist ' });
      }
  
      // Create the Sokong entry
      const newSokong = await prisma.tblSokong.create({
        data: {
          MohonID,
          PindaanID,
          SemakID,
          TindakanID,
          Ulasan,
          TkhSokong: getGMTPlus8Date(),
          PenyokongID,
        },
      });
  
      // Log the action in the audit trail
      await prisma.tblAuditTrail.create({
        data: {
          MohonID,
          action: 'CREATE',
          TableName: 'tblSokong',
          PenggunaID: 0,
          RecordID: String(newSokong.SokongID),
          Reason: 'New Sokong entry created',
          Application: 'api/sokong',
          actiontime: getGMTPlus8Date(),
        },
      });
  
      res.status(201).json(newSokong);
    } catch (error) {
      console.error('Error creating Sokong entry:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  /**
 * @swagger
 * /api/sokong:
 *   get:
 *     summary: Retrieve a list of Sokong entries
 *     tags:
 *       - Sokong
 *     description: Retrieves a list of Sokong entries with optional filtering by `MohonID` or pagination.
 *     parameters:
 *       - in: query
 *         name: MohonID
 *         schema:
 *           type: integer
 *         description: Filter by the MohonID of the Sokong entries.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of records to return per page.
 *     responses:
 *       200:
 *         description: A list of Sokong entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       SokongID:
 *                         type: integer
 *                         description: The ID of the Sokong entry.
 *                       MohonID:
 *                         type: integer
 *                         description: The MohonID of the Sokong entry.
 *                       PindaanID:
 *                         type: integer
 *                         description: The PindaanID of the Sokong entry.
 *                       SemakID:
 *                         type: integer
 *                         description: The SemakID of the Sokong entry.
 *                       TindakanID:
 *                         type: integer
 *                         description: The TindakanID of the Sokong entry.
 *                       Ulasan:
 *                         type: string
 *                         description: The comment or feedback for the Sokong entry.
 *                       PenyokongID:
 *                         type: integer
 *                         description: The PenyokongID of the Sokong entry.
 *                       TkhSokong:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the Sokong entry was created.
 *                 page:
 *                   type: integer
 *                   description: The current page number.
 *                 total:
 *                   type: integer
 *                   description: The total number of Sokong entries.
 *       500:
 *         description: Internal Server Error
 */

router.get('/', async (req, res) => {
    const { MohonID, page = 1, limit = 10 } = req.query;
  
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;
  
    try {
      // Build query filter
      const filter = MohonID ? { MohonID: parseInt(MohonID) } : {};
  
      // Retrieve data with pagination
      const [data, total] = await Promise.all([
        prisma.tblSokong.findMany({
          where: filter,
          skip: offset,
          take: limitNumber,
          orderBy: { TkhSokong: 'desc' },
        }),
        prisma.tblSokong.count({ where: filter }),
      ]);
  
      res.status(200).json({
        data,
        page: pageNumber,
        total,
      });
    } catch (error) {
      console.error('Error retrieving Sokong entries:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;

/**
 * @swagger
 * /api/sokong/update:
 *   post:
 *     summary: Update a Sokong entry by ID
 *     tags:
 *       - Sokong
 *     description: Updates specific fields of a Sokong record identified by `SokongID` and logs the action in the audit trail.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SokongID:
 *                 type: integer
 *                 description: The ID of the Sokong entry to update
 *                 example: 10
 *               SemakID:
 *                 type: integer
 *                 description: The updated SemakID value
 *                 example: 3
 *               TindakanID:
 *                 type: integer
 *                 description: The updated TindakanID value
 *                 example: 2
 *               Ulasan:
 *                 type: string
 *                 description: The updated comment or feedback
 *                 example: "Updated comment."
 *     responses:
 *       200:
 *         description: Sokong entry successfully updated
 *       404:
 *         description: Sokong entry not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/update', async (req, res) => {
    const { SokongID, SemakID, TindakanID, Ulasan } = req.body;
  
    if (!SokongID) {
      return res.status(400).json({ error: 'SokongID is required' });
    }
  
    try {
      const updatedSokong = await prisma.tblSokong.updateMany({
        where: { SokongID: parseInt(SokongID) },
        data: { SemakID, TindakanID, Ulasan },
      });
  
      if (updatedSokong.count > 0) {
        // Log the action in the audit trail
        await prisma.tblAuditTrail.create({
          data: {
            MohonID: null,
            action: 'UPDATE',
            TableName: 'tblSokong',
            PenggunaID: 0,
            RecordID: String(SokongID),
            Reason: 'Updated Sokong entry',
            Application: 'api/sokong/update',
            actiontime: getGMTPlus8Date(),
          },
        });
  
        res.status(200).json({ message: 'Sokong entry successfully updated' });
      } else {
        res.status(404).json({ message: 'Sokong entry not found' });
      }
    } catch (error) {
      console.error('Error updating Sokong entry:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

/**
 * @swagger
 * /api/sokong/delete:
 *   post:
 *     summary: Delete a Sokong entry by ID
 *     tags:
 *       - Sokong
 *     description: Deletes a Sokong record identified by `SokongID` and logs the action in the audit trail.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SokongID:
 *                 type: integer
 *                 description: The ID of the Sokong entry to delete
 *                 example: 10
 *     responses:
 *       200:
 *         description: Sokong entry successfully deleted
 *       404:
 *         description: Sokong entry not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/delete', async (req, res) => {
    const { SokongID } = req.body;
  
    if (!SokongID) {
      return res.status(400).json({ error: 'SokongID is required' });
    }
  
    try {
      const sokong = await prisma.tblSokong.findMany({
        where: { SokongID: parseInt(SokongID) },
      });
  
      if (sokong.length > 0) {
        await prisma.tblSokong.deleteMany({
          where: { SokongID: parseInt(SokongID) },
        });
  
        // Log the action in the audit trail
        await prisma.tblAuditTrail.create({
          data: {
            MohonID: null,
            action: 'DELETE',
            TableName: 'tblSokong',
            PenggunaID: 0,
            RecordID: String(SokongID),
            Reason: 'Deleted Sokong entry',
            Application: 'api/sokong/delete',
            actiontime: getGMTPlus8Date(),
          },
        });
  
        res.status(200).json({ message: 'Sokong entry successfully deleted' });
      } else {
        res.status(404).json({ message: 'Sokong entry not found' });
      }
    } catch (error) {
      console.error('Error deleting Sokong entry:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = router;
