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
 * /api/peraku:
 *   post:
 *     summary: Create a new Peraku entry
 *     tags:
 *       - Peraku
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: integer
 *                 example: 85
 *               SokongID:
 *                 type: integer
 *                 example: 5
 *               TindakanID:
 *                 type: integer
 *                 example: 1
 *               Ulasan:
 *                 type: string
 *                 example: "This is a review."
 *               PerakuID:
 *                 type: integer
 *                 example: 3
 *               PindaanID:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: MohonID or SokongID does not exist
 *       500:
 *         description: Internal Server Error
 */
router.post('/', async (req, res) => {
  const { MohonID, SokongID, TindakanID, Ulasan, PerakuID, PindaanID } = req.body;
  try {
   // Check if MohonID exists in tblPermohonan
const mohonExists = await prisma.tblPermohonan.findFirst({
    where: { MohonID },
  });
  
  if (!mohonExists) {
    return res.status(400).json({ error: 'MohonID does not exist' });
  }
  
    // Check if SokongID exists in tblSokong
    const sokongExists = await prisma.tblSokong.findUnique({
      where: { SokongID },
    });

    if (!sokongExists) {
      return res.status(400).json({ error: 'SokongID does not exist' });
    }

    const newPeraku = await prisma.tblPeraku.create({
      data: {
        MohonID,
        SokongID,
        TindakanID,
        Ulasan,
        TkhPeraku: getGMTPlus8Date(),
        PerakuID,
        PindaanID,
      },
    });

    await prisma.tblAuditTrail.create({
      data: {
        MohonID,
        action: 'CREATE',
        TableName: 'tblPeraku',
        PenggunaID: 0,
        RecordID: String(newPeraku.PerakuanID),
        Reason: 'New Peraku entry created',
        Application: 'api/peraku',
        actiontime: getGMTPlus8Date(),
      },
    });

    res.status(201).json(newPeraku);
  } catch (error) {
    console.error('Error creating Peraku entry:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/peraku:
 *   get:
 *     summary: Retrieve a list of Peraku entries
 *     tags:
 *       - Peraku
 *     responses:
 *       200:
 *         description: A list of Peraku entries
 *       500:
 *         description: Internal Server Error
 */
router.get('/', async (req, res) => {
    try {
      const perakuList = await prisma.tblPeraku.findMany();
      res.status(200).json(perakuList);
    } catch (error) {
      console.error('Error retrieving Peraku entries:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

/**
 * @swagger
 * /api/peraku/update:
 *   post:
 *     summary: Update a Peraku entry by ID
 *     tags:
 *       - Peraku
 *     description: Updates specific fields of a Peraku record identified by `PerakuanID` and logs the action in the audit trail.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PerakuanID:
 *                 type: integer
 *                 description: The ID of the Peraku entry to update
 *                 example: 10
 *               TindakanID:
 *                 type: integer
 *                 description: The updated TindakanID value
 *                 example: 2
 *               Ulasan:
 *                 type: string
 *                 description: The updated comment or review
 *                 example: "Updated review."
 *     responses:
 *       200:
 *         description: Peraku entry successfully updated
 *       404:
 *         description: Peraku entry not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/update', async (req, res) => {
  const { PerakuanID, TindakanID, Ulasan } = req.body;

  if (!PerakuanID) {
    return res.status(400).json({ error: 'PerakuanID is required' });
  }

  try {
    const updatedPeraku = await prisma.tblPeraku.updateMany({
      where: { PerakuanID: parseInt(PerakuanID) },
      data: { TindakanID, Ulasan },
    });

    if (updatedPeraku.count > 0) {
      await prisma.tblAuditTrail.create({
        data: {
          MohonID: null,
          action: 'UPDATE',
          TableName: 'tblPeraku',
          PenggunaID: 0,
          RecordID: String(PerakuanID),
          Reason: 'Updated Peraku entry',
          Application: 'api/peraku/update',
          actiontime: getGMTPlus8Date(),
        },
      });

      res.status(200).json({ message: 'Peraku entry successfully updated' });
    } else {
      res.status(404).json({ message: 'Peraku entry not found' });
    }
  } catch (error) {
    console.error('Error updating Peraku entry:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/peraku/delete:
 *   post:
 *     summary: Delete a Peraku entry by ID
 *     tags:
 *       - Peraku
 *     description: Deletes a Peraku record identified by `PerakuanID` and logs the action in the audit trail.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PerakuanID:
 *                 type: integer
 *                 description: The ID of the Peraku entry to delete
 *                 example: 10
 *     responses:
 *       200:
 *         description: Peraku entry successfully deleted
 *       404:
 *         description: Peraku entry not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/delete', async (req, res) => {
  const { PerakuanID } = req.body;

  if (!PerakuanID) {
    return res.status(400).json({ error: 'PerakuanID is required' });
  }

  try {
    const peraku = await prisma.tblPeraku.findMany({
      where: { PerakuanID: parseInt(PerakuanID) },
    });

    if (peraku.length > 0) {
      await prisma.tblPeraku.deleteMany({
        where: { PerakuanID: parseInt(PerakuanID) },
      });

      await prisma.tblAuditTrail.create({
        data: {
          MohonID: null,
          action: 'DELETE',
          TableName: 'tblPeraku',
          PenggunaID: 0,
          RecordID: String(PerakuanID),
          Reason: 'Deleted Peraku entry',
          Application: 'api/peraku/delete',
          actiontime: getGMTPlus8Date(),
        },
      });

      res.status(200).json({ message: 'Peraku entry successfully deleted' });
    } else {
      res.status(404).json({ message: 'Peraku entry not found' });
    }
  } catch (error) {
    console.error('Error deleting Peraku entry:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/peraku:
 *   get:
 *     summary: Retrieve a list of Peraku entries
 *     tags:
 *       - Peraku
 *     responses:
 *       200:
 *         description: A list of Peraku entries
 *       500:
 *         description: Internal Server Error
 */
router.get('/', async (req, res) => {
  try {
    const perakuList = await prisma.tblPeraku.findMany();
    res.status(200).json(perakuList);
  } catch (error) {
    console.error('Error retrieving Peraku entries:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
