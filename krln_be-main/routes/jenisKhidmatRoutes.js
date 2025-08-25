const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     JenisKhidmat:
 *       type: object
 *       properties:
 *         JenisKhidmatID:
 *           type: integer
 *           description: Unique identifier of the service type
 *         Keterangan:
 *           type: string
 *           description: Description of the service type
 *       required:
 *         - JenisKhidmatID
 *         - Keterangan
 */

/**
 * @swagger
 * /api/senaraiKhidmat:
 *   get:
 *     summary: Retrieve all records from TblJenisKhidmat
 *     tags:
 *       - Ref Table
 *     description: Retrieve all JenisKhidmatID and Keterangan records from the TblJenisKhidmat table
 *     responses:
 *       200:
 *         description: Successfully retrieved service type records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JenisKhidmat'
 *       500:
 *         description: Server error
 */
router.get('/senaraiKhidmat', async (req, res) => {
  try {
    const khidmatData = await prisma.tblRefJenisKhidmat.findMany(); // Retrieve all records from TblJenisKhidmat
    res.status(200).json(khidmatData); // Send the retrieved data as JSON
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

module.exports = router;
