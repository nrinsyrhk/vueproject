<script setup>

import { useRoute } from 'vue-router'; // Import useRoute instead of useRouter
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from "primevue/button"; 
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext'; 

const route = useRoute(); // Get the current route
const router = useRouter();
const error = ref(null); 
const loading = ref(true);
const baseUrl = import.meta.env.VITE_API_URL;
const MohonID = route.params.id; // Extract the MohonID from the route params

onMounted(() => {
    console.log('Permohonan ID:', MohonID); // Log the Permohonan ID when the component is mounted
    fetchMohonID();
    getKategoriProgram();
    getKategoriPeserta();
    getKategoriKhidmat();
    getNegara();
    fetchDocuments();
    fetchDataPeruntukan();
});

const dropdownKategoriPeserta = ref ([]);
const dropdownKategoriProgram = ref ([]);
const dropdownKategoriKhidmat = ref ([]);
const dropdownNegara = ref ([]);
const dropdownPeringkatKelulusan = ref([]);

const permohonan = ref({
  Nama: '',
  Tujuan: '',
  KategoriProgramID: '',
  Kekerapan: '',
  TkhMula: null,
  TkhTamat: null,
  Tempoh: null,
  KatPesertaID: '',
  JenisKhidmatID: '',
  NegaraID: '',
  Tempat: '',
  Kedutaan: '',
  LulusKDN: '',
  Faedah: ''
});

async function fetchMohonID() {
  try {
    const response = await axios.post(`${baseUrl}/api/permohonan/getById`, {
      MohonID: MohonID
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0]; 

      permohonan.value = {
        Nama: result.Nama,
        Tujuan: result.Tujuan,
        KategoriProgramID: result.KategoriProgramID,
        Kekerapan: result.Kekerapan,
        TkhMula: result.TkhMula ? new Date(result.TkhMula) : null,
        TkhTamat: result.TkhTamat ? new Date(result.TkhTamat) : null,
        Tempoh: result.Tempoh,
        KatPesertaID: result.KatPesertaID,
        JenisKhidmatID: result.JenisKhidmatID,
        NegaraID: result.NegaraID,
        Tempat: result.Tempat,
        Kedutaan: result.Kedutaan,
        LulusKDN: result.LulusKDN,
        Faedah: result.Faedah
      };

      console.log("Fetched permohonan:", permohonan.value);
    } else {
      console.error('No permohonan found for the provided MohonID.');
    }
  } catch (err) {
    console.error('Failed to load permohonan:', err.response?.data || err);
    error.value = 'Failed to fetch permohonan data.';
  } finally {
    loading.value = false;
  }
}
// Fetch data on component mount
onMounted(() => {
    fetchMohonID();
});

// Computed property to manage formatted TkhMula for the Calendar
const formattedTkhMula = computed({
    get() {
        if (!permohonan.value || !permohonan.value.TkhMula) return null;
        const date = new Date(permohonan.value.TkhMula);
        return date.toLocaleDateString("en-GB"); // Format as dd/mm/yyyy for display
    },
    set(newValue) {
        if (!newValue) {
            permohonan.value.TkhMula = null;
        } else if (typeof newValue === 'string') {
            // Ensure the value is a string and split it
            const [day, month, year] = newValue.split('/');
            permohonan.value.TkhMula = new Date(`${year}-${month}-${day}`).toISOString();
        } else if (newValue instanceof Date) {
            // If the newValue is a Date object, store it directly as ISO
            permohonan.value.TkhMula = newValue.toISOString();
        }
    }
});

// Computed property to manage formatted TkhTamat for the Calendar
const formattedTkhTamat = computed({
    get() {
        if (!permohonan.value || !permohonan.value.TkhTamat) return null;
        const date = new Date(permohonan.value.TkhTamat);
        return date.toLocaleDateString("en-GB"); // Format as dd/mm/yyyy for display
    },
    set(newValue) {
        if (!newValue) {
            permohonan.value.TkhTamat = null;
        } else if (typeof newValue === 'string') {
            // Ensure the value is a string and split it
            const [day, month, year] = newValue.split('/');
            permohonan.value.TkhTamat = new Date(`${year}-${month}-${day}`).toISOString();
        } else if (newValue instanceof Date) {
            // If the newValue is a Date object, store it directly as ISO
            permohonan.value.TkhTamat = newValue.toISOString();
        }
    }
});

