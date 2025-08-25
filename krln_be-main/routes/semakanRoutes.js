const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/semakan:
 *   get:
 *     summary: Retrieve a list of semakan
 *     tags:
 *       - Semakan
 *     responses:
 *       200:
 *         description: A list of semakan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   SemakID:
 *                     type: integer
 *                   MohonID:
 *                     type: string
 *                   PindaanID:
 *                     type: integer
 *                   TindakanID:
 *                     type: integer
 *                   Ulasan:
 *                     type: string
 *                   KewDiperaku:
 *                     type: string
 *                   KuasaLulusID:
 *                     type: integer
 *                   TkhSemak:
 *                     type: string
 *                   PenyemakID:
 *                     type: integer
 */
router.get('/', async (req, res) => {
    try {
        const semakan = await prisma.tblSemak.findMany();
        res.json(semakan);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while fetching semakan');
    }
});

/**
 * @swagger
 * /api/semakan/{id}:
 *   get:
 *     summary: Retrieve a single semakan by ID
 *     tags:
 *       - Semakan
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single semakan
 *       404:
 *         description: Semakan not found
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const semakan = await prisma.tblSemak.findUnique({
            where: { SemakID: parseInt(id) },
        });
        if (!semakan) return res.status(404).send('Semakan not found');
        res.json(semakan);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while fetching the semakan');
    }
});

/**
 * @swagger
 * /api/semakan:
 *   post:
 *     summary: Create a new semakan
 *     tags:
 *       - Semakan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: string
 *               PindaanID:
 *                 type: integer
 *               TindakanID:
 *                 type: integer
 *               Ulasan:
 *                 type: string
 *               KewDiperaku:
 *                 type: string
 *               KuasaLulusID:
 *                 type: integer
 *               TkhSemak:
 *                 type: string
 *               PenyemakID:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Semakan created
 */
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newSemakan = await prisma.tblSemak.create({
            data,
        });
        res.status(201).json({ message: 'Successfully created new peruntukan' });
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while creating the semakan');
    }
});

/**
 * @swagger
 * /api/semakan/{id}:
 *   put:
 *     summary: Update an existing semakan
 *     tags:
 *       - Semakan
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: string
 *               PindaanID:
 *                 type: integer
 *               TindakanID:
 *                 type: integer
 *               Ulasan:
 *                 type: string
 *               KewDiperaku:
 *                 type: string
 *               KuasaLulusID:
 *                 type: integer
 *               TkhSemak:
 *                 type: string
 *               PenyemakID:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Semakan updated
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedSemakan = await prisma.tblSemak.update({
            where: { SemakID: parseInt(id) },
            data,
        });
        res.json(updatedSemakan);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while updating the semakan');
    }
});

/**
 * @swagger
 * /api/semakan/{id}:
 *   delete:
 *     summary: Delete a semakan
 *     tags:
 *       - Semakan
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Semakan deleted
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.tblSemak.delete({
            where: { SemakID: parseInt(id) },
        });
        res.send('Semakan deleted');
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while deleting the semakan');
    }
});

module.exports = router;
