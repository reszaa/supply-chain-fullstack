<template>
    <div class="space-y-10 animate-fade-in w-full">

        <div class="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm">
            <div class="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                <div class="flex items-center gap-4">
                    <div class="w-2 h-6 bg-emerald-600 rounded-full"></div>
                    <h3 class="text-lg font-bold text-slate-800">Daftar Stok Pabrik - PT</h3>
                </div>

                <div class="relative flex items-center group">
                    <i
                        class="pi pi-search absolute left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors"></i>
                    <InputText v-model="filters['global'].value" placeholder="Cari nama barang..."
                        class="!pl-12 !py-3 !rounded-xl !bg-slate-50 !border-none shadow-sm focus:!ring-2 focus:!ring-emerald-500/20 w-64 lg:w-80 transition-all font-medium" />
                </div>
            </div>

            <DataTable v-model:filters="filters" :value="stokList" :globalFilterFields="['nama_item']"
                class="p-datatable-modern" responsiveLayout="scroll" :paginator="true" :rows="10">
                <Column field="nama_item" header="Nama Item" :sortable="true"
                    style="width: 25%; font-weight: bold; color: #334155;"></Column>
                <Column field="pcs" header="PCS" style="text-align: center; font-weight: 600;"></Column>
                <Column field="galon" header="GALON" style="text-align: center; font-weight: 600;"></Column>
                <Column field="dus" header="DUS" style="text-align: center; font-weight: 600;"></Column>
                <Column field="pail_20kg" header="PAIL 20KG" style="text-align: center; font-weight: 600;"></Column>
                <Column field="pail_25kg" header="PAIL 25KG" style="text-align: center; font-weight: 600;"></Column>
                <Column field="pail_30kg" header="PAIL 30KG" style="text-align: center; font-weight: 600;"></Column>
                <Column field="terakhir_update" header="Terakhir Update"
                    style="text-align: right; color: #94a3b8; font-size: 0.75rem;"></Column>

                <template #empty>
                    <div class="text-center py-20">
                        <i class="pi pi-box text-4xl text-slate-200 mb-4 block"></i>
                        <p class="text-slate-400 font-medium">Data stok PT kosong atau barang tidak ditemukan.</p>
                    </div>
                </template>
            </DataTable>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { FilterMatchMode } from '@primevue/core/api'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const stokList = ref([])
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// MENGAMBIL DATA DARI LOCAL STORAGE (Mockup)
const fetchStokPT = () => {
    const dataLokal = JSON.parse(localStorage.getItem('mock_stokPT')) || []
    stokList.value = dataLokal
}

onMounted(() => {
    fetchStokPT()
})
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
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

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    color: #64748b;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 1.25rem 1rem;
    border-bottom: 1px solid #e2e8f0;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
}
</style>