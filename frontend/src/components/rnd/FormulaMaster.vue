<template>
    <div class="space-y-6 sm:space-y-8 animate-fade-in w-full overflow-hidden max-w-full text-slate-700 font-sans">

        <div class="bg-white border border-slate-200 rounded-[24px] p-4 sm:p-6 md:p-8 shadow-sm w-full">

            <div
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-3">
                <h3 class="text-base sm:text-lg font-bold text-slate-800 tracking-tight">Buat Formula / Resep Baru</h3>
                <span
                    class="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100 w-fit">
                    Master Data
                </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div class="flex flex-col gap-2">
                    <label
                        class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-0.5">Nama
                        Formula / Varian Produk</label>
                    <InputText v-model="formResep.nama_formula" placeholder="Contoh: Super Clean Lemon"
                        class="w-full shadow-sm !rounded-xl border border-slate-200 bg-slate-50/50 !py-2.5 !px-4 text-sm font-medium focus:!ring-2 focus:!ring-purple-500" />
                </div>
                <div class="flex flex-col gap-2">
                    <label
                        class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-0.5">Deskripsi
                        / Keterangan (Opsional)</label>
                    <InputText v-model="formResep.deskripsi" placeholder="Tulis catatan atau kegunaan..."
                        class="w-full shadow-sm !rounded-xl border border-slate-200 bg-slate-50/50 !py-2.5 !px-4 text-sm font-medium focus:!ring-2 focus:!ring-purple-500" />
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 mt-8 sm:mt-10 gap-4">
                <h4 class="text-sm font-bold text-slate-700">Komposisi Bahan Baku</h4>
                <Button label="Tambah Bahan" icon="pi pi-plus" text @click="addBahanRow"
                    class="w-full sm:w-auto justify-center !font-bold !text-purple-600 hover:!bg-purple-50 !rounded-xl !text-xs !py-2.5 sm:!py-1 border border-purple-100 sm:border-none" />
            </div>

            <div class="border border-slate-100 rounded-xl overflow-x-auto custom-scrollbar pb-2 mb-6 w-full">
                <DataTable :value="formResep.bahan" class="p-datatable-tight min-w-[500px]" responsiveLayout="scroll">
                    <Column header="Nama Bahan Baku" class="min-w-[200px]">
                        <template #body="slotProps">
                            <InputText v-model="slotProps.data.nama_bahan" placeholder="Cari/Ketik Nama Bahan..."
                                class="w-full !rounded-lg text-sm !py-2 !px-3 border-slate-200" />
                        </template>
                    </Column>
                    <Column header="Takaran (Kg)" class="min-w-[150px]">
                        <template #body="slotProps">
                            <InputNumber v-model="slotProps.data.takaran_kg" :min="0" :minFractionDigits="2"
                                class="w-full !rounded-lg" inputClass="!py-2 !text-sm border-slate-200"
                                placeholder="0.00" />
                        </template>
                    </Column>
                    <Column header="Aksi" bodyStyle="text-align: center" class="w-[80px]">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" text severity="danger" @click="removeBahanRow(slotProps.index)"
                                class="!p-2 !rounded-lg hover:!bg-red-50" />
                        </template>
                    </Column>
                    <template #empty>
                        <div class="text-center py-8 text-slate-400 text-sm">
                            Belum ada komposisi bahan baku untuk resep ini.
                        </div>
                    </template>
                </DataTable>
            </div>

            <div
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 gap-6">
                <div class="w-full sm:w-auto text-left">
                    <span
                        class="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Estimasi
                        Berat
                        Formula</span>
                    <span class="block text-2xl sm:text-3xl font-black text-slate-800">{{ totalBeratEstimasi }} <span
                            class="text-sm font-medium text-slate-500">kg</span></span>
                </div>

                <button @click="simpanFormula" :disabled="isSaving"
                    class="w-full sm:w-auto justify-center px-8 py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 text-sm">
                    <i class="pi" :class="isSaving ? 'pi-spin pi-spinner' : 'pi-check-circle'"></i>
                    {{ isSaving ? 'Menyimpan...' : 'Simpan Master Formula' }}
                </button>
            </div>

        </div>

        <div class="bg-white border border-slate-200 rounded-[24px] p-4 sm:p-6 md:p-8 shadow-sm w-full">
            <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-100">
                <div class="w-2 h-6 bg-purple-500 rounded-full"></div>
                <h3 class="text-base sm:text-lg font-bold text-slate-800 tracking-tight">Katalog Master Formula</h3>
            </div>

            <div class="w-full overflow-x-auto custom-scrollbar pb-2">
                <DataTable :value="formulaList" class="p-datatable-modern min-w-[600px]" responsiveLayout="scroll"
                    :paginator="true" :rows="5">
                    <Column field="id" header="ID Formula" :sortable="true" class="min-w-[120px]">
                        <template #body="slotProps">
                            <span class="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{{
                                slotProps.data.id }}</span>
                        </template>
                    </Column>
                    <Column field="nama_formula" header="Nama Varian" :sortable="true" class="min-w-[180px]">
                        <template #body="slotProps">
                            <span class="font-bold text-slate-800">{{ slotProps.data.nama_formula }}</span>
                        </template>
                    </Column>
                    <Column field="deskripsi" header="Deskripsi" class="min-w-[200px]"></Column>
                    <Column header="Total Bahan" class="min-w-[120px]">
                        <template #body="slotProps">
                            <span
                                class="font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100 text-xs">{{
                                    slotProps.data.bahan.length }} Item</span>
                        </template>
                    </Column>
                    <Column field="tanggal_dibuat" header="Tgl Dibuat" :sortable="true" class="min-w-[120px]"></Column>

                    <template #empty>
                        <div class="text-center py-10">
                            <i class="pi pi-inbox text-4xl text-slate-200 mb-3 block"></i>
                            <p class="text-slate-400 text-sm font-medium">Belum ada Master Formula yang tersimpan.</p>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const isSaving = ref(false)
