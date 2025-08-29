<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const gender = ref(null);
const hpNumber = ref('');
const jawatan = ref('');
const jabatan = ref(null);
const icType = ref(null);
const icNumber = ref('');
const username = ref('');
const dropdownValues = ref([]);
const baseUrl = import.meta.env.VITE_API_URL

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  hpNumber: '',
  jawatan: '',
  jabatan: '',
  icType: '',
  icNumber: '',
  username: '',
  program: ''
});
const isSubmitting = ref(false);
const isSuccess = ref(false);


const fetchDropdownValues = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/bahagian`);
    dropdownValues.value = response.data
      .map(item => ({
        name: item.BUTitle1,
        code: item.BUOrgChart1
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching dropdown values:', error);
  }
};


const program = ref([]);
const programOptions = ref([
  { label: 'Aktiviti Darat', value: 'Aktiviti Darat' },
  { label: 'Aktiviti Maritim', value: 'Aktiviti Maritim' },
  { label: 'Aktiviti Pertahanan Udara', value: 'Aktiviti Pertahanan Udara' },
  { label: 'Aktiviti Pengurusan Am', value: 'Aktiviti Pengurusan Am' },
  { label: 'Aktiviti Bantuan Bersama', value: 'Aktiviti Bantuan Bersama' }
]);

const resetForm = () => {
  name.value = '';
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
  gender.value = null;
  hpNumber.value = '';
  jawatan.value = '';
  jabatan.value = null;
  icType.value = null;
  icNumber.value = '';
  username.value = '';
  program.value = [];
  errors.value = {};
  isSuccess.value = false;
};


const validateForm = () => {
  errors.value = {};
  let isValid = true;

  
  if (!name.value) {
    errors.value.name = 'Nama diperlukan';
    isValid = false;
  }

  
  if (!email.value) {
    errors.value.email = 'Emel diperlukan';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Emel mesti sah';
    isValid = false;
  }

  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!password.value) {
    errors.value.password = 'Kata laluan diperlukan';
    isValid = false;
  } else if (!passwordRegex.test(password.value)) {
    errors.value.password = 'Kata laluan mesti mempunyai sekurang-kurangnya 8 aksara, huruf besar, huruf kecil, dan aksara khas';
    isValid = false;
  }

  
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Kata laluan tidak sepadan';
    isValid = false;
  }


  if (!hpNumber.value) {
    errors.value.hpNumber = 'Nombor HP diperlukan';
    isValid = false;
  }

 
  if (!jawatan.value) {
    errors.value.jawatan = 'Jawatan diperlukan';
    isValid = false;
  }

 
  if (!jabatan.value) {
    errors.value.jabatan = 'Jabatan/Bahagian diperlukan';
    isValid = false;
  }

  
  if (!gender.value) {
    errors.value.gender = 'Jantina diperlukan';
    isValid = false;
  }

  
  if (!icType.value) {
    errors.value.icType = 'Jenis Kad Pengenalan diperlukan';
    isValid = false;
  }


  if (!icNumber.value) {
    errors.value.icNumber = 'Nombor Kad Pengenalan diperlukan';
    isValid = false;
  }

  
  if (program.value.length === 0) {
    errors.value.program = 'Program diperlukan';
    isValid = false;
  }

  return isValid;
};




const checkExistingUser = async () => {
  if (icNumber.value.trim() !== '') {
    try {
      const response = await axios.post(`${baseUrl}/api/keycloak/user`, {
        search: icNumber.value
      });

      if (response.data.success && response.data.data.length > 0) {
        errors.value.icNumber = 'Pengguna ini sudah wujud';
        username.value = '';
      } else {
        errors.value.icNumber = '';
        username.value = icNumber.value;
      }
    } catch (error) {
      errors.value.icNumber = 'Ralat semasa menyemak pengguna';
    }
  } else {
    errors.value.icNumber = '';
  }
};


watch(icNumber, () => {
  checkExistingUser();
  if (icNumber.value) errors.value.icNumber = '';
});


const submitForm = async () => {
  if (validateForm()) {
    isSubmitting.value = true;
    try {
      const formData = {
        username: username.value,
        name: name.value,
        email: email.value,
        password: password.value,
        gender: gender.value,
        hpNumber: hpNumber.value,
        jawatan: jawatan.value,
        jabatan: jabatan.value,
        icType: icType.value,
        icNumber: icNumber.value,
        program: program.value
      };

      console.log('Form Data:', formData);
      
      
      alert('Pendaftaran berjaya!'); 

      resetForm();
    } catch (error) {
      console.log('Error submitting form:', error);
    } finally {
      isSubmitting.value = false;
    }
  }
};

onMounted(() => {
  fetchDropdownValues();
});
</script>



<template>
  <div class="grid p-fluid justify-content-center">
    <div class="col-12 md:col-8 lg:col-6">
      <div class="card p-fluid form-card">
        <h5 class="text-center">Daftar Pengguna Baru</h5>

        <TabView>
          <TabPanel header="Maklumat Pengguna">
            <div class="formgrid grid">
              
              <div class="field col-12">
                <label for="name">Nama Penuh</label>
                <InputText id="name" v-model="name" type="text" />
                <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
              </div>

              
              <div class="field col-12">
                <label for="email">Emel</label>
                <InputText id="email" v-model="email" type="email" />
                <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
              </div>

              
              <div class="field col-12">
                <label for="icType">Jenis Kad Pengenalan</label>
                <Dropdown id="icType" v-model="icType" :options="['MyKad', 'MyPR', 'MyKAS', 'MyTentera']" placeholder="Pilih Jenis KP" />
                <small v-if="errors.icType" class="p-error">{{ errors.icType }}</small>
              </div>

              
              <div class="field col-12">
                <label for="icNumber">Nombor Kad Pengenalan</label>
                <InputText id="icNumber" v-model="icNumber" type="text" :maxlength="icType === 'MyTentera' ? 7 : 12" :disabled="!icType" />
                <small v-if="errors.icNumber" class="p-error">{{ errors.icNumber }}</small>
              </div>

              <div class="field col-12">
                <label for="username">Username</label>
                <InputText id="username" v-model="username" type="text" disabled />
                <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
              </div>
              
              <div class="field col-12">
                <label for="gender">Jantina</label>
                <Dropdown id="gender" v-model="gender" :options="[{ label: 'Lelaki', value: 'Lelaki' }, { label: 'Perempuan', value: 'Perempuan' }]" optionLabel="label" placeholder="Pilih Jantina" />
                <small v-if="errors.gender" class="p-error">{{ errors.gender }}</small>
              </div>

             
              <div class="field col-12">
                <label for="hpNumber">Nombor HP</label>
                <InputText id="hpNumber" v-model="hpNumber" type="text" />
                <small v-if="errors.hpNumber" class="p-error">{{ errors.hpNumber }}</small>
              </div>


              <div class="field col-12">
                <label for="password">Kata Laluan</label>
                <Password id="password" v-model="password" feedback="false" toggleMask />
                <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
              </div>

             
              <div class="field col-12">
                <label for="confirmPassword">Pengesahan Kata Laluan</label>
                <Password id="confirmPassword" v-model="confirmPassword" feedback="false" toggleMask />
                <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
              </div>

              
              <div class="field col-12">
                <label for="jawatan">Jawatan</label>
                <InputText id="jawatan" v-model="jawatan" type="text" />
                <small v-if="errors.jawatan" class="p-error">{{ errors.jawatan }}</small>
              </div>

              
              <div class="field col-12">
                <label for="jabatan">Jabatan/Bahagian</label>
                <Dropdown id="jabatan" v-model="jabatan" :options="dropdownValues" optionLabel="name" filter showClear placeholder="Pilih Jabatan/Bahagian" />
                <small v-if="errors.jabatan" class="p-error">{{ errors.jabatan }}</small>
              </div>

              <div class="field col-12"> 
                <label for="program">Program</label>
                <MultiSelect id="program" v-model="program" :options="programOptions"  optionLabel="label" placeholder="Pilih Program" display="chip" />
                <small v-if="errors.program" class="p-error">{{ errors.program }}</small>
              </div>


             
              <div class="field col-12 button-group">
                
                <Button 
                  icon="pi pi-send" 
                  @click="submitForm" 
                  :loading="isSubmitting" 
                  class="p-button-success p-button-lg p-button-rounded" 
                  iconPos="left"/>
               
                <Button 
                  icon="pi pi-times" 
                  @click="resetForm" 
                  class="p-button-danger p-button-lg p-button-rounded batal-button" 
                  iconPos="left"
                  
                />
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
</template>

<style scoped>
.p-error {
  color: red;
}


.grid {
  min-height: 100vh; 
  display: flex;
  align-items: center; 
}


.form-card {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


.button-group {
  display: flex;
  justify-content: center; 
  gap: 20px; 
  margin-top: 20px; 
}


.batal-button {
  background-color: #f44336;
  border-color: #f44336;
}

.batal-button:hover {
  background-color: #d32f2f;
  border-color: #d32f2f;
}


.text-center {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
