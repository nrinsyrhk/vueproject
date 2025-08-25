<script setup>

import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from "primevue/button";
import { useRoute } from 'vue-router';  // Import useRoute instead of useRouter
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';

const route = useRoute();  // Get the current route
const router = useRouter();
const loading = ref(true);
const error = ref(null);
const baseUrl = import.meta.env.VITE_API_URL;

const MohonID = route.params.id;  // Extract the MohonID from the route params
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

const dropdownKategoriProgram = ref([]);
const dropdownKategoriPeserta = ref([]);
const dropdownKategoriKhidmat = ref([]);
const dropdownNegara = ref([]);

const dropdownPeringkatKelulusan = ref([]);

// Declare permohonan as a reference
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
    Faedah: '',
});

// Fetch the permohonan data using the ID
async function fetchMohonID() {
    try {
        const response = await axios.post(`${baseUrl}/api/permohonan/getById`, {
            MohonID: MohonID, // Use MohonID from the route params in the request body
        });

        if (response.data && response.data.length > 0) {
            const data = response.data[0]; // Access the first element of the array

            // Map response data to permohonan
            permohonan.value = {
                Nama: data.Nama,
                Tujuan: data.Tujuan,
                KategoriProgramID: data.KategoriProgramID,
                Kekerapan: data.Kekerapan,
                TkhMula: data.TkhMula ? new Date(data.TkhMula) : null, // Ensure valid Date object
                TkhTamat: data.TkhTamat ? new Date(data.TkhTamat) : null, // Ensure valid Date object
                Tempoh: data.Tempoh,
                KatPesertaID: data.KatPesertaID,
                JenisKhidmatID: data.JenisKhidmatID,
                NegaraID: data.NegaraID,
                Tempat: data.Tempat,
                Kedutaan: data.Kedutaan,
                LulusKDN: data.LulusKDN,
                Faedah: data.Faedah,
            };
        } else {
            console.error('No data found for the provided MohonID.');
        }
    } catch (err) {
        console.error('Failed to load permohonan data', err.response?.data || err);
    } finally {
        loading.value = false;
    }
}

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

const fetchRow1Data = async () => {
    try {
        const response = await axios.post(`${baseUrl}/api/permohonan/getById`, {
            MohonID: MohonID,
        });
        const data = response.data[0];
        return {
            Bil: 1,
            Status: 'Baharu',
            TarikhTindakan: data.TkhHantar,
            NamaPegawai: userMap.value[data.PenggunaID] || 'Tidak Dikenalpasti', // Map PenggunaID to Nama
            Ulasan: 'Permohonan Baru',
        };
    } catch (error) {
        console.error('Error fetching row 1 data:', error);
        return null;
    }
};

const fetchRow2Data = async () => {
    try {
        const response = await axios.post(`${baseUrl}/api/semakan/getByID`, {
            MohonID: MohonID,
        });
        const data = response.data[0];

        console.log("Semakan Response Data:", data); // Debugging

        // Fetch Kuasa Lulus Mapping
        const kuasaLulusResponse = await axios.get(`${baseUrl}/api/senaraiKuasaLulus`);
        const kuasaLulusList = kuasaLulusResponse.data;

        console.log("Kuasa Lulus List:", kuasaLulusList); // Debugging

        // Map KuasaLulusID to Keterangan
        const kuasaLulusItem = kuasaLulusList.find(item => item.KuasaLulusID === data.KuasaLulusID);

        console.log("Matched Kuasa Lulus:", kuasaLulusItem); // Debugging

        return {
            Bil: 2,
            Status: 'Semakan',
            TarikhTindakan: data.TkhSemak,
            NamaPegawai: userMap.value[data.PenyemakID] || 'Tidak Dikenalpasti',
            Ulasan: data.Ulasan,
            KuasaLulus: kuasaLulusItem ? kuasaLulusItem.Keterangan.trim() : "Tidak Diketahui",
            KewDiperaku: data.KewDiperaku
        };
    } catch (error) {
        console.error('Error fetching row 2 data:', error);
        return null;
    }
};

const row2DataRef = ref(null); // Make sure this is declared

onMounted(async () => {
    await namaUsers(); // Fetch user data and create the mapping

    const row1Data = await fetchRow1Data();
    const row2Data = await fetchRow2Data();

    if (row1Data && row2Data) {
        tableData.value = [row1Data, row2Data];
    }

    row2DataRef.value = row2Data; // Store row2Data in a reactive variable

    console.log("row2Data:", row2Data); // Debugging
    loading.value = false;
});

//options tindakan
const selectedTindakan = ref(""); // Holds the selected value

// options Ulasan

const selectedOption = ref(""); // To track selected option
const selectedDropdown = ref(null); // Stores selected dropdown value
const ulasanText = ref(""); // Stores textarea value

// Disable radio buttons after selecting from dropdown or typing in textarea
const isOptionLocked = computed(() => selectedDropdown.value !== null || ulasanText.value.trim() !== "");

</script>

