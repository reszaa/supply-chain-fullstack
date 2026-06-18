<script setup>
import { ref } from 'vue'

// Data Dummy untuk Kartu Statistik
const logisticStats = ref([
    {
        id: 1,
        title: 'Total Pengiriman',
        value: '1,248',
        desc: 'Sepanjang bulan ini',
        icon: 'pi-box',
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        id: 2,
        title: 'Sedang Berjalan',
        value: '34',
        desc: 'Dalam rute pengiriman',
        icon: 'pi-truck',
        color: 'text-amber-600',
        bg: 'bg-amber-50'
    },
    {
        id: 3,
        title: 'Selesai Terkirim',
        value: '1,180',
        desc: 'Telah diterima pelanggan',
        icon: 'pi-check-circle',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
    }
])

// Data Dummy untuk Tabel Aktivitas Terkini
const recentShipments = ref([
    { id: 'DO-2610-001', destination: 'PT Maju Terus', type: 'Retail (B2B)', status: 'In Transit', driver: 'Andi Santoso' },
    { id: 'DO-2610-002', destination: 'Budi (Perorangan)', type: 'Customer (B2C)', status: 'Delivered', driver: 'Bambang' },
    { id: 'DO-2610-003', destination: 'Toko Makmur Jaya', type: 'Retail (B2B)', status: 'Processing', driver: 'Menunggu Alokasi' },
    { id: 'DO-2610-004', destination: 'CV Karya Bersama', type: 'Retail (B2B)', status: 'In Transit', driver: 'Andi Santoso' },
])

// Fungsi utilitas untuk warna badge status
const getStatusBadge = (status) => {
    switch (status) {
        case 'Delivered': return 'bg-emerald-100 text-emerald-700'
        case 'In Transit': return 'bg-blue-100 text-blue-700'
        case 'Processing': return 'bg-amber-100 text-amber-700'
        default: return 'bg-slate-100 text-slate-700'
    }
}
</script>

<template>
    <div class="space-y-8 animate-fade-in">

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="stat in logisticStats" :key="stat.id"
                class="bg-white border border-slate-200/60 rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                <div :class="[stat.bg, stat.color]"
                    class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                    <i :class="['pi', stat.icon, 'text-2xl']"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-slate-500">{{ stat.title }}</p>
                    <h3 class="text-3xl font-bold text-slate-800 mt-1">{{ stat.value }}</h3>
                    <p class="text-xs text-slate-400 mt-1">{{ stat.desc }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
            <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h2 class="text-lg font-bold text-slate-800">Aktivitas Pengiriman Terkini</h2>
                <button class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Lihat
                    Semua</button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                        <tr>
                            <th class="px-6 py-4 font-semibold">Nomor DO</th>
                            <th class="px-6 py-4 font-semibold">Tujuan</th>
                            <th class="px-6 py-4 font-semibold">Tipe Pengiriman</th>
                            <th class="px-6 py-4 font-semibold">Kurir / Supir</th>
                            <th class="px-6 py-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="item in recentShipments" :key="item.id"
                            class="hover:bg-slate-50/50 transition-colors">
                            <td class="px-6 py-4 font-medium text-slate-800">{{ item.id }}</td>
                            <td class="px-6 py-4">{{ item.destination }}</td>
                            <td class="px-6 py-4">
                                <span class="text-xs font-medium text-slate-500">{{ item.type }}</span>
                            </td>
                            <td class="px-6 py-4">{{ item.driver }}</td>
                            <td class="px-6 py-4">
                                <span :class="getStatusBadge(item.status)"
                                    class="px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                                    {{ item.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>