// Calling kategori program from API
async function getKategoriProgram() {
    try {
        const { data } = await axios.get(`${baseUrl}/api/senaraiKategoriProgram`);
        dropdownKategoriProgram.value = data;
        console.log('kategoriProgram:', dropdownKategoriProgram.value);
    } catch (err) {
        const errorMessage = err.response
            ? `Server responded with status ${err.response.status}: ${err.response.data?.message || err.message}`
            : err.request
                ? 'No response received from the server.'
                : 'Failed to load data. ' + err.message;

        console.error(errorMessage);
        error.value = errorMessage;
    } finally {
        loading.value = false;
    }
}

//calling kategori Peserta from api
async function getKategoriPeserta() {
    try {
        const { data } = await axios.get(`${baseUrl}/api/senaraiPeserta`);
        dropdownKategoriPeserta.value = data;
        console.log('kategoriPeserta:', dropdownKategoriPeserta.value);
    } catch (err) {
        const errorMessage = err.response
            ? `Server responded with status ${err.response.status}: ${err.response.data?.message || err.message}`
            : err.request
                ? 'No response received from the server.'
                : 'Failed to load data. ' + err.message;
        console.error(errorMessage);
        error.value = errorMessage;
    } finally {
        loading.value = false;
    }
}

//calling kategori khidmat from api
async function getKategoriKhidmat() {
    try {
        const { data } = await axios.get(`${baseUrl}/api/senaraiKhidmat`);
        dropdownKategoriKhidmat.value = data;
        console.log('kategoriKhidmat:', dropdownKategoriKhidmat.value);
    } catch (err) {
        const errorMessage = err.response
            ? `Server responded with status ${err.response.status}: ${err.response.data?.message || err.message}`
            : err.request
                ? 'No response received from the server.'
                : 'Failed to load data. ' + err.message;

        console.error(errorMessage);
        error.value = errorMessage;
    } finally {
        loading.value = false;
    }
}

//calling kategori negara from api
async function getNegara() {
    try {
        const { data } = await axios.get(`${baseUrl}/api/senaraiNegara`);
        dropdownNegara.value = data;
        console.log('Negara:', dropdownNegara.value);
    } catch (err) {
        const errorMessage = err.response
            ? `Server responded with status ${err.response.status}: ${err.response.data?.message || err.message}`
            : err.request
                ? 'No response received from the server.'
                : 'Failed to load data. ' + err.message;

        console.error(errorMessage);
        error.value = errorMessage;
    } finally {
        loading.value = false;
    }
}

// Function maklumat peserta
// State for table and dialog
const pesertaList = ref([]);
const searchQuery = ref('');
const namaKapal = ref('');

const users = ref([]); // Holds the list of users

