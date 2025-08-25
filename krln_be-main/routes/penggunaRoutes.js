const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../api/pengguna');
// Route to get the list of users
/**
 * @swagger
 * /api/pengguna:
 *   get:
 *     summary: Retrieve a list of pengguna
 *     tags:
 *       - Pengguna
 *     responses:
 *       200:
 *         description: A list of penggunas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   PenggunaID:
 *                     type: integer
 *                   Nama:
 *                     type: string
 */
router.get('/', async (req, res) => {
    try {
        const penggunas = await prisma.TblPengguna.findMany();
        res.json(penggunas);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while fetching users');
    }
});
// // Route to get a user by ID

/**
 * @swagger
 * /pengguna/searchbyid:
 *   post:
 *     summary: Retrieve a user by ID
 *     tags:
 *       - Pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: String
 *                 example: 1
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/searchbyid', async (req, res) => {
    const id = req.body.id;
    if (!id) {
        return res.status(400).send('User ID is required');
    }
    try {
        const pengguna = await prisma.tblPengguna.findUnique({
            where: { PenggunaID: Number(id) },
            include: {
                TblKumpulan: true,
            },
        });
        if (pengguna) {
            res.json(pengguna);
        } else {
            res.status(404).send(`User with id ${id} not found`);
        }
    } catch (error) {
        res.status(500).send(`An error occurred while fetching user with id ${id}`);
    }
});
// Route to create a new user
/**
 * @swagger
 * /pengguna/create:
 *   post:
 *     summary: Create a new pengguna
 *     tags:
 *       - Pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nama:
 *                 type: string
 *               NoKP:
 *                 type: string
 *               NoPassport:
 *                 type: string
 *               Emel:
 *                 type: string
 *               PerananID:
 *                 type: integer
 *               PerkhidmatanID:
 *                 type: integer
 *               BahagianID:
 *                 type: integer
 *               CawanganID:
 *                 type: integer
 *               Jawatan:
 *                 type: string
 *               StatusPenggunaID:
 *                 type: integer
 *               NoTel:
 *                 type: string
 *               KategoriPenggunaID:
 *                 type: integer
 *               PenggunaDaftarID:
 *                 type: integer
 *               TkhDaftar:
 *                 type: string
 *                 format: date-time
 *               PegawaiKemaskiniID:
 *                 type: integer
 *               TkhKemaskini:
 *                 type: string
 *                 format: date-time
 *               PengesahID:
 *                 type: integer
 *               TkhSah:
 *                 type: string
 *                 format: date-time
 *               Justifikasi:
 *                 type: string
 *     responses:
 *       200:
 *         description: A newly created pengguna
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 PenggunaID:
 *                   type: integer
 *                 Nama:
 *                   type: string
 */
router.post('/create', async (req, res) => {
    const user = req.body;
    try {
        const newUser = await prisma.tblPengguna.create({
            data: user,
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while creating the user');
    }
});
/**
 * @swagger
 * /pengguna/update:
 *   put:
 *     summary: Update user information
 *     tags:
 *       - Pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               updateBody:
 *                 type: object
 *                 properties:
 *                   Nama:
 *                     type: string
 *                   NoKP:
 *                     type: string
 *                   NoPassport:
 *                     type: string
 *                   Emel:
 *                     type: string
 *                   PerananID:
 *                     type: integer
 *                   PerkhidmatanID:
 *                     type: integer
 *                   BahagianID:
 *                     type: integer
 *                   CawanganID:
 *                     type: integer
 *                   Jawatan:
 *                     type: string
 *                   StatusPenggunaID:
 *                     type: integer
 *                   NoTel:
 *                     type: string
 *                   KategoriPenggunaID:
 *                     type: integer
 *                   PenggunaDaftarID:
 *                     type: integer
 *                   TkhDaftar:
 *                     type: string
 *                     format: date-time
 *                   PegawaiKemaskiniID:
 *                     type: integer
 *                   TkhKemaskini:
 *                     type: string
 *                     format: date-time
 *                   PengesahID:
 *                     type: integer
 *                   TkhSah:
 *                     type: string
 *                     format: date-time
 *                   Justifikasi:
 *                     type: string
 *     responses:
 *       '201':
 *         description: User updated successfully
 *       '500':
 *         description: An error occurred while updating the user
 */

router.put('/update', async (req, res) => {
    const id = req.body.id;
    const {
        Nama,
        NoKP,
        NoPassport,
        Emel,
        PerananID,
        PerkhidmatanID,
        BahagianID,
        CawanganID,
        Jawatan,
        StatusPenggunaID,
        NoTel,
        KategoriPenggunaID,
        PenggunaDaftarID,
        TkhDaftar,
        PegawaiKemaskiniID,
        TkhKemaskini,
        PengesahID,
        TkhSah,
        Justifikasi
    } = req.body.updateBody;

    try {
        const pengguna = await prisma.tblPengguna.update({
            where: { PenggunaID: id },
            data: {
                Nama,
                NoKP,
                NoPassport,
                Emel,
                PerananID,
                PerkhidmatanID,
                BahagianID,
                CawanganID,
                Jawatan,
                StatusPenggunaID,
                NoTel,
                KategoriPenggunaID,
                PenggunaDaftarID,
                TkhDaftar,
                PegawaiKemaskiniID,
                TkhKemaskini,
                PengesahID,
                TkhSah,
                Justifikasi
            }
        });
        res.status(201).send("User updated");
    } catch (error) {
        console.log(error);
        res.status(500).send(`An error occurred while updating user with id ${id}`);
    }
});
// Route to delete a user by ID
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteUser(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(`An error occurred while deleting user with id ${id}`);
    }
});
module.exports = router;
