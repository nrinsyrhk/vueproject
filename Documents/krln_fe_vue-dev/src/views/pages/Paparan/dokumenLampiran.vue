<script setup>
import { ref } from 'vue';

const dokumen = ref({
  tajuk: '',
  kategori: '',
  file: null,
});

function saveDokumen() {
  if (!dokumen.value.file) {
    alert('Sila pilih fail terlebih dahulu!');
    return;
  }
  alert('Dokumen Berjaya Disimpan!');
  

  dokumen.value = {
    tajuk: '',
    kategori: '',
    file: null,
  };
  
  
  window.location.reload();

  
  dokumen.value = {
    tajuk: '',
    kategori: '',
    file: null, 
  };
}

function deleteDokumen() {
  dokumen.value = {
    tajuk: '',
    kategori: '',
    file: null,
  };
  alert('Dokumen telah dipadam!');

 
  window.location.reload();
}

function submitDokumen() {
  console.log('Hantar untuk paparan clicked');
}
</script>

<template>
  <div class="layout-empty">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h5 class="title">Dokumen Lampiran</h5>

          <table class="table-custom">
            <tbody>
              <tr>
                <td class="header">Tajuk Dokumen</td>
                <td colspan="2">
                  <input v-model="dokumen.tajuk" type="text" class="input-custom" />
                </td>
              </tr>
              <tr>
                <td class="header">Kategori Dokumen</td>
                <td>
                  <input v-model="dokumen.kategori" type="text" class="input-custom" />
                </td>
                <td>
                  <input
                    type="file"
                    class="input-custom"
                    @change="(e) => dokumen.file = e.target.files[0]"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div class="button-container">
            <button class="btn btn-save" @click="saveDokumen">
              <i class="pi pi-save"></i> 
            </button>
            <button class="btn btn-delete" @click="deleteDokumen">
              <i class="pi pi-trash"></i> 
            </button>
            <button class="btn btn-submit" @click="submitDokumen">
              <i class="pi pi-upload"></i> 
            </button>
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

.title {
  background-color: grey;
  color: white;
  padding: 10px;
  text-align: left;
}

.table-custom {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table-custom td {
  border: 1px solid grey;
  padding: 10px;
}

.header {
  background-color: #d3d3d3;
  font-weight: bold;
}

.input-custom {
  width: 100%;
  padding: 5px;
}

.button-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn {
  padding: 10px;
  font-size: 10px; 
  cursor: pointer;
  border: none;
  border-radius: 5px;
  margin: 0 10px; 
}

.btn-save {
  background-color: #28a745;
  color: white;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-submit {
  background-color: blue;
  color: white;
}
</style>
