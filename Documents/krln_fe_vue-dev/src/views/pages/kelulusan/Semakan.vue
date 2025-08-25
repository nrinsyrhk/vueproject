<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment';
const baseUrl = import.meta.env.VITE_API_URL;
const router = useRouter();
const loading = ref(true);
const error = ref(null);
const permohonans = ref([]);
const selectedStatus = ref(sessionStorage.getItem('userRole'));
const selectedPeringkatKelulusan = ref(null);
const searchQuery = ref('');
const dropdownStatus = ref([]); // This will hold the status options
const semakanData = ref([]);
const senaraiKuasaLulus = ref([]);
function formatDate(date) {
    return moment(date).format('DD/MM/YYYY');
}
// Fetch the data
async function fetchPermohonans() {
    try {
        const response = await axios.get(`${baseUrl}/api/permohonan`);
        // permohonans.value = response.data;
        // Filter the data to include only StatusId 2, 3, 4, 5
        permohonans.value = response.data.filter((item) => [2, 3, 4, 5, 9].includes(item.StatusMohonID));
    } catch (err) {
        if (err.response) {
            error.value = `Failed to load data. Server responded with status ${err.response.status}: ${err.response.data.message || err.message}`;
        } else if (err.request) {
            error.value = 'Failed to load data. No response received from the server.';
        } else {
            error.value = 'Failed to load data. ' + err.message;
        }
    } finally {
        loading.value = false;
    }
}
// Mapping for transforming status values
const statusMapping = {
    1: 'Pemohon',
    2: 'PSU CKK (PENYEMAK)',
    3: 'KPSU / PSU 1 (PENYOKONG)',
    4: 'TSUB A / SUB (PERAKU)',
    5: 'KSU (PELULUS)',
    6: 'KELULUSAN',
    7: 'DILULUSKAN',
    6: 'TIDAK DILULUSKAN',
    9: 'PENYEMAK KUIRI'
    // Add other mappings as needed
};
// Fetch status options
const getStatus = async () => {
    try {
        const { data } = await axios.get(`${baseUrl}/api/senaraiStatusMohon`);
        // Filter the data to include only StatusMohonID 2, 3, 4, 5
        const filteredData = data.filter((item) => [2, 3, 4, 5, 9].includes(item.StatusMohonID));
        // Transform the data using the statusMapping
        dropdownStatus.value = filteredData.map((item) => ({
            value: item.StatusMohonID, // Keep the original ID for selection
            label: statusMapping[item.StatusMohonID] || item.Keterangan.trim() // Use the mapped label, fallback to original Keterangan if not mapped
        }));
    } catch (err) {
        const errorMessage = err.response ? `Server responded with status ${err.response.status}: ${err.response.data?.message || err.message}` : err.request ? 'No response received from the server.' : 'Failed to load data. ' + err.message;
        console.error(errorMessage);
        error.value = errorMessage;
    } finally {
        loading.value = false;
    }
};
// Call the fetch function when the component mounts
fetchPermohonans();
// Filter permohonan
const filteredPermohonan = computed(() => {
    let filtered = permohonans.value;
    if (selectedStatus.value !== null) {
        filtered = filtered.filter((item) => item.StatusMohonID === parseInt(selectedStatus.value));
    }
    // Filter by Peringkat Kelulusan (Map MohonID to KuasaLulusID)
    if (selectedPeringkatKelulusan.value !== null) {
        filtered = filtered.filter((item) => {
            const semakan = semakanData.value.find((s) => s.MohonID === item.MohonID);
            return semakan && String(semakan.KuasaLulusID) === String(selectedPeringkatKelulusan.value);
        });
    }
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter((item) => (item.MohonID && item.MohonID.toLowerCase().includes(query)) || (item.Nama && item.Nama.toLowerCase().includes(query)) || (item.Tempat && item.Tempat.toLowerCase().includes(query)));
    }
    return filtered;
});
// Reset filters
function resetFilters() {
    selectedStatus.value = null;
    selectedPeringkatKelulusan.value = null;
    searchQuery.value = '';
}
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
    // Find the semakan data for the given MohonID
    const semakan = semakanData.value.find((item) => item.MohonID === mohonID);
    if (semakan) {
        console.log('Semakan Data:', semakan); // Debugging log
        console.log('KuasaLulusID in Semakan:', semakan.KuasaLulusID, typeof semakan.KuasaLulusID); // Debugging log
        // Find the corresponding KuasaLulus data
        const kuasa = senaraiKuasaLulus.value.find(
            (item) => String(item.KuasaLulusID) === String(semakan.KuasaLulusID) // Force both to string
        );
        console.log('Kuasa Data:', kuasa); // Debugging log
        return kuasa ? kuasa.Keterangan.trim() : '-'; // Trim to remove extra spaces
    }
    return '-';
};
// Navigate to semak permohonan
function semakPermohonan(MohonID) {
    router.push({ name: 'semakPermohonan', params: { id: MohonID.MohonID } });
}
// Navigate to sokong permohonan
function sokongPermohonan(MohonID) {
    console.log('test', MohonID);
    router.push({ name: 'sokongPermohonan', params: { id: MohonID.MohonID } });
}
// Navigate to peraku permohonan
function perakuPermohonan(MohonID) {
    console.log('test', MohonID);
    router.push({ name: 'perakuPermohonan', params: { id: MohonID.MohonID } });
}
// Navigate to lulus permohonan
function lulusPermohonan(MohonID) {
    console.log('test', MohonID);
    router.push({ name: 'lulusPermohonan', params: { id: MohonID.MohonID } });
}
onMounted(() => {
    fetchPermohonans();
    getStatus();
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
                        <h5>Senarai Permohonan (Proses Kelulusan)</h5>
                    User Role:  {{ selectedStatus }}
                        <Dropdown id="dropdownStatus" v-model="selectedStatus" :options="dropdownStatus" optionLabel="label" optionValue="value" placeholder="Pilih Peranan" :filter="true" filterPlaceholder="Cari Status"> </Dropdown>
                    </div>
                    <DataTable :paginator="true" :rows="10" class="p-datatable-gridlines" :row-hover="true" responsive-layout="scroll" :value="filteredPermohonan" v-if="!loading && !error">
                        <template #header>
                            <div class="flex justify-content-between flex-column sm:flex-row">
                                <Dropdown
                                    id="dropdownPeringkatKelulusan"
                                    v-model="selectedPeringkatKelulusan"
                                    :options="senaraiKuasaLulus"
                                    optionLabel="Keterangan"
                                    optionValue="KuasaLulusID"
                                    placeholder="Pilih Peringkat Kelulusan"
                                    :filter="true"
                                    filterPlaceholder="Cari Peringkat"
                                >
                                </Dropdown>
                                &nbsp;&nbsp;&nbsp;
                                <span class="p-input-icon-left mb-2" style="width: 100%">
                                    <div style="position: relative; display: inline-block; width: 100%">
                                        <i class="pi pi-search" style="position: absolute; top: 50%; left: 0.75rem; transform: translateY(-50%); color: #888"></i>
                                        <InputText placeholder="Carian... " style="width: 100%; padding-left: 2.5rem" title="Carian" v-model="searchQuery" />
                                    </div>
                                </span>
                                <Button type="button" icon="pi pi-filter-slash" class="p-button-outlined mb-2" style="margin-left: 0.5rem" title="Semula" @click="resetFilters" />
                            </div>
                        </template>
                        <template #empty> Tiada permohonan ditemui. </template>
                        <template #loading> Memuatkan data permohonan. Sila tunggu. </template>
                        <Column field="MohonID" header="Kod Mohon" style="min-width: 10rem"></Column>
                        <Column field="Nama" header="Nama Program" style="min-width: 22rem"></Column>
                        <Column field="Tempat" header="Lokasi" style="min-width: 8rem"></Column>
                        <!-- Use scoped slots to format the dates -->
                        <Column header="Tarikh Program" style="min-width: 12rem">
                            <template #body="slotProps">
                                <div>
                                    <div><strong>Mula&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> {{ formatDate(slotProps.data.TkhMula) }}</div>
                                    <div><strong>Tamat&nbsp;&nbsp;:</strong> {{ formatDate(slotProps.data.TkhTamat) }}</div>
                                </div>
                            </template>
                        </Column>
                        <Column field="TblRefStatusMohon.Keterangan" header="Status" style="min-width: 10rem"></Column>
                        <Column header="Peringkat Kelulusan" style="min-width: 10rem">
                            <template #body="slotProps">
                                {{ getPeringkatKelulusanDesc(slotProps.data.MohonID) }}
                            </template>
                        </Column>
                        <Column header="Tindakan" style="min-width: 12rem">
                            <template #body="slotProps">
                                <div class="button-group">
                                    <Button icon="pi pi-check-circle" class="p-button-success" title="semak" rounded @click="semakPermohonan(slotProps.data)" v-if="slotProps.data.StatusMohonID == 2" />
                                    <Button icon="pi pi-check-circle" class="p-button-info" title="sokong" rounded @click="sokongPermohonan(slotProps.data)" v-if="slotProps.data.StatusMohonID == 3" />
                                    <Button icon="pi pi-check-circle" class="p-button-warning" title="peraku" rounded @click="perakuPermohonan(slotProps.data)" v-if="slotProps.data.StatusMohonID == 4" />
                                    <Button icon="pi pi-check-circle" class="p-button-help" title="lulus" rounded @click="lulusPermohonan(slotProps.data)" v-if="slotProps.data.StatusMohonID == 5" />
                                </div>
                            </template>
                        </Column>
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
    gap: 3.5px; /* Adjust spacing between buttons */
}
.button-container {
    display: flex;
    gap: 0.5rem; /* Adjust spacing as needed */
}
</style>