<template>
    <div class="p-fluid formgrid grid">
        <div class="col-12">
            <div class="card">
                <h5 class="right-aligned-heading">Sokong Permohonan ( Kod Mohon : {{ MohonID }} )</h5>

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

                            <div class="borang-section">
                                <h3 class="section-title">Tarikh</h3>
                                <div class="borang-row" style="display: flex; gap: 1rem; align-items: center;">
                                    <div class="borang-field">
                                        <label>Tarikh Mula:</label>
                                        <span>{{ formattedTkhMula }}</span>
                                    </div>
                                    <div class="borang-field">
                                        <label>Tarikh Tamat:</label>
                                        <span>{{ formattedTkhTamat }}</span>
                                    </div>
                                    <div class="borang-field">
                                        <label>Tempoh (hari):</label>
                                        <span>{{ permohonan.Tempoh }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="borang-section">
                                <h3 class="section-title">Kategori</h3>
                                <div class="borang-row">
                                    <div class="borang-field">
                                        <label>Kategori Program:</label>
                                        <span>{{ dropdownKategoriProgram.find(option => option.KategoriProgramID ===
                                            permohonan.KategoriProgramID)?.keterangan }}</span>
                                    </div>
                                    <div class="borang-field">
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

                            <div class="borang-section">
                                <h3 class="section-title">Lokasi</h3>
                                <div class="borang-row">
                                    <div class="borang-field">
                                        <label>Negara:</label>
                                        <span>{{ dropdownNegara.find(option => option.NegaraID ===
                                            permohonan.NegaraID)?.Keterangan }}</span>
                                    </div>
                                    <div class="borang-field">
                                        <label>Tempat:</label>
                                        <span>{{ permohonan.Tempat }}</span>
                                    </div>
                                    <div class="borang-field">
                                        <label>Kedutaan:</label>
                                        <span>{{ permohonan.Kedutaan }}</span>
                                    </div>
                                </div>
                            </div>

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
                            <br>
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
                            <br>
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
                            <br>
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
                                <br>


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
                                    <h3 class="section-title">Peruntukan Kewangan (CKK)</h3>
                                    <div class="borang-row">
                                        <div class="borang-field">
                                            <label>Peringkat Kelulusan:</label>
                                            <span>{{ row2DataRef?.KuasaLulus  }}</span>
                                        </div>
                                        <div class="borang-field">
                                            <label>Implikasi Kewangan yang diperakukan:</label>
                                            <span>RM {{ row2DataRef?.KewDiperaku }}</span>
                                        </div>
                                    </div>    
                                </div>

                                <div class="divider"></div> <!-- Custom divider -->
                                <br>

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

                        <div class="divider"></div> <!-- Custom divider -->
                        <div class="form-section"
                            style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 1rem; align-items: flex-start;">
                            <!-- Tindakan Heading -->
                            <h5 class="right-left-heading" style="grid-column: span 12;">Tindakan</h5>

                            <!-- Radio Buttons -->
                            <div class="field-radiobutton" style="grid-column: span 3;">
                                <RadioButton id="tindakan1" name="Disokong" value="Disokong"
                                    v-model="selectedTindakan" />
                                <label for="tindakan1">Disokong</label>
                            </div>
                            <div class="field-radiobutton" style="grid-column: span 3;">
                                <RadioButton id="tindakan1" name="Tidak Disokong" value="Tidak Disokong"
                                    v-model="selectedTindakan" />
                                <label for="tindakan1">Tidak Disokong</label>
                            </div>
                            <div class="field-radiobutton" style="grid-column: span 3;">
                                <RadioButton id="tindakan1" name="Kuiri" value="Kuiri" v-model="selectedTindakan" />
                                <label for="tindakan1">Kuiri</label>
                            </div>

                            <!-- Ulasan -->
                            <div class="field" style="grid-column: span 12;">
                                <label for="ulasan">Ulasan</label>

                                <!-- Radio buttons (Disabled once an option is chosen) -->
                                <div class="flex gap-4">
                                    <div>
                                        <input type="radio" id="dropdownOption" value="dropdown"
                                            v-model="selectedOption" :disabled="isOptionLocked" />
                                        <label for="dropdownOption">Pilih dari Senarai</label>
                                    </div>
                                    <div>
                                        <input type="radio" id="textareaOption" value="textarea"
                                            v-model="selectedOption" :disabled="isOptionLocked" />
                                        <label for="textareaOption">Tulis Ulasan</label>
                                    </div>
                                </div>
                                <br>
                                <!-- Dropdown (Disabled if textarea is selected or no selection) -->
                                <Dropdown v-model="selectedDropdown" :options="ulasanOptions" optionLabel="label"
                                    placeholder="Pilih Ulasan" style="width: 100%;"
                                    :disabled="selectedOption === '' || selectedOption === 'textarea'" />

                                <br>

                                <!-- Textarea (Disabled if dropdown is selected or no selection) -->
                                <Textarea v-model="ulasanText" rows="3" cols="20" style="width: 100%;"
                                    :disabled="selectedOption === '' || selectedOption === 'dropdown'" />
                            </div>

                        </div>
                        <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                            <Button label="Simpan" icon="pi pi-save" class="p-button-sm p-button-info p-button-rounded"
                                title="Simpan Keputusan" style="width: auto; font-size: 0.75rem; padding: 0.5rem 1rem;"
                                @click="simpanKeputusan" />&nbsp;&nbsp;&nbsp;
                            <Button label="Hantar" icon="pi pi-send"
                                class="p-button-sm p-button-success p-button-rounded" title="Hantar Keputusan"
                                style="width: auto; font-size: 0.75rem; padding: 0.5rem 1rem;"
                                @click="hantarKeputusan" />
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
}

