<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import { useRouter } from 'vue-router';

// const config
const router = useRouter();
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const baseUrl = import.meta.env.VITE_API_URL
const activeIndex = ref(0); // Make this a ref

// calling data from api
const dropdownKategoriProgram = ref([]);
const dropdownKategoriPeserta = ref([]);
const dropdownKategoriKhidmat = ref([]);
const dropdownNegara = ref([]);

//declare const error
const isProgramRequiredError = ref(false);
const isNamaRequiredError = ref(false);
const isTujuanRequiredError = ref(false);
const isKekerapanRequiredError = ref(false);
const isTarikhMulaRequiredError = ref(false);
const isTarikhTamatRequiredError = ref(false);
const isTempohRequiredError = ref(false);
const isPesertaRequiredError = ref(false);
const isKhidmatRequiredError = ref(false);
const isTempatRequiredError = ref(false);
const isNegaraRequiredError = ref(false);
const isRadioKedutaanRequiredError = ref(false);
const isKedutaanRequiredError = ref(false);
const isRadioKDNRequiredError = ref(false);
const isKDNRequiredError = ref(false);
const isFaedahRequiredError = ref(false);

const hasFormErrors = ref(false); // general error tracking

let mohonIDs = ref('');

const searchQuery = ref('');

const filteredUsers = computed(() => {
    // Filters users based on searchQuery
    return users.value.filter(user =>
        Object.values(user).some(value =>
            String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    );
});

function resetSearch() {
    searchQuery.value = '';  // Resets the search input
}

//onmounter - generate first
onMounted(() => {

    fetchUsers();
    getKategoriProgram();
    getKategoriKhidmat();
    getKategoriPeserta();
    getNegara();

    const storedValue = localStorage.getItem('mohonIDs');
    if (storedValue) {
        mohonIDs.value = storedValue; // Set mohonIDs to the stored value
    }

});

//declare nilai kosong x select
const radioValue = ref(null);
const radioValue1 = ref(null);
const BakiPKLN = ref(null);

//calling api senarai user
async function fetchUsers() {
    try {
        const { data } = await axios.get(`${baseUrl}/api/pengguna`);
        users.value = data;
        console.log('Users:', users.value);
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

// calling function router ke other page
function goTodaftarpengguna() {
    const routeData = router.resolve({ path: '/pages/daftarpengguna' });
    window.open(routeData.href, '_blank');
}

//calling kategori program from api
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
        console.log('kategoriPserta:', dropdownKategoriPeserta.value);
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


// form data model
const formPermohonan = ref({
    Nama: '',
    Tujuan: '',
    dropdownKategoriProgram: null,
    Kekerapan: null,
    TarikhMula: '',
    TarikhTamat: '',
    Tempoh: '',
    dropdownKategoriPeserta: null,
    dropdownKategoriPerkhidmatan: null,
    Tempat: '',
    dropdownNegara: null,
    Kedutaan: '',
    LulusKDN: '',
    Faedah: '',
    PenggunaID: 1,// Replace dgn user store
    KumpulanID: '',
    StatusMohonID: 1,
});

let isSwalShown = false; // Add a flag to prevent multiple dialogs

const calculateTempoh = () => {
    const startDate = formPermohonan.value.TarikhMula ? new Date(formPermohonan.value.TarikhMula) : null;
    const endDate = formPermohonan.value.TarikhTamat ? new Date(formPermohonan.value.TarikhTamat) : null;

    if (startDate && endDate) {
        if (startDate > endDate) {
            if (!isSwalShown) { // Check if Swal is already shown
                isSwalShown = true; // Set the flag
                Swal.fire({
                    icon: 'warning',
                    title: 'Tarikh Tidak Sah',
                    text: 'Tarikh Mula tidak boleh melebihi Tarikh Tamat.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    // Reset dates and allow user to change
                    formPermohonan.value.TarikhMula = '';
                    formPermohonan.value.TarikhTamat = '';
                    formPermohonan.value.Tempoh = ''; // Clear Tempoh
                    isSwalShown = false; // Reset the flag after the dialog is closed
                });
            }
            isTempohRequiredError.value = true;
        } else {
            const differenceInTime = endDate - startDate;
            const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24); // Convert milliseconds to days
            formPermohonan.value.Tempoh = differenceInDays.toString(); // Update Tempoh field
            isTempohRequiredError.value = false; // Clear error
        }
    } else {
        formPermohonan.value.Tempoh = ''; // Clear Tempoh if dates are incomplete
        isTempohRequiredError.value = true;
    }
};

// Watcher for date changes
watch(
    () => [formPermohonan.value.TarikhMula, formPermohonan.value.TarikhTamat],
    () => {
        calculateTempoh();
    }
);

// function submit form
async function sendPermohonan() {

    isProgramRequiredError.value = false;
    isNamaRequiredError.value = false;
    isTujuanRequiredError.value = false;
    isKekerapanRequiredError.value = false;
    isTarikhMulaRequiredError.value = false;
    isTarikhTamatRequiredError.value = false;
    isTempohRequiredError.value = false;
    isPesertaRequiredError.value = false;
    isKhidmatRequiredError.value = false;
    isTempatRequiredError.value = false;
    isNegaraRequiredError.value = false;
    isRadioKedutaanRequiredError.value = false;
    isKedutaanRequiredError.value = false;
    isRadioKDNRequiredError.value = false;
    isKDNRequiredError.value = false;
    isFaedahRequiredError.value = false;

    hasFormErrors.value = false;

    // Check if the Nama field is empty
    if (!formPermohonan.value.Nama) {
        isNamaRequiredError.value = true; // Set error state
    }

    // Check if the dropdownKategoriProgram is null or an empty string
    if (formPermohonan.value.dropdownKategoriProgram === null || formPermohonan.value.dropdownKategoriProgram === '') {
        isProgramRequiredError.value = true; // Set error state
    }

    if (!formPermohonan.value.Tujuan) {
        isTujuanRequiredError.value = true; // Set error state
    }

    if (!formPermohonan.value.Kekerapan) {
        isKekerapanRequiredError.value = true; // Set error state
    }

    if (!formPermohonan.value.TarikhMula) {
        isTarikhMulaRequiredError.value = true;
    } else {
        isTarikhMulaRequiredError.value = false; // Clear error if date is valid
    }

    if (!formPermohonan.value.TarikhTamat) {
        isTarikhTamatRequiredError.value = true;
    } else {
        isTarikhTamatRequiredError.value = false; // Clear error if date is valid
    }

    if (!formPermohonan.value.Tempoh) {
        isTempohRequiredError.value = true; // Set error state
    }

    if (formPermohonan.value.dropdownKategoriPeserta === null || formPermohonan.value.dropdownKategoriPeserta === '') {
        isPesertaRequiredError.value = true; // Set error state
    }

    if (formPermohonan.value.dropdownKategoriPerkhidmatan === null || formPermohonan.value.dropdownKategoriPerkhidmatan === '') {
        isKhidmatRequiredError.value = true; // Set error state
    }

    if (!formPermohonan.value.Tempat) {
        isTempatRequiredError.value = true; // Set error state
    }

    if (formPermohonan.value.dropdownNegara === null || formPermohonan.value.dropdownNegara === '') {
        isNegaraRequiredError.value = true; // Set error state
    }

    // Validate the radio button Kedutaan (either "YA" or "TIDAK" must be selected)
    if (!radioValue.value) {
        isRadioKedutaanRequiredError.value = true;
    }

    // Validate Kedutaan field if "YA" is selected
    if (radioValue.value === 'YA' && !formPermohonan.value.Kedutaan) {
        isKedutaanRequiredError.value = true;
    }

    // Validate the radio button KDN (either "YA" or "TIDAK" must be selected)
    if (!radioValue1.value) {
        isRadioKDNRequiredError.value = true;
    }

    // Validate Kedutaan field if "YA" is selected
    if (radioValue1.value === 'YA' && !formPermohonan.value.LulusKDN) {
        isKDNRequiredError.value = true;
    }

    if (!formPermohonan.value.Faedah) {
        isFaedahRequiredError.value = true; // Set error state
    }

    // Determine if there are any errors
    hasFormErrors.value = isNamaRequiredError.value || isTujuanRequiredError.value || isKekerapanRequiredError.value || isTarikhMulaRequiredError.value || isTarikhTamatRequiredError.value
        || isTempohRequiredError.value || isPesertaRequiredError.value || isKhidmatRequiredError.value || isNegaraRequiredError.value || isRadioKedutaanRequiredError.value || isKedutaanRequiredError.value || isRadioKDNRequiredError.value || isKDNRequiredError.value
        || isFaedahRequiredError.value;

    if (hasFormErrors.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Permohonan tidak lengkap',
            text: 'Sila pastikan semua maklumat telah lengkap.',
            confirmButtonText: 'OK'
        });
        return; // Exit the function if validation fails
    }

    const localDate = new Date(); // Client's current time
    const utcPlus8Date = new Date(localDate.getTime() + 8 * 60 * 60 * 1000);
    const selectedKategoriProgramID = formPermohonan.value.dropdownKategoriProgram;
    const selectedKatPesertaID = formPermohonan.value.dropdownKategoriPeserta;
    const selectedJenisKhidmatID = formPermohonan.value.dropdownKategoriPerkhidmatan;
    const selectedNegara = formPermohonan.value.dropdownNegara;

    const mohonIDs = ref(''); // Set this value based on your previous tab's response

    const permohonanData = {

        Nama: formPermohonan.value.Nama,
        Tujuan: formPermohonan.value.Tujuan,
        KategoriProgramID: selectedKategoriProgramID ? parseInt(selectedKategoriProgramID) : null, // Set to null if not selected
        Kekerapan: parseInt(formPermohonan.value.Kekerapan), // Ensure Kekerapan is an integer
        TkhMula: formPermohonan.value.TarikhMula ? new Date(formPermohonan.value.TarikhMula).toISOString() : null,
        TkhTamat: formPermohonan.value.TarikhTamat ? new Date(formPermohonan.value.TarikhTamat).toISOString() : null,
        Tempoh: formPermohonan.value.Tempoh,
        KatPesertaID: selectedKatPesertaID ? parseInt(selectedKatPesertaID) : null,
        JenisKhidmatID: selectedJenisKhidmatID ? parseInt(selectedJenisKhidmatID) : null,
        Tempat: formPermohonan.value.Tempat,
        NegaraID: selectedNegara ? parseInt(selectedNegara) : null,
        Kedutaan: formPermohonan.value.Kedutaan || 'Tiada',
        LulusKDN: formPermohonan.value.LulusKDN || 'Tiada',
        Faedah: formPermohonan.value.Faedah,
        PenggunaID: parseInt(formPermohonan.value.PenggunaID), // Ensure PenggunaID is an integer
        StatusMohonID: parseInt(formPermohonan.value.StatusMohonID) || 1, // Ensure StatusMohonID is an integer

    };

    try {
        const response = await axios.post(`${baseUrl}/api/permohonan`, permohonanData);
        console.log('Response Mohon Id:', response.data);
   
        mohonIDs.value = response.data.MohonID;

        // Update MohonID using the update function
        updateMohonIDs(response.data.MohonID);

        Swal.fire({
            icon: 'success',
            title: 'Permohonan Disimpan',
            text: 'Permohonan telah di simpan sebagai Draf',
            confirmButtonText: 'OK'
        });

        activeIndex.value += 1; // Change tab index after successful submission

    } catch (error) {
        console.error('Error saving permohonan:', error);
        Swal.fire({
            icon: 'error',
            title: 'Ralat',
            text: 'Terdapat ralat semasa menyimpan permohonan.',
            confirmButtonText: 'OK'
        });
    }

}

