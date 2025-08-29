<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';

const { layoutConfig } = useLayout();
const router = useRouter();

const username = ref('');
const password = ref('');
const logoUrl = computed(() => `/layout/images/${layoutConfig.darkTheme.value ? 'logo-1' : 'logo-1'}.png`);
const errorMessage = ref('');

// Hardcoded users
const users = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'user123' }
];

const handleLogin = () => {
  const user = users.find(u => u.username === username.value && u.password === password.value);

  if (user) {
    console.log("Logged in as:", user.username);
    errorMessage.value = '';
    router.push('/dashboard');
  } else {
    console.log('login failed');
    errorMessage.value = 'Nama pengguna atau kata laluan salah.';
  }
};
</script>

<template> 
  <div class="login-page">
    <div class="login-container">
      
      <img :src="logoUrl" alt="KLRN Logo" class="login-logo" />

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder="Masukkan Pengguna"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Masukkan Kata Laluan"
          />
        </div>
  <!-- Error message -->
  <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; 
  background-color: #f0f2f5; 
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.login-logo {
  margin-bottom: 1.5rem;
  width: 150px; 
}

.form-group {
  width: 100%;
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #ef4444;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
