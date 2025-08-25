const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
/**
 * @swagger
 * components:
 *   schemas:
 *     Permohonan:
 *       type: object
 *       required:
 *         - Nama
 *         - Tujuan
 *         - KategoriProgramID
 *         - Kekerapan
 *         - TkhMula
 *         - TkhTamat
 *         - Tempoh
 *         - KatPesertaID
 *         - JenisKhidmatID
 *         - Tempat
 *         - NegaraID
 *         - Kedutaan
 *         - Faedah
 *         - PenggunaID
 *         - TkhHantar
 *         - KumpulanID
 *         - PeruntukanID
 *         - StatusMohonID
 *       properties:
 *         Nama:
 *           type: string
 *           description: Name of the application or program
 *           example: "TEST"
 *         Tujuan:
 *           type: string
 *           description: Purpose of the application
 *           example: "TEST"
 *         KategoriProgramID:
 *           type: integer
 *           description: Program category ID
 *           example: 1
 *         Kekerapan:
 *           type: integer
 *           description: Frequency of the program
 *           example: 1
 *         TkhMula:
 *           type: string
 *           format: date
 *           description: Start date of the program
 *           example: "2024-07-25"
 *         TkhTamat:
 *           type: string
 *           format: date
 *           description: End date of the program
 *           example: "2024-07-25"
 *         Tempoh:
 *           type: string
 *           description: Duration of the program
 *           example: "5 days"
 *         KatPesertaID:
 *           type: integer
 *           description: Participant category ID
 *           example: 1
 *         JenisKhidmatID:
 *           type: integer
 *           description: Type of service ID
 *           example: 1
 *         Tempat:
 *           type: string
 *           description: Location where the program will be held
 *           example: "Kuala Lumpur"
 *         NegaraID:
 *           type: integer
 *           description: Country ID where the program will be held
 *           example: 1
 *         Kedutaan:
 *           type: string
 *           description: Embassy related to the program
 *           example: "Embassy ABC"
 *         LulusKDN:
 *           type: string
 *           description: KDN approval status (optional)
 *           example: "Approved"
 *         Faedah:
 *           type: string
 *           description: Benefits of the program
 *           example: "Skill development"
 *         PenggunaID:
 *           type: integer
 *           description: ID of the user submitting the application
 *           example: 1
 *         TkhHantar:
 *           type: string
 *           format: date-time
 *           description: Date and time of application submission
 *           example: "2024-07-25T08:40:51.620Z"
 *         KumpulanID:
 *           type: integer
 *           description: Group ID associated with the program
 *           example: 1
 *         PeruntukanID:
 *           type: integer
 *           description: Allocation or budget ID for the program
 *           example: 1
 *         StatusMohonID:
 *           type: integer
 *           description: Application status ID
 *           example: 1
 *       example:
 *         Nama: "TEST"
 *         Tujuan: "TEST"
 *         KategoriProgramID: 1
 *         Kekerapan: 1
 *         TkhMula: "2024-07-25T00:00:00.000Z"
 *         TkhTamat: "2024-07-25T00:00:00.000Z"
 *         Tempoh: "5 days"
 *         KatPesertaID: 1
 *         JenisKhidmatID: 1
 *         Tempat: "Kuala Lumpur"
 *         NegaraID: 1
 *         Kedutaan: "Embassy ABC"
 *         LulusKDN: "Approved"
 *         Faedah: "Skill development"
 *         PenggunaID: 1
 *         TkhHantar: "2024-07-25T08:40:51.620Z"
 *         KumpulanID: 1
 *         PeruntukanID: 1
 *         StatusMohonID: 1
 */
/**
 * @swagger
 * /api/permohonan:
 *   get:
 *     tags:
 *       - Permohonan
 *     summary: Retrieve a list of permohonan
 *     responses:
 *       200:
 *         description: A list of permohonan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permohonan'
 */
