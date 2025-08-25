const express = require('express');
const router = express.Router();
const Audit = require('../models/audit');

/**
 * @swagger
 * /audit:
 *   post:
 *     summary: Create an audit trail record
 *     tags:
 *       - Audit
 *     description: Create an audit trail record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *               user:
 *                 type: string
 *               details:
 *                 type: object
 *     responses:
 *       201:
 *         description: Audit record created successfully
 *       500:
 *         description: Server error
 */
router.post('/audit', async (req, res) => {
  try {
    const audit = new Audit(req.body);
    await audit.save();
    res.status(201).send(audit);
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * @swagger
 * /audit:
 *   get:
 *     summary: Get all audit trail records
 *     tags:
 *       - Audit
 *     description: Retrieve all audit trail records
 *     responses:
 *       200:
 *         description: Successfully retrieved audit records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.get('/audit', async (req, res) => {
  try {
    const audits = await Audit.find();
    res.status(200).send(audits);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;