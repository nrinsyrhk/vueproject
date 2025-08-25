<script setup>

import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from 'primevue/textarea';
import { useRoute } from 'vue-router';  // Import useRoute instead of useRouter
import { useRouter } from 'vue-router';

const route = useRoute();  // Get the current route
const MohonID = route.params.id;  // Extract the MohonID from the route params

const router = useRouter();

const loading = ref(true);
const error = ref(null);
const baseUrl = import.meta.env.VITE_API_URL;

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

// Watch for changes in both dates
watch([() => permohonan.value.TkhMula, () => permohonan.value.TkhTamat], () => {
  const startDate = new Date(permohonan.value.TkhMula);
  const endDate = new Date(permohonan.value.TkhTamat);

  // Check if Tarikh Mula is greater than Tarikh Tamat
  if (startDate && endDate && startDate > endDate) {
    Swal.fire({
      icon: 'warning',
      title: 'Tarikh Tidak Tepat',
      text: 'Tarikh Mula tidak boleh melebihi Tarikh Tamat. (masukkan nilai bagi Tarikh Tamat terdahulu)',
      confirmButtonText: 'OK',
    }).then(() => {
      permohonan.value.TkhMula = null; // Reset the start date
      permohonan.value.TkhTamat = null; // Reset the end date
      permohonan.value.Tempoh = ''; // Clear the Tempoh field
    });
  } else {
    // Calculate the duration if dates are valid
    if (startDate && endDate) {
      const diffTime = endDate - startDate;
      const diffDays = diffTime / (1000 * 3600 * 24); // Calculate difference in days
      permohonan.value.Tempoh = diffDays.toString(); // Set the Tempoh field
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

async function updatePermohonan() {
  try {
    // Validate required fields
    const requiredFields = [
      { field: permohonan.value.Nama, name: "Nama Program" },
      { field: permohonan.value.Tujuan, name: "Tujuan" },
      { field: permohonan.value.KategoriProgramID, name: "Kategori Program" },
      { field: permohonan.value.Kekerapan, name: "Kekerapan" },
      { field: permohonan.value.TkhMula, name: "Tarikh Mula" },
      { field: permohonan.value.TkhTamat, name: "Tarikh Tamat" },
      { field: permohonan.value.KatPesertaID, name: "Kategori Peserta" },
      { field: permohonan.value.JenisKhidmatID, name: "Kategori Perkhidmatan" },
      { field: permohonan.value.NegaraID, name: "Negara" },
      { field: permohonan.value.Tempat, name: "Tempat" },
      { field: permohonan.value.Kedutaan, name: "Kedutaan" }, // Add Kedutaan to mandatory fields
      { field: permohonan.value.LulusKDN, name: "Kelulusan KDN" },
      { field: permohonan.value.Faedah, name: "Faedah Kepada Negara" },
    ];

    const emptyFields = requiredFields.filter((item) => !item.field);
    if (emptyFields.length > 0) {
      const missingFields = emptyFields.map((item) => item.name).join(", ");
      Swal.fire({
        icon: "error",
        title: "Ralat",
        text: `Sila isi semua medan wajib: ${missingFields}.`,
      });
      return;
    }

    // Construct the payload
    const payload = {
      MohonID: MohonID, // Ensure MohonID is included
      Nama: permohonan.value.Nama,
      Tujuan: permohonan.value.Tujuan,
      KategoriProgramID: permohonan.value.KategoriProgramID,
      Kekerapan: parseInt(permohonan.value.Kekerapan, 10), // Ensure Kekerapan is an integer
      TkhMula: permohonan.value.TkhMula,
      TkhTamat: permohonan.value.TkhTamat,
      Tempoh: permohonan.value.Tempoh,
      KatPesertaID: permohonan.value.KatPesertaID,
      JenisKhidmatID: permohonan.value.JenisKhidmatID,
      NegaraID: permohonan.value.NegaraID,
      Tempat: permohonan.value.Tempat,
      Kedutaan: permohonan.value.Kedutaan,
      LulusKDN: permohonan.value.LulusKDN,
      Faedah: permohonan.value.Faedah,
      PenggunaID: 1, // Replace with user ID from store
    };

    // Send the API request
    const response = await axios.post(`${baseUrl}/api/permohonan/update/draf`, payload);
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Berjaya",
        text: "Maklumat permohonan telah dikemas kini.",
      });

      // Refresh the form by re-fetching data
      await fetchMohonID();
    } else {
      throw new Error("Kemaskini gagal. Sila cuba lagi.");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Ralat",
      text: "Gagal mengemas kini permohonan.",
    });
    console.error("Failed to update permohonan:", error.response?.data || error);
  }
}

