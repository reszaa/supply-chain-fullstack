<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const entityFilter = ref('all')
const showAddModal = ref(false)

const formItem = ref({
    sku: '',
    nama_item: '',
    entitas: 'PT',
    kategori: 'Raw Material',
    packaging: 'Pail 20L',
    stok_aktual: 0,
    batas_minimum: 10
})

const stockItems = ref([])

onMounted(() => {
    const localData = JSON.parse(localStorage.getItem('pracindo_warehouse_stock'))
    if (localData && localData.length > 0) {
        stockItems.value = localData
    } else {
        const dummyStock = [
            { sku: 'RM-PT-001', nama_item: 'Asam Sulfat (H2SO4)', entitas: 'PT', kategori: 'Raw Material', packaging: 'Drum 200L', stok_aktual: 45, batas_minimum: 10 },
            { sku: 'FG-CV-102', nama_item: 'Pembersih Lantai V1', entitas: 'CV', kategori: 'Finished Good', packaging: 'Kardus 12x1L', stok_aktual: 120, batas_minimum: 50 },
            { sku: 'WP-PT-044', nama_item: 'Base Sabun Cair', entitas: 'PT', kategori: 'WIP', packaging: 'Toren 1000L', stok_aktual: 2, batas_minimum: 5 },
            { sku: 'RM-CV-019', nama_item: 'Pewangi Lemon Ext', entitas: 'CV', kategori: 'Raw Material', packaging: 'Pail 20L', stok_aktual: 8, batas_minimum: 15 },
            { sku: 'FG-PT-221', nama_item: 'Deterjen Premium', entitas: 'PT', kategori: 'Finished Good', packaging: 'Sak 25Kg', stok_aktual: 0, batas_minimum: 20 },
        ]
        stockItems.value = dummyStock
        localStorage.setItem('pracindo_warehouse_stock', JSON.stringify(dummyStock))
    }
})

const totalStockPT = computed(() => stockItems.value.filter(item => item.entitas === 'PT').reduce((sum, item) => sum + item.stok_aktual, 0))
const totalStockCV = computed(() => stockItems.value.filter(item => item.entitas === 'CV').reduce((sum, item) => sum + item.stok_aktual, 0))
const lowStockCount = computed(() => stockItems.value.filter(item => item.stok_aktual <= item.batas_minimum).length)

const filteredStock = computed(() => {
    return stockItems.value.filter(item => {
        const matchEntity = entityFilter.value === 'all' || item.entitas === entityFilter.value
        const matchSearch = item.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) || item.nama_item.toLowerCase().includes(searchQuery.value.toLowerCase())
        return matchEntity && matchSearch
    })
})

