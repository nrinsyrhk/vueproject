const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// Add new country
router.post('/senaraiNegara/add', async (req, res) => {
    try {
      const { Kod, Nama } = req.body;
  
      if (!Kod || !Nama) {
        return res.status(400).json({ message: "Kod and Nama are required" });
      }
  
      // check duplicate by Kod
      const duplicate = await prisma.TblRefNegara.findFirst({
        where: { Kod , Nama }
      });
  
      if (duplicate) {
        return res.status(400).json({ message: "Kod and Nama already exists" });
      }
  
      const newCountry = await prisma.TblRefNegara.create({
        data: { Kod, Nama }
      });
  
      res.status(201).json({
        message: "Country added successfully",
        country: newCountry
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding country", error: error.message });
    }
});

//Get all countries
router.get('/senaraiNegara', async (req, res) => {
  try {
    const senarai = await prisma.TblRefNegara.findMany();
    res.json(senarai);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching countries', error: error.message });
  }
});

//Get single country by ID
router.get('/senaraiNegara/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const negara = await prisma.TblRefNegara.findUnique({
      where: { NegaraID: id },
    });

    if (!negara) {
      return res.status(404).json({ message: 'Country not found' });
    }

    res.json(negara);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching country', error: error.message });
  }
});

//Update country
router.put('/senaraiNegara/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { Kod, Nama } = req.body;

    const updated = await prisma.TblRefNegara.update({
      where: { NegaraID: id },
      data: { Kod, Nama },
    });

    res.json({ message: 'Country updated successfully', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating country', error: error.message });
  }
});

//Delete country
router.delete('/senaraiNegara/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.TblRefNegara.delete({
      where: { NegaraID: id },
    });

    res.json({ message: 'Country deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting country', error: error.message });
  }
});

module.exports = router;
