<script setup>
import { ref } from 'vue'
import FormPengirimanCustomer from './FormPengirimanCustomer.vue'

const customerDeliveries = ref([
    { id: 'TRX-CUS-001', customer: 'Budi Santoso', address: 'Jl. Melati No. 15, Jakarta Selatan', courier: 'Andi (Motor)', status: 'Dalam Perjalanan' },
    { id: 'TRX-CUS-002', customer: 'Siti Aminah', address: 'Komp. Mawar Blok B/4, Bandung', courier: 'Menunggu Alokasi', status: 'Menunggu Kurir' },
])

const searchQuery = ref('')
const showModal = ref(false)


const handleSaveDelivery = (newData) => {
    customerDeliveries.value.unshift(newData)
    showModal.value = false
}


const getStatusBadge = (status) => {
    switch (status) {
        case 'Terkirim': return 'bg-emerald-100 text-emerald-700'
        case 'Dalam Perjalanan': return 'bg-blue-100 text-blue-700'
        case 'Menunggu Kurir': return 'bg-amber-100 text-amber-700'
        default: return 'bg-slate-100 text-slate-700'
    }
}
</script>

<template>
    <div class="space-y-6 animate-fade-in relative">

        <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-slate-200/60 rounded-2xl shadow-sm">
            <div class="relative w-full sm:w-96">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input type="text" v-model="searchQuery" placeholder="Cari ID resi atau nama customer..."
                    class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-700 placeholder-slate-400" />
            </div>

            <button @click="showModal = true"
                class="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-2">
                <i class="pi pi-plus"></i>
                <span>Buat Pengiriman Baru</span>
            </button>
        </div>

        <div class="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                        <tr>
                            <th class="px-6 py-4 font-semibold">ID Resi</th>
                            <th class="px-6 py-4 font-semibold">Nama Customer</th>
                            <th class="px-6 py-4 font-semibold">Alamat Tujuan</th>
                            <th class="px-6 py-4 font-semibold">Kurir</th>
                            <th class="px-6 py-4 font-semibold">Status</th>
                            <th class="px-6 py-4 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="item in customerDeliveries" :key="item.id"
                            class="hover:bg-slate-50/50 transition-colors">
                            <td class="px-6 py-4 font-bold text-slate-800">{{ item.id }}</td>
                            <td class="px-6 py-4 font-medium">{{ item.customer }}</td>
                            <td class="px-6 py-4 truncate max-w-xs" :title="item.address">{{ item.address }}</td>
                            <td class="px-6 py-4">{{ item.courier }}</td>
                            <td class="px-6 py-4">
                                <span :class="getStatusBadge(item.status)"
                                    class="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap">
                                    {{ item.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <button
                                    class="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center mx-auto"
                                    title="Detail">
                                    <i class="pi pi-eye"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <FormPengirimanCustomer v-if="showModal" @close="showModal = false" @save="handleSaveDelivery" />

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