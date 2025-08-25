<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import moment from 'moment';
import Swal from 'sweetalert2';

const router = useRouter();
const loading = ref(true);
const error = ref(null);
const baseUrl = import.meta.env.VITE_API_URL

const permohonans = ref([]);
const selectedStatus = ref(null);
const selectedPeringkatKelulusan = ref(null);
const searchQuery = ref("");
const dropdownStatus = ref([]);  // This will hold the status options

const senaraiNegara = ref([]);
const semakanData = ref([]);
const senaraiKuasaLulus = ref([]);

// Pagination setup
const first = ref(0); // Ensure first starts at 0
const rows = ref(10); // Default rows per page

// Fetch permohonan data
const fetchPermohonan = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/permohonan`);
    permohonans.value = response.data;
  } catch (err) {
    console.error('Error fetching permohonan:', err);
    error.value = `Failed to load data: ${err.response?.data.message || err.message}`;
  } finally {
    loading.value = false;
  }
};

// Fetch status options
const getStatus = async () => {
  try {
    const { data } = await axios.get(`${baseUrl}/api/senaraiStatusMohon`);
    dropdownStatus.value = data;
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
};

// Fetch negara list
const getNegara = async () => {
  try {
    const { data } = await axios.get(`${baseUrl}/api/senaraiNegara`);
    senaraiNegara.value = data;
  } catch (err) {
    console.error('Failed to fetch negara:', err);
  }
};

// Map NegaraID to Keterangan
const getNegaraKeterangan = (negaraID) => {
  const negara = senaraiNegara.value.find(item => item.NegaraID === negaraID);
  return negara ? negara.Keterangan : '(-)';
};

// Fetch Semakan Data
const getSemakan = async () => {
  try {
    const { data } = await axios.get(`${baseUrl}/api/semakan`);
    semakanData.value = data;
  } catch (err) {
    console.error('Failed to fetch semakan:', err);
  }
};

// Fetch Senarai Kuasa Lulus Data
const getKuasaLulus = async () => {
  try {
    const { data } = await axios.get(`${baseUrl}/api/senaraiKuasaLulus`);
    senaraiKuasaLulus.value = data;
  } catch (err) {
    console.error('Failed to fetch senarai kuasa lulus:', err);
  }
};

// Map MohonID to Peringkat Kelulusan Keterangan
const getPeringkatKelulusanDesc = (mohonID) => {
  const semakan = semakanData.value.find(item => item.MohonID === mohonID);

  if (semakan) {
    const kuasa = senaraiKuasaLulus.value.find(item =>
      String(item.KuasaLulusID) === String(semakan.KuasaLulusID)  // Force to string
    );
    return kuasa ? kuasa.Keterangan.trim() : '(-)';  // Trim to remove extra spaces
  }
  return '-';
};

// Navigate to a new permohonan
function goToPermohonanBaru() {
  router.push('/daftarpermohonan');
}

// Format date
function formatDate(date) {
  return moment(date).format('DD/MM/YYYY');
}

// Navigate to edit permohonan
function editPermohonan(MohonID) {
  router.push({ name: 'kemaskiniPermohonan', params: { id: MohonID } });
}

// Navigate to view permohonan
function viewPermohonan(MohonID) {

  console.log('test', MohonID)
  router.push({ name: 'paparPermohonan', params: { id: MohonID.MohonID } });
}

// Reset filters
function resetFilters() {
  selectedStatus.value = null;
  selectedPeringkatKelulusan.value = null;
  searchQuery.value = "";
}

// Filter permohonan
const filteredPermohonan = computed(() => {
  let filtered = permohonans.value;

  if (selectedStatus.value !== null) {
    filtered = filtered.filter(item => item.StatusMohonID === selectedStatus.value);
  }

   // Filter by Peringkat Kelulusan (Map MohonID to KuasaLulusID)
   if (selectedPeringkatKelulusan.value !== null) {
    filtered = filtered.filter(item => {
      const semakan = semakanData.value.find(s => s.MohonID === item.MohonID);
      return semakan && String(semakan.KuasaLulusID) === String(selectedPeringkatKelulusan.value);
    });
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.Nama.toLowerCase().includes(query) ||
      (item.Tempat && item.Tempat.toLowerCase().includes(query))
    );
  }

  return filtered;
});


// function delete Permohonan - Draf
const deletePermohonan = async (MohonID) => {
  // Show confirmation dialog
  const result = await Swal.fire({
    title: 'Anda pasti untuk memadam?',
    text: 'Tindakan ini tidak boleh diundur!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak',
    customClass: {
      confirmButton: 'p-button-danger',
      cancelButton: 'p-button-secondary',
    },
  });

  if (!result.isConfirmed) {
    return; // Do nothing if the user selects 'Tidak'
  }

  // Define the APIs to call
  const apis = [
    { url: `${baseUrl}/api/permohonan/delete`, body: { MohonID } },
    { url: `${baseUrl}/api/kumpulan/delete`, body: { MohonID } },
    { url: `${baseUrl}/api/lampiran/delete`, body: { MohonID } },
    { url: `${baseUrl}/api/peruntukan/delete`, body: { MohonID } },
  ];

  let successCount = 0;
  const errors = [];

  for (const api of apis) {
    try {
      const response = await axios.post(api.url, api.body);
      console.log(`API ${api.url} success:`, response.data);
      successCount++;
    } catch (error) {
      console.error(`API ${api.url} failed:`, error.response ? error.response.data : error.message);
      errors.push(api.url);
    }
  }

  // Show appropriate alert and refresh the page on "OK"
  if (errors.length === 0) {
    Swal.fire({
      title: "Berjaya!",
      text: "Semua permohonan telah dipadam.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      // Reload the page
      window.location.reload();
    });
  } else {
    Swal.fire({
      title: "Ralat!",
      html: `Sebahagian permohonan gagal dipadam. Ralat pada: <ul>${errors
        .map((url) => `<li>${url}</li>`)
        .join("")}</ul>`,
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      // Reload the page
      window.location.reload();
    });
  }

};

onMounted(() => {
  fetchPermohonan();
  getStatus();
  getNegara();

});

onMounted(async () => {
  await getSemakan();
  await getKuasaLulus();
});

</script>

<template>
  <div class="layout-empty">
    <div class="grid">
      <div class="col-12">
        <div class="card">

          <div class="flex justify-content-between items-center mb-3">
            <h5>Senarai Permohonan</h5>
            <Button label="Tambah Permohonan" class="p-button-success" title="Tambah Permohonan"
              @click="goToPermohonanBaru" />
          </div>
          <DataTable :value="filteredPermohonan" :paginator="true" :rows="rows" :first="first"
            @update:first="first = $event" @update:rows="rows = $event" :rows-per-page-options="[10, 20, 30]"
            :dataKey="'MohonID'">

            <template #header>
              <div class="flex justify-content-between flex-column sm:flex-row">
                <Dropdown id="dropdownPeringkatKelulusan" v-model="selectedPeringkatKelulusan"
                  :options="senaraiKuasaLulus" optionLabel="Keterangan" optionValue="KuasaLulusID"
                  placeholder="Pilih Peringkat Kelulusan" :filter="true" filterPlaceholder="Cari Peringkat">
                </Dropdown>
                &nbsp;&nbsp;&nbsp;
                <Dropdown id="dropdownStatus" v-model="selectedStatus" :options="dropdownStatus"
                  optionLabel="Keterangan" optionValue="StatusMohonID" placeholder="Pilih Status" :filter="true"
                  filterPlaceholder="Cari Status">
                </Dropdown>
                &nbsp;&nbsp;&nbsp;
                
                <span class="p-input-icon-left mb-2" style="width: 100%;">
                  <div style="position: relative; display: inline-block; width: 100%;">
                    <i class="pi pi-search"
                      style="position: absolute; top: 50%; left: 0.75rem; transform: translateY(-50%); color: #888;"></i>
                    <InputText placeholder="Carian..." v-model="searchQuery" style="width: 100%; padding-left: 2.5rem;"
                      title="Carian" />
                  </div>
                </span>
                <Button type="button" icon="pi pi-filter-slash" class="p-button-outlined mb-2"
                  style="margin-left: 0.5rem;" title="Semula" @click="resetFilters" />
              </div>
            </template>

            <template #empty>
              Tiada permohonan ditemui.
            </template>
            <template #loading>
              Memuatkan data permohonan. Sila tunggu.
            </template>

            <!-- New Column for Bil -->
            <Column header="Bil" style="min-width:4rem; text-align: center;">
              <template #body="slotProps">
                {{ console.log("first:", first, "slotProps.index:", slotProps.index) }}
                {{ first + (slotProps.index || 0) + 1 }}
              </template>
            </Column>
            <Column field="MohonID" header="Kod Mohon" style="min-width:8rem"></Column>
            <Column field="Nama" header="Nama Program" style="min-width:22rem"></Column>
            <Column header="Negara" style="min-width:8rem">
              <template #body="slotProps">
                {{ getNegaraKeterangan(slotProps.data.NegaraID) }}
              </template>
            </Column>
            <Column header="Tarikh Program" style="min-width: 12rem">
              <template #body="slotProps">
                <div>
                  <div><strong>Mula&nbsp;&nbsp;&nbsp;&nbsp;:</strong> {{ formatDate(slotProps.data.TkhMula) }}</div>
                  <div><strong>Tamat  :</strong> {{ formatDate(slotProps.data.TkhTamat) }}</div>
                </div>
              </template>
            </Column>
            <Column field="TblRefStatusMohon.Keterangan" header="Status" style="min-width:8rem"></Column>
            <Column header="Tarikh Proses" style="min-width:10rem">
              <template #body="slotProps">
                <div><strong>Mohon &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> {{ slotProps.data.TkhHantar ? formatDate(slotProps.data.TkhHantar) || '(-)'
                  : '(-)' }}</div>
                <div><strong>Semak &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> (-)</div>
                <div><strong>Sokong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> (-)</div>
                <div><strong>Perakuan &nbsp;&nbsp;:</strong> (-)</div>
                <div><strong>Kelulusan &nbsp;&nbsp;:</strong> (-)</div>
              </template>
            </Column>
            <Column header="Peringkat Kelulusan" style="min-width:10rem">
              <template #body="slotProps">
                {{ getPeringkatKelulusanDesc(slotProps.data.MohonID) }}
              </template>
            </Column>
            <Column header="Tindakan" style="min-width:12rem">
              <template #body="slotProps">
                <div class="button-group">
                  <Button icon="pi pi-search" class="p-button-warning" title="Papar Permohonan" rounded
                    @click="viewPermohonan(slotProps.data)" v-if="slotProps.data.StatusMohonID !== 1" />
                  <Button icon="pi pi-pencil" class="p-button-info" title="Kemaskini Permohonan" rounded
                    @click="editPermohonan(slotProps.data.MohonID)" v-if="slotProps.data.StatusMohonID === 1" />
                  <Button icon="pi pi-trash" class="p-button-danger" title="Padam Permohonan" rounded
                    @click="() => { deletePermohonan(slotProps.data.MohonID); }"
                    v-if="slotProps.data.StatusMohonID === 1" />
                </div>
              </template>
            </Column>

            <!-- Footer with Total Count -->
            <template #footer>
              <div class="flex justify-content-between">
                <span>{{ filteredPermohonan.length }} per {{ permohonans.length }} permohonan</span>
              </div>
            </template>

          </DataTable>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-empty {
  margin-bottom: 20px;
}

.error-message {
  color: red;
  margin-top: 1rem;
}

.button-group {
  display: inline-flex;
  gap: 1.5px;
  /* Adjust spacing between buttons */
}
</style>