.button-container {
    text-align: right;
    margin-top: 1.5rem;
}

h6 {
    margin-top: 1.5rem;
    font-weight: bold;
    color: #333;
}

.section-title {
    margin-bottom: 20px;
    font-size: 1.25rem;
    /* Adjust the size as needed */
    font-weight: bold;
}

.divider {
    border: 0;
    height: 1px;
    background-color: #ccc;
    /* Light grey color */
    margin: 20px 0;
    /* Adjust the spacing as needed */
}

.button-container {
    display: flex;
    justify-content: flex-end;
    /* Aligns the button to the right */
    margin-top: 20px;
    /* Optional: Adds space above the button */
}

.selected-users-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.selected-users-table th,
.selected-users-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.selected-users-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.selected-users-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.pagination-controls {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pagination-controls button {
    margin: 0 5px;
}

.table-container {
    max-width: 600px;
    margin: 20px auto;
    padding: 10px;
    border-radius: 8px;
    background-color: #f4f6f8;
    /* Light blue-gray background */
}

.styled-table {
    width: 100%;
    border-collapse: collapse;
}

.styled-table thead tr {
    background-color: #3b4a6b;
    /* Dark blue-gray */
    color: #ffffff;
    text-align: left;
}

.styled-table th,
.styled-table td {
    padding: 12px 15px;
    border: 1px solid #d1d9e3;
    /* Light blue-gray border */
}

.styled-table tbody tr {
    background-color: #ffffff;
    transition: background-color 0.3s ease;
}

.styled-table tbody tr:nth-child(even) {
    background-color: #e8eff5;
    /* Light blue-gray for even rows */
}

.styled-table tbody tr:hover {
    background-color: #d9e2ec;
    /* Blue-gray for hover */
}

.styled-table a {
    color: #cccccc;
    ;
    /* Dark blue-gray for link */
    text-decoration: none;
    font-weight: bold;
}

.styled-table a:hover {
    text-decoration: underline;
}

.download-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    /* Button size */
    height: 32px;
    background-color: #3b4a6b;
    /* Dark blue-gray background */
    color: white;
    border-radius: 50%;
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.download-button:hover {
    background-color: #2c3a58;
    /* Slightly darker shade on hover */
}

.form-group {
    display: flex;
    /* Align items side by side */
    align-items: center;
    /* Vertically center items */
    gap: 10px;
    /* Space between the label and input */
    margin-bottom: 15px;
    /* Space below the input field */
}

.form-label {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    white-space: nowrap;
    /* Prevent label from wrapping to the next line */
}

.form-input.small-input {
    width: 200px;
    /* Adjust input width */
    height: 30px;
    /* Adjust input height */
    padding: 5px 10px;
    /* Adjust padding */
    font-size: 15px;
    /* Adjust font size */
    font-family: inherit;
    /* Inherit font-family from the body */
    border: 1px solid #ccc;
    border-radius: 4px;
}

.p-button-sm {
    font-size: 1rem !important;
    /* Larger font size */
    padding: 0.75rem 1.5rem !important;
    /* Larger padding */
}

.button-container {
    display: flex;
    justify-content: flex-end;
    /* Aligns the button to the right */
    margin-top: 20px;
    /* Optional: Adds space above the button */
}

.table-auto {
    table-layout: auto;
}

.right-aligned-heading {
    text-align: right;
    margin-right: 0;
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

.borang-header h2 {
    margin: 0;
    font-size: 24px;
}

.borang-header .borang-date {
    font-size: 14px;
    color: #666;
}

.borang-section {
    margin-bottom: 20px;
}

.section-title {
    font-size: 18px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
}

.borang-row {
    display: flex !important;
    gap: 1rem !important;
    align-items: center !important;
    flex-wrap: nowrap !important;
    /* Prevent wrapping */
}

.borang-field {
    flex: 1 1 auto !important;
    /* Allow flexible width for each field */
}

.borang-field label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}

.borang-field span {
    background: none;
    /* Remove any background color */
    border: none;
    /* Remove any borders */
    display: inline;
    /* Ensure it stays inline */
    padding: 0;
    /* Remove any padding */
    margin: 0;
    /* Remove any margin */
    box-shadow: none;
    /* Remove any box shadow */
}

.tarikh-row {
    display: flex;
    gap: 1rem;
    align-items: center;
}
</style>