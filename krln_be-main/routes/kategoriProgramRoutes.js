const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/senaraiKategoriProgram:
 *   get:
 *     summary: Retrieve all records from tblRefKategoriProgram
 *     tags:
 *       - Ref Table
 *     description: Retrieve all KategoriProgramID and Keterangan records from the tblRefKategoriProgram table
 *     responses:
 *       200:
 *         description: Successfully retrieved program category records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KategoriProgram'
 *       500:
 *         description: Server error
 */

router.get('/senaraiKategoriProgram', async (req, res) => {
  try {
    const refKategoriProgram = await prisma.tblRefKategoriProgram.findMany(); // Retrieve all records from tableRefbidang
    res.status(200).json(refKategoriProgram); // Send the retrieved data as JSON
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

module.exports = router;
