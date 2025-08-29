<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const searchKeyword = ref('');
const baseUrl = import.meta.env.VITE_API_URL

async function fetchUsers() {
  try {
      
 
    const response = await axios.get(`${baseUrl}/api/pengguna`);
    users.value = response.data;
  } catch (err) {
    error.value = 'Failed to load data. ' + (err.response?.data.message || err.message);
  } finally {
    loading.value = false;
  }
}

const filteredUsers = computed(() => {
  return users.value
    .filter(user =>
      user.Nama?.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      user.Emel?.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
    .sort((a, b) => a.Nama?.localeCompare(b.Nama));
});

function goTodaftarpengguna() {
  router.push('/daftarpengguna');
}

function editUser(user) {
  router.push(`/editpengguna/${user.PenggunaID}`);
}


async function deleteUser(user) {
  if (confirm(`Are you sure you want to delete ${user.Nama}?`)) {
    try {
      await axios.delete(`${baseUrl}/api/pengguna/${user.PenggunaID}`);
      users.value = users.value.filter(u => u.PenggunaID !== user.PenggunaID);
    } catch (err) {
      alert('Failed to delete user. Please try again.');
    }
  }
}


onMounted(fetchUsers);
</script>

<template>
  <div class="layout-empty">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <div class="flex justify-content-between items-center mb-3">
            <h5>Senarai Pengguna</h5>
            <Button label="Tambah Pengguna" class="p-button-success" @click="goTodaftarpengguna" />
          </div>

          <div v-if="loading" class="loading-message">Memuatkan data pengguna...</div>
          <div v-if="error" class="error-message">{{ error }}</div>

          <DataTable
            v-if="!loading"
            :paginator="true"
            :rows="10"
            class="p-datatable-gridlines"
            responsive-layout="scroll"
            :value="filteredUsers"
          >
            <template #header>
              <div class="search-box">
                <InputText v-model="searchKeyword" placeholder="Cari Pengguna" class="search-input" />
                <i class="pi pi-search search-icon"></i>
              </div>
            </template>

            <template #empty>Tiada pengguna ditemui.</template>

            <Column field="Nama" header="Nama Pengguna"></Column>
            <Column field="NoKP" header="No. Kad Pengenalan"></Column>
            <Column field="Jawatan" header="Jawatan"></Column>
            <Column field="NoTel" header="No. Telefon"></Column>
            <Column field="Emel" header="Emel"></Column>
            <Column header="Tindakan">
              <template #body="slotProps">
            <div class="button-container">
              <Button icon="pi pi-pencil" class="p-button-warning" @click="editUser(slotProps.data)" />
               <Button icon="pi pi-trash" class="p-button-danger ml-2" @click="deleteUser(slotProps.data)" />
            </div>
            </template>

            </Column>
          </DataTable>
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
.loading-message {
  color: blue;
  margin-top: 1rem;
}
.search-box {
  position: relative;
  width: 100%;
}
.search-input {
  width: 100%;
  padding-left: 2.5rem;
  box-sizing: border-box;
  padding-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  height: 2.5rem;
}
.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 1.2rem;
}
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
