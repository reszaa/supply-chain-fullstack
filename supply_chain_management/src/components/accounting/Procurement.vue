<script setup>
import { reactive, computed, onMounted, ref, watch } from 'vue'
import { useProcurement } from '@/composables/useProcurement'
import FormSuplier from './FormSuplier.vue'
import Dropdown from 'primevue/dropdown';
import api from '../../utils/api';
import Select from 'primevue/select';
const {
    dataSupplier,
    isLoading,
    fetchSuppliers,
    simpanPO,
    generateIdPT
} = useProcurement()

const packagingOptions = ['sak', 'drum', 'bag'];
const showModalSupplier = ref(false)

const formHeader = reactive({
    id_transaksi: '',
    tanggal: '',
    supplier: '',
    entitas: 'PT'
})

onMounted(async () => {
    fetchSuppliers()
    if (formHeader.entitas === 'PT') {
        formHeader.id_transaksi = await generateIdPT()
    }
})

watch(() => formHeader.entitas, async (newEntitas) => {
    if (newEntitas === 'PT') {
        formHeader.id_transaksi = await generateIdPT()
    } else {
        formHeader.id_transaksi = ''
    }
})


const formDetail = reactive([
    { nama_item: '', packaging: '', unit_kg: null, total_unit: null, harga_satuan: null }
])

const tambahItem = () => {
    formDetail.push({
        nama_item: '',
        packaging: '',
        unit_kg: null,
        total_unit: null,
        harga_satuan: null
    })
}

const hapusItem = (index) => {
    if (formDetail.length > 1) {
        formDetail.splice(index, 1)
    } else {
        alert("Minimal harus ada 1 item transaksi!")
    }
}

const hitungTotalHargaBaris = (item) => {
    const totalUnit = parseFloat(item.total_unit) || 0
    const harga = parseFloat(item.harga_satuan) || 0
    return totalUnit * harga
}

const hitungQuantity = (item) => {
    const unitKg = parseFloat(item.unit_kg) || 0
    const totalUnit = parseFloat(item.total_unit) || 0
    return unitKg * totalUnit
}

const grandTotal = computed(() => {
    return formDetail.reduce((total, item) => total + hitungTotalHargaBaris(item), 0)
})

const handleSupplierSaved = async () => {
    await fetchSuppliers()
    showModalSupplier.value = false
}

const handleSimpanPO = async () => {
    if (!formHeader.id_transaksi || !formHeader.supplier) {
        alert("Harap lengkapi No. PO dan Supplier terlebih dahulu!")
        return
    }

    const payloadBackend = {
        id_transaksi: formHeader.id_transaksi,
        tanggal: formHeader.tanggal,
        nama_supplier: formHeader.supplier,
        entitas: formHeader.entitas,

        daftar_item: formDetail.map(item => ({
            nama_item: item.nama_item,
            packaging: item.packaging || '-',
            unit_kg: parseFloat(item.unit_kg) || 0,
            total_unit: parseInt(item.total_unit) || 0,
            quantity: hitungQuantity(item),
            harga_satuan: parseFloat(item.harga_satuan) || 0
        }))
    }

    const hasil = await simpanPO(payloadBackend)

    if (hasil.success) {
        alert("Purchase Order berhasil diterbitkan ke Database!")


        formHeader.tanggal = ''
        formHeader.supplier = ''
        formHeader.entitas = 'PT'
        formHeader.id_transaksi = await generateIdPT()

        formDetail.splice(0, formDetail.length, {
            nama_item: '',
            packaging: '',
            unit_kg: null,
            total_unit: null,
            harga_satuan: null
        })
    } else {
        alert(hasil.message)
    }
}
</script>

