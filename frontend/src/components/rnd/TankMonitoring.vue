<template>
    <div class="space-y-6 animate-fade-in w-full text-slate-700">

        <!-- ========================================== -->
        <!-- BARIS KARTU RINGKASAN SALDO PER TANGKI     -->
        <!-- ========================================== -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <!-- Tangki A -->
            <div
                class="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm flex items-center justify-between">
                <div class="space-y-1">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Saldo Tangki A</span>
                    <h3 class="text-2xl font-black text-slate-800">{{ totalTangkiA.toFixed(2) }} <span
                            class="text-xs font-medium text-slate-400">Kg</span></h3>
                    <p class="text-[10px] text-slate-400 font-medium">Wadah Utama Hasil Produksi</p>
                </div>
                <div
                    class="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-700">
                    <i class="pi pi-database text-lg"></i>
                </div>
            </div>

            <!-- Tangki B -->
            <div
                class="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm flex items-center justify-between">
                <div class="space-y-1">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Saldo Tangki B</span>
                    <h3 class="text-2xl font-black text-slate-800">{{ totalTangkiB.toFixed(2) }} <span
                            class="text-xs font-medium text-slate-400">Kg</span></h3>
                    <p class="text-[10px] text-slate-400 font-medium">Wadah Cadangan Pabrik</p>
                </div>
                <div
                    class="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-700">
                    <i class="pi pi-database text-lg"></i>
                </div>
            </div>

            <!-- Tangki C -->
            <div
                class="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm flex items-center justify-between">
                <div class="space-y-1">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Saldo Tangki C</span>
                    <h3 class="text-2xl font-black text-slate-800">{{ totalTangkiC.toFixed(2) }} <span
                            class="text-xs font-medium text-slate-400">Kg</span></h3>
                    <p class="text-[10px] text-slate-400 font-medium">Penyimpanan Formula Khusus</p>
                </div>
                <div
                    class="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-700">
                    <i class="pi pi-database text-lg"></i>
                </div>
            </div>

        </div>

        <!-- ========================================== -->
        <!-- CARD TABLE: RINCIAN SALDO CAIRAN           -->
        <!-- ========================================== -->
        <div class="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div class="flex items-center gap-3">
                    <h3 class="text-base font-bold text-slate-800 tracking-tight">Rincian Saldo Inventaris Cairan (WIP)
                    </h3>
                    <span
                        class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wide">Merekam
                        Hasil Filling</span>
                </div>

                <!-- Filter Pencarian Mandiri -->
                <div class="relative flex items-center">
                    <i class="pi pi-search absolute left-3.5 text-slate-400 text-xs"></i>
                    <InputText v-model="filters['global'].value" placeholder="Cari nama produk cairan..."
                        class="!pl-9 !py-2 !pr-4 !rounded-xl !bg-slate-50 !border-none text-xs font-medium w-60 lg:w-72 shadow-inner" />
                </div>
            </div>

            <!-- Data Table Inventaris Saldo -->
            <div class="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <DataTable v-model:filters="filters" :value="saldoList" :globalFilterFields="['nama', 'tangki']"
                    responsiveLayout="scroll" class="p-datatable-tight" :paginator="true" :rows="10">
                    <!-- Nama Cairan -->
                    <Column field="nama" header="Nama Produk Cairan" :sortable="true"
                        style="width: 40%; font-weight: bold; color: #1e293b;"></Column>

                    <!-- Metode Olah -->
                    <Column field="sumber" header="Metode Pengolahan" style="width: 20%; text-align: center;">
                        <template #body="{ data }">
                            <span class="px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider"
                                :class="data.sumber === 'MIXING' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50' : 'bg-amber-50 text-amber-600 border border-amber-100/50'">
                                {{ data.sumber }}
                            </span>
                        </template>
                    </Column>

                    <!-- Posisi Tangki -->
                    <Column field="tangki" header="Lokasi Tangki" :sortable="true"
                        style="width: 20%; text-align: center;">
                        <template #body="{ data }">
                            <span
                                class="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200/40">
                                {{ formatTangkiName(data.tangki) }}
                            </span>
                        </template>
                    </Column>

                    <!-- Saldo Berat (Kg) -->
                    <Column field="stok" header="Saldo Volume Tersedia" :sortable="true"
                        style="width: 20%; text-align: right;">
                        <template #body="{ data }">
                            <span class="text-sm font-black text-emerald-600">
                                {{ parseFloat(data.stok).toFixed(2) }} <span
                                    class="text-[10px] font-normal text-slate-400">Kg</span>
                            </span>
                        </template>
                    </Column>

                    <!-- Template Jika Kosong -->
                    <template #empty>
                        <div class="text-center py-16">
                            <i class="pi pi-exclamation-triangle text-3xl text-slate-300 mb-3 block"></i>
                            <p class="text-slate-400 text-xs font-bold">Belum ada saldo cairan. Silakan lakukan proses
                                Filling terlebih dahulu.</p>
                        </div>
                    </template>

                </DataTable>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { FilterMatchMode } from '@primevue/core/api'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const saldoList = ref([])

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// Mengambil data akumulasi saldo tangki
const loadSaldoTangki = () => {
    const dataLokal = JSON.parse(localStorage.getItem('mock_produkTangki')) || []
    saldoList.value = dataLokal
}

// Komputasi Total Saldo Per Wadah untuk Kartu Ringkasan
const totalTangkiA = computed(() => {
    return saldoList.value.filter(t => t.tangki === 'TANGKI_A').reduce((sum, item) => sum + parseFloat(item.stok || 0), 0)
})

const totalTangkiB = computed(() => {
    return saldoList.value.filter(t => t.tangki === 'TANGKI_B').reduce((sum, item) => sum + parseFloat(item.stok || 0), 0)
})

const totalTangkiC = computed(() => {
    return saldoList.value.filter(t => t.tangki === 'TANGKI_C').reduce((sum, item) => sum + parseFloat(item.stok || 0), 0)
})

const formatTangkiName = (slug) => {
    if (!slug) return '-'
    return slug.replace('_', ' ')
}

onMounted(() => {
    loadSaldoTangki()
})
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

:deep(.p-datatable-tight .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    color: #64748b;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e2e8f0;
}

:deep(.p-datatable-tight .p-datatable-tbody > tr > td) {
    padding: 0.65rem 1rem;
    border-bottom: 1px solid #f1f5f9;
}
</style>