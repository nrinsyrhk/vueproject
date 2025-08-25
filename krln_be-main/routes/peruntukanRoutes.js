const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Helper function to get GMT+8 time
function getGMTPlus8Date() {
  const date = new Date();
  date.setHours(date.getHours() + 8); // Adjust by 8 hours for GMT+8
  return date;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     Peruntukan:
 *       type: object
 *       required:
 *         - kewMohon
 *         - bakiPKLN
 *         - kewSah
 *         - bakiPTJ
 *         - ulasan
 *         - CreatedDate
 *       properties:
 *         PeruntukanID:
 *           type: integer
 *           description: The unique ID of the peruntukan record
 *           example: 1
 *         kewMohon:
 *           type: number
 *           format: decimal
 *           description: The requested amount
 *           example: 1000.50
 *         tarikhbakiPKLN:
 *           type: string
 *           format: date-time
 *           description: Date of PKLN balance
 *           example: "2024-01-01T00:00:00Z"
 *         bakiPKLN:
 *           type: number
 *           format: decimal
 *           description: Remaining PKLN balance
 *           example: 500.00
 *         kewSah:
 *           type: number
 *           format: decimal
 *           description: Approved amount
 *           example: 800.00
 *         bakiPTJ:
 *           type: number
 *           format: decimal
 *           description: Remaining PTJ balance
 *           example: 300.00
 *         tanggunganOleh:
 *           type: string
 *           description: Responsible person or dependency
 *           example: "John Doe"
 *         ulasan:
 *           type: string
 *           description: Remarks or comments
 *           example: "Budget allocation approved"
 *         tajaanperinci:
 *           type: string
 *           description: Detailed sponsorship information (optional)
 *           example: "Sponsored by XYZ"
 *         tajaanoleh:
 *           type: string
 *           description: Sponsor (optional)
 *           example: "Company ABC"
 *         JenisPindaanID:
 *           type: integer
 *           description: ID of the amendment type (optional)
 *           example: 2
 *         MohonID:
 *           type: string
 *           description: Related application ID (optional)
 *           example: "A12345"
 *         CreatedDate:
 *           type: string
 *           format: date-time
 *           description: Date the record was created
 *           example: "2024-01-01T00:00:00Z"
 *         UpdatedDate:
 *           type: string
 *           format: date-time
 *           description: Date the record was last updated
 *           example: "2024-01-02T00:00:00Z"
 */
/**
 * @swagger
 * /api/peruntukan:
 *   get:
 *     tags:
 *       - Peruntukan
 *     summary: Retrieve all peruntukan records
 *     responses:
 *       200:
 *         description: A list of peruntukan records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Peruntukan'
 */
router.get('/', async (req, res) => {
  try {
    const peruntukan = await prisma.tblPeruntukan.findMany();
    res.json(peruntukan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/**
 * @swagger
 * /api/peruntukan/getByID:
 *   post:
 *     summary: Retrieve records by MohonID
 *     tags:
 *       - Peruntukan
 *     description: Fetches all records from the tblPeruntukan table that match the provided MohonID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: string
 *                 description: The unique ID associated with the records in tblPeruntukan.
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Successfully retrieved records for the specified MohonID.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID:
 *                     type: integer
 *                     description: Unique identifier of the record.
 *                     example: 101
 *                   MohonID:
 *                     type: string
 *                     description: ID associated with the record.
 *                     example: "1234567890"
 *                   NamaPeruntukan:
 *                     type: string
 *                     description: Name of the allocation.
 *                     example: "Peruntukan A"
 *                   Jumlah:
 *                     type: number
 *                     format: double
 *                     description: Amount allocated.
 *                     example: 5000.00
 *                   CreatedDate:
 *                     type: string
 *                     format: date-time
 *                     description: The date the record was created.
 *                     example: "2024-11-18T14:45:00Z"
 *       400:
 *         description: Bad Request - Missing required MohonID in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "MohonID is required"
 *       404:
 *         description: No records found for the given MohonID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No records found for MohonID 1234567890"
 *       500:
 *         description: Internal Server Error - Unable to fetch records.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/getByID', async (req, res) => {
  const { MohonID } = req.body;
  if (!MohonID) {
    return res.status(400).json({ error: 'MohonID is required' });
  }
  try {
    const kumpulanRecords = await prisma.tblPeruntukan.findMany({
      where: {
        MohonID,
      }
    });
    if (kumpulanRecords.length === 0) {
      return res.status(404).json({ error: `No records found for MohonID ${MohonID}` });
    }
    res.status(200).json(kumpulanRecords);
  } catch (error) {
    console.error('Error fetching records from Tblkumpulan:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/**
 * @swagger
 * /api/peruntukan/getByID:
 *   post:
 *     summary: Retrieve peruntukan record by MohonID
 *     tags:
 *       - Peruntukan
 *     description: Fetches the `peruntukan` record based on the provided MohonID in the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: integer
 *                 description: The ID related to the requested peruntukan record
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ID:
 *                   type: integer
 *                   example: 1
 *                 MohonID:
 *                   type: integer
 *                   example: 123456
 *                 CreatedDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-06T12:34:56+08:00"
 *                 [other fields]:
 *                   type: string
 *                   example: "Sample data"
 *       400:
 *         description: Bad Request - MohonID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "MohonID is required"
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No record found for MohonID 123456"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/peruntukan/getByID', async (req, res) => {
  const { MohonID } = req.body;
  if (!MohonID) {
    return res.status(400).json({ error: 'MohonID is required' });
  }
  try {
    const peruntukanRecord = await prisma.tblPeruntukan.findUnique({
      where: { MohonID },
    });
    if (!peruntukanRecord) {
      return res.status(404).json({ error: `No record found for MohonID ${MohonID}` });
    }
    res.status(200).json(peruntukanRecord);
  } catch (error) {
    console.error('Error fetching peruntukan record:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/**
 * @swagger
 * /api/peruntukan:
 *   post:
 *     summary: Create a new Peruntukan and optionally update Permohonan
 *     tags: 
 *       - Peruntukan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kewMohon:
 *                 type: number
 *                 example: 5000
 *               tarikhbakiPKLN:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-11-21T10:00:00Z"
 *               bakiPKLN:
 *                 type: number
 *                 example: 2000
 *               kewSah:
 *                 type: number
 *                 example: 3000
 *               bakiPTJ:
 *                 type: number
 *                 example: 1500
 *               tanggunganOleh:
 *                 type: string
 *                 example: "Jabatan ABC"
 *               ulasan:
 *                 type: string
 *                 example: "Approved budget for the project."
 *               tajaanperinci:
 *                 type: string
 *                 example: "Detailed sponsorship information"
 *               tajaanoleh:
 *                 type: string
 *                 example: "Organization XYZ"
 *               JenisPindaanID:
 *                 type: integer
 *                 example: 2
 *               MohonID:
 *                 type: integer
 *                 example: 85
 *               PengesahanRP:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Created a new Peruntukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 PeruntukanID:
 *                   type: integer
 *                   example: 123
 *       200:
 *         description: Updated an existing Permohonan with new PeruntukanID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 PeruntukanID:
 *                   type: integer
 *                   example: 123
 *       400:
 *         description: Mohon ID already exists in Peruntukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Mohon ID already exists in Peruntukan"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/', async (req, res) => {
  const {
    kewMohon,
    tarikhbakiPKLN,
    bakiPKLN,
    kewSah,
    bakiPTJ,
    tanggunganOleh,
    ulasan,
    tajaanperinci,
    tajaanoleh,
    JenisPindaanID,
    MohonID,
    PengesahanRP,
  } = req.body;

  try {
    console.log(`Checking if MohonID ${MohonID} exists in tblPeruntukan`);

    // Check if the combination of MohonID already exists
    const existingRecord = await prisma.tblPeruntukan.findFirst({
      where: { MohonID },
    });

    if (existingRecord) {
      // Log and return a response indicating that the MohonID already exists
      console.log(`MohonID ${MohonID} already exists in Peruntukan`);
      return res.status(400).json({ error: 'Mohon ID already exists in Peruntukan' });
    }

    console.log(`MohonID ${MohonID} does not exist, proceeding to create new Peruntukan record`);

    // If MohonID does not exist, create a new entry
    const newPeruntukanID = await prisma.tblPeruntukan.create({
      data: {
        kewMohon,
        tarikhbakiPKLN,
        bakiPKLN,
        kewSah,
        bakiPTJ,
        tanggunganOleh,
        ulasan,
        tajaanperinci,
        tajaanoleh,
        JenisPindaanID,
        MohonID,
        PengesahanRP,
        CreatedDate: new Date(), // Adding CreatedDate with the current date and time
        UpdatedDate: new Date(), // Adding UpdatedDate with the current date and time
      },
      select: { PeruntukanID: true }, // Return only the PeruntukanID
    });

    res.status(201).json({ PeruntukanID: newPeruntukanID.PeruntukanID });
  } catch (error) {
    console.error('Error creating or updating peruntukan:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/peruntukan/update:
 *   post:
 *     summary: Update records in tblPeruntukan
 *     tags:
 *       - Peruntukan
 *     description: Updates records in the `tblPeruntukan` table associated with the provided `MohonID`. The action is logged in the audit trail for tracking changes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: string
 *                 description: The ID of the permohonan to update
 *                 example: "1234567890"
 *               field1:
 *                 type: string
 *                 description: Example field to update
 *                 example: "newValue"
 *               field2:
 *                 type: integer
 *                 description: Another example field to update
 *                 example: 42
 *     responses:
 *       200:
 *         description: Successfully updated the records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of updated records
 *                   example: 1
 *       400:
 *         description: Bad Request (e.g., missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Invalid request payload"
 *       404:
 *         description: No records found for the provided MohonID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "No records found for MohonID 1234567890"
 *       500:
 *         description: Internal Server Error (e.g., database issues)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
router.post('/update', async (req, res) => {
  const { ...data } = req.body;
  try {
    // Query the database first to fet the full info for audit Trail
    const permohonanInfo = await prisma.tblPermohonan.findMany({
      where: {
        MohonID: data.MohonID,
      },
      orderBy: {
        UpdatedDate: 'desc',  // Sort by UpdatedDate in descending order
      },
      take: 1,
    });
    const updatedPeruntukan = await prisma.tblPeruntukan.updateMany({
      where: { MohonID: data.MohonID },
      data: {
        ...data,
        UpdatedDate: getGMTPlus8Date(), // Set UpdatedDate to the current date and time
      },
    });
    //Will be updated to audit trail if update the peruntukan
    await prisma.tblAuditTrail.create({
      data: {
        MohonID: updatedPeruntukan.MohonID,
        PenggunaID: permohonanInfo[0].PenggunaID, // ID of the user who performed the action
        action: 'UPDATE',
        TableName: 'tblPeruntukan',
        RecordID: String(permohonanInfo[0].id), // Assuming 'id' is the primary key of the created record
        Reason: 'Update Peruntukan',
        Application: 'api/peruntukan/update',
        actiontime: getGMTPlus8Date()
      }
    });
    res.status(200).json({ message: 'Successfully updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});
/**
 * @swagger
 * /api/peruntukan/delete:
 *   post:
 *     summary: Delete draft records from tblPeruntukan by MohonID
 *     tags:
 *       - Peruntukan
 *     description: Deletes records in the `tblPeruntukan` table associated with a specified `MohonID`, provided they exist. Logs the action in the audit trail with details about the deleted records.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: string
 *                 description: The ID of the draft permohonan to delete
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Successfully deleted the draft permohonan or no drafts found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success or informational message
 *                   example: "Draf permohonan successfully deleted."
 *                 deletedRecords:
 *                   type: object
 *                   description: Details of the deleted records
 *                   example:
 *                     count: 1
 *       400:
 *         description: Bad Request (e.g., missing MohonID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "MohonID is required"
 *       404:
 *         description: No records found for the given MohonID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "No records found for MohonID 1234567890"
 *       500:
 *         description: Internal Server Error (e.g., database or server issues)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
router.post('/delete', async (req, res) => {
  const { MohonID } = req.body; // Get MohonID and PenggunaID from request body
  if (!MohonID) {
    return res.status(400).json({ error: 'MohonID is required' });
  }
  try {
    // Query the database first to fet the full info for audit Trail
    const permohonanInfo = await prisma.tblPermohonan.findMany({
      where: {
        MohonID: MohonID,  // Assuming 'MohonID' is the correct field name in your database
      },
    });
    // Check if the record exists in the tblPeruntukan table
    const checkIfExist = await prisma.tblPeruntukan.findMany({
      where: {
        MohonID: MohonID,  // Assuming 'MohonID' is the correct field name in your database
      },
    });
    if (checkIfExist && checkIfExist.length > 0) {
      // Delete records from tblPeruntukan
      const deletedRecords = await prisma.tblPeruntukan.deleteMany({
        where: { MohonID },
      });
      await prisma.tblAuditTrail.create({
        data: {
          MohonID: MohonID,
          PenggunaID: permohonanInfo[0].PenggunaID, // ID of the user who performed the action
          action: 'DELETE',
          TableName: 'tblPeruntukan',
          RecordID: String(permohonanInfo[0].id), // Assuming 'id' is the primary key of the created record
          Reason: 'Delete draf peruntukan',
          Application: 'api/peruntukan/delete',
          actiontime: getGMTPlus8Date()
        },
      });
      if (deletedRecords.count === 0) {
        return res.status(404).json({ error: `No records found for MohonID ${MohonID}` });
      }
      res.json({ message: 'Draf permohonan successfully deleted.', deletedRecords });
    } else {
      res.status(200).json({ message: 'No draft found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
