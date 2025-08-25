const express = require('express')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express()
const port = 3000
const Keycloak = require('keycloak-connect');
const session = require('express-session');

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, './keycloak-config.json');

// Import routes
const penggunaRoutes = require('./routes/penggunaRoutes');
const permohonanRoutes = require('./routes/permohonanRoutes');
const minioRoutes = require('./routes/minioRoutes');
const keycloakMission = require('./api/keycloakMission');
const countriesRouter = require('./routes/senaraiNegaraRoutes');
const bahagianRoutes = require('./routes/bahagianRoutes');  
const senaraiBidangRoutes = require('./routes/kategoriProgramRoutes');  
const KategoriPesertaRoutes = require('./routes/kategoriPesertaRoutes');  
const JenisKhidmatRoutes = require('./routes/jenisKhidmatRoutes');  
const statusMohonRoutes = require('./routes/statusMohonRoutes');  
const jenisPindaRoutes = require('./routes/jenisPindaRoutes');  
const kehadiranRoutes = require('./routes/refKehadiranRoutes'); 
const kumpulanPesertaRoutes = require('./routes/pesertaKumpulan');
const lampiranRoutes = require('./routes/lampiranRoutes');
const peruntukanRoutes = require('./routes/peruntukanRoutes');
const keycloakRoutes = require('./routes/keycloakRoutes');
const sokongRoutes = require('./routes/sokongRoutes');
const perakuRoutes = require('./routes/perakuRoutes');
const semakanRoutes = require('./routes/semakanRoutes');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Use the routes
app.use('/api/pengguna', penggunaRoutes);
app.use('/api/permohonan', permohonanRoutes);
app.use('/api/minio', minioRoutes);
app.use('/api/keycloakM', keycloakMission);
app.use('/api/peruntukan',peruntukanRoutes);
app.use('/api/sokong',sokongRoutes);
app.use('/api/peraku',perakuRoutes);

app.use('/api', bahagianRoutes);
app.use('/api', senaraiBidangRoutes);
app.use('/api', KategoriPesertaRoutes);
app.use('/api', JenisKhidmatRoutes);
app.use('/api', statusMohonRoutes);
app.use('/api', jenisPindaRoutes);
app.use('/api', kehadiranRoutes);
app.use('/api', kumpulanPesertaRoutes);
app.use('/api', lampiranRoutes);
app.use('/api', keycloakRoutes);
app.use('/api/semakan', semakanRoutes);

// ✅ Negara routes (without /api prefix)
app.use('/', countriesRouter);

app.get('/', (req, res) => {
  res.send('This is krln backend')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