<template>
    <div class="flex flex-col w-full animate-fade-in relative overflow-hidden max-w-full">
        <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
            <div>
                <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Create Procurement (PO)</h2>
                <p class="text-slate-500 text-xs sm:text-sm mt-1">Input data Purchase Order Header & Detail Item.</p>
            </div>
        </div>

        <div
            class="bg-white border border-slate-200 rounded-[24px] p-4 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-full">

            <div
                class="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-slate-100 pb-4 gap-4">
                <h3 class="text-base font-bold text-slate-800">Informasi Utama</h3>

                <div
                    class="grid grid-cols-4 md:flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200/60 shadow-inner w-full md:w-auto gap-1">
                    <button v-for="ent in ['PT', 'CV', 'AGUS', 'MARSINI']" :key="ent" type="button"
                        @click="formHeader.entitas = ent" :class="['col-span-1 md:col-span-none px-2 sm:px-6 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all duration-300 w-full text-center truncate',
                            formHeader.entitas === ent
                                ? 'bg-white text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-100/50'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50']">
                        {{ ent }}
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <div class="flex flex-col gap-2">
                    <label class="text-xs sm:text-sm font-bold text-slate-700">No. PO / ID</label>
                    <input v-model="formHeader.id_transaksi" type="text" placeholder="Contoh: PO-2026-06-001"
                        class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-slate-800 placeholder-slate-400" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-xs sm:text-sm font-bold text-slate-700">Tanggal PO</label>
                    <input v-model="formHeader.tanggal" type="date"
                        class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-slate-800" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-xs sm:text-sm font-bold text-slate-700">Supplier Tujuan</label>
                    <div class="flex gap-2 w-full relative">
                        <select v-model="formHeader.supplier"
                            class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-slate-800 appearance-none truncate">
                            <option value="" disabled>-- Pilih Supplier --</option>
                            <option v-for="sup in dataSupplier" :key="sup.id || sup.id_suplier"
                                :value="sup.nama_perusahaan || sup.nama_supplier || sup.nama_suplier">
                                {{ sup.nama_perusahaan || sup.nama_supplier || sup.nama_suplier }}
                            </option>
                        </select>

                        <button type="button" @click="showModalSupplier = true"
                            class="w-11 h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl border border-emerald-200 flex items-center justify-center transition-all shadow-sm shrink-0"
                            title="Tambah Supplier Baru">
                            <i class="pi pi-plus text-base font-bold"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-slate-100 pb-2 mt-8 gap-3">
                <h3 class="text-base font-bold text-slate-800">Detail Item Pesanan</h3>
                <button @click="tambahItem"
                    class="w-full sm:w-auto justify-center px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
                    <i class="pi pi-plus"></i> Tambah Item
                </button>
            </div>

            <div class="overflow-x-auto mb-8 custom-scrollbar pb-2">
                <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="text-slate-500 bg-slate-50/50">
                        <tr>
                            <th class="py-3 px-2 sm:px-4 font-semibold rounded-tl-xl w-[20%] text-left min-w-[200px]">
                                Nama Barang</th>
                            <th class="py-3 px-2 sm:px-4 font-semibold w-[10%] text-left min-w-[120px]">Packaging</th>
                            <th class="py-3 px-2 sm:px-4 font-semibold w-[10%] text-left">Unit/Kg</th>
                            <th class="py-3 px-2 sm:px-4 font-semibold w-[10%] text-left">Total Unit</th>
                            <th class="py-3 px-2 sm:px-4 font-semibold w-[15%] text-left min-w-[150px]">Harga Satuan
                            </th>
                            <th class="py-3 px-2 sm:px-4 font-semibold w-[15%] text-left">Total Harga</th>
                            <th class="py-3 px-2 sm:px-4 font-semibold w-[10%] text-left">Quantity (Kg)</th>
                            <th class="py-3 px-2 sm:px-4 font-semibold text-center rounded-tr-xl w-[10%]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="(item, index) in formDetail" :key="index"
                            class="hover:bg-slate-50/30 transition-colors">

                            <td class="py-3 px-2 sm:px-4">
                                <input v-model="item.nama_item" type="text" placeholder="Nama barang..."
                                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
                            </td>

                            <td class="py-3 px-2 sm:px-4">
                                <Dropdown v-model="item.packaging" :options="packagingOptions"
                                    placeholder="Pilih kemasan..." class="w-full !text-sm"
                                    :pt="{ root: { class: '!py-1 !border-slate-300' } }" />
                            </td>

                            <td class="py-3 px-2 sm:px-4">
                                <input v-model="item.unit_kg" type="number" min="0" step="0.01" placeholder="Berat/Unit"
                                    class="w-full min-w-[80px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
                            </td>

                            <td class="py-3 px-2 sm:px-4">
                                <input v-model="item.total_unit" type="number" min="1" placeholder="Jml Unit"
                                    class="w-full min-w-[80px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
                            </td>

                            <td class="py-3 px-2 sm:px-4">
                                <input v-model="item.harga_satuan" type="number" min="0" placeholder="Rp"
                                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
                            </td>

                            <td class="py-3 px-2 sm:px-4 font-bold text-slate-800 text-right">
                                Rp {{ hitungTotalHargaBaris(item).toLocaleString('id-ID') }}
                            </td>

                            <td class="py-3 px-2 sm:px-4 text-center">
                                <span
                                    class="px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-black text-emerald-600 block w-full min-w-[90px] text-center">
                                    {{ hitungQuantity(item) }} Kg
                                </span>
                            </td>

                            <td class="py-3 px-2 sm:px-4 text-center">
                                <button @click="hapusItem(index)"
                                    class="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors inline-flex items-center justify-center"
                                    title="Hapus Baris">
                                    <i class="pi pi-trash text-sm"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                class="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 gap-6">
                <div class="text-slate-500 text-xs sm:text-sm flex items-start sm:items-center gap-2">
                    <i class="pi pi-info-circle text-slate-400 mt-0.5 sm:mt-0"></i>
                    <span>Pastikan rincian berat dan harga telah sesuai sebelum dicetak.</span>
                </div>

                <div
                    class="flex flex-col sm:flex-row items-end sm:items-center gap-4 sm:gap-6 w-full lg:w-auto justify-between sm:justify-end">
                    <div
                        class="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
                        <span class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Grand Total</span>
                        <span class="block text-xl sm:text-2xl font-black text-slate-800">
                            Rp {{ grandTotal.toLocaleString('id-ID') }}
                        </span>
                    </div>
                    <button @click="handleSimpanPO" :disabled="isLoading"
                        class="w-full sm:w-auto justify-center px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
                        <i class="pi" :class="isLoading ? 'pi-spin pi-spinner' : 'pi-check-circle'"></i>
                        {{ isLoading ? 'Memproses...' : 'Terbitkan PO' }}
                    </button>
                </div>
            </div>
        </div>

        <FormSuplier v-if="showModalSupplier" @close="showModalSupplier = false" @saved="handleSupplierSaved" />
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
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

/* [UBAH] Scrollbar khusus agar konsisten */
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