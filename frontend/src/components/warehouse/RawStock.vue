<template>
    <div class="space-y-6 sm:space-y-10 animate-fade-in w-full overflow-hidden max-w-full">

        <div class="bg-white border border-slate-200 rounded-[24px] p-4 sm:p-8 shadow-sm w-full overflow-hidden">

            <div
                class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-50 gap-4">
                <div class="flex items-center gap-3 sm:gap-4">
                    <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
                    <h3 class="text-base sm:text-lg font-bold text-slate-800">Daftar Stok Bahan Baku (Gudang)</h3>
                </div>

                <div class="relative flex items-center group w-full sm:w-auto">
                    <i
                        class="pi pi-search absolute left-4 text-slate-400 group-focus-within:text-amber-500 transition-colors"></i>
                    <InputText v-model="filters['global'].value" placeholder="Cari nama atau kemasan..."
                        class="!pl-12 !py-3 !rounded-xl !bg-slate-50 !border-none shadow-sm focus:!ring-2 focus:!ring-amber-500/20 w-full sm:w-64 lg:w-80 transition-all font-medium text-sm" />
                </div>
            </div>

            <div class="w-full overflow-x-auto custom-scrollbar pb-2">
                <DataTable v-model:filters="filters" :value="stokBahanBakuList"
                    :globalFilterFields="['nama_bahan', 'packaging']" class="p-datatable-modern"
                    responsiveLayout="scroll" :paginator="true" :rows="10" :loading="isLoading"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Menampilkan {first} - {last} dari {totalRecords} item">

                    <Column field="nama_bahan" header="Nama Bahan / Item" :sortable="true" class="min-w-[200px]">
                        <template #body="slotProps">
                            <span class="font-bold text-slate-800">{{ slotProps.data.nama_bahan }}</span>
                        </template>
                    </Column>

                    <Column field="packaging" header="Packaging" :sortable="true" class="min-w-[150px]">
                        <template #body="slotProps">
                            <span
                                class="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-200">
                                {{ slotProps.data.packaging }}
                            </span>
                        </template>
                    </Column>

                    <Column field="total_unit" header="Total Unit" :sortable="true" class="min-w-[120px]">
                        <template #body="slotProps">
                            <span class="font-semibold text-slate-600">{{ slotProps.data.total_unit }}</span>
                        </template>
                    </Column>

                    <Column field="total_quantity" header="Tonase (Kg)" :sortable="true" class="min-w-[150px]">
                        <template #body="slotProps">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-database text-amber-500/70"></i>
                                <span class="font-black text-slate-800">{{ (slotProps.data.total_quantity ||
                                    0).toLocaleString('id-ID') }} <span
                                        class="text-xs text-slate-400 font-medium">kg</span></span>
                            </div>
                        </template>
                    </Column>

                    <template #empty>
                        <div class="text-center py-20">
                            <i class="pi pi-box text-4xl text-slate-200 mb-4 block"></i>
                            <p class="text-slate-400 font-medium">Bahan baku tidak ditemukan atau stok kosong.</p>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>

    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useMobile } from '@/utils/useMobile'
const { isMobile } = useMobile()

import { useStockRaw } from '@/composables/useStockRaw'

const {
    isLoading,
    stokBahanBakuList,
    filters,
    fetchStokBahanBaku
} = useStockRaw()

onMounted(() => {
    fetchStokBahanBaku()
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
    font-weight: 700;
    font-size: 0.875rem;
    padding: 1rem 1.5rem;
    border-bottom: 2px solid #f1f5f9;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    color: #475569;
    font-size: 0.875rem;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
    background-color: #f8fafc;
}

/* [UBAH] Penambahan scrollbar custom agar seragam dengan aplikasi lainnya */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background-color: #94a3b8;
}
</style>