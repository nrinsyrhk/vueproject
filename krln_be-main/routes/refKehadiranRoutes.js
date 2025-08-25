const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Kehadiran:
 *       type: object
 *       properties:
 *         KehadiranID:
 *           type: integer
 *           description: The unique identifier for the kehadiran
 *         Keterangan:
 *           type: string
 *           description: Description of the kehadiran
 *       required:
 *         - KehadiranID
 *         - Keterangan
 */

/**
 * @swagger
 * /api/senaraiKehadiran:
 *   get:
 *     summary: Retrieve all records from TblRefKehadiran
 *     tags:
 *       - Ref Table   # Grouping it under 'Ref Tables'
 *     description: Retrieve all KehadiranID and Keterangan records from the TblRefKehadiran table
 *     responses:
 *       200:
 *         description: Successfully retrieved kehadiran records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Kehadiran'
 *       500:
 *         description: Server error
 */
router.get('/senaraiKehadiran', async (req, res) => {
  try {
    const kehadiranData = await prisma.tblRefKehadiran.findMany();
    res.status(200).json(kehadiranData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

module.exports = router;