// Function maklumat peserta

// State for table and dialog
const pesertaList = ref([]);
const dialogTambahPeserta = ref(false); // Should be initialized properly
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

const addPesertaToList = async (selectedUser) => {
  console.log(selectedUser);

  if (!selectedUser || !selectedUser.PenggunaID) {
    console.error('Selected user or PenggunaID is missing', selectedUser);
    return;
  }
  console.log('Selected User:', selectedUser);

  const requestData = {
    MohonID,
    PenggunaID: selectedUser.PenggunaID,
    JenisPindaID: null,
    KetuaDelagasi: 0,
    NamaKapal: null,
  };

  try {
    const response = await axios.post(`${baseUrl}/api/kumpulan/add`, requestData);
    console.log('Peserta added successfully:', response.data);

    if (response.data.message && response.data.message === "Record added successfully.") {
      dialogTambahPeserta.value = false; // Ensure dialog is closed

      await Swal.fire({
        title: 'Tahniah!',
        text: `Peserta ${selectedUser.Nama} berjaya ditambah.`,
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      });

      await fetchData();
    }
  } catch (error) {
    console.error('Error adding peserta:', error);

    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.includes('already exists')
    ) {
      dialogTambahPeserta.value = false; // Close dialog before alert

      await Swal.fire({
        title: 'Makluman',
        text: `Peserta ${selectedUser.Nama} telah wujud dalam senarai.`,
        icon: 'info',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      });

      dialogTambahPeserta.value = false; // Ensure dialog remains closed
    } else {
      dialogTambahPeserta.value = false; // Close dialog before alert

      await Swal.fire({
        title: 'Ralat',
        text: 'Terdapat masalah menambah peserta. Sila cuba lagi.',
        icon: 'error',
        confirmButtonText: 'OK',
      });

      dialogTambahPeserta.value = false; // Ensure dialog remains closed
    }
  }
};

// Reset search query
const resetSearch = () => {
  searchQuery.value = '';
};

const showDialogTambahPeserta = () => {

  console.log('Tambah Peserta Button Clicked');
  dialogTambahPeserta.value = true;
};

// Fetch users and peserta on mounted
onMounted(() => {
  fetchUsers();
  fetchData();
});

async function padamPesertaList(PenggunaID) {
  try {
    // Prepare the request payload
    const payload = {
      MohonID, // Replace with your actual MohonID variable
      PenggunaID,
    };

    // Send delete request
    const response = await axios.post(`${baseUrl}/api/kumpulan/delete`, payload);

    // Check the response message
    if (response.status === 200 && response.data.message === "User successfully deleted from MohonID") {
      // Remove the deleted user from pesertaList
      pesertaList.value = pesertaList.value.filter(peserta => peserta.PenggunaID !== PenggunaID);

      // Show success message
      Swal.fire("Berjaya", "Peserta berjaya dipadam.", "success");
    } else {
      // Show error message if deletion was unsuccessful
      Swal.fire("Ralat", "Gagal untuk memadam peserta.", "error");
    }
  } catch (error) {
    // Handle errors (e.g., network issues)
    console.error("Error deleting peserta:", error);
    Swal.fire("Ralat", "Terdapat permasalahan pada rekod.", "error");
  }
}

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

