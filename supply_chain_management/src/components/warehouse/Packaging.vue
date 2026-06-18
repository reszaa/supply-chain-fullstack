<template>
    <div class="space-y-10 animate-fade-in w-full">

        <div class="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm">
            <div class="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                <div class="flex items-center gap-4">
                    <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
                    <h3 class="text-lg font-bold text-slate-800">Daftar Stok Bahan Baku (Gudang)</h3>
                </div>

                <div class="relative flex items-center group">
                    <i
                        class="pi pi-search absolute left-4 text-slate-400 group-focus-within:text-amber-500 transition-colors"></i>
                    <InputText v-model="filters['global'].value" placeholder="Cari nama atau kemasan..."
                        class="!pl-12 !py-3 !rounded-xl !bg-slate-50 !border-none shadow-sm focus:!ring-2 focus:!ring-amber-500/20 w-64 lg:w-80 transition-all font-medium" />
                </div>
            </div>

            <DataTable v-model:filters="filters" :value="stokBahanBakuList"
                :globalFilterFields="['nama_bahan', 'packaging']" class="p-datatable-modern" responsiveLayout="scroll"
                :paginator="true" :rows="15">

                <Column field="nama_bahan" header="Nama Bahan Baku" :sortable="true"
                    style="width: 45%; font-weight: bold; color: #334155;">
                    <template #body="{ data }">
                        {{ data.nama_bahan }}
                    </template>
                </Column>

                <Column field="packaging" header="Kemasan" :sortable="true" style="width: 25%;">
                    <template #body="{ data }">
                        <span
                            class="px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider">
                            {{ data.packaging && data.packaging !== '-' ? data.packaging : 'Tanpa Kemasan' }}
                        </span>
                    </template>
                </Column>

                <Column field="stok" header="Stok Tersedia (Kg)" :sortable="true"
                    style="width: 30%; text-align: right;">
                    <template #body="{ data }">
                        <span
                            :class="{ 'text-red-500 font-black': data.stok <= 0, 'text-emerald-600 font-bold text-lg': data.stok > 0 }">
                            {{ data.stok !== undefined ? parseFloat(data.stok).toFixed(2) : '0.00' }}
                        </span>
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
</template>

<script setup>
import { onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// Memanggil logika dari composable
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