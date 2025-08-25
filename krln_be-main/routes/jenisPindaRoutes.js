const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     JenisPinda:
 *       type: object
 *       properties:
 *         JenisPindaID:
 *           type: integer
 *           description: The unique identifier for the jenis pinda
 *         Keterangan:
 *           type: string
 *           description: The description of the jenis pinda
 *       required:
 *         - JenisPindaID
 *         - Keterangan
 */

/**
 * @swagger
 * /api/senaraiJenisPinda:
 *   get:
 *     summary: Retrieve all records from TblJenisPinda
 *     tags:
 *       - Ref Table
 *     description: Retrieve all JenisPindaID and Keterangan records from the TblJenisPinda table
 *     responses:
 *       200:
 *         description: Successfully retrieved jenis pinda records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JenisPinda'
 *       500:
 *         description: Server error
 */
router.get('/senaraiJenisPinda', async (req, res) => {
  try {
    const jenisPindaData = await prisma.tblRefJenisPinda.findMany(); // Retrieve all records from TblJenisPinda
    res.status(200).json(jenisPindaData); // Send the retrieved data as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

module.exports = router;
