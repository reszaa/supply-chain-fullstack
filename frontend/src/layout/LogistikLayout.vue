<script setup>
import { ref } from 'vue'

// Import komponen anak sesuai dengan struktur folder aslimu
import DashboardTo from '../components/logistic/DashboardTo.vue'
import GoToCustomer from '../components/logistic/GoToCustomer.vue'
import GotoRetail from '../components/logistic/GotoRetail.vue'
import MasterKurir from '../components/logistic/MasterKurir.vue'
const activeTab = ref('dashboard')

const switchTab = (tab) => {
    activeTab.value = tab
}
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex font-sans">
        <aside
            class="w-24 bg-white border border-slate-200/60 text-slate-600 flex flex-col fixed h-[calc(100vh-3rem)] top-6 left-6 rounded-[2rem] shadow-xl shadow-slate-200/50 z-50 overflow-hidden">

            <div class="h-24 flex items-center justify-center border-b border-slate-100/80 shrink-0">
                <router-link to="/"
                    class="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer">
                    <span class="text-white font-black text-xl tracking-tighter">PR</span>
                </router-link>
            </div>

            <nav class="flex-1 flex flex-col items-center gap-4 py-8 overflow-y-auto custom-scrollbar">

                <button @click="switchTab('dashboard')"
                    class="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group"
                    :class="activeTab === 'dashboard' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'">
                    <i class="pi pi-chart-bar text-xl transition-transform group-hover:scale-110"></i>
                    <span
                        class="absolute left-16 bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg transition-opacity">
                        Dashboard Logistik
                    </span>
                </button>

                <button @click="switchTab('customer')"
                    class="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group"
                    :class="activeTab === 'customer' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'">
                    <i class="pi pi-users text-xl transition-transform group-hover:scale-110"></i>
                    <span
                        class="absolute left-16 bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg transition-opacity">
                        Pengiriman Customer
                    </span>
                </button>

                <button @click="switchTab('retail')"
                    class="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group"
                    :class="activeTab === 'retail' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'">
                    <i class="pi pi-shop text-xl transition-transform group-hover:scale-110"></i>
                    <span
                        class="absolute left-16 bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg transition-opacity">
                        Pengiriman Retail
                    </span>
                </button>
                <button @click="switchTab('kurir')"
                    class="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group"
                    :class="activeTab === 'kurir' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'">
                    <i class="pi pi-id-card text-xl transition-transform group-hover:scale-110"></i>
                    <span
                        class="absolute left-16 bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg transition-opacity">
                        Akun & Armada Kurir
                    </span>
                </button>
            </nav>

            <div class="h-24 flex items-center justify-center border-t border-slate-100/80 shrink-0">
                <div
                    class="w-11 h-11 bg-slate-100 border-2 border-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:ring-2 hover:ring-slate-200 transition-all">
                    <span class="text-slate-600 font-bold text-sm">AL</span>
                </div>
            </div>
        </aside>

        <main class="flex-1 ml-[136px] p-8 h-screen overflow-y-auto custom-scrollbar">
            <div class="mb-8">
                <div v-if="activeTab === 'dashboard'">
                    <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Logistik</h1>
                    <p class="text-slate-500 mt-1">Ringkasan aktivitas dan metrik pengiriman Pracindo.</p>
                </div>
                <div v-else-if="activeTab === 'customer'">
                    <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Pengiriman ke Customer</h1>
                    <p class="text-slate-500 mt-1">Manajemen rute dan status pengiriman ke pelanggan langsung (B2C).</p>
                </div>
                <div v-else-if="activeTab === 'retail'">
                    <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Pengiriman ke Retail</h1>
                    <p class="text-slate-500 mt-1">Manajemen distribusi barang ke titik-titik toko/retail (B2B).</p>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 min-h-[70vh]">
                <DashboardTo v-if="activeTab === 'dashboard'" />
                <GoToCustomer v-else-if="activeTab === 'customer'" />
                <GotoRetail v-else-if="activeTab === 'retail'" />
                <MasterKurir v-else-if="activeTab === 'kurir'" />
            </div>
        </main>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}
</style>