<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const userId = route.params.id;

const user = ref({
  PenggunaID: '',  
  Nama: '',
  NoKP: '',
  Jawatan: '',
  NoTel: '',
  Emel: '',
});

const loading = ref(true);
const error = ref(null);
const baseUrl = import.meta.env.VITE_API_URL;

async function fetchUser() {
  try {
    const response = await axios.post(`${baseUrl}/api/pengguna/searchbyid`, { id: userId });
    user.value = response.data;
    console.log('Fetched User:', user.value);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      error.value = `User with ID ${userId} not found.`;
    } else {
      error.value = 'Failed to load user data. ' + (err.response?.data.message || err.message);
    }
  } finally {
    loading.value = false;
  }
}

async function updateUser() {
  try {
    const updateBody = {
      Nama: user.value.Nama,
      NoKP: user.value.NoKP,
      Jawatan: user.value.Jawatan,
      NoTel: user.value.NoTel,
      Emel: user.value.Emel,
    };

    console.log('Update Payload:', { id: userId, updateBody });

    const response = await axios.put(`${baseUrl}/api/pengguna/update`, {
      id: userId,
      updateBody
    });

    console.log('Update Response:', response);
    alert('User updated successfully');
    router.push('/senaraipengguna');
  } catch (err) {
    console.error('Update Error:', err.response || err.message);
    alert('Failed to update user. Please try again.');
  }
} 

function cancelUpdate() {
  router.push('/senaraipengguna');
}

onMounted(fetchUser);
</script>

<template>
  <div class="layout-container">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h5>Edit Pengguna</h5>

          <div v-if="loading" class="loading-message">Memuatkan data pengguna...</div>
          <div v-if="error" class="error-message">{{ error }}</div>

          <form v-if="!loading && !error" @submit.prevent="updateUser">
            <div class="form-row">
              <div class="form-group">
                <label for="PenggunaID">ID Pengguna</label>
                <InputText v-model="user.PenggunaID" id="PenggunaID" class="form-control" readonly />
              </div>

              <div class="form-group">
                <label for="Nama">Nama Pengguna</label>
                <InputText v-model="user.Nama" id="Nama" class="form-control" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="NoKP">No. Kad Pengenalan</label>
                <InputText v-model="user.NoKP" id="NoKP" class="form-control" />
              </div>

              <div class="form-group">
                <label for="Jawatan">Jawatan</label>
                <InputText v-model="user.Jawatan" id="Jawatan" class="form-control" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="NoTel">No. Telefon</label>
                <InputText v-model="user.NoTel" id="NoTel" class="form-control" />
              </div>

              <div class="form-group">
                <label for="Emel">Emel</label>
                <InputText v-model="user.Emel" id="Emel" class="form-control" />
              </div>
            </div>
            <div class="button-container">
  <button class="btn btn-save" type="submit">
    <i class="pi pi-save"></i> 
  </button>
  <button class="btn btn-cancel ml-2" @click="cancelUpdate">
    <i class="pi pi-times"></i> 
  </button>
</div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  margin: 0 auto;
  max-width: 900px; 
  padding: 40px; 
}

.card {
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem; 
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-control {
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.loading-message {
  color: blue;
  margin-top: 1rem;
}

.error-message {
  color: red;
  margin-top: 1rem;
}

.button-container {
  text-align: center; 
  margin-top: 20px;   
}

.btn-save {
  background-color: #28a745; 
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
}

.btn-save:hover {
  background-color: #218838; 
}

.btn-cancel {
  background-color: #dc3545; 
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
}

.btn-cancel:hover {
  background-color: #c82333; 
}

.ml-2 {
  margin-left: 10px; 
}

</style>