// Maklumat Peserta
const selectedUsers = ref([]); // Reactive variable to hold selected users
const rowsPerPage = ref(10); // Number of rows per page
const firstRow = ref(0); // Tracks the starting index of the current page

const pilihPeserta = (user) => {
    if (!selectedUsers.value.some(u => u.NoKP === user.NoKP)) {
        // Set KetuaDelagasi to 0 by default when a user is added
        selectedUsers.value.push({...user, KetuaDelagasi: 0});
    }
};

const selectedLeader = ref(null);

function selectKetuaDelagasi(user) {
    if (selectedLeader.value === user.PenggunaID) {
        // Uncheck if the same user is clicked again
        selectedLeader.value = null;
        user.KetuaDelagasi = 0;
    } else {
        // Set the selected user as the leader and reset others
        selectedUsers.value = selectedUsers.value.map(u => {
            u.KetuaDelagasi = u.PenggunaID === user.PenggunaID ? 1 : 0;
            return u;
        });
        selectedLeader.value = user.PenggunaID;
    }
}

const dialogTambahPeserta = ref(false); // Controls dialog visibility

// Method to show the dialog
const showDialogTambahPeserta = () => {
    dialogTambahPeserta.value = true;
};

// Pagination state
const currentPage = ref(1); // The current page number
const pageSize = 10; // Number of records per page

