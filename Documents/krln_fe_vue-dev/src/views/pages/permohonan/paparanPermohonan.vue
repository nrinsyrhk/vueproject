<script setup>
import { useRoute } from 'vue-router'; // Import useRoute instead of useRouter
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
const route = useRoute(); // Get the current route
const baseUrl = import.meta.env.VITE_API_URL;
const MohonID = route.params.id; // Extract the MohonID from the route params
const loading = ref(true);
onMounted(() => {
    console.log('Permohonan ID:', MohonID); // Log the Permohonan ID when the component is mounted
    fetchMohonID();
});
const permohonan = ref({
    Nama: '',
    Tujuan: '',
    KategoriProgramID: '',
    Kekerapan: '',
    TkhMula: null,
    TkhTamat: null,
    Tempoh: null,
    KatPesertaID: '',
    JenisKhidmatID: '',
    NegaraID: '',
    Tempat: '',
    Kedutaan: '',
    LulusKDN: '',
    Faedah: ''
});
const form = ref({
    kewMohon: '',
    PengesahanRP: '',
    tarikhbakiPKLN: null,
    bakiPKLN: '',
    kewSah: '',
    bakiPTJ: '',
    tanggunganOleh: '',
    ulasan: '',
    tajaanperinci: '',
    tajaanoleh: '',
    MohonID: MohonID
});
async function fetchMohonID() {
    try {
        const response = await axios.post(`${baseUrl}/api/permohonan/getById`, {
            MohonID: MohonID // Use MohonID from the route params in the request body
        });
        if (response.data && response.data.length > 0) {
            const permohonan = response.data[0]; // Access the first element of the array
            // Log the fetched permohonan for debugging
            // Map response permohonan to permohonan
            permohonan.value = {
                Nama: permohonan.Nama,
                Tujuan: permohonan.Tujuan,
                KategoriProgramID: permohonan.KategoriProgramID,
                Kekerapan: permohonan.Kekerapan,
                TkhMula: permohonan.TkhMula ? new Date(permohonan.TkhMula) : null, // Ensure valid Date object
                TkhTamat: permohonan.TkhTamat ? new Date(permohonan.TkhTamat) : null, // Ensure valid Date object
                Tempoh: permohonan.Tempoh,
                KatPesertaID: permohonan.KatPesertaID,
                JenisKhidmatID: permohonan.JenisKhidmatID,
                NegaraID: permohonan.NegaraID,
                Tempat: permohonan.Tempat,
                Kedutaan: permohonan.Kedutaan,
                LulusKDN: permohonan.LulusKDN,
                Faedah: permohonan.Faedah
            };
            console.log("Added permohonan",permohonan);
        } else {
            console.error('No permohonan found for the provided MohonID.');
        }
    } catch (err) {
        console.error('Failed to load permohonan permohonan', err.response?.permohonan || err);
    } finally {
        loading.value = false;
    }
}
</script>
<template>
    <h5>Paparan Permohonan ( Kod Mohon : {{ MohonID }} )</h5>
    <template>
  <div class="max-w-4xl mx-auto p-6">
    <h5 class="text-xl font-semibold mb-4 text-center text-gray-700">
      Paparan Permohonan <span class="text-blue-600 font-bold">(Kod Mohon: {{ MohonID }})</span>
    </h5>
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 border-b pb-2">Maklumat Program</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        <FormRow label="📝 Nama" :value="permohonan.Nama" />
        <FormRow label="🎯 Tujuan" :value="permohonan.Tujuan" />
        <FormRow label="📂 Kategori Program" :value="permohonan.KategoriProgramID" />
        <FormRow label="🔁 Kekerapan" :value="permohonan.Kekerapan" />
        <FormRow label="📅 Tarikh Mula" :value="permohonan.TkhMula" />
        <FormRow label="📅 Tarikh Tamat" :value="permohonan.TkhTamat" />
        <FormRow label="⏳ Tempoh" :value="permohonan.Tempoh" />
        <FormRow label="👥 Kategori Peserta" :value="permohonan.KatPesertaID" />
        <FormRow label="🛠️ Jenis Khidmat" :value="permohonan.JenisKhidmatID" />
        <FormRow label="🌍 Negara" :value="permohonan.NegaraID" />
        <FormRow label="📍 Tempat" :value="permohonan.Tempat" />
        <FormRow label="🏛️ Kedutaan" :value="permohonan.Kedutaan" />
        <FormRow label="✅ Lulus KDN" :value="permohonan.LulusKDN" />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-1">🎁 Faedah</label>
        <div class="bg-gray-100 p-4 rounded-md text-gray-800 whitespace-pre-line">
          {{ permohonan.Faedah || '-' }}
        </div>
      </div>
    </div>
  </div>
</template>
</template>
<style scoped>
.card {
    margin: 1rem;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
}
</style>