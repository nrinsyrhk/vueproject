const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     KategoriPeserta:
 *       type: object
 *       properties:
 *         KatPesertaID:
 *           type: integer
 *           description: Unique identifier of the participant category
 *         Keterangan:
 *           type: string
 *           description: Description of the participant category
 *       required:
 *         - KatPesertaID
 *         - Keterangan
 */

/**
 * @swagger
 * /api/senaraiPeserta:
 *   get:
 *     summary: Retrieve all records from TblKatPeserta
 *     tags:
 *       - Ref Table
 *     description: Retrieve all KatPesertaID and Keterangan records from the TblKatPeserta table
 *     responses:
 *       200:
 *         description: Successfully retrieved participant category records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KategoriPeserta'
 *       500:
 *         description: Server error
 */
router.get('/senaraiPeserta', async (req, res) => {
  try {
    const pesertaData = await prisma.tblRefKategoriPeserta.findMany(); // Retrieve all records from TblKatPeserta
    res.status(200).json(pesertaData); // Send the retrieved data as JSON
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

module.exports = router;
