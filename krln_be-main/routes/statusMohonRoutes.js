const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     StatusMohon:
 *       type: object
 *       properties:
 *         StatusMohonID:
 *           type: integer
 *           description: Unique identifier of the status of the application
 *         Keterangan:
 *           type: string
 *           description: Description of the status
 *       required:
 *         - StatusMohonID
 *         - Keterangan
 */

/**
 * @swagger
 * /api/senaraiStatusMohon:
 *   get:
 *     summary: Retrieve all records from TblRefStatusMohon
 *     tags:
 *       - Ref Table
 *     description: Retrieve all StatusMohonID and Keterangan records from the TblRefStatusMohon table
 *     responses:
 *       200:
 *         description: Successfully retrieved status records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StatusMohon'
 *       500:
 *         description: Server error
 */
router.get('/senaraiStatusMohon', async (req, res) => {
  try {
    const statusMohonData = await prisma.tblRefStatusMohon.findMany(); // Retrieve all records from TblRefStatusMohon
    res.status(200).json(statusMohonData); // Send the retrieved data as JSON
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

module.exports = router;