// Delete document
const deleteDocument = async (document) => {
  try {
    // Prepare request body for file deletion
    const requestBodyMinio = {
      fileName: document.FailPathUrl.split('/').pop(),
      folderName: `${MohonID}`,
    };

    // Prepare request body for deleting document record
    const requestBodyLampiran = {
      ID: document.ID,
      MohonID: MohonID,
    };

    // Call both APIs simultaneously
    const [minioResponse, lampiranResponse] = await Promise.all([
      axios.post(`${baseUrl}/api/minio/delete`, requestBodyMinio),
      axios.post(`${baseUrl}/api/lampiran/deleteByID`, requestBodyLampiran),
    ]);

    if (minioResponse.status === 200 && lampiranResponse.status === 200) {
      // Optimistically update the document list
      documents.value = documents.value.filter((doc) => doc.ID !== document.ID);

      Swal.fire({
        icon: 'success',
        title: 'Berjaya',
        text: 'Dokumen berjaya dipadam.',
      });

      // Optionally, refetch documents list
      fetchDocuments();
    } else {
      throw new Error('Failed to delete document.');
    }
  } catch (error) {
    console.error('Error while deleting document:', error);
    Swal.fire({
      icon: 'error',
      title: 'Padam Gagal',
      text: 'Tidak dapat memadam dokumen.',
    });
  }
};

const fileInput = ref(null); // Reference for hidden file input

// Trigger file input for file selection // add new file
const addNewFile = () => {
  fileInput.value.click();
};

// Handle file selection
const onFileChange = async (event) => {
  const file = event.target.files[0];

  if (file) {
    // Check file type
    if (file.type !== "application/pdf") {
      Swal.fire({
        icon: "error",
        title: "Ralat",
        text: "Hanya fail dalam format PDF dibenarkan.",
      });
      return; // Exit if the file is not a PDF
    }

    await uploadFile(file);
  }
};