const formulaList = ref([])

const formResep = ref({
    nama_formula: '',
    deskripsi: '',
    bahan: [{ nama_bahan: '', takaran_kg: 0 }]
})

const totalBeratEstimasi = computed(() => {
    return formResep.value.bahan.reduce((sum, item) => sum + (item.takaran_kg || 0), 0)
})

const loadFormula = () => {
    formulaList.value = JSON.parse(localStorage.getItem('mock_formulaMaster')) || []
}

const addBahanRow = () => {
    formResep.value.bahan.push({ nama_bahan: '', takaran_kg: 0 })
}

const removeBahanRow = (index) => {
    formResep.value.bahan.splice(index, 1)
}

const simpanFormula = () => {
    if (!formResep.value.nama_formula) return alert("Nama Formula Wajib Diisi!")

    isSaving.value = true
    setTimeout(() => {
        let dbFormula = JSON.parse(localStorage.getItem('mock_formulaMaster')) || []

        dbFormula.push({
            id: `FML-${Date.now().toString().slice(-6)}`,
            nama_formula: formResep.value.nama_formula,
            deskripsi: formResep.value.deskripsi || '-',
            bahan: [...formResep.value.bahan],
            tanggal_dibuat: new Date().toLocaleDateString('id-ID')
        })

        localStorage.setItem('mock_formulaMaster', JSON.stringify(dbFormula))

        alert("Formula Master berhasil disimpan ke dalam katalog!")

        // Reset form
        formResep.value = {
            nama_formula: '',
            deskripsi: '',
            bahan: [{ nama_bahan: '', takaran_kg: 0 }]
        }

        loadFormula()
        isSaving.value = false
    }, 600)
}

onMounted(() => {
    loadFormula()
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

/* Scrollbar responsif untuk Mobile & Desktop */
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

/* Penyesuaian PrimeVue DataTable */
:deep(.p-datatable-tight .p-datatable-thead > tr > th),
:deep(.p-datatable-tight .p-datatable-tbody > tr > td) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
}

:deep(.p-datatable-modern .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    color: #64748b;
    font-weight: 700;
    font-size: 0.875rem;
    padding: 1rem 1.5rem;
    border-bottom: 2px solid #f1f5f9;
}

:deep(.p-datatable-modern .p-datatable-tbody > tr > td) {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    color: #475569;
    font-size: 0.875rem;
}

:deep(.p-datatable-modern .p-datatable-tbody > tr:hover) {
    background-color: #f8fafc;
}
</style>