// Fetch peserta and pengguna data
const fetchData = async () => {
    try {
        // Fetch peserta list
        const pesertaResponse = await axios.post(`${baseUrl}/api/kumpulan/getByID`, { MohonID });
        const pesertaData = pesertaResponse.data;

        // Fetch pengguna options
        const penggunaResponse = await axios.get(`${baseUrl}/api/pengguna`);
        const penggunaData = penggunaResponse.data;

        // Map pengguna data to include Jawatan
        const penggunaMap = new Map();
        penggunaData.forEach((user) => {
            penggunaMap.set(user.PenggunaID, user);
        });

        // Populate pesertaList with mapped data
        if (pesertaData.length > 0) {
            namaKapal.value = pesertaData[0].NamaKapal || '';
            pesertaList.value = pesertaData.map((peserta) => {
                const pengguna = penggunaMap.get(peserta.PenggunaID) || {};
                return {
                    ...peserta,
                    Nama: pengguna.Nama || 'Unknown',
                    Jawatan: pengguna.Jawatan || 'Unknown',
                };
            });
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        Swal.fire('Ralat', 'Tiada rekod data peserta.', 'error');
    }
};

// Fetch users and ensure plain objects
const fetchUsers = async () => {
    try {
        const response = await axios.get(`${baseUrl}/api/pengguna`);
        users.value = response.data.map(user => ({ ...user }));
        console.log('Fetched Users:', users.value);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
// Computed property for filtering users
const filteredUsers = computed(() =>
    users.value.filter(user =>
        user.Nama.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

const plainFilteredUsers = computed(() => {
    const result = filteredUsers.value.map(user => ({ ...user }));
    console.log('Plain Filtered Users:', result);
    return result;
});

// Watch plainFilteredUsers to debug
watch(plainFilteredUsers, (newVal) => {
    console.log('Filtered Users:', newVal);
});

// Fetch users and peserta on mounted
onMounted(() => {
    fetchUsers();
    fetchData();
});

// Function to fetch documents
const documents = ref([]);

const fetchDocuments = async () => {
    try {
        const response = await axios.post(`${baseUrl}/api/lampiran/getByID`, { MohonID });
        documents.value = response.data;
    } catch (error) {
        console.error("Failed to fetch documents", error);
    }
};

// Download document

const downloadFile = async (documentData) => {
    try {
        console.log("Starting download for:", documentData.NamaFail);

        const formData = new FormData();
        formData.append('fileName', documentData.NamaFail);
        formData.append('folderName', MohonID);

        const response = await axios.post(`${baseUrl}/api/minio/download`, formData, {
            responseType: 'blob', // Ensure response is treated as file
        });

        console.log("API Response:", response);
        console.log("Response Data:", response.data);

        const blob = response.data;
        console.log("Blob Size:", blob.size);

        if (blob.size > 0) {
            const url = window.URL.createObjectURL(blob);
            const link = globalThis.document.createElement('a'); // Ensure correct reference
            link.href = url;
            link.setAttribute('download', documentData.NamaFail);
            globalThis.document.body.appendChild(link);
            link.click();
            globalThis.document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Muat Turun Gagal',
                text: 'Fail tidak mengandungi data.',
            });
        }
    } catch (error) {
        console.error("Download Error:", error.response || error.message);
        Swal.fire({
            icon: 'error',
            title: 'Muat Turun Gagal',
            text: error.response?.data?.message || 'Ralat berlaku semasa memuat turun fail.',
        });
    }
};

// Function to call maklumat peruntukan

const form = ref({
    kewMohon: '',
    PengesahanRP: '',
    tarikhbakiPKLN: null,
    bakiPKLN: '',
    kewSah: '',
    bakiPTJ: '',
    tanggunganOleh: '',
    ulasan: '',
    tajaanperinci: '',
    tajaanoleh: '',
    MohonID: MohonID,
});

// Dropdown options
const dropdownBudgetOptions = [
    { label: 'Ada', value: 1 },
    { label: 'Tiada', value: 0 },
];

// Function to format date to dd/mm/yyyy
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Fetch data for form population
const fetchDataPeruntukan = async () => {
    try {
        const response = await axios.post(`${baseUrl}/api/peruntukan/getByID`, { MohonID: form.value.MohonID });

        if (response.data && response.data.length > 0) {
            const data = response.data[0];
            form.value.kewMohon = data.kewMohon || '';
            form.value.PengesahanRP = data.PengesahanRP !== null ? data.PengesahanRP : 0; // Default to 0 if null
            form.value.tarikhbakiPKLN = data.tarikhbakiPKLN ? formatDate(data.tarikhbakiPKLN) : ''; // Format date
            form.value.bakiPKLN = data.bakiPKLN || '';
            form.value.kewSah = data.kewSah || '';
            form.value.bakiPTJ = data.bakiPTJ || '';
            form.value.tanggunganOleh = data.tanggunganOleh || '';
            form.value.ulasan = data.ulasan || '';
            form.value.tajaanperinci = data.tajaanperinci || '';
            form.value.tajaanoleh = data.tajaanoleh || '';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Fetch data on component mount
onMounted(() => {
    fetchDataPeruntukan();
});

// Get today's date
const today = new Date();

// Format the date (e.g., "DD/MM/YYYY")
const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

// Fetch Senarai Kuasa Lulus Data
const getPeringkatKelulusan = async () => {
    try {
        const { data } = await axios.get(`${baseUrl}/api/senaraiKuasaLulus`);
        dropdownPeringkatKelulusan.value = data.map(item => ({
            PeringkatKelulusanID: item.KuasaLulusID, // Map to PeringkatKelulusanID
            keterangan: item.Keterangan.trim()      // Map to keterangan (trim whitespace)
        }));
    } catch (err) {
        console.error('Failed to fetch senarai kuasa lulus:', err);
    }
};
// Fetch data on component mount
onMounted(() => {
    getPeringkatKelulusan();
});

// Fetch Kronologi

const tableData = ref([]); // Store the data for the table
const userMap = ref({});

// Fetch user data and create a mapping of PenggunaID to Nama
const namaUsers = async () => {
    try {
        const response = await axios.get(`${baseUrl}/api/pengguna`);
        if (response.data && response.data.length > 0) {
            userMap.value = response.data.reduce((map, user) => {
                map[user.PenggunaID] = user.Nama; // Map PenggunaID to Nama
                return map;
            }, {});
        }
    } catch (err) {
        console.error('Failed to fetch user data:', err.response?.data || err.message);
    }
};


</script>

<template>
    <div class="p-fluid formgrid grid">
        <div class="col-12">
            <div class="card">
                <h5 class="right-aligned-heading">Peraku Permohonan ( Kod Mohon : {{ MohonID }} )</h5>

                <div class="divider"></div> <!-- Custom divider -->

                <!-- Display loading or error message -->
                <div v-if="loading">Loading...</div>
                <div v-if="error">{{ error }}</div>

                <!-- Form Section -->
                <div v-if="!loading && permohonan">
                    <form>

                        <div class="borang-container">
                            <div class="borang-header">
                                <p class="borang-date" style="text-align: right; margin: 0;">Tarikh: {{ formattedDate }}
                                </p>
                            </div>
                            <div class="divider"></div> <!-- Custom divider -->
                            <div class="borang-section">
                                <h3 class="section-title">Maklumat Permohonan</h3>
                                <div class="borang-row">
                                    <div class="borang-field">
                                        <label>Nama Program:</label>
                                        <span>{{ permohonan.Nama }}</span>
                                    </div>
                                    <div class="borang-field">
                                        <label>Tujuan:</label>
                                        <span>{{ permohonan.Tujuan }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="divider"></div> <!-- Custom divider -->

                            <div class="borang-section">
                                <h3 class="section-title">Tarikh</h3>
                                <div class="borang-row" style="display: flex; gap: 1rem; align-items: center;">
                                    <div class="borang-field">
                                        <label>Tarikh Mula:</label>
                                        <span>{{ formattedTkhMula }}</span>
                                    </div>
                                    <div class="borang-field" style="margin-left: 20px;">
                                        <label>Tarikh Tamat:</label>
                                        <span>{{ formattedTkhTamat }}</span>
                                    </div>
                                    <div class="borang-field">
                                        <label>Tempoh (hari):</label>
                                        <span>{{ permohonan.Tempoh }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="divider"></div> <!-- Custom divider -->

                            <div class="borang-section">
                                <h3 class="section-title">Kategori</h3>
                                <div class="borang-row">
                                    <div class="borang-field">
                                        <label>Kategori Program:</label>
                                        <span>{{ dropdownKategoriProgram.find(option => option.KategoriProgramID ===
                                            permohonan.KategoriProgramID)?.keterangan }}</span>
                                    </div>
                                    <div class="borang-field" style="padding-left: 20px;">
                                        <label>Kategori Peserta:</label>
                                        <span>{{ dropdownKategoriPeserta.find(option => option.KatPesertaID ===
                                            permohonan.KatPesertaID)?.Keterangan }}</span>
                                    </div>
                                    <div class="borang-field">
                                        <label>Kategori Perkhidmatan:</label>
                                        <span>{{ dropdownKategoriKhidmat.find(option => option.JenisKhidmatID ===
                                            permohonan.JenisKhidmatID)?.Keterangan }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="divider"></div> <!-- Custom divider -->

                            <div class="borang-section">
                                <h3 class="section-title">Lokasi</h3>
                                <div class="borang-row">
                                    <div class="borang-field">
                                        <label>Negara:</label>
                                        <span>{{ dropdownNegara.find(option => option.NegaraID ===
                                            permohonan.NegaraID)?.Nama }}</span>
                                    </div>
                                    <div class="borang-field" style="padding-left: 20px;">
                                        <label>Tempat:</label>
                                        <span>{{ permohonan.Tempat }}</span>
                                    </div>
                                    <div class="borang-field">
                                        <label>Kedutaan:</label>
                                        <span>{{ permohonan.Kedutaan }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="divider"></div> <!-- Custom divider -->

                            <div class="borang-section">
                                <h3 class="section-title">Kelulusan & Faedah</h3>
                                <div class="borang-row">
                                    <div class="borang-field">
                                        <label>Kelulusan KDN:</label>
                                        <span>{{ permohonan.LulusKDN }}</span>
                                    </div>
                                    <div class="borang-field">
                                        <label>Faedah Kepada Negara:</label>
                                        <span>{{ permohonan.Faedah }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="divider"></div> <!-- Custom divider -->

                            <div class="borang-section">
                                <h3 class="section-title">Maklumat Peserta</h3>
                                <div class="form-group">
                                    <label for="namaKapal" class="form-label">Nama Kapal:</label>
                                    <span>{{ namaKapal }}</span>
                                </div>
                                <!-- Peserta Table -->
                                <table class="table-auto w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr class="bg-gray-100">
                                            <th class="border border-gray-300 px-4 py-2">Bil</th>
                                            <th class="border border-gray-300 px-4 py-2">Nama Peserta</th>
                                            <th class="border border-gray-300 px-4 py-2">Jawatan</th>
                                            <th class="border border-gray-300 px-4 py-2">Ketua Delegasi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="pesertaList.length === 0">
                                            <td colspan="5" class="text-center">Tiada data tersedia.</td>
                                        </tr>
                                        <tr v-for="(peserta, index) in pesertaList" :key="peserta.PenggunaID">
                                            <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                                            <td class="border border-gray-300 px-4 py-2">{{ peserta.Nama }}</td>
                                            <td class="border border-gray-300 px-4 py-2">{{ peserta.Jawatan }}</td>
                                            <td class="border border-gray-300 px-4 py-2 text-center">
                                                <input type="radio" :checked="peserta.KetuaDelagasi === 1"
                                                    :disabled="peserta.KetuaDelagasi !== 1" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br>
                            </div>

                            <div class="divider"></div> <!-- Custom divider -->

                            <div class="borang-section">
                                <h3 class="section-title">Maklumat Lampiran</h3>
                                <div>
                                    <table class="table-auto w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr class="bg-gray-100">
                                                <th class="border border-gray-300 px-4 py-2">Bil</th>
                                                <th class="border border-gray-300 px-4 py-2">Nama Fail</th>
                                                <th class="border border-gray-300 px-4 py-2">Muat Turun</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(document, index) in documents" :key="document.ID">
                                                <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                                                <td class="border border-gray-300 px-4 py-2">
                                                    {{ document.NamaFail ? document.NamaFail : 'Nama Fail Tidak Sah' }}
                                                </td>
                                                <td class="border border-gray-300 px-4 py-2 text-center">
                                                    <Button icon="pi pi-download"
                                                        class="p-button-rounded p-button-info mr-1" title="Muat Turun"
                                                        @click="downloadFile(document)" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="divider"></div> <!-- Custom divider -->

                            <div class="borang-section">
                                <h3 class="section-title">Implikasi Kewangan</h3>
                                <div class="borang-row">
                                    <div class="borang-field">
                                        <label>Implikasi Kewangan Dimohon (RM):</label>
                                        <span>{{ form.kewMohon }}</span>
                                    </div>
                                    <div class="borang-field">
                                        <label>Implikasi Kewangan Disahkan Oleh PTJ (RM):</label>
                                        <span>{{ form.kewSah }}</span>
                                    </div>
                                </div>
                                <br>

                                <div class="divider"></div> <!-- Custom divider -->

                                <div class="borang-section">
                                    <h3 class="section-title">Baki</h3>
                                    <div class="borang-row">
                                        <div class="borang-field">
                                            <label>Baki PKLN (RM):</label>
                                            <span>{{ form.bakiPKLN }}</span>
                                        </div>
                                        <div class="borang-field">
                                            <label>Sehingga:</label>
                                            <span>{{ form.tarikhbakiPKLN }}</span>
                                        </div>
                                        <div class="borang-field">
                                            <label>Baki Peruntukan PTJ (RM):</label>
                                            <span>{{ form.bakiPTJ }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="divider"></div> <!-- Custom divider -->

                                <div class="borang-section">
                                    <h3 class="section-title">Perbelanjaan</h3>
                                    <div class="borang-row">
                                        <div class="borang-field">
                                            <label>Pengesahan Rancangan Perbelanjaan:</label>
                                            <span>{{ dropdownBudgetOptions.find(option => option.value ===
                                                form.PengesahanRP)?.label }}</span>
                                        </div>
                                        <div class="borang-field">
                                            <label>Perbelanjaan Ditanggung Oleh:</label>
                                            <span>{{ form.tanggunganOleh }}</span>
                                        </div>
                                        <div class="borang-field">
                                            <label>Ulasan:</label>
                                            <span>{{ form.ulasan }}</span>
                                        </div>
                                    </div>

                                    <div class="divider"></div> <!-- Custom divider -->

                                    <h3 class="section-title">Tajaan</h3>
                                    <div class="borang-row">
                                        <div class="borang-field">
                                            <label>Perincian Tajaan:</label>
                                            <span>{{ form.tajaanperinci }}</span>
                                        </div>
                                        <div class="borang-field">
                                            <label>Tajaan Oleh:</label>
                                            <span>{{ form.tajaanoleh }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="divider"></div> <!-- Custom divider -->

                                <div class="borang-section">
                                    <h3 class="section-title">Kronologi Permohonan</h3>
                                    <div v-if="loading" class="text-center">Loading...</div>
                                    <div v-else>
                                        <table class="table-auto w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr class="bg-gray-100">
                                                    <th class="border border-gray-300 px-4 py-2">Bil</th>
                                                    <th class="border border-gray-300 px-4 py-2">Status</th>
                                                    <th class="border border-gray-300 px-4 py-2">Tarikh Tindakan</th>
                                                    <th class="border border-gray-300 px-4 py-2">Nama Pegawai</th>
                                                    <th class="border border-gray-300 px-4 py-2">Ulasan</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(row, index) in tableData" :key="index">
                                                    <td class="border border-gray-300 px-4 py-2">{{ row.Bil }}</td>
                                                    <td class="border border-gray-300 px-4 py-2">{{ row.Status }}</td>
                                                    <td class="border border-gray-300 px-4 py-2 text-center">{{
                                                        formatDate(row.TarikhTindakan) }}</td>
                                                    <td class="border border-gray-300 px-4 py-2 text-center">{{
                                                        row.NamaPegawai }}</td>
                                                    <td class="border border-gray-300 px-4 py-2 text-center">{{
                                                        row.Ulasan }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </form>   
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    margin: 1rem;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
    border-radius: 10px;
}

.loading-message {
    text-align: center;
    color: blue;
    font-weight: bold;
}

.error-message {
    text-align: center;
    color: red;
    font-weight: bold;
}

.section-title {
    margin-bottom: 10px;
    font-size: 1.2rem; /* Increased size for better visibility */
    font-weight: bold;
    color: #3b4a6b; /* Dark blue-gray */
}

.divider {
    border: 0;
    height: 1px;
    background-color: #ccc; /* Light grey color */
    margin: 10px 0 20px; /* Adjust spacing above & below */
}

.borang-container {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 20px auto;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.borang-header {
    text-align: center;
    margin-bottom: 20px;
}

.borang-header .borang-date {
    font-size: 14px;
    color: #666;
}

.borang-section {
    margin-bottom: 20px;
}

.borang-row {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.borang-field {
    flex: 1;
}

.borang-field label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}

.borang-field span {
    display: inline;
    padding: 0;
    margin: 0;
}

.styled-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.styled-table th,
.styled-table td {
    padding: 12px 15px;
    border: 1px solid #d1d9e3; /* Light blue-gray border */
}

.styled-table thead tr {
    background-color: #3b4a6b; /* Dark blue-gray */
    color: #ffffff;
}

.styled-table tbody tr:nth-child(even) {
    background-color: #e8eff5; /* Light blue-gray for even rows */
}

.styled-table tbody tr:hover {
    background-color: #d9e2ec; /* Blue-gray for hover */
}

.text-center {
    text-align: center;
}
</style>

