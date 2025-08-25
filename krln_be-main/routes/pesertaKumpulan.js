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
 * /api/kumpulan:
 *   post:
 *     summary: Create a new Permohonan
 *     tags: 
 *     - Kumpulan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: integer
 *                 example: 85
 *               KumpulanID:
 *                 type: integer
 *                 example: 0
 *               PenggunaID:
 *                 type: integer
 *                 example: 1
 *               PindaanID:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *               KehadiranID:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *               Kapal:
 *                 type: string
 *                 example: "Kapal ABC Bistro"
 *     responses:
 *       201:
 *         description: Created
 *       500:
 *         description: Internal Server Error
 */
//Create new kumpulan and update the permohonan
router.post('/kumpulan', async (req, res) => {
  const { MohonID, PenggunaID, PindaanID, KehadiranID, Kapal } = req.body;
  try {
    // Check if the combination of MohonID and PenggunaID already exists
    const existingRecord = await prisma.tblKumpulan.findFirst({
      where: {
        MohonID,
      },
    });
    if (existingRecord) {
      // Add to errors list instead of throwing an error
      res.status(500).json({ error: 'Mohon Id already exist' });
      return null; // Skip creation for this record
    }
    // If MohonID does not exist, create a new entry
    const newKumpulanID = await prisma.tblKumpulan.create({
      data: {
        MohonID,
        PenggunaID,
        PindaanID,
        KehadiranID,
        Kapal,
      },
      select: { ID: true }, // Return only the KumpulanID
    });
    const KumpulanID = newKumpulanID.ID;
    // Check if the MohonID already exists in tblPermohonan
    const existingMohon = await prisma.tblPermohonan.findFirst({
      where: { MohonID },
    });
    if (existingMohon) {
      // Update the existing entry and return the KumpulanID
      const updatedPermohonan = await prisma.tblPermohonan.update({
        where: { MohonID },
        data: { KumpulanID: KumpulanID },
        select: { KumpulanID: true }, // Optionally select the KumpulanID to return
      });
      return res.status(200).json(updatedPermohonan);
    }
  } catch (error) {
    console.error('Error creating or updating permohonan:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/**
 * @swagger
 * /api/kumpulan/add:
 *   post:
 *     summary: Add a new record to the Kumpulan table
 *     tags:
 *     - Kumpulan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: string
 *                 example: "REQ123"
 *               PenggunaID:
 *                 type: integer
 *                 example: 1
 *               JenisPindaID:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *               KetuaDelagasi:
 *                 type: integer
 *                 example: 2
 *               NamaKapal:
 *                 type: string
 *                 nullable: true
 *                 example: "Kapal Bahagia"
 *     responses:
 *       201:
 *         description: Record added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Record added successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     ID:
 *                       type: integer
 *                       example: 789
 *                     MohonID:
 *                       type: string
 *                       example: "REQ123"
 *                     PenggunaID:
 *                       type: integer
 *                       example: 1
 *                     JenisPindaID:
 *                       type: integer
 *                       example: null
 *                     KetuaDelagasi:
 *                       type: integer
 *                       example: 2
 *                     NamaKapal:
 *                       type: string
 *                       example: "Kapal Bahagia"
 *       404:
 *         description: Not Found - PenggunaID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Pengguna with ID 1 does not exist.
 *       409:
 *         description: Conflict - Record already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Record with MohonID REQ123 and PenggunaID 1 already exists.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 *                 details:
 *                   type: string
 *                   example: Detailed error message here.
 */


router.post('/kumpulan/add', async (req, res) => {
  const { MohonID, PenggunaID, JenisPindaID, KetuaDelagasi, NamaKapal } = req.body;

  try {
    // Verify if PenggunaID exists in the database
    const penggunaExists = await prisma.tblPengguna.findUnique({
      where: { PenggunaID },
    });

    if (!penggunaExists) {
      return res.status(404).json({
        error: `Pengguna with ID ${PenggunaID} does not exist.`,
      });
    }

    // Check if a record with the same MohonID and PenggunaID already exists
    const existingRecord = await prisma.tblKumpulan.findFirst({
      where: {
        MohonID,
        PenggunaID,
      },
    });

    if (existingRecord) {
      return res.status(409).json({
        error: `Record with MohonID ${MohonID} and PenggunaID ${PenggunaID} already exists.`,
      });
    }

    // Create a new record if it doesn't exist
    const newRecord = await prisma.tblKumpulan.create({
      data: {
        MohonID,
        PenggunaID,
        JenisPindaID,
        KetuaDelagasi,
        NamaKapal,
      },
    });

    // Optionally, log the creation to an audit trail
    await prisma.tblAuditTrail.create({
      data: {
        MohonID: newRecord.MohonID,
        PenggunaID: newRecord.PenggunaID,
        action: 'CREATE',
        TableName: 'tblKumpulan',
        RecordID: String(newRecord.ID), // Assuming `ID` is the primary key
        Reason: 'New record added',
        Application: 'api/kumpulan/add',
        actiontime: getGMTPlus8Date(),
      },
    });

    res.status(201).json({
      message: 'Record added successfully.',
      data: newRecord,
    });
  } catch (error) {
    console.error('Error adding record:', error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message,
    });
  }
});

/**
 * @swagger
 * /api/kumpulan/byBatch:
 *   post:
 *     summary: Batch create or update kumpulan records with a JSON array
 *     tags: 
 *       - Kumpulan
 *     description: Batch creates kumpulan records. If a record for the given MohonID and PenggunaID already exists, it will be skipped, and an error will be reported in the response. Supports partial success for cases where some records may succeed while others fail due to duplicate records or foreign key constraints.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 MohonID:
 *                   type: integer
 *                   example: 85
 *                 PenggunaID:
 *                   type: integer
 *                   example: 1
 *                 PindaanID:
 *                   type: integer
 *                   nullable: true
 *                   example: null
 *                 KehadiranID:
 *                   type: integer
 *                   nullable: true
 *                   example: null
 *                 Kapal:
 *                   type: string
 *                   example: "Kapal ABC Bistro"
 *     responses:
 *       201:
 *         description: All records were successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MohonID:
 *                         type: integer
 *                         example: 85
 *                       PenggunaID:
 *                         type: integer
 *                         example: 1
 *                       KumpulanID:
 *                         type: integer
 *                         example: 101
 *                       Kapal:
 *                         type: string
 *                         example: "Kapal ABC Bistro"
 *       207:
 *         description: Some records were successfully created, others failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MohonID:
 *                         type: integer
 *                         example: 85
 *                       PenggunaID:
 *                         type: integer
 *                         example: 1
 *                       KumpulanID:
 *                         type: integer
 *                         example: 101
 *                       Kapal:
 *                         type: string
 *                         example: "Kapal ABC Bistro"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MohonID:
 *                         type: integer
 *                         example: 85
 *                       PenggunaID:
 *                         type: integer
 *                         example: 1
 *                       error:
 *                         type: string
 *                         example: "Foreign key constraint failed: PenggunaID 1 does not exist in the TblPengguna table"
 *       400:
 *         description: Invalid request format (e.g., request body is not an array)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request format. Expected an array of kumpulan objects."
 *       409:
 *         description: Conflict - Duplicate record exists for MohonID and PenggunaID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Record for MohonID 85 with PenggunaID 1 already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/kumpulan/byBatch', async (req, res) => {
  const kumpulanData = req.body;
  if (!Array.isArray(kumpulanData) || kumpulanData.length === 0) {
    return res.status(400).json({ error: 'Invalid request format. Expected an array of kumpulan objects.' });
  }
  const results = {
    success: [],
    errors: []
  };
  try {
    for (const data of kumpulanData) {
      const { MohonID, PenggunaID, NamaKapal, KetuaDelagasi } = data;
      // Check if the combination of MohonID and PenggunaID already exists
      const existingRecord = await prisma.tblKumpulan.findFirst({
        where: { MohonID, PenggunaID },
      });
      if (existingRecord) {
        // Add to errors list instead of throwing an error
        results.errors.push({
          MohonID,
          PenggunaID,
          error: `Record for Kumpulan ID ${MohonID} with PenggunaID ${PenggunaID} already exists`
        });
        continue; // Skip creation for this record
      }
      try {
        const createdRecord = await prisma.tblKumpulan.create({
          data: { MohonID, PenggunaID, NamaKapal, KetuaDelagasi },
        });
        await prisma.tblAuditTrail.create({
          data: {
            MohonID: createdRecord.MohonID,
            PenggunaID: createdRecord.PenggunaID, // ID of the user who performed the action
            action: 'CREATE',
            TableName: 'tblKumpulan',
            RecordID: String(createdRecord.ID), // Assuming 'id' is the primary key of the created record
            Reason: 'New Kumpulan creation',
            Application: 'api/kumpulan/byBatch',
            actiontime: getGMTPlus8Date()
          },
        });
        results.success.push(createdRecord); // Add successful record to the success list
      } catch (error) {
        console.log(error);
        // Check if the error is a foreign key constraint failure
        if (error.code === 'P2003') { // Prisma error code for foreign key constraint
          results.errors.push({
            MohonID,
            PenggunaID,
            error: `Foreign key constraint failed: PenggunaID ${PenggunaID} does not exist in the TblPengguna table`
          });
        } else {
          // Generic error message for other unexpected errors
          results.errors.push({
            MohonID,
            PenggunaID,
            error: `Failed to create record: ${error.message}`
          });
        }
      }
    }
    // If there are any errors, return 207 Multi-Status
    if (results.errors.length > 0) {
      return res.status(207).json(results); // Partial success
    }
    // All records succeeded, return 201 Created
    return res.status(201).json(results);
  } catch (error) {
    console.error('Error in batch update:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/**
 * @swagger
 * /api/kumpulan:
 *   get:
 *     summary: Retrieve a list of Permohonan
 *     tags: 
 *     - Kumpulan
 *     responses:
 *       200:
 *         description: A list of Permohonan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MohonID:
 *                     type: integer
 *                   KumpulanID:
 *                     type: integer
 *                   PenggunaID:
 *                     type: integer
 *                   PindaanID:
 *                     type: integer
 *                   KehadiranID:
 *                     type: integer
 *                   Kapal:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 */
// GET /kumpulan - Retrieve all Permohonan
router.get('/kumpulan', async (req, res) => {
  try {
    const permohonanList = await prisma.tblKumpulan.findMany({
      include: {
        TblPengguna: {
          select: {
            PenggunaID: true,
            Nama: true,
            NoKP: true
          }
        }
      }
    });
    res.status(200).json(permohonanList);
  } catch (error) {
    console.error('Error retrieving permohonan:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// GET /kumpulan/:id - Retrieve a single Permohonan by MohonID
router.get('/kumpulan/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const permohonan = await prisma.tblkumpulan.findUnique({
      where: { MohonID: parseInt(id) },
    });
    if (!permohonan) {
      return res.status(404).json({ error: 'Permohonan not found' });
    }
    res.status(200).json(permohonan);
  } catch (error) {
    console.error('Error retrieving permohonan:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// POST /kumpulan/ - Update a Permohonan
/**
 * @swagger
 * /api/Kumpulan/update:
 *   post:
 *     summary: Update a Permohonan
 *     tags: 
 *     - Kumpulan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: integer
 *                 description: The Permohonan ID
 *                 example: 1
 *               KumpulanID:
 *                 type: integer
 *                 example: 100
 *               PenggunaID:
 *                 type: integer
 *                 example: 50
 *               PindaanID:
 *                 type: integer
 *                 example: 10
 *               KehadiranID:
 *                 type: integer
 *                 example: 20
 *               Kapal:
 *                 type: string
 *                 example: "Kapal ABC"
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Permohonan not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/Kumpulan/update', async (req, res) => {
  const { KumpulanID, PenggunaID, PindaanID, KehadiranID, Kapal } = req.body;
  try {
    const updatedPermohonan = await prisma.tblKumpulan.updateMany({
      where: { KumpulanID: parseInt(KumpulanID) }, // Ensure KumpulanID is an integer
      data: {
        PenggunaID,
        PindaanID,
        KehadiranID,
        Kapal,
      },
    });
    res.status(200).json(updatedPermohonan); // Return the updated record
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/kumpulan/delete:
 *   post:
 *     summary: Delete specific kumpulan records associated with a given MohonID and PenggunaID
 *     tags:
 *       - Kumpulan
 *     description: Deletes `tblKumpulan` records associated with the specified MohonID (varchar) and PenggunaID (integer), and logs the action in the audit trail. If no records are found, a message indicating this is returned.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: string
 *                 description: The ID (varchar) associated with the kumpulan records to delete
 *                 example: "KRLN2024BB9"
 *               PenggunaID:
 *                 type: integer
 *                 description: The user ID (integer) associated with the kumpulan records to delete
 *                 example: 21
 *     responses:
 *       200:
 *         description: Success or no records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success or informational message
 *                   example: "User successfully deleted from MohonID"
 *       400:
 *         description: Bad Request (e.g., missing required MohonID or PenggunaID)
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
 *         description: No matching records found for the given MohonID and PenggunaID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Informational message when no records are found
 *                   example: "No matching records found"
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
 *                   example: "Internal Server Error"
 */


router.post('/kumpulan/delete', async (req, res) => {
  const { MohonID, PenggunaID } = req.body;

  // Ensure MohonID is provided before proceeding
  if (!MohonID) {
    return res.status(400).json({ error: 'MohonID is required' });
  }

  try {
    // Check if the specific MohonID and PenggunaID exist
    const records = await prisma.tblKumpulan.findMany({
      where: {
        MohonID: MohonID,
        PenggunaID: PenggunaID, // Ensure PenggunaID matches
      },
    });

    if (records && records.length > 0) {
      // Fetch associated permohonan details for audit trail
      const permohonan = await prisma.tblPermohonan.findMany({
        where: { MohonID: MohonID },
      });

      // Perform delete operation
      await prisma.tblKumpulan.deleteMany({
        where: {
          MohonID: MohonID,
          PenggunaID: PenggunaID, // Delete specific user under the MohonID
        },
      });

      // Log the action in audit trail
      await prisma.tblAuditTrail.create({
        data: {
          MohonID: MohonID,
          PenggunaID: PenggunaID, // Log the specific user deleted
          action: 'DELETE',
          TableName: 'tblKumpulan',
          RecordID: String(records[0].ID), // Use the ID of the deleted record for tracking
          Reason: `Deleted user ${PenggunaID} from MohonID ${MohonID}`,
          Application: 'api/kumpulan/delete',
          actiontime: getGMTPlus8Date(),
        },
      });

      res.status(200).json({ message: 'User successfully deleted from MohonID' });
    } else {
      res.status(200).json({ message: 'No matching records found' });
    }
  } catch (error) {
    console.error('Error deleting pengguna:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
 * @swagger
 * /kumpulan/getByID:
 *   post:
 *     summary: Fetch Kumpulan records by MohonID
 *     tags:
 *       - Kumpulan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: integer
 *                 description: The Permohonan ID to fetch records for
 *                 example: 1
 *     responses:
 *       200:
 *         description: Records fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   MohonID:
 *                     type: integer
 *                   otherField:
 *                     type: string
 *       400:
 *         description: Bad Request - MohonID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: MohonID is required
 *       404:
 *         description: No records found for MohonID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No records found for MohonID 1
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/kumpulan/getByID', async (req, res) => {
  const { MohonID } = req.body;
  if (!MohonID) {
    return res.status(400).json({ error: 'MohonID is required' });
  }
  try {
    const kumpulanRecords = await prisma.tblKumpulan.findMany({
      where: {
        MohonID,
        JenisPindaID: null  // Add this line to filter for records where JenisPindaID is null
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
module.exports = router;
