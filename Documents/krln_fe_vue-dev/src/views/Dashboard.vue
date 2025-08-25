<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import axios from 'axios';
import { ProductService } from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
const { isDarkTheme } = useLayout();
const baseUrl = import.meta.env.VITE_API_URL;
//Get session PerananID
const PerananID = sessionStorage.getItem('username');
const products = ref(null);
const lineData = reactive({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});
const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
]);
const lineOptions = ref(null);
const productService = new ProductService();
// Permohonan Counts State
const permohonanCounts = reactive({
    baru: 0,
    lebih7Hari: 0,
    lebih14Hari: 0,
    lulus: 0,
    tidakLulus: 0,
    semakanSemula: 0
});
onMounted(() => {
    // Fetch products (original code)
    productService.getProductsSmall().then((data) => (products.value = data));
    //Check user role
    fetchRole();
    // Fetch permohonan counts
    fetchPermohonanCounts();
});
// Fetch Permohonan Counts from the API
const fetchPermohonanCounts = async () => {
    try {
        const response = await axios.get(`${baseUrl}/api/permohonan/permohonanCounts`);
        const { StatusCounts, CountMoreThan7Days, CountMoreThan14Days } = response.data;
        // Map API counts to local state
        permohonanCounts.baru = StatusCounts[2] || 0;
        permohonanCounts.lebih7Hari = CountMoreThan7Days || 0;
        permohonanCounts.lebih14Hari = CountMoreThan14Days || 0;
        permohonanCounts.lulus = StatusCounts[6] || 0;
        permohonanCounts.tidakLulus = StatusCounts[8] || 0;
        permohonanCounts.semakanSemula = StatusCounts[3] || 0;
    } catch (error) {
        console.error('Error fetching permohonanCounts:', error);
    }
};
const fetchRole = async () => {
    try {
        const username = sessionStorage.getItem('username');
        if (username !== null && username !== '') {
            console.log('NoKP found in sessionStorage:', username);
            // You can safely use NoKP here
        } else {
            console.log('NoKP not found in sessionStorage.');
            //
        }
        const response = await axios.post(`${baseUrl}/api/pengguna/getById`, {
            NoKP: username // Example ID, replace with actual logic to get the current user's ID
        });
        const Peranan = response.data.PerananID; // adjust based on your actual response structure
        if (Peranan) {
            sessionStorage.setItem('userRole', Peranan); //Store userRole in sessionStorage
            sessionStorage.removeItem('username'); // Remove username after storing role
        } else {
            console.warn('Role not found in response:', response.data);
        }
    } catch (error) {
        console.error('Error fetching role:', error);
    }
};
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};
const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};
watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
</script>
<template>
    <div class="grid">
        <!-- Permohonan Baru -->
        <div class="col-12 lg:col-12 xl:col-4">
            <div class="card mb-0" style="background-color: #e6f7e6">
                <div class="flex justify-content-between mb-1">
                    <div>
                        <span class="block text-500 font-medium mb-3">Permohonan Baru</span>
                        <div class="text-900 font-medium text-green-500" style="font-size: 2.5rem">
                            {{ permohonanCounts.baru }}
                        </div>
                    </div>
                    <div>
                        <i class="pi pi-inbox text-green-500" style="font-size: 2rem"></i>
                    </div>
                </div>
                <span class="text-500">permohonan</span>
            </div>
        </div>
        <!-- Permohonan Lebih 7 Hari -->
        <div class="col-12 lg:col-12 xl:col-4">
            <div class="card mb-0" style="background-color: #fff8e1">
                <div class="flex justify-content-between mb-1">
                    <div>
                        <span class="block text-500 font-medium mb-3">Permohonan Lebih 7 Hari</span>
                        <div class="text-900 font-medium text-yellow-500" style="font-size: 2.5rem">
                            {{ permohonanCounts.lebih7Hari }}
                        </div>
                        <span class="text-500">permohonan</span>
                    </div>
                    <div>
                        <i class="pi pi-exclamation-circle text-yellow-500" style="font-size: 2rem"></i>
                    </div>
                </div>
            </div>
        </div>
        <!-- Permohonan Lebih 14 Hari -->
        <div class="col-12 lg:col-12 xl:col-4">
            <div class="card mb-0" style="background-color: #ffe1f0">
                <div class="flex justify-content-between mb-1">
                    <div>
                        <span class="block text-500 font-medium mb-3">Permohonan Lebih 14 Hari</span>
                        <div class="text-900 font-medium text-pink-500" style="font-size: 2.5rem">
                            {{ permohonanCounts.lebih14Hari }}
                        </div>
                        <span class="text-500">permohonan</span>
                    </div>
                    <div>
                        <i class="pi pi-bell text-pink-500" style="font-size: 2rem"></i>
                    </div>
                </div>
            </div>
        </div>
        <!-- Lulus -->
        <div class="col-12 lg:col-12 xl:col-4">
            <div class="card mb-0" style="background-color: #e0f2fe">
                <div class="flex justify-content-between mb-1">
                    <div>
                        <span class="block text-500 font-medium mb-3">Lulus</span>
                        <div class="text-900 font-medium text-blue-500" style="font-size: 2.5rem">
                            {{ permohonanCounts.lulus }}
                        </div>
                    </div>
                    <div>
                        <i class="pi pi-send text-blue-500" style="font-size: 2rem"></i>
                    </div>
                </div>
                <span class="text-500">permohonan</span>
            </div>
        </div>
        <!-- Tidak Lulus -->
        <div class="col-12 lg:col-12 xl:col-4">
            <div class="card mb-0" style="background-color: #fdecea">
                <div class="flex justify-content-between mb-1">
                    <div>
                        <span class="block text-500 font-medium mb-3">Tidak Lulus</span>
                        <div class="text-900 font-medium text-red-500" style="font-size: 2.5rem">
                            {{ permohonanCounts.tidakLulus }}
                        </div>
                    </div>
                    <div>
                        <i class="pi pi-ban text-red-500" style="font-size: 2rem"></i>
                    </div>
                </div>
                <span class="text-500">permohonan</span>
            </div>
        </div>
        <!-- Semakan Semula -->
        <div class="col-12 lg:col-12 xl:col-4">
            <div class="card mb-0" style="background-color: #f3e8ff">
                <div class="flex justify-content-between mb-1">
                    <div>
                        <span class="block text-500 font-medium mb-3">Semakan Semula</span>
                        <div class="text-900 font-medium text-purple-500" style="font-size: 2.5rem">
                            {{ permohonanCounts.semakanSemula }}
                        </div>
                    </div>
                    <div>
                        <i class="pi pi-sync text-purple-500" style="font-size: 2rem"></i>
                    </div>
                </div>
                <span class="text-500">permohonan</span>
            </div>
        </div>
    </div>
</template>