// Upload selected file
const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderName', MohonID);
    formData.append('MohonID', MohonID);

    const response = await axios.post(`${baseUrl}/api/minio/fullUpload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Check for the "file already exists" error from the API
    if (response.status === 400 && response.data.error && response.data.error.includes('already exists')) {
      // Extract file name and folder name for custom message
      const fileName = file.name;
      const folderName = MohonID;

      // Show custom error message
      Swal.fire({
        icon: 'error',
        title: 'Ralat',
        text: `Fail dengan nama "${fileName}" sudah wujud bagi Kod Mohon "${folderName}".`,
      });
      return; // Exit if the file already exists
    }

    // Update documents list
    documents.value.push({
      ID: response.data.ID, // Adjust based on API response
      FailPathUrl: response.data.FailPathUrl, // Adjust based on API response
    });

    // Refresh documents list
    await fetchDocuments();

    Swal.fire('Berjaya', 'Fail berjaya dimuat naik!', 'success');
  } catch (error) {
    const fileName = file.name;
    const folderName = MohonID;

    // Directly show the custom error message
    Swal.fire({
      icon: 'error',
      title: 'Ralat',
      text: `Fail tidak dapat di muat naik`,
    });
    console.error('Upload error:', error);
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

// Error handling for dropdown
const isDropdownBudgetError = ref(false);

// Fetch data for form population
const fetchDataPeruntukan = async () => {
  try {
    const response = await axios.post(`${baseUrl}/api/peruntukan/getByID`, { MohonID: form.value.MohonID });

    if (response.data && response.data.length > 0) {
      const data = response.data[0];
      form.value.kewMohon = data.kewMohon || '';
      form.value.PengesahanRP = data.PengesahanRP !== null ? data.PengesahanRP : 0; // Default to 0 if null
      form.value.tarikhbakiPKLN = data.tarikhbakiPKLN ? new Date(data.tarikhbakiPKLN) : null;
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

// Update Peruntukan function
const updatePeruntukan = async () => {

  // Validate PengesahanRP
  if (form.value.PengesahanRP === null || form.value.PengesahanRP === undefined) {
    isDropdownBudgetError.value = true;
    Swal.fire("Ralat", "Sila pilih Pengesahan Rancangan Perbelanjaan.", "error");
    return;
  } else {
    isDropdownBudgetError.value = false; // Clear error if valid
  }

  // Prepare data for submission
  const dataToUpdate = {
    ...form.value,
    tarikhbakiPKLN: form.value.tarikhbakiPKLN ? form.value.tarikhbakiPKLN.toISOString() : null, // Ensure date is correctly formatted
  };

  try {
    const response = await axios.post(`${baseUrl}/api/peruntukan/update`, dataToUpdate, {
      headers: { 'Content-Type': 'application/json' },
    });
    // Log the response or handle it
    console.log('API Response:', response.data);

    Swal.fire('Berjaya', 'Maklumat Peruntukan berjaya dikemaskini.', 'success');
  } catch (error) {
    console.error('Error updating data:', error);
    Swal.fire('Ralat', 'Terdapat masalah semasa kemaskini maklumat.', 'error');
  }
};

//hantar permohonan
const hantarPermohonan = async () => {
  const payload = {
    MohonID: MohonID,
    StatusMohonID: 2,
    TkhHantar: new Date().toISOString(),
  };

  try {
    const response = await axios.post(`${baseUrl}/api/permohonan/update/version`, payload);
    console.log('Response:', response.data);
    Swal.fire('Berjaya!', 'Permohonan berjaya dihantar.', 'success').then(() => {
      router.push('/senaraipermohonan');
    });
  } catch (error) {
    console.error('Error:', error);
    // Add SweetAlert for error
    Swal.fire('Ralat!', 'Terdapat masalah menghantar permohonan.', 'error');
  }
};

</script>

<template>
  <div class="p-fluid formgrid grid">
    <div class="col-12">
      <div class="card">
        <h5>Kemaskini Permohonan ( Kod Mohon : {{ MohonID }} )</h5>
        <div class="divider"></div> <!-- Custom divider -->
        <p><b>Maklumat Permohonan</b></p>
        <!-- Display loading or error message -->
        <div v-if="loading">Loading...</div>
        <div v-if="error">{{ error }}</div>

        <!-- Form Section -->
        <div v-if="!loading && permohonan">
          <form @submit.prevent="sendPermohonan">
            <div class="p-fluid formgrid grid">

              <div class="field col-12 md:col-6">
                <label for="nama">Nama Program <span class="p-error">*</span></label>
                <Textarea id="nama" v-model="permohonan.Nama" rows="3" />
              </div>

              <div class="field col-12 md:col-6">
                <label for="tujuan">Tujuan <span class="p-error">*</span></label>
                <Textarea id="tujuan" v-model="permohonan.Tujuan" rows="2" />
              </div>

              <div class="field col-12 md:col-3">
                <label for="dropdownKategoriProgram">Kategori Program <span class="p-error">*</span></label>
                <Dropdown id="dropdownKategoriProgram" v-model="permohonan.KategoriProgramID"
                  :options="dropdownKategoriProgram" optionLabel="keterangan" optionValue="KategoriProgramID"
                  placeholder="Pilih Program" :required="true" />
                <small v-if="isProgramRequiredError" class="p-error">Sila pilih Kategori
                  Program.</small>
              </div>

              <div class="field col-12 md:col-3">
                <label for="kekerapan">Kekerapan <span class="p-error">*</span></label>
                <InputText id="kekerapan" v-model="permohonan.Kekerapan" type="number" />
              </div>

              <div class="field col-12 md:col-3">
                <label for="tarikhMula">Tarikh Mula <span class="p-error">*</span></label>
                <Calendar id="tarikhMula" v-model="formattedTkhMula" dateFormat="dd/mm/yy" :mask="`99/99/9999`"
                  placeholder="dd/mm/yyyy" :showIcon="true" />
              </div>

              <div class="field col-12 md:col-3">
                <label for="tarikhTamat">Tarikh Tamat <span class="p-error">*</span></label>
                <Calendar id="tarikhTamat" v-model="formattedTkhTamat" dateFormat="dd/mm/yy" :mask="`99/99/9999`"
                  placeholder="dd/mm/yyyy" :showIcon="true" />
              </div>

              <div class="field col-12 md:col-3">
                <label for="tempoh">Tempoh <span class="p-error">*</span></label>
                <InputText id="tempoh" v-model="permohonan.Tempoh" readonly />
              </div>

              <div class="field col-12 md:col-3">
                <label for="dropdownKategoriPeserta">Kategori Peserta <span class="p-error">*</span></label>
                <Dropdown id="dropdownKategoriPeserta" v-model="permohonan.KatPesertaID"
                  :options="dropdownKategoriPeserta" optionLabel="Keterangan" optionValue="KatPesertaID"
                  placeholder="Pilih Kategori" :required="true" />
                <small v-if="isPesertaRequiredError" class="p-error">Sila pilih Kategori
                  Peserta.</small>
              </div>

              <div class="field col-12 md:col-3">
                <label for="dropdownKategoriPerkhidmatan">Kategori Perkhidmatan <span class="p-error">*</span></label>
                <Dropdown id="dropdownKategoriPerkhidmatan" v-model="permohonan.JenisKhidmatID"
                  :options="dropdownKategoriKhidmat" optionLabel="Keterangan" optionValue="JenisKhidmatID"
                  placeholder="Pilih Kategori" :required="true" />
                <small v-if="isKhidmatRequiredError" class="p-error">Sila pilih Kategori
                  Perkhidmatan.</small>
              </div>

              <div class="field col-12 md:col-3">
                <label for="dropdownNegara">Negara <span class="p-error">*</span></label>
                <Dropdown id="dropdownNegara" v-model="permohonan.NegaraID" :options="dropdownNegara"
                  optionLabel="Keterangan" optionValue="NegaraID" placeholder="Pilih Negara" :required="true" />
                <small v-if="isNegaraRequiredError" class="p-error">Sila pilih Negara.</small>
              </div>

              <div class="field col-12 md:col-6">
                <label for="tempat">Tempat <span class="p-error">*</span></label>
                <InputText id="tempat" v-model="permohonan.Tempat" type="text" />
              </div>

              <div class="field col-12 md:col-6">
                <label for="Kedutaan">Kedutaan <span class="p-error">*</span></label>
                <InputText id="Kedutaan" v-model="permohonan.Kedutaan" type="text" />
              </div>

              <div class="field col-12 md:col-6">
                <label for="LulusKDN">Kelulusan KDN <span class="p-error">*</span> </label>
                <InputText id="LulusKDN" v-model="permohonan.LulusKDN" type="text" />
              </div>

              <div class="field col-12 md:col-6">
                <label for="Faedah">Faedah Kepada Negara <span class="p-error">*</span></label>
                <Textarea id="Faedah" v-model="permohonan.Faedah" rows="2" />
              </div>
            </div>
            <div style="width: 100%; display: flex; justify-content: flex-end;">
              <Button label="Simpan" icon="pi pi-save" class="p-button-sm p-button-info p-button-rounded"
                title="Simpan Maklumat Permohonan" @click="updatePermohonan"
                style="width: auto; font-size: 0.75rem; padding: 0.5rem 1rem;" />
            </div>

            <div class="divider"></div> <!-- Custom divider -->
            <div>
              <!-- Nama Kapal Input -->
              <p><b>Maklumat Peserta</b></p>
              <div class="form-group">
                <label for="namaKapal" class="form-label">Nama Kapal:</label>
                <input type="text" id="namaKapal" v-model="namaKapal" class="form-input small-input" />
              </div>

              <!-- Peserta Table -->
              <br />
              <table class="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2">Bil</th>
                    <th class="border border-gray-300 px-4 py-2">Nama Peserta</th>
                    <th class="border border-gray-300 px-4 py-2">Jawatan</th>
                    <th class="border border-gray-300 px-4 py-2">Ketua Delegasi</th>
                    <th class="border border-gray-300 px-4 py-2">Tindakan</th>
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
                        @change="updateKetuaDelegasi(peserta.PenggunaID)" />
                    </td>
                    <td class="border border-gray-300 px-4 py-2 text-center">
                      <Button icon="pi pi-trash" class="p-button-rounded p-button-danger"
                        @click="padamPesertaList(peserta.PenggunaID)" />
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Add Peserta Dialog -->
              <Button label="Tambah Peserta" icon="pi pi-plus" class="p-button-outlined p-button-sm"
                @click="showDialogTambahPeserta" />
              <br>
              <Dialog header="Senarai Pengguna" v-model:visible="dialogTambahPeserta" @hide="onCloseDialog" modal="true"
                :closable="true" :draggable="false" :style="{ width: '1200px', height: '800px' }">
                <!-- Search Section -->

                <template #header>
                  <div>
                    <!-- Text Section -->
                    <div style="margin-bottom: 0.5rem;">
                      <p>Pilih senarai peserta dari senarai pengguna</p>
                    </div>

                    <!-- Search Section -->
                    <div style="display: flex; align-items: center; width: 100%;">
                      <!-- Search Box -->
                      <div style="flex: 1; position: relative; display: inline-block;">
                        <i class="pi pi-search"
                          style="position: absolute; top: 50%; left: 0.75rem; transform: translateY(-50%); color: #888;"></i>
                        <InputText placeholder="Carian..." v-model="searchQuery"
                          style="width: 100%; padding-left: 2.5rem;" title="Carian" />
                      </div>

                      <!-- Reset Button -->
                      <Button type="button" icon="pi pi-filter-slash" class="p-button-outlined"
                        style="margin-left: 0.5rem; flex-shrink: 0;" title="Semula" @click="resetSearch" />
                    </div>
                  </div>
                </template>

                <!-- DataTable to Display Users -->
                <DataTable :value="plainFilteredUsers" :paginator="true" :rows="10">
                  <Column field="Nama" header="Nama Pengguna" style="min-width:12rem" />
                  <Column field="NoKP" header="No. Kad Pengenalan" style="min-width:12rem"></Column>
                  <Column field="Jawatan" header="Jawatan" style="min-width:10rem"></Column>
                  <Column field="NoTel" header="No. Telefon" style="min-width:10rem"></Column>
                  <Column field="Emel" header="Emel" style="min-width:12rem"></Column>
                  <Column header="Tindakan">
                    <template #body="slotProps">
                      <div>
                        <Button icon="pi pi-user-plus" class="p-button-success" @click="() => {
                          console.log('slotProps.rowData:', slotProps.data);
                          addPesertaToList(slotProps.data);
                        }" />
                      </div>
                    </template>
                  </Column>
                </DataTable>

                <!-- Error Message -->
                <div v-if="error" class="error-message">{{ error }}</div>
              </Dialog>

              <br />
              <div style="width: 100%; display: flex; justify-content: flex-end;">
                <Button label="Simpan" icon="pi pi-save" class="p-button-sm p-button-info p-button-rounded"
                  title="Simpan Maklumat Peserta" @click="updatePeserta"
                  style="width: auto; font-size: 0.75rem; padding: 0.5rem 1rem;" />
              </div>
            </div>

            <div class="divider"></div> <!-- Custom divider -->

            <p><b>Lampiran</b></p>
            <div>
              <table class="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2">BIL</th>
                    <th class="border border-gray-300 px-4 py-2">Nama Fail</th>
                    <th class="border border-gray-300 px-4 py-2">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(document, index) in documents" :key="document.ID">
                    <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                    <td class="border border-gray-300 px-4 py-2">
                      {{ document.NamaFail ? document.NamaFail : 'Nama Fail Tidak Sah' }}
                    </td>
                    <td class="border border-gray-300 px-4 py-2 text-center">
                      <Button icon="pi pi-download" class="p-button-rounded p-button-info mr-1" title="Muat Turun"
                        @click="downloadFile(document)" />
                      <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" title="Padam Dokumen"
                        @click="deleteDocument(document)" />
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Add Document Button -->
              <div class="button-container">
                <Button label="Tambah Fail" icon="pi pi-plus" class="p-button-sm p-button-info p-button-rounded"
                  @click="addNewFile" style="width: auto; font-size: 0.75rem; padding: 0.5rem 1rem;" />
                <input type="file" ref="fileInput" style="display: none;" @change="onFileChange" />
              </div>
            </div>
            <div class="divider"></div> <!-- Custom divider -->

            <p><b>Maklumat Peruntukan</b></p>
            <br>

            <div class="p-fluid formgrid grid">
              <div class="field col-12 md:col-6">
                <label for="kewMohon">Implikasi Kewangan Dimohon (RM)</label>
                <InputText id="kewMohon" type="number" v-model="form.kewMohon"
                  placeholder="Masukkan jumlah dalam nombor" min="0" />
              </div>

              <div class="field col-12 md:col-4">
                <label for="dropdownBudget">Pengesahan Rancangan Perbelanjaan<span class="p-error">*</span></label>
                <Dropdown id="dropdownBudget" :options="dropdownBudgetOptions" option-label="label" option-value="value"
                  v-model="form.PengesahanRP" placeholder="Pilih Pilihan" :required="true" />
                <small v-if="isDropdownBudgetError" class="p-error">Sila buat pilihan.</small>
              </div>

              <div class="field col-12 md:col-3">
                <label for="bakiPKLN">Baki PKLN (RM)<span class="p-error">*</span></label>
                <InputText id="bakiPKLN" type="number" v-model="form.bakiPKLN" placeholder="Masukkan baki dalam nombor"
                  min="0" />
              </div>

              <div class="field col-12 md:col-3">
                <label for="tarikhbakiPKLN">Sehingga <span class="p-error">*</span></label>
                <Calendar id="tarikhbakiPKLN" v-model="form.tarikhbakiPKLN" :showIcon="true" :showButtonBar="true"
                  dateFormat="dd/mm/yy" />
              </div>

              <div class="field col-12 md:col-6">
                <label for="kewSah">Implikasi Kewangan Disahkan Oleh PTJ (RM)<span class="p-error">*</span></label>
                <InputText id="kewSah" type="number" v-model="form.kewSah" placeholder="Masukkan jumlah dalam nombor"
                  min="0" />
              </div>

              <div class="field col-12 md:col-6">
                <label for="bakiPTJ">Baki Peruntukan PTJ (RM)<span class="p-error">*</span></label>
                <InputText id="bakiPTJ" type="number" v-model="form.bakiPTJ" placeholder="Masukkan baki dalam nombor"
                  min="0" />
              </div>

              <div class="field col-12 md:col-6">
                <label for="tanggunganOleh">Perbelanjaan Ditanggung Oleh<span class="p-error">*</span></label>
                <InputText id="tanggunganOleh" type="text" v-model="form.tanggunganOleh" />
              </div>

              <div class="field col-12 md:col-6">
                <label for="ulasan">Ulasan<span class="p-error">*</span></label>
                <Textarea id="ulasan" rows="2" v-model="form.ulasan"></Textarea>
              </div>

              <div class="field col-12 md:col-6">
                <label for="tajaanperinci">Perincian Tajaan<span class="p-error">*</span></label>
                <InputText id="tajaanperinci" type="text" v-model="form.tajaanperinci" />
              </div>

              <div class="field col-12 md:col-6">
                <label for="tajaanoleh">Tajaan Oleh<span class="p-error">*</span></label>
                <InputText id="tajaanoleh" type="text" v-model="form.tajaanoleh" />
              </div>
            </div>
            <div style="width: 100%; display: flex; justify-content: flex-end;">
              <Button label="Simpan" icon="pi pi-save" class="p-button-sm p-button-info p-button-rounded"
                title="Simpan Maklumat Peruntukan" @click="updatePeruntukan"
                style="width: auto; font-size: 0.75rem; padding: 0.5rem 1rem;" />
            </div>
            <div class="divider"></div> <!-- Custom divider -->
            <p class="p-error">** Sila pastikan semua bahagian telah lengkap untuk mewujudkan button HANTAR</p>
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">

              <Button v-if="pesertaList.length > 0 && documents.length > 0" label="Hantar Permohonan" icon="pi pi-send"
                class="p-button-sm p-button-success p-button-rounded" title="Hantar Permohonan"
                style="width: auto; font-size: 0.75rem; padding: 0.5rem 1rem;" @click="hantarPermohonan" />
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
</style>