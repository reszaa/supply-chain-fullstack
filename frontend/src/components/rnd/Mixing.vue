<template>
    <div class="space-y-6 sm:space-y-8 animate-fade-in w-full overflow-hidden max-w-full text-slate-700 font-sans">

        <div class="bg-white border border-slate-200 rounded-[24px] p-4 sm:p-6 md:p-8 shadow-sm w-full">

            <div
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
                <h3 class="text-base sm:text-lg font-bold text-slate-800 tracking-tight">Setup Mixing Mesin Reaktor</h3>
                <Button label="Tambah Bahan" icon="pi pi-plus" text @click="addMaterialRow"
                    class="w-full sm:w-auto justify-center !font-bold !text-blue-600 hover:!bg-blue-50 !rounded-xl !text-xs !py-2.5 sm:!py-1 border border-blue-100 sm:border-none" />
            </div>

            <div class="mb-6 sm:mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div class="flex flex-col gap-2">
                    <label
                        class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-0.5">Nama
                        Batch /
                        Hasil Cairan</label>
                    <InputText v-model="namaBatch" placeholder="Misal: Golden Yellow"
                        class="w-full shadow-sm !rounded-xl border border-slate-200 bg-slate-50/50 !py-2.5 !px-4 text-sm font-medium focus:!ring-2 focus:!ring-blue-500" />
                </div>
            </div>

            <div class="border border-slate-100 rounded-xl overflow-x-auto custom-scrollbar pb-2 mb-6 w-full">
                <DataTable :value="inputMaterials" class="p-datatable-tight min-w-[600px]" responsiveLayout="scroll">
                    <Column header="Nama Bahan Baku" class="min-w-[200px]">
                        <template #body="slotProps">
                            <Select v-model="slotProps.data.nama_bahan" :options="rawStocks" optionLabel="nama_bahan"
                                optionValue="nama_bahan" placeholder="Pilih Bahan"
                                @change="updateStock(slotProps.index)" class="w-full !rounded-lg text-sm" />
                        </template>
                    </Column>
                    <Column header="Stok Tersedia (Kg)" class="min-w-[150px]">
                        <template #body="slotProps">
                            <span class="font-medium text-slate-500">{{ slotProps.data.stok_tersedia }} kg</span>
                        </template>
                    </Column>
                    <Column header="Qty Dipakai (Kg)" class="min-w-[150px]">
                        <template #body="slotProps">
                            <InputNumber v-model="slotProps.data.qty_pakai" :min="0" :max="slotProps.data.stok_tersedia"
                                class="w-full !rounded-lg" inputClass="!py-2 !text-sm" />
                        </template>
                    </Column>
                    <Column header="Aksi" bodyStyle="text-align: center" class="w-[80px]">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" text severity="danger"
                                @click="removeMaterialRow(slotProps.index)" class="!p-2 !rounded-lg hover:!bg-red-50" />
                        </template>
                    </Column>

                    <template #empty>
                        <div class="text-center py-8 text-slate-400 text-sm">
                            Belum ada bahan baku yang ditambahkan.
                        </div>
                    </template>
                </DataTable>
            </div>

            <div
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 gap-6">
                <div class="w-full sm:w-auto text-left">
                    <span
                        class="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total
                        Berat
                        Formula</span>
                    <span class="block text-2xl sm:text-3xl font-black text-slate-800">{{ totalBeratFormula }} <span
                            class="text-sm font-medium text-slate-500">kg</span></span>
                </div>

                <button @click="simpanMixing" :disabled="isSaving"
                    class="w-full sm:w-auto justify-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 text-sm">
                    <i class="pi" :class="isSaving ? 'pi-spin pi-spinner' : 'pi-check-circle'"></i>
                    {{ isSaving ? 'Memproses...' : 'Mulai Mixing' }}
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const namaBatch = ref('')
const isSaving = ref(false)
const rawStocks = ref([])
const inputMaterials = ref([{ nama_bahan: '', stok_tersedia: 0, qty_pakai: 0 }])

const totalBeratFormula = computed(() => {
    return inputMaterials.value.reduce((sum, item) => sum + (item.qty_pakai || 0), 0)
})

const loadRawStocksGudang = () => {
    rawStocks.value = JSON.parse(localStorage.getItem('mock_stokBahanBaku')) || []
}

const addMaterialRow = () => {
    inputMaterials.value.push({ nama_bahan: '', stok_tersedia: 0, qty_pakai: 0 })
}

const removeMaterialRow = (index) => {
    inputMaterials.value.splice(index, 1)
}

const updateStock = (index) => {
    const selected = rawStocks.value.find(b => b.nama_bahan === inputMaterials.value[index].nama_bahan)
    inputMaterials.value[index].stok_tersedia = selected ? selected.stok : 0
    inputMaterials.value[index].qty_pakai = 0
}

const simpanMixing = () => {
    if (!namaBatch.value) return alert("Isi Nama Batch!")
    isSaving.value = true
    setTimeout(() => {
        let dbBahanBaku = JSON.parse(localStorage.getItem('mock_stokBahanBaku')) || []
        let dbMesin = JSON.parse(localStorage.getItem('mock_mesinWip')) || []

        inputMaterials.value.forEach(material => {
            let currentBahan = dbBahanBaku.find(b => b.nama_bahan === material.nama_bahan)
            if (currentBahan) currentBahan.stok -= material.qty_pakai
        })

        // Simpan ke cairan belum di-filling (WIP)
        dbMesin.push({ id: `MIX-${Date.now()}`, nama: namaBatch.value, stok: parseFloat(totalBeratFormula.value) })

        localStorage.setItem('mock_stokBahanBaku', JSON.stringify(dbBahanBaku))
        localStorage.setItem('mock_mesinWip', JSON.stringify(dbMesin))

        alert("Mixing Selesai! Bahan baku telah diproses.")
        namaBatch.value = ''; inputMaterials.value = [{ nama_bahan: '', stok_tersedia: 0, qty_pakai: 0 }]
        loadRawStocksGudang(); isSaving.value = false
    }, 800)
}

onMounted(() => loadRawStocksGudang())
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

/* Scrollbar khusus untuk Mobile & Desktop agar elegan */
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

/* Modifikasi internal PrimeVue agar lebih lega di HP */
:deep(.p-datatable-tight .p-datatable-thead > tr > th),
:deep(.p-datatable-tight .p-datatable-tbody > tr > td) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
}
</style>