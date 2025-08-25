const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();
/**
 * @swagger
 * /api/bahagian:
 *   get:
 *     summary: Retrieve a list of bahagians
 *     tags:
 *       - Bahagian
 *     responses:
 *       200:
 *         description: A list of bahagians
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   BahagianID:
 *                     type: integer
 *                   BUOrgChart1:
 *                     type: string
 *                   BUTitle1:
 *                     type: string
 *                   BUOrgChart2:
 *                     type: string
 *                   BUTitle2:
 *                     type: string
 */
router.get('/bahagian', async (req, res) => {
    try {
        const bahagians = await prisma.TblRefBahagian.findMany({
            select: {
                BahagianID: true,
                BUOrgChart1: true,
                BUTitle1: true,
                BUOrgChart2: true,
                BUTitle2: true,
            },
        });
        res.json(bahagians);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching bahagian');
    }
});

module.exports = router;