// Compute the total number of pages
const totalPages = computed(() => {
    return Math.ceil(selectedUsers.value.length / pageSize);
});

// Method to remove a user
const removeUser = (index) => {
    selectedUsers.value.splice(index, 1);
    if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value; // Adjust the page number if necessary
    }
};

// Update the page's starting row when the page changes
const onPage = (event) => {
    firstRow.value = event.first;
};

function updateMohonIDs(newValue) {
    mohonIDs.value = newValue;
}

watch(mohonIDs, (newValue) => {
    localStorage.setItem('mohonIDs', newValue);
})

const formpeserta = ref({
    NamaKapal: '',
});

const simpanPeserta1 = async () => {

    console.log(mohonIDs.value);

    if (selectedUsers.value.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Tiada Peserta',
            text: 'Sila pilih sekurang-kurangnya satu peserta.',
            confirmButtonText: 'OK'
        });
        return;
    }

    try {
        console.log('Current MohonID:', mohonIDs.value);

        // Build the JSON payload for the selected users
        const pesertaData = selectedUsers.value.map(user => ({
            MohonID: mohonIDs.value, // Mohon ID from previous
            PenggunaID: user.PenggunaID,
            NamaKapal: formpeserta.value.NamaKapal || 'Tidak Berkait',
            // Ensure KetuaDelagasi is set to either 1 or 0
            KetuaDelagasi: user.KetuaDelagasi || 0,
        }));
        
        console.log('Peserta Data:', pesertaData);

        const response = await axios.post(`${baseUrl}/api/kumpulan/byBatch`, pesertaData);
        console.log('Peserta Data sent successfully:', response.data);

        Swal.fire({
            icon: 'success',
            title: 'Peserta Disimpan',
            text: 'Senarai peserta telah disimpan.',
            confirmButtonText: 'OK'
        });

        activeIndex.value += 1; // Move to next tab after submission
    } catch (err) {
        const errorMessage = err.response
            ? `Error ${err.response.status}: ${err.response.data?.message || err.message}`
            : 'Failed to save participants. ' + err.message;

        console.error(errorMessage);

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal menyimpan senarai peserta.',
            confirmButtonText: 'OK'
        });
    }
};

// State variables
const files = ref([]); // Array to store files and custom names
const currentFile = ref(null); // Temporary storage for currently selected file
const currentCustomName = ref(''); // Temporary custom name for currently selected file

// Handle file selection
const onFileChange = (event) => {
  currentFile.value = event.target.files[0]; // Only take the first file selected at a time
};

// Add file with custom name to the list
const addFile = () => {
  if (currentFile.value) {
    // Add selected file and custom name to files array
    files.value.push({ file: currentFile.value, customName: currentCustomName.value || currentFile.value.name });
    
    // Clear current selection
    currentFile.value = null;
    currentCustomName.value = '';
  } else {
    Swal.fire('Tiada Fail', 'Sila pilih fail terlebih dahulu.', 'warning');
  }
};

// Remove selected file by index
const removeFile = (index) => {
  files.value.splice(index, 1);
};

