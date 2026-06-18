<script setup>
import { onMounted, computed } from 'vue'
import { useReceived } from '@/composables/useReceived'

const {
    isLoading, isSaving, poList, selectedPODetail,
    formHeader, formItems, fetchAvailablePO, fetchPODetail,
    calcWeight, addRow, removeRow, resetForm, saveData
} = useReceived()

onMounted(() => {
    fetchAvailablePO()
})

const handlePOChange = () => {
    fetchPODetail(formHeader.ref_id)
}

const totalTonasePenerimaan = computed(() => {
    return formItems.value.reduce((sum, item) => sum + (parseFloat(item.berat) || 0), 0).toFixed(2)
})
</script>

<template>
    <div class="space-y-6 sm:space-y-10 animate-fade-in w-full overflow-hidden max-w-full text-slate-700 font-sans">

        <div class="bg-white border border-slate-200 rounded-[24px] p-4 sm:p-8 shadow-sm">
            <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <div class="w-2 h-6 bg-blue-600 rounded-full"></div>
                <h3 class="text-base sm:text-lg font-bold text-slate-800">Informasi Dokumen (Referensi PO)</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div class="flex flex-col gap-2">
                    <label class="text-xs sm:text-sm font-bold text-slate-700">Pilih Referensi PO PO</label>
                    <select v-model="formHeader.ref_id" @change="handlePOChange" :disabled="isLoading"
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800">
                        <option value="" disabled>-- Pilih Nomor PO --</option>
                        <option v-for="po in poList" :key="po.id_transaksi" :value="po.id_transaksi">
                            {{ po.id_transaksi }} ({{ po.nama_supplier }})
                        </option>
                    </select>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-xs sm:text-sm font-bold text-slate-700">Entitas Pemilik PO</label>
                    <input v-model="formHeader.entitas" type="text" readonly placeholder="Otomatis terisi..."
                        class="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 outline-none" />
                </div>
            </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-[24px] p-4 sm:p-8 shadow-sm">
            <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <div class="w-2 h-6 bg-blue-600 rounded-full"></div>
                <h3 class="text-base sm:text-lg font-bold text-slate-800">Informasi Pengiriman / Armada</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div class="flex flex-col gap-2">
                    <label class="text-xs sm:text-sm font-bold text-slate-700">No. Surat Jalan Vendor</label>
                    <input v-model="formHeader.surat_jalan_supplier" type="text" placeholder="Masukkan nomor SJ..."
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-xs sm:text-sm font-bold text-slate-700">No. Plat Kendaraan</label>
                    <input v-model="formHeader.no_polisi" type="text" placeholder="Contoh: B 1234 ABC"
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-xs sm:text-sm font-bold text-slate-700">Nama Sopir / Driver</label>
                    <input v-model="formHeader.nama_supir" type="text" placeholder="Nama pengemudi..."
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800" />
                </div>
            </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-[24px] p-4 sm:p-8 shadow-sm">
            <div
                class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-3">
                <div class="flex items-center gap-4">
                    <div class="w-2 h-6 bg-blue-600 rounded-full"></div>
                    <h3 class="text-base sm:text-lg font-bold text-slate-800">Rincian Item Yang Diterima</h3>
                </div>
                <button @click="addRow" type="button"
                    class="w-full sm:w-auto justify-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
                    <i class="pi pi-plus"></i> Tambah Baris Manual
                </button>
            </div>

            <div class="overflow-x-auto custom-scrollbar pb-2 mb-6">
                <table class="w-full text-left text-sm border-collapse whitespace-nowrap">
                    <thead class="text-slate-500 bg-slate-50/50">
                        <tr>
                            <th class="py-3 px-4 font-semibold rounded-tl-xl w-[30%] min-w-[220px]">Nama Barang / Item
                            </th>
                            <th class="py-3 px-4 font-semibold w-[15%] min-w-[120px]">Packaging</th>
                            <th class="py-3 px-4 font-semibold w-[10%] text-center">Unit/Kg</th>
                            <th class="py-3 px-4 font-semibold w-[10%] text-center">Total Unit</th>
                            <th class="py-3 px-4 font-semibold w-[15%] text-right">Hitung Tonase (Kg)</th>
                            <th class="py-3 px-4 font-semibold text-center rounded-tr-xl w-[10%]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="(item, index) in formItems" :key="index"
                            class="hover:bg-slate-50/30 transition-colors">
                            <td class="py-3 px-4">
                                <input v-model="item.nama_item" type="text" placeholder="Masukkan nama barang..."
                                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" />
                            </td>

                            <td class="py-3 px-4">
                                <select v-model="item.packaging"
                                    class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800">
                                    <option value="sak">Sak / Karung</option>
                                    <option value="drum">Drum / Tong</option>
                                    <option value="bag">Bag / Plastik</option>
                                    <option value="box">Box / Kardus</option>
                                    <option value="-">Lainnya</option>
                                </select>
                            </td>

                            <td class="py-3 px-4">
                                <input v-model="item.unit_kg" @input="calcWeight(index)" type="number" min="0"
                                    step="0.01" placeholder="0"
                                    class="w-full min-w-[80px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" />
                            </td>

                            <td class="py-3 px-4">
                                <input v-model="item.total_unit" @input="calcWeight(index)" type="number" min="0"
                                    placeholder="0"
                                    class="w-full min-w-[80px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" />
                            </td>

                            <td class="py-3 px-4 text-right font-bold text-slate-800">
                                <span
                                    class="bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-black border border-slate-200 inline-block min-w-[100px]">
                                    {{ (item.berat || 0).toLocaleString('id-ID') }} kg
                                </span>
                            </td>

                            <td class="py-3 px-4 text-center">
                                <button @click="removeRow(index)" type="button"
                                    class="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors inline-flex items-center justify-center"
                                    title="Hapus Baris">
                                    <i class="pi pi-trash text-sm"></i>
                                </button>
                            </td>
                        </tr>

                        <tr v-if="formItems.length === 0">
                            <td colspan="6" class="py-10 text-center text-slate-400">
                                <i class="pi pi-inbox text-3xl mb-2 block text-slate-300"></i>
                                Tidak ada item dalam daftar penerimaan barang.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                class="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-slate-900 border border-slate-950 p-4 sm:p-6 rounded-2xl gap-6">
                <div class="flex items-center gap-4 w-full lg:w-auto">
                    <div
                        class="w-12 h-12 bg-slate-800 border border-slate-700/60 rounded-xl flex items-center justify-center text-blue-400 flex-shrink-0 shadow-inner">
                        <i class="pi pi-database text-xl"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-0.5">
                            Total Tonase Masuk
                        </span>
                        <span class="text-xl sm:text-2xl font-black text-white leading-none">
                            {{ totalTonasePenerimaan }} <span class="text-xs font-medium text-slate-500">kg</span>
                        </span>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto justify-end">
                    <button @click="resetForm" type="button"
                        class="w-full sm:w-auto justify-center px-6 py-3.5 font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all text-sm">
                        Reset Data
                    </button>
                    <button @click="saveData" :disabled="isSaving" type="button"
                        class="w-full sm:w-auto justify-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black rounded-xl shadow-[0_4px_15px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2 text-sm">
                        <i class="pi" :class="isSaving ? 'pi-spin pi-spinner' : 'pi-check-circle'"></i>
                        {{ isSaving ? 'Menyimpan...' : 'SIMPAN PENERIMAAN' }}
                    </button>
                </div>
            </div>
        </div>

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

/* [UBAH] Penambahan custom scrollbar horizontal tabel gudang agar tampak premium */
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