router.get('/', async (req, res) => {
  try {
    const permohonan = await prisma.tblPermohonan.findMany({
      distinct: ['MohonID'],  // Ensure only unique MohonID values
      orderBy: {
        UpdatedDate: 'desc',  // Sort by latest UpdatedAt date
      },
      include: {
        TblRefStatusMohon: true,
        TblRefJenisKhidmat: true,  // Include related reference tables
      },
    });
    res.json(permohonan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
/**
* @swagger
* /api/permohonan/getById:
*   post:
*     tags:
*       - Permohonan
*     summary: Get the last 3 permohonan entries by MohonID
*     description: Retrieve the last 3 permohonan entries based on the provided MohonID in the request body. Results are sorted by UpdatedDate in descending order.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               MohonID:
*                 type: integer
*                 description: The ID of the permohonan to retrieve
*                 example: 123
*     responses:
*       200:
*         description: A list of the last 3 permohonan objects sorted by UpdatedDate in descending order
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Permohonan'
*       400:
*         description: Missing or invalid MohonID
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: 'MohonID is required'
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: 'Something went wrong'
*/
router.post('/getById', async (req, res) => {
  try {
    const { MohonID } = req.body;
    // Ensure MohonID is provided
    if (!MohonID) {
      return res.status(400).json({ error: 'MohonID is required' });
    }
    // Query the database with the where condition, order by UpdatedDate, and limit to 3 results
    const permohonan = await prisma.tblPermohonan.findMany({
      where: {
        MohonID: MohonID,  // Assuming 'MohonID' is the correct field name in your database
      },
      orderBy: {
        UpdatedDate: 'desc',  // Sort by UpdatedDate in descending order
      },
      take: 3,  // Limit results to the last 3
    });
    res.json(permohonan);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
});
/**
* @swagger
* /api/permohonan:
*   post:
*     tags:
*       - Permohonan
*     summary: Get permohonan based on parameters provided in the body
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id:
*                 type: integer
*                 description: The permohonan ID (optional)
*               filter:
*                 type: object
*                 description: Additional filters for permohonan (optional)
*     responses:
*       200:
*         description: A list of permohonan objects
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Permohonan'
*/
/**
 * @swagger
 * /api/permohonan:
 *   post:
 *     tags:
 *       - Permohonan
 *     summary: Create a new permohonan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permohonan'
 *     responses:
 *       201:
 *         description: The created permohonan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permohonan'
 */
// Helper function to get GMT+8 time
function getGMTPlus8Date() {
  const date = new Date();
  date.setHours(date.getHours() + 8); // Adjust by 8 hours for GMT+8
  return date;
}
router.post('/', async (req, res) => {
  try {
    // Get the current year
    const year = new Date().getFullYear();
    // Count the number of rows in the tblPermohonan table and add 1
    const rowCount = await prisma.tblPermohonan.count();
    const incrementedCount = rowCount + 1;
    // Map JenisKhidmat values to specific codes
    const jenisKhidmatCodes = {
      1: 'PA',
      2: 'BB',
      3: 'D',
      4: 'L',
      5: 'U'
    };
    // Get the prefix based on JenisKhidmat, or set it to an empty string if not in the map
    const prefix = jenisKhidmatCodes[req.body.JenisKhidmatID] || '';
    // Generate MohonID by appending 'KRLN', the current year, the prefix, and the incremented count
    const MohonID = `KRLN${year}${prefix}${incrementedCount}`;
    // Create new Permohonan with the auto-generated MohonID
    const permohonan = await prisma.tblPermohonan.create({
      data: {
        ...req.body,  // Assuming the request body contains other fields
        MohonID,      // Set the generated MohonID
        CreatedDate: getGMTPlus8Date(), // Add CreatedDate
      },
    });
    // Log the creation action in the AuditLog table
    await prisma.tblAuditTrail.create({
      data: {
        MohonID: permohonan.MohonID,
        PenggunaID: permohonan.PenggunaID, // ID of the user who performed the action
        action: 'CREATE',
        TableName: 'tblPermohonan',
        RecordID: permohonan.id, // Assuming 'id' is the primary key of the created record
        Reason: 'New Permohonan creation',
        Application: 'api/permohonan',
        actiontime: getGMTPlus8Date()
      },
    });
    res.status(201).json({ MohonID: permohonan.MohonID });
  } catch (error) {
    console.error('Error creating permohonan:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/**
* @swagger
* /api/permohonan/update/version:
*   post:
*     tags:
*       - Permohonan
*     summary: Update a permohonan by to create a new version of Mohon ID
*     description: Update the details of a specific permohonan by providing its MohonID and other fields to update after proses draf.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               MohonID:
*                 type: integer
*                 description: The ID of the permohonan to update
*                 example: 85
*               LampiranID:
*                 type: integer
*                 description: The Lampiran ID related to the permohonan
*                 example: 85
*               PenggunaID:
*                 type: integer
*                 description: The ID of the user associated with the permohonan
*                 example: 101
*               UpdatedDate:
*                 type: string
*                 format: date-time
*                 description: Date when the permohonan was last updated (auto-generated)
*               CreatedDate:
*                 type: string
*                 format: date-time
*                 description: Date when the permohonan was originally created
*     responses:
*       200:
*         description: The updated permohonan object
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Permohonan'
*       400:
*         description: Invalid request body or missing fields
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: 'MohonID is required'
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: 'An error occurred while updating the permohonan.'
*/
router.post('/update/version', async (req, res) => {
  const { MohonID, ...data } = req.body; // Destructure to get MohonID and other fields
  try {
    //fetch the old permohonan sorted by latest created date
    const oldPermohonan = await prisma.tblPermohonan.findMany({
      where: { MohonID: MohonID },
      orderBy: { UpdatedDate: 'desc' },
      take: 1, // Fetch only the latest record
    });

    if (oldPermohonan &&oldPermohonan.length>0 ) {

    const permohonan = await prisma.tblPermohonan.create({
      data: {
        MohonID: MohonID,
        ...data,
        UpdatedDate: getGMTPlus8Date(),
        CreatedDate: oldPermohonan[0].CreatedDate,
      },
    });
    // Log the creation action in the AuditLog table
    await prisma.tblAuditTrail.create({
      data: {
        MohonID: MohonID,
        PenggunaID: permohonan.PenggunaID, // ID of the user who performed the action
        action: 'UPDATE',
        TableName: 'tblPermohonan',
        RecordID: String(permohonan.id), // Assuming 'id' is the primary key of the created record
        Reason: 'Update permohonan',
        Application: 'api/permohonan/update',
        actiontime: getGMTPlus8Date()
      },
    });
    res.json(permohonan);
  }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while updating the permohonan.' });
  }
});

/**
 * @swagger
 * /api/permohonan/update/draf:
 *   post:
 *     tags:
 *       - Permohonan
 *     summary: Update a permohonan by MohonID for permohonan draft version only
 *     description: Update the details of a specific permohonan by providing its MohonID and other fields to update after processing the draft.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: integer
 *                 description: The ID of the permohonan to update
 *                 example: 85
 *               LampiranID:
 *                 type: integer
 *                 description: The Lampiran ID related to the permohonan
 *                 example: 85
 *               PenggunaID:
 *                 type: integer
 *                 description: The ID of the user associated with the permohonan
 *                 example: 101
 *               AdditionalField1:
 *                 type: string
 *                 description: Additional field to update
 *                 example: "Value1"
 *               AdditionalField2:
 *                 type: boolean
 *                 description: Another field for update
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully updated the permohonan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique ID of the updated permohonan
 *                   example: 85
 *                 MohonID:
 *                   type: integer
 *                   description: The ID of the permohonan
 *                   example: 85
 *                 UpdatedDate:
 *                   type: string
 *                   format: date-time
 *                   description: Date when the permohonan was last updated
 *                   example: "2024-11-21T10:00:00+08:00"
 *       404:
 *         description: Permohonan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Permohonan not found'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'An error occurred while updating the permohonan.'
 */
router.post('/update/draf', async (req, res) => { 
  const { MohonID, ...data } = req.body; // Destructure to get MohonID and other fields
  try {
    // Fetch the existing permohonan record to verify it exists
    const existingPermohonan = await prisma.tblPermohonan.findMany({
      where: { MohonID: MohonID },
    });

    if (!existingPermohonan) {
      return res.status(404).json({ error: 'Permohonan not found' });
    }

    // Update the permohonan with the new data
    const updatedPermohonan = await prisma.tblPermohonan.update({
      where: { id: existingPermohonan[0].id },
      data: {
        ...data,
        UpdatedDate: getGMTPlus8Date(), // Set the update timestamp
      },
    });

    // Log the update action in the AuditLog table
    await prisma.tblAuditTrail.create({
      data: {
        MohonID: MohonID,
        PenggunaID: updatedPermohonan.PenggunaID, // ID of the user who performed the action
        action: 'UPDATE DRAF',
        TableName: 'tblPermohonan',
        RecordID: String(updatedPermohonan.id), // Assuming 'id' is the primary key of the updated record
        Reason: 'Update permohonan draf',
        Application: 'api/permohonan/update/draf',
        actiontime: getGMTPlus8Date(),
      },
    });

    res.json(updatedPermohonan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the permohonan.' });
  }
});


/**
 * @swagger
 * /api/permohonan/delete:
 *   post:
 *     summary: Delete a draft permohonan (application) and log the action in the audit trail
 *     tags:
 *       - Permohonan
 *     description: Deletes a draft permohonan (StatusMohonID = 1) specified by the MohonID. Before deletion, logs the action in the audit trail.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MohonID:
 *                 type: string
 *                 description: The ID of the permohonan to delete
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Permohonan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Permohonan deleted"
 *                 deletedRecord:
 *                   type: object
 *                   description: Details of the deleted record
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
 *                   example: "Mohon ID is required"
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

router.post('/delete', async (req, res) => { 
  const { MohonID } = req.body; // Get the id from the request body
  if (!MohonID) {
    return res.status(400).json({ error: 'Mohon ID is required' }); // Error if ID is missing
  }

  //No need to check if exist because draft will always have permohonan
  try {
    // Query the database first to fet the full info for audit Trail
    const permohonan = await prisma.tblPermohonan.findMany({
      where: {
        MohonID: MohonID,  // Assuming 'MohonID' is the correct field name in your database
      },
    });

    //Add up to audit rail first before deleting
    await prisma.tblAuditTrail.create({
      data: {
        MohonID: MohonID,
        PenggunaID: permohonan[0].PenggunaID, // ID of the user who performed the action
        action: 'DELETE',
        TableName: 'tblPermohonan',
        RecordID: String(permohonan[0].id), // Assuming 'id' is the primary key of the created record
        Reason: 'Delete draf permohonan',
        Application: 'api/permohonan/delete',
        actiontime: getGMTPlus8Date()
      },
    });

    const deletedRecord = await prisma.tblPermohonan.deleteMany({
      where: {
        AND: [
          { MohonID: MohonID }, // Check for the specific record
          { StatusMohonID: 1 }  // Ensure statusMohonID equals 1 which is draf only
        ]
      },
    });
    res.json({ message: 'Permohonan deleted', deletedRecord });
  } catch (error) {
    console.error('Error deleting permohonan:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/permohonan/permohonanCounts:
 *   get:
 *     tags:
 *       - Permohonan
 *     summary: Retrieve permohonan counts grouped by StatusMohonID and date conditions
 *     description: Returns distinct counts of permohonan for predefined StatusMohonID values (1 to 8) and counts where TkhHantar is older than 7 and 14 days for StatusMohonID = 2. Logs the action in the audit trail.
 *     responses:
 *       200:
 *         description: Permohonan counts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 StatusCounts:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                     example: 5
 *                 CountMoreThan7Days:
 *                   type: integer
 *                   example: 3
 *                 CountMoreThan14Days:
 *                   type: integer
 *                   example: 2
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

router.get('/permohonanCounts', async (req, res) => {
  try {
    // Define all StatusMohonID values
    const allStatusMohonIDs = [1, 2, 3, 6, 7, 8]; // Removed 4 and 5
    const results = {};

    // Initialize results with default values
    allStatusMohonIDs.forEach(id => {
      results[id] = 0;
    });

    // Fetch distinct counts for each StatusMohonID
    for (const id of allStatusMohonIDs) {
      const distinctRecords = await prisma.tblPermohonan.findMany({
        where: { StatusMohonID: id },
        distinct: ['MohonID'], // Replace with your unique identifier
        select: { MohonID: true },
      });
      results[id] = distinctRecords.length;
    }

    // Count records where TkhHantar is more than 7 days old for StatusMohonID = 2
    const countMoreThan7Days = await prisma.tblPermohonan.count({
      where: {
        StatusMohonID: 2,
        TkhHantar: {
          lt: new Date(new Date().setDate(new Date().getDate() - 7)), // More than 7 days ago
        },
      },
    });

    // Count records where TkhHantar is more than 14 days old for StatusMohonID = 2
    const countMoreThan14Days = await prisma.tblPermohonan.count({
      where: {
        StatusMohonID: 2,
        TkhHantar: {
          lt: new Date(new Date().setDate(new Date().getDate() - 14)), // More than 14 days ago
        },
      },
    });

    res.json({
      StatusCounts: results,
      CountMoreThan7Days: countMoreThan7Days,
      CountMoreThan14Days: countMoreThan14Days,
    });
  } catch (error) {
    console.error('Error fetching distinct counts:', error.message);


    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

