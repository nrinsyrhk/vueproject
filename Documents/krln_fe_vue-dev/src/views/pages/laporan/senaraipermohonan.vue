<template>
  <div class="layout-empty">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <div class="flex justify-content-between items-center mb-3">
            <h5>Senarai Permohonan</h5>
          </div>

          <div class="table-responsive">
            <DataTable
              :value="permohonanList"
              :paginator="true"
              :rows="rowsPerPage"
              :first="currentPage * rowsPerPage"
              @page="e => currentPage = e.page"
              class="p-datatable-gridlines"
              :row-hover="true"
              responsive-layout="scroll"
              v-if="!loading && !error"
            >
              <template #header>
                <div class="flex justify-content-between flex-column sm:flex-row">
                  <span class="p-input-icon-left mb-2" style="width: 100%;">
                    <div style="position: relative; display: inline-block; width: 100%;">
                      <i class="pi pi-search" style="position: absolute; top: 50%; left: 0.75rem; transform: translateY(-50%); color: #888;"></i>
                      <InputText placeholder="Carian..." style="width: 100%; padding-left: 2.5rem;" />
                    </div>
                  </span>
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label="Clear"
                    class="p-button-outlined mb-2"
                    style="margin-left: 1rem;"
                  />
                </div>
              </template>

              <template #empty>Tiada permohonan ditemui.</template>
              <template #loading>Memuatkan data permohonan. Sila tunggu.</template>

              <Column header="Bil" style="width:5rem">
                <template #body="slotProps">
                  {{ currentPage * rowsPerPage + slotProps.index + 1 }}
                </template>
              </Column>
              <Column field="MohonID" header="Kod Mohon" style="width:10rem" />
              <Column field="Nama" header="Tajuk Program / Aktiviti" style="width:15rem" />
              <Column header="Negara" style="width:10rem">
                <template #body="slotProps">{{ getNegaraName(slotProps.data.NegaraID) }}</template>
              </Column>
              <Column header="Bulan, Tahun" style="width:10rem">
                <template #body="slotProps">{{ formatDate(slotProps.data.TkhMula) }}</template>
              </Column>
              <Column field="KategoriProgramID" header="Kategori Program" style="width:12rem" />
              <Column field="LulusKDN" header="Peringkat Kelulusan" style="width:12rem" />
              <Column field="StatusMohonID" header="Status" style="width:10rem" />
            </DataTable>
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import moment from 'moment';

const permohonanList = ref([]);
const negaraList = ref([]);
const loading = ref(true);
const error = ref(null);
const baseUrl = import.meta.env.VITE_API_URL;

const currentPage = ref(0); // Page index starts at 0
const rowsPerPage = ref(10);

function formatDate(date) {
  return moment(date).format('MM/YYYY');
}

async function fetchPermohonan() {
  try {
    const response = await axios.get(`${baseUrl}/api/permohonan`);
    permohonanList.value = response.data;
  } catch (err) {
    handleApiError(err);
  } finally {
    loading.value = false;
  }
}

async function fetchNegara() {
  try {
    const response = await axios.get(`${baseUrl}/api/senaraiNegara`);
    negaraList.value = response.data;
  } catch (err) {
    handleApiError(err);
  }
}

function getNegaraName(negaraId) {
  const negara = negaraList.value.find((n) => n.NegaraID === negaraId);
  return negara ? negara.Keterangan.trim() : 'Unknown';
}

function handleApiError(err) {
  if (err.response) {
    console.error('Server responded with status:', err.response.status);
    error.value = `Failed to load data. Server responded with status ${err.response.status}: ${err.response.data.message || err.message}`;
  } else if (err.request) {
    console.error('No response received:', err.request);
    error.value = 'Failed to load data. No response received from the server.';
  } else {
    console.error('Error message:', err.message);
    error.value = 'Failed to load data. ' + err.message;
  }
}

onMounted(async () => {
  await Promise.all([fetchPermohonan(), fetchNegara()]);
});
</script>

<style scoped>
.layout-empty {
  margin-bottom: 20px;
}

.error-message {
  color: red;
  margin-top: 1rem;
}

.table-responsive {
  overflow-x: auto;
  padding: 0.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.p-datatable-gridlines {
  width: 100%;
  table-layout: auto;
  text-align: center;
}

.p-datatable-gridlines th,
.p-datatable-gridlines td {
  padding: 0.5rem;
  font-size: 14px;
  text-align: center;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .table-responsive {
    width: 100%;
    display: block;
    overflow-x: scroll;
  }
}
</style>