// Upload function, triggered by button click
const uploadFiles = async () => {
  if (files.value.length === 0) {
    Swal.fire('Pilih Fail', 'Sila pilih fail untuk dimuat naik.', 'warning');
    return;
  }

  try {
    const uploadPromises = files.value.map(({ file, customName }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('customName', customName);
      formData.append('folderName', mohonIDs.value);
      formData.append('MohonID', mohonIDs.value);

      return axios.post(`${baseUrl}/api/minio/fullUpload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    });

    const responses = await Promise.all(uploadPromises);

    Swal.fire('Berjaya', 'Semua fail berjaya dimuat naik!', 'success');
    responses.forEach((response) => {
      console.log(response.data); // Handle response if needed
    });

    files.value = []; // Clear files after upload
  } catch (error) {
    Swal.fire('Ralat', 'Terdapat masalah semasa memuat naik fail.', 'error');
    console.error('Upload error:', error);
  }
};

const goToNextTab = () => {
    activeIndex.value += 1; // Increment tab index to go to the next tab
};

// Radio button and other field values
const radioValueTajaan = ref('');
// Define options for the dropdown
const dropdownBudgetOptions = ref([
  { label: 'ADA', value: 1 },
  { label: 'TIADA', value: 0 },
]);

// Form Maklumat Peruntukan
const formPeruntukan = ref({
  kewMohon: '',
  tarikhbakiPKLN: '',
  bakiPKLN: '',
  kewSah: '',
  bakiPTJ: '',
  tanggunganOleh: '',
  ulasan: '',
  tajaanperinci: '',
  tajaanoleh: '',
  PengesahanRP: '',  // This will hold the dropdown value (1 or 0)
});

// Watch for changes in radioValueTajaan
watch(radioValueTajaan, (newValue) => {
    if (newValue === 'TIADA') {
        formPeruntukan.value.tajaanperinci = 'Tidak Berkait';
        formPeruntukan.value.tajaanoleh = 'Tidak Berkait';
    } else {
        formPeruntukan.value.tajaanperinci = '';
        formPeruntukan.value.tajaanoleh = '';
    }
});

// Error tracking for each field
const isKewMohonError = ref(false);
const istarikhbakiPKLNError = ref(false);
const isBakiPKLNError = ref(false);
const iskewSahError = ref(false);
const isbakiPTJError = ref(false);
const istanggunganOlehError = ref(false);
const isulasanError = ref(false);
const isRadioError = ref(false);
// Error tracking for dropdown
const isDropdownBudgetError = ref(false);
// Validation function
// Watch for changes in the dropdown value and validate
watch(() => formPeruntukan.value.PengesahanRP, (newValue) => {
  isDropdownBudgetError.value = newValue === '';
});

function validateForm() {
  // Reset all error flags
  isKewMohonError.value = !formPeruntukan.value.kewMohon;
  istarikhbakiPKLNError.value = !formPeruntukan.value.tarikhbakiPKLN;
  isBakiPKLNError.value = !formPeruntukan.value.bakiPKLN;
  iskewSahError.value = !formPeruntukan.value.kewSah;
  isbakiPTJError.value = !formPeruntukan.value.bakiPTJ;
  istanggunganOlehError.value = !formPeruntukan.value.tanggunganOleh;
  isulasanError.value = !formPeruntukan.value.ulasan;
  isRadioError.value = !radioValueTajaan.value;  
  isDropdownBudgetError.value = formPeruntukan.value.PengesahanRP === ''; // Validate dropdown

  // Check if any field is invalid
  return !(
    isKewMohonError.value ||
    istarikhbakiPKLNError.value ||
    isBakiPKLNError.value ||
    iskewSahError.value ||
    isbakiPTJError.value ||
    istanggunganOlehError.value ||
    isulasanError.value ||
    isRadioError.value ||
    isDropdownBudgetError.value
  );
}

// Save form function
async function saveForm() {
  if (validateForm()) {
    try {
      // Prepare form data
      const formPeruntukanData = {
        ...formPeruntukan.value,
        MohonID: mohonIDs.value, // Use dynamically assigned MohonID
      };

      // API call
      const response = await axios.post(`${baseUrl}/api/peruntukan`, formPeruntukanData);

      // Success alert
      Swal.fire({
        icon: 'success',
        title: 'Permohonan Disimpan',
        text: 'Permohonan telah disimpan dengan berjaya!',
        confirmButtonText: 'OK',
      });

    // Log the response for debugging
    console.log('Response:', response.data);

    // Navigate to SenaraiPermohonan page
    router.push('/senaraipermohonan');

    } catch (error) {
      // Error alert
      Swal.fire({
        icon: 'error',
        title: 'Ralat',
        text: 'Terdapat masalah semasa menyimpan permohonan. Sila cuba lagi.',
        confirmButtonText: 'OK',
      });

      // Log the error for debugging
      console.error('Error saving form:', error);
    }
  } else {
    // Validation failed alert
    Swal.fire({
      icon: 'error',
      title: 'Borang Tidak Lengkap',
      text: 'Sila lengkapkan semua medan yang diperlukan.',
      confirmButtonText: 'OK',
    });
  }
}
</script>

<template>

    <div class="card">
        <h5>PERMOHONAN BARU / LAMPIRAN A </h5>
        <p>Masukkan maklumat borang dengan lengkap.</p>
        <div class="col-12">
            <TabView :activeIndex="activeIndex" @tabChange="(e) => activeIndex = e.index">
                <TabPanel header="MAKLUMAT LAWATAN">
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="Nama">Nama Program / Aktiviti / Tugas Rasmi <span
                                    class="p-error">*</span></label>
                            <InputText id="Nama" v-model="formPermohonan.Nama" type="text" />
                            <small v-if="isNamaRequiredError" class="p-error">Sila isi Nama Program / Aktiviti / Tugas
                                Rasmi.</small>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="dropdownKategoriProgram">Kategori Program<span class="p-error">*</span>
                            </label>
                            <Dropdown id="kategoriProgram" v-model="formPermohonan.dropdownKategoriProgram"
                                :options="dropdownKategoriProgram" optionLabel="keterangan"
                                optionValue="KategoriProgramID" placeholder="Pilih Program" :required="true" />
                            <small v-if="isProgramRequiredError" class="p-error">Sila pilih Kategori Program.</small>
                        </div>
                        <div class="field col-12">
                            <label for="Tujuan">Tujuan<span class="p-error">*</span></label>
                            <Textarea id="Tujuan" v-model="formPermohonan.Tujuan" rows="3" />
                            <small v-if="isTujuanRequiredError" class="p-error">Sila isi Tujuan.</small>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="Kekerapan">Kekerapan Program / Aktiviti / Tugas Rasmi<span
                                    class="p-error">*</span></label>
                            <InputText id="Kekerapan" v-model="formPermohonan.Kekerapan" type="number" />
                            <small v-if="isKekerapanRequiredError" class="p-error">Sila nyatakan Kekerapan.</small>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="tarikhMula">Tarikh Mula <span class="p-error">*</span></label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="formPermohonan.TarikhMula"
                                dateFormat="dd/mm/yy" @blur="calculateTempoh" />
                            <small v-if="isTarikhMulaRequiredError" class="p-error">Sila pilih Tarikh Mula.</small>
                        </div>

                        <div class="field col-12 md:col-3">
                            <label for="tarikhTamat">Tarikh Tamat <span class="p-error">*</span></label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="formPermohonan.TarikhTamat"
                                dateFormat="dd/mm/yy" @blur="calculateTempoh" />
                            <small v-if="isTarikhTamatRequiredError" class="p-error">Sila pilih Tarikh Tamat.</small>
                        </div>

                        <div class="field col-12 md:col-3">
                            <label for="Tempoh">Tempoh Program (Bilangan Hari)<span class="p-error">*</span></label>
                            <InputText id="Tempoh" v-model="formPermohonan.Tempoh" type="text" readonly />
                            <small v-if="isTempohRequiredError" class="p-error">Sila nyatakan Tempoh.</small>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="dropdownKategoriPeserta">Kategori Peserta <span class="p-error">*</span></label>
                            <Dropdown id="dropdownKategoriPeserta" v-model="formPermohonan.dropdownKategoriPeserta"
                                :options="dropdownKategoriPeserta" optionLabel="Keterangan" optionValue="KatPesertaID"
                                placeholder="Pilih Kategori" :required="true" filter filterPlaceholder="Cari Kategori">
                            </Dropdown>
                            <small v-if="isPesertaRequiredError" class="p-error">Sila pilih Kategori Peserta.</small>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="dropdownKategoriPerkhidmatan">Kategori Perkhidmatan<span
                                    class="p-error">*</span></label>
                            <Dropdown id="dropdownKategoriPerkhidmatan"
                                v-model="formPermohonan.dropdownKategoriPerkhidmatan" :options="dropdownKategoriKhidmat"
                                optionLabel="Keterangan" optionValue="JenisKhidmatID" placeholder="Pilih Kategori"
                                :required="true" filter filterPlaceholder="Cari Kategori">
                            </Dropdown>
                            <small v-if="isKhidmatRequiredError" class="p-error">Sila pilih Kategori
                                Perkhidmatan.</small>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="Tempat">Tempat <span class="p-error">*</span></label>
                            <InputText id="Tempat" v-model="formPermohonan.Tempat" type="text" />
                            <small v-if="isTempatRequiredError" class="p-error">Sila nyatakan Tempat.</small>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="dropdownNegara">Negara <span class="p-error">*</span></label>
                            <Dropdown id="dropdownNegara" v-model="formPermohonan.dropdownNegara"
                                :options="dropdownNegara" optionLabel="Keterangan" optionValue="NegaraID"
                                placeholder="Pilih Negara" :required="true" filter filterPlaceholder="Cari Negara">
                            </Dropdown>
                            <small v-if="isNegaraRequiredError" class="p-error">Sila pilih Negara.</small>
                        </div>
                        <div class="field col-12 md:col-6">
                            <p><label for="Kedutaan">Kedutaan Malaysia di Negara Tersebut <span
                                        class="p-error">*</span></label></p>
                            <br>
                            <div class="grid">
                                <div class="col-12 md:col-4">
                                    <div class="field-radiobutton mb-0">
                                        <RadioButton id="option1" name="option" value="ADA" v-model="radioValue" />
                                        <label for="option1">ADA</label>
                                    </div>
                                    <small v-if="isRadioKedutaanRequiredError" class="p-error">Sila pilih salah satu
                                        pilihan.</small>
                                </div>
                                <div class="col-12 md:col-4">
                                    <div class="field-radiobutton mb-0">
                                        <RadioButton id="option2" name="option" value="TIDAK" v-model="radioValue" />
                                        <label for="option2">TIDAK</label>
                                    </div>
                                </div>

                                <div v-if="radioValue === 'ADA'"><br>
                                    <label for="Kedutaan">Nyatakan <span class="p-error">*</span></label>
                                    <InputText id="Kedutaan" v-model="formPermohonan.Kedutaan" />
                                    <small v-if="isKedutaanRequiredError" class="p-error">Sila nyatakan
                                        Kedutaan.</small>
                                </div>

                            </div>
                        </div>

                        <div class="field col-12 md:col-6">
                            <p><label for="Tempat">Kelulusan KDN / KLN (Jika di negara komunis) <span
                                        class="p-error">*</span></label></p>
                            <br>
                            <div class="grid">
                                <div class="col-12 md:col-4">
                                    <div class="field-radiobutton mb-0">
                                        <RadioButton id="optionKomunis1" name="optionKomunis1" value="ADA"
                                            v-model="radioValue1" />
                                        <label for="optionKomunis1">ADA</label>
                                    </div>
                                    <small v-if="isRadioKDNRequiredError" class="p-error">Sila pilih salah satu
                                        pilihan.</small>
                                </div>
                                <div class="col-12 md:col-4">
                                    <div class="field-radiobutton mb-0">
                                        <RadioButton id="optionKomunis2" name="optionKomunis2" value="TIDAK"
                                            v-model="radioValue1" />
                                        <label for="optionKomunis2">TIDAK</label>
                                    </div>
                                </div>

                                <div v-if="radioValue1 === 'ADA'"><br>
                                    <label for="LulusKDN">Nyatakan <span class="p-error">*</span></label>
                                    <InputText id="LulusKDN" v-model="formPermohonan.LulusKDN" />
                                    <small v-if="isKDNRequiredError" class="p-error">Sila nyatakan Kedutaan.</small>
                                </div>

                            </div>
                        </div>

                        <div class="field col-12">
                            <label for="Faedah">Faedahnya Kepada Negara <span class="p-error">*</span></label>
                            <Textarea id="Faedah" rows="2" v-model="formPermohonan.Faedah" />
                            <small v-if="isFaedahRequiredError" class="p-error">Sila nyatakan Faedah.</small>
                        </div>

                    </div>
                    <div class="button-container">
                        <Button label="Simpan" severity="info" rounded class="mb-2 mr-2" title="Simpan Permohonan"
                            @click="sendPermohonan" icon="pi pi-save" iconPos="right" />
                    </div>
                </TabPanel>

                <TabPanel header="MAKLUMAT PESERTA">
                    <div class="formgrid grid">

                        <div class="col- md:col-8">
                            <div class="button-custom">
                                <label class="mr-2" for="NamaKapal">Nama Kapal (Jika Ada) </label>
                                <InputText class="mr-2" id="NamaKapal" v-model="formpeserta.NamaKapal" type="text" />

                                <label class="mr-2" for="BilanganPeserta">Bilangan Peserta <span
                                        class="p-error">*</span></label>
                                <InputText class="mr-2" id="BilanganPeserta" type="text" :value="selectedUsers.length"
                                    readonly />

                                <Button severity="info" class="mr-2" @click="showDialogTambahPeserta"
                                    icon="pi pi-user-plus" iconPos="right" title="Tambah Peserta" />
                            </div>
                            <Dialog header="Senarai Pengguna" v-model:visible="dialogTambahPeserta" modal="true"
                                :closable="true" :draggable="false" :style="{ width: '1200px', height: '800px' }">
                                <div class="flex justify-content-between items-center mb-3">
                                    <p>Pilih senarai peserta dari senarai pengguna</p>
                                    <Button label="Tambah Pengguna" class="p-button-info" title="Tambah Pengguna"
                                        @click="goTodaftarpengguna" />
                                </div>

                                <DataTable :paginator="true" :rows="10" class="p-datatable-gridlines" :row-hover="true"
                                    responsive-layout="scroll" :value="filteredUsers" v-if="!loading && !error">
                                    <template #header>
                                        <div class="p-input-icon-left mb-2"
                                            style="display: flex; align-items: center; width: 100%;">
                                            <div style="position: relative; display: inline-block; flex: 1;">
                                                <i class="pi pi-search"
                                                    style="position: absolute; top: 50%; left: 0.75rem; transform: translateY(-50%); color: #888;"></i>
                                                <InputText placeholder="Carian..." v-model="searchQuery"
                                                    style="width: 100%; padding-left: 2.5rem;" title="Carian" />
                                            </div>
                                            <Button type="button" icon="pi pi-filter-slash"
                                                class="p-button-outlined mb-2" style="margin-left: 0.5rem;"
                                                title="Semula" @click="resetSearch" />
                                        </div>
                                    </template>

                                    <template #empty>
                                        Tiada pengguna ditemui.
                                    </template>
                                    <template #loading>
                                        Memuatkan data pengguna. Sila tunggu.
                                    </template>

                                    <Column field="Nama" header="Nama Pengguna" style="min-width:12rem"></Column>
                                    <Column field="NoKP" header="No. Kad Pengenalan" style="min-width:12rem"></Column>
                                    <Column field="Jawatan" header="Jawatan" style="min-width:10rem"></Column>
                                    <Column field="NoTel" header="No. Telefon" style="min-width:10rem"></Column>
                                    <Column field="Emel" header="Emel" style="min-width:12rem"></Column>
                                    <Column header="Tindakan" style="min-width:12rem">
                                        <template #body="slotProps">
                                            <div class="button-group">
                                                <Button icon="pi pi-user-plus" class="p-button-success"
                                                    title="Pilih Peserta" @click="pilihPeserta(slotProps.data)" />
                                            </div>
                                        </template>
                                    </Column>
                                </DataTable>

                                <div v-if="error" class="error-message">
                                    {{ error }}
                                </div>

                            </Dialog>
                            <br>
                            <div v-if="selectedUsers.length > 0" class="selected-users">
                                <h6>Senarai Peserta Dipilih:</h6>
                                <table class="selected-users-table">
                                    <thead>
                                        <tr>
                                            <th>Bil</th>
                                            <th>Nama</th>
                                            <th>No KP</th>
                                            <th>Ketua Delagasi</th>
                                            <th>Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(user, index) in selectedUsers.slice(firstRow, firstRow + rowsPerPage)"
                                            :key="user.NoKP">
                                            <td>{{ firstRow + index + 1 }}</td> <!-- Bil column -->
                                            <td>{{ user.Nama }}</td> <!-- Nama column -->
                                            <td>{{ user.NoKP }}</td> <!-- No KP column -->
                                            <td>
                                                <!-- Radio button with controlled value for Ketua Delegasi -->
                                                <input type="radio" :name="'ketua-delegasi'"
                                                    :checked="selectedLeader === user.NoKP"
                                                    @change="selectKetuaDelagasi(user)" />
                                            </td>
                                            <td><Button icon="pi pi-trash" class="p-button-danger" title="Padam Peserta"
                                                    @click="removeUser(firstRow + index)" /></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!-- PrimeVue Paginator -->
                                <Paginator :first="firstRow" :rows="rowsPerPage" :totalRecords="selectedUsers.length"
                                    @page="onPage" />

                            </div>

                        </div>
                    </div>

                    <div class="button-container">
                        <Button label="Simpan" severity="info" rounded class="mb-2 mr-2" title="Simpan Maklumat Pegawai"
                            @click="simpanPeserta1" icon="pi pi-save" iconPos="right" />
                    </div>

                </TabPanel>

                <TabPanel header="DOKUMEN LAMPIRAN">

                    <div class="p-fluid formgrid grid">

                        <div class="field col-12 md:col-6">
                            <input type="file" @change="onFileChange" />
                            <p></p>
                            <div class="input-button-group">
                                <InputText v-model="currentCustomName" placeholder="Nama Fail" />
                                <Button label="Tambah" @click="addFile" icon="pi pi-plus" class="p-button-secondary"
                                    title="Tambah fail dalam senarai" />
                            </div>
                            <small class="p-error" v-if="files.length === 0">Sila pilih fail untuk dimuat naik.</small>
                        </div>

                        <!-- Display Selected Files in Table -->
                        <div class="col-12" v-if="files.length > 0">
                            <table class="file-table">
                                <thead>
                                    <tr>
                                        <th>Bil</th>
                                        <th>Fail Di Muat Naik</th>
                                        <th>Nama Fail</th>
                                        <th>Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(fileData, index) in files" :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ fileData.file.name }}</td>
                                        <td>{{ fileData.customName }}</td>
                                        <td>
                                            <Button icon="pi pi-trash" class="p-button-danger"
                                                @click="removeFile(index)" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <br>
                        <!-- Upload Button -->
                        <div class="col-12">
                            <Button label="Muat Naik" @click="uploadFiles" icon="pi pi-upload"
                                title="Muat naik fail dalam senarai" class="p-button-success" />
                        </div>
                    </div>

                    <div class="button-container">
                        <Button label="Simpan" severity="info" rounded class="mb-2 mr-2" title="Simpan Permohonan"
                            @click="goToNextTab" icon="pi pi-save" iconPos="right" />
                    </div>

                </TabPanel>

                <TabPanel header="MAKLUMAT PERUNTUKAN">
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-4">
                            <label for="kewMohon">Implikasi Kewangan Dimohon (RM)<span class="p-error">*</span></label>
                            <InputText id="kewMohon" v-model="formPeruntukan.kewMohon" type="number" placeholder="Masukkan jumlah dalam nombor" min="0" />
                            <small v-if="isKewMohonError" class="p-error">Sila Nyatakan Implikasi Kewangan Yang
                                Dimohon</small>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="firstname2">Baki PKLN (RM) <span class="p-error">*</span> </label>
                            <InputText id="bakiPKLN" type="number" v-model="formPeruntukan.bakiPKLN"
                                class="uniform-input" placeholder="Masukkan baki dalam nombor" min="0" />
                            <small v-if="isBakiPKLNError" class="p-error">Sila Nyatakan Baki
                                PKLN</small>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="tarikhbakiPKLN">Sehingga (Tarikh Baki PKLN) <span
                                    class="p-error">*</span></label>
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="formPeruntukan.tarikhbakiPKLN"
                                dateFormat="dd/mm/yy" class="uniform-input" />
                            <small v-if="isBakiPKLNError" class="p-error">Sila Nyatakan Baki
                                PKLN</small>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="kewSah">Implikasi Kewangan Disahkan Oleh PTJ (RM) <span
                                    class="p-error">*</span></label>
                            <InputText id="kewSah" type="number" v-model="formPeruntukan.kewSah" placeholder="Masukkan jumlah dalam nombor" min="0" />
                            <small v-if="iskewSahError" class="p-error">Sila Nyatakan Implikasi Kewangan Yang
                                Disahkan</small>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="bakiPTJ">Baki Peruntukan PTJ (RM) <span class="p-error">*</span></label>
                            <InputText id="bakiPTJ" type="number" v-model="formPeruntukan.bakiPTJ" placeholder="Masukkan jumlah dalam nombor" min="0" />
                            <small v-if="isbakiPTJError" class="p-error">Sila Nyatakan Baki Peruntukan PTJ</small>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="tanggunganOleh">Perbelanjaan Ditanggung Oleh <span
                                    class="p-error">*</span></label>
                            <InputText id="tanggunganOleh" type="text" v-model="formPeruntukan.tanggunganOleh" />
                            <small v-if="istanggunganOlehError" class="p-error">Sila Nyatakan Perbelanjaan Ditanggung
                                Oleh</small>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="dropdownBudget">
                                Pengesahan Rancangan Perbelanjaan <span class="p-error">*</span>
                            </label>
                            <Dropdown id="dropdownBudget" v-model="formPeruntukan.PengesahanRP"
                                :options="dropdownBudgetOptions" option-label="label" option-value="value"
                                placeholder="Pilih Pilihan" :required="true" />
                            <small v-if="isDropdownBudgetError" class="p-error">Sila buat pilihan.</small>
                        </div>

                        <div class="field col-12 md:col-8">
                            <label for="ulasan">Ulasan <span class="p-error">*</span></label>
                            <Textarea id="ulasan" rows="2" v-model="formPeruntukan.ulasan"></Textarea>
                            <small v-if="isulasanError" class="p-error">Sila Nyatakan Ulasan</small>
                        </div>
                    </div>

                    <div class="field col-12 md:col-12">
                        <p><label for="Tempat">Perincian Tajaan <span class="p-error">*</span> </label></p>

                        <div class="grid">
                            <div class="col-12 md:col-4">
                                <div class="field-radiobutton mb-0">
                                    <RadioButton id="ADA" name="tajaan" value="ADA" v-model="radioValueTajaan" />
                                    <label for="ADA">ADA</label>
                                </div>
                            </div>
                            <div class="col-12 md:col-4">
                                <div class="field-radiobutton mb-0">
                                    <RadioButton id="TIADA" name="tajaan" value="TIADA" v-model="radioValueTajaan" />
                                    <label for="TIADA">TIADA</label>
                                </div>
                                <!-- Error message if no selection is made -->
                                <small v-if="isRadioError" class="p-error">Sila Buat Pilihan Tajaan</small>
                            </div>

                            <!-- Show additional fields when "YA" is selected -->
                            <div v-if="radioValueTajaan === 'ADA'"><br>
                                <label for="tajaanperinci">Perincian Tajaan :&nbsp;</label>
                                <InputText id="tajaanperinci" v-model="formPeruntukan.tajaanperinci" />
                                &nbsp;&nbsp;&nbsp;
                                <label for="tajaanoleh">Tajaan Oleh :&nbsp;</label>
                                <InputText id="tajaanoleh" v-model="formPeruntukan.tajaanoleh" />
                            </div>
                        </div>
                    </div>

                    <div class="button-wrapper">
                        <div class="button-container">
                            <Button label="Simpan" severity="info" rounded class="mb-2 mr-2" icon="pi pi-save"
                                iconPos="right" title="Simpan Permohonan sebagai Draf" @click="saveForm" />
                        </div>
                    </div>

                    <div class="button-container button-hantar">

                    </div>

                </TabPanel>

            </TabView>
        </div>
    </div>

</template>

<script>
export default {
    data() {
        return {
            activeIndex: 0,
            isPopupVisible: false,
            // other data properties
        };
    },
    methods: {
        nextTab() {
            this.activeIndex += 1;
        },
        showPopup() {
            this.isPopupVisible = true;
        },
        closePopup() {
            this.isPopupVisible = false;
        },
        nextTabAndShowPopup() {
            this.nextTab();
            this.showPopup();
        }
    },
};
</script>

<style scoped>
.button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    /* Add some margin to separate the button from the content */
}

.button-wrapper {
    display: flex;
    gap: 5px;
    /* Adjust the gap as needed */
    justify-content: flex-end;
}

.button-hantar {
    margin-top: 3px;
    /* Reduces space between the two sections */
}

.button-custom {
    display: flex;
    align-items: center;
    /* Ensures vertical alignment */
    justify-content: flex-start;
    /* Adjust this to control horizontal alignment */
}

.p-fluid .p-button {
    width: 20%;
}

.input-wrapper {
    display: flex;
    gap: 10px;
    /* Adjust the gap as needed */
}

.popup-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background: #fff;
    padding: 100px;
    border-radius: 10px;
    text-align: center;
}

.button-group {
    display: inline-flex;
    gap: 5px;
    /* Adjust spacing between buttons */
}

.button-container {
    display: flex;
    justify-content: flex-end;
    /* Aligns the button to the right */
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

.file-table {
    width: 100%;
    border-collapse: collapse;
}

.file-table th,
.file-table td {
    border: 1px solid #ddd;
    padding: 8px;
}

.file-table th {
    background-color: #f2f2f2;
    text-align: left;
}
.input-button-group {
    display: flex;
    gap: 8px; /* Space between input and button */
    align-items: center; /* Center align button and input */
}

</style>
