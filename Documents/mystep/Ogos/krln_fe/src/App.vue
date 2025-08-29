<script setup>
const isDevelopment = import.meta.env.VITE_APP_MODE === 'development';
</script>

<template>
    <div v-if="isDevelopment" class="dev-overlay">Development Server</div>
    <router-view />
</template>

<style scoped>
.dev-overlay {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: red;
    color: white;
    padding: 5px 15px;
    font-size: 14px;
    font-weight: bold;
    z-index: 9999; /* Ensure it appears on top of other elements */
    border-radius: 5px;
}
</style>