const getStockStatus = (aktual, minimum) => {
    if (aktual === 0) return { label: 'Habis', class: 'bg-red-100 text-red-700 border-red-200' }
    if (aktual <= minimum) return { label: 'Menipis', class: 'bg-amber-100 text-amber-700 border-amber-200' }
    return { label: 'Aman', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
}

const getEntityBadge = (entitas) => {
    return entitas === 'PT' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-teal-50 text-teal-700 border-teal-200'
}

const simpanItemBaru = () => {
    if (!formItem.value.sku || !formItem.value.nama_item) {
        alert("SKU dan Nama Item wajib diisi!")
        return
    }
    stockItems.value.unshift({ ...formItem.value })
    localStorage.setItem('pracindo_warehouse_stock', JSON.stringify(stockItems.value))
    alert(`Item ${formItem.value.entitas} berhasil ditambahkan!`)
    showAddModal.value = false
    formItem.value = { sku: '', nama_item: '', entitas: 'PT', kategori: 'Raw Material', packaging: 'Pail 20L', stok_aktual: 0, batas_minimum: 10 }
}
</script>

<template>
    <div class="space-y-6 animate-fade-in text-slate-700 p-4 sm:p-0">

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Manajemen Stok</h2>
                <p class="text-slate-500 text-xs sm:text-sm mt-1">Pantau inventaris gabungan PT dan CV di gudang
                    sentral.</p>
            </div>
            <button @click="showAddModal = true"
                class="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                <i class="pi pi-plus text-base"></i>
                <span>Register Item Baru</span>
            </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            <div
                class="bg-white border border-slate-200 rounded-[20px] p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden">
                <div class="absolute right-0 top-0 w-16 h-16 bg-indigo-50 rounded-bl-[100px] -z-10"></div>
                <div
                    class="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center shrink-0 border border-indigo-200">
                    <i class="pi pi-building text-xl"></i>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Volume PT</p>
                    <h3 class="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">{{
                        totalStockPT.toLocaleString('id-ID') }}
                        <span class="text-xs sm:text-sm font-semibold text-slate-500">Unit</span>
                    </h3>
                </div>
            </div>

            <div
                class="bg-white border border-slate-200 rounded-[20px] p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden">
                <div class="absolute right-0 top-0 w-16 h-16 bg-teal-50 rounded-bl-[100px] -z-10"></div>
                <div
                    class="w-12 h-12 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0 border border-teal-200">
                    <i class="pi pi-briefcase text-xl"></i>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Volume CV</p>
                    <h3 class="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">{{
                        totalStockCV.toLocaleString('id-ID') }}
                        <span class="text-xs sm:text-sm font-semibold text-slate-500">Unit</span>
                    </h3>
                </div>
            </div>

            <div
                class="bg-white border border-red-100 rounded-[20px] p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(239,68,68,0.05)] sm:col-span-2 md:col-span-1">
                <div
                    class="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 border border-red-100">
                    <i class="pi pi-exclamation-triangle text-xl"></i>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-red-400 uppercase tracking-wider">Peringatan Restock</p>
                    <h3 class="text-xl sm:text-2xl font-black text-red-600 mt-0.5">{{ lowStockCount }} <span
                            class="text-xs sm:text-sm font-semibold text-red-400">Item Kritis</span></h3>
                </div>
            </div>
        </div>

        <div
            class="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
            <div class="flex overflow-x-auto bg-slate-100 p-1 rounded-xl w-full lg:w-auto hide-scrollbar">
                <button @click="entityFilter = 'all'"
                    :class="entityFilter === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none">Semua
                    Entitas</button>
                <button @click="entityFilter = 'PT'"
                    :class="entityFilter === 'PT' ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none">Milik
                    PT</button>
                <button @click="entityFilter = 'CV'"
                    :class="entityFilter === 'CV' ? 'bg-white text-teal-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none">Milik
                    CV</button>
            </div>
            <div class="relative w-full lg:w-72">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input type="text" v-model="searchQuery" placeholder="Cari SKU atau Nama Item..."
                    class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-700" />
            </div>
        </div>

        <div
            class="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div class="overflow-x-auto hide-scrollbar">
                <table class="w-full text-left text-sm border-collapse min-w-[800px]">
                    <thead class="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <tr>
                            <th class="py-4 px-6 font-semibold whitespace-nowrap">SKU & Item</th>
                            <th class="py-4 px-4 font-semibold text-center whitespace-nowrap">Kepemilikan</th>
                            <th class="py-4 px-4 font-semibold text-center whitespace-nowrap">Kategori</th>
                            <th class="py-4 px-4 font-semibold text-center whitespace-nowrap">Packaging</th>
                            <th class="py-4 px-6 font-semibold text-right whitespace-nowrap">Stok Aktual</th>
                            <th class="py-4 px-4 font-semibold text-center whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        <tr v-for="item in filteredStock" :key="item.sku"
                            class="hover:bg-slate-50/40 transition-colors">
                            <td class="py-4 px-6 whitespace-nowrap">
                                <span class="font-bold text-slate-900 block text-sm">{{ item.sku }}</span>
                                <span class="text-xs font-medium text-slate-500 block mt-0.5">{{ item.nama_item
                                    }}</span>
                            </td>
                            <td class="py-4 px-4 text-center whitespace-nowrap">
                                <span :class="getEntityBadge(item.entitas)"
                                    class="px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider">{{
                                    item.entitas }}</span>
                            </td>
                            <td class="py-4 px-4 text-center whitespace-nowrap">
                                <span
                                    class="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">{{
                                    item.kategori }}</span>
                            </td>
                            <td class="py-4 px-4 text-center whitespace-nowrap">
                                <span class="text-xs text-slate-600">{{ item.packaging }}</span>
                            </td>
                            <td class="py-4 px-6 text-right whitespace-nowrap">
                                <div class="flex flex-col items-end">
                                    <span class="text-base font-black text-slate-800">{{ item.stok_aktual }}</span>
                                    <span class="text-[9px] font-bold text-slate-400 uppercase">Min: {{
                                        item.batas_minimum }}</span>
                                </div>
                            </td>
                            <td class="py-4 px-4 text-center whitespace-nowrap">
                                <span :class="getStockStatus(item.stok_aktual, item.batas_minimum).class"
                                    class="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border">{{
                                        getStockStatus(item.stok_aktual, item.batas_minimum).label }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="filteredStock.length === 0" class="py-12 text-center flex flex-col items-center w-full">
                    <i class="pi pi-box text-4xl text-slate-300 mb-3"></i>
                    <p class="text-slate-500 text-sm font-medium">Item tidak ditemukan</p>
                </div>
            </div>
        </div>

        <div v-if="showAddModal"
            class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-0"
            @click.self="showAddModal = false">
            <div
                class="bg-white w-full max-w-lg rounded-t-[24px] sm:rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up max-h-[90vh] overflow-y-auto hide-scrollbar">
                <div
                    class="sticky top-0 z-10 px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/95 backdrop-blur-sm">
                    <h3 class="text-base font-bold text-slate-800">Registrasi Item Master</h3>
                    <button @click="showAddModal = false"
                        class="text-slate-400 hover:text-red-500 transition-colors p-1"><i
                            class="pi pi-times text-lg"></i></button>
                </div>
                <div class="p-6 space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">KODE SKU</label>
                            <input type="text" v-model="formItem.sku"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">ENTITAS</label>
                            <select v-model="formItem.entitas"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                                <option value="PT">Milik PT</option>
                                <option value="CV">Milik CV</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-500">NAMA ITEM</label>
                        <input type="text" v-model="formItem.nama_item"
                            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">KATEGORI</label>
                            <select v-model="formItem.kategori"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                                <option value="Raw Material">Raw Material</option>
                                <option value="WIP">WIP</option>
                                <option value="Finished Good">Finished Good</option>
                                <option value="Packaging">Packaging</option>
                            </select>
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">KEMASAN FISIK</label>
                            <select v-model="formItem.packaging"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                                <option value="Pail 20L">Pail 20L</option>
                                <option value="Drum 200L">Drum 200L</option>
                                <option value="Sak 25Kg">Sak 25Kg</option>
                                <option value="Kardus 12x1L">Kardus 12x1L</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">STOK AWAL (AKTUAL)</label>
                            <input type="number" v-model="formItem.stok_aktual" min="0"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">BATAS MINIMUM</label>
                            <input type="number" v-model="formItem.batas_minimum" min="0"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                        </div>
                    </div>
                </div>
                <div
                    class="sticky bottom-0 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 bg-slate-50/95 backdrop-blur-sm">
                    <button @click="showAddModal = false"
                        class="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Batal</button>
                    <button @click="simpanItemBaru"
                        class="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-md">Simpan
                        Item</button>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

.animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(15px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>