<script setup>
import { ref, computed, reactive, onMounted } from 'vue'

const searchQuery = ref('')
const statusFilter = ref('all')
const showAddModal = ref(false)

const formWO = reactive({
    wo_id: '',
    product: '',
    qty: null,
    unit: 'Liter',
    target_date: '',
    pic: '',
    status: 'Draft',
    progress: 0
})

const workOrders = ref([])

onMounted(() => {
    const localData = JSON.parse(localStorage.getItem('pracindo_factory_wo'))

    if (localData && localData.length > 0) {
        workOrders.value = localData
    } else {
        const dummyWO = [
            { wo_id: 'WO-2606-001', product: 'Pembersih Lantai V1', qty: 500, unit: 'Liter', target_date: '2026-06-15', pic: 'Tim A (Shift 1)', status: 'In Progress', progress: 45 },
            { wo_id: 'WO-2606-002', product: 'Deterjen Premium', qty: 1000, unit: 'Kg', target_date: '2026-06-14', pic: 'Tim B (Shift 2)', status: 'Completed', progress: 100 },
            { wo_id: 'WO-2606-003', product: 'Base Sabun Cair', qty: 250, unit: 'Liter', target_date: '2026-06-18', pic: 'Budi Santoso', status: 'Draft', progress: 0 },
            { wo_id: 'WO-2606-004', product: 'Pewangi Pakaian Floral', qty: 300, unit: 'Liter', target_date: '2026-06-16', pic: 'Tim A (Shift 1)', status: 'In Progress', progress: 80 },
        ]
        workOrders.value = dummyWO
        localStorage.setItem('pracindo_factory_wo', JSON.stringify(dummyWO))
    }
})

const totalWO = computed(() => workOrders.value.length)
const activeWO = computed(() => workOrders.value.filter(wo => wo.status === 'In Progress').length)
const completedWO = computed(() => workOrders.value.filter(wo => wo.status === 'Completed').length)

const filteredWO = computed(() => {
    return workOrders.value.filter(wo => {
        const matchStatus = statusFilter.value === 'all' || wo.status === statusFilter.value
        const matchSearch =
            wo.wo_id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            wo.product.toLowerCase().includes(searchQuery.value.toLowerCase())

        return matchStatus && matchSearch
    })
})

const getStatusBadge = (status) => {
    switch (status) {
        case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
        case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-200'
        case 'Draft': return 'bg-slate-100 text-slate-700 border-slate-200'
        case 'Canceled': return 'bg-red-100 text-red-700 border-red-200'
        default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
}

const simpanWO = () => {
    if (!formWO.wo_id || !formWO.product || !formWO.qty) {
        alert("Nomor WO, Produk, dan Target Qty wajib diisi!")
        return
    }

    workOrders.value.unshift({ ...formWO })
    localStorage.setItem('pracindo_factory_wo', JSON.stringify(workOrders.value))

    alert(`Work Order ${formWO.wo_id} berhasil diterbitkan!`)
    showAddModal.value = false

    Object.assign(formWO, {
        wo_id: '', product: '', qty: null, unit: 'Liter', target_date: '', pic: '', status: 'Draft', progress: 0
    })
}

const updateProgress = (wo, amount) => {
    if (wo.status === 'Completed') return

    wo.progress += amount
    if (wo.progress >= 100) {
        wo.progress = 100
        wo.status = 'Completed'
    } else if (wo.progress > 0 && wo.status === 'Draft') {
        wo.status = 'In Progress'
    }

    localStorage.setItem('pracindo_factory_wo', JSON.stringify(workOrders.value))
}
</script>

<template>
    <div class="space-y-6 animate-fade-in text-slate-700">

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Work Order Produksi</h2>
                <p class="text-slate-500 text-sm mt-1">Kelola instruksi manufaktur dan pantau progress produksi harian.
                </p>
            </div>

            <button @click="showAddModal = true"
                class="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-[0_4px_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2">
                <i class="pi pi-hammer text-base"></i>
                <span>Buat Work Order</span>
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div
                class="bg-white border border-slate-200 rounded-[20px] p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div
                    class="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                    <i class="pi pi-file text-xl"></i>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total WO Terdaftar</p>
                    <h3 class="text-2xl font-black text-slate-800 mt-0.5">{{ totalWO }} <span
                            class="text-sm font-semibold text-slate-500">Dokumen</span></h3>
                </div>
            </div>

            <div
                class="bg-white border border-amber-100 rounded-[20px] p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(245,158,11,0.05)] relative overflow-hidden">
                <div
                    class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                    <i class="pi pi-sync spin-slow text-xl"></i>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Sedang Diproduksi</p>
                    <h3 class="text-2xl font-black text-amber-700 mt-0.5">{{ activeWO }} <span
                            class="text-sm font-semibold text-amber-600">Aktif</span></h3>
                </div>
            </div>

            <div
                class="bg-white border border-emerald-100 rounded-[20px] p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(16,185,129,0.05)] relative overflow-hidden">
                <div
                    class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
                    <i class="pi pi-check-circle text-xl"></i>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Produksi Selesai</p>
                    <h3 class="text-2xl font-black text-emerald-700 mt-0.5">{{ completedWO }} <span
                            class="text-sm font-semibold text-emerald-600">Batch</span></h3>
                </div>
            </div>
        </div>

        <div
            class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
            <div class="flex bg-slate-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto">
                <button @click="statusFilter = 'all'"
                    :class="statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap">Semua WO</button>
                <button @click="statusFilter = 'Draft'"
                    :class="statusFilter === 'Draft' ? 'bg-white text-slate-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap">Draft</button>
                <button @click="statusFilter = 'In Progress'"
                    :class="statusFilter === 'In Progress' ? 'bg-white text-amber-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap">In Progress</button>
                <button @click="statusFilter = 'Completed'"
                    :class="statusFilter === 'Completed' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap">Completed</button>
            </div>

            <div class="relative w-full lg:w-72">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input type="text" v-model="searchQuery" placeholder="Cari No. WO atau Produk..."
                    class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-700" />
            </div>
        </div>

        <div
            class="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm border-collapse">
                    <thead class="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <tr>
                            <th class="py-4 px-6 font-semibold">Nomor WO & Produk</th>
                            <th class="py-4 px-4 font-semibold text-center">Target Qty</th>
                            <th class="py-4 px-4 font-semibold text-center">Tenggat Waktu</th>
                            <th class="py-4 px-4 font-semibold text-center">Status</th>
                            <th class="py-4 px-6 font-semibold w-1/4">Progress Produksi</th>
                            <th class="py-4 px-4 font-semibold text-center">Update</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        <tr v-for="wo in filteredWO" :key="wo.wo_id" class="hover:bg-slate-50/40 transition-colors">

                            <td class="py-4 px-6">
                                <span class="font-bold text-slate-900 block text-sm">{{ wo.wo_id }}</span>
                                <span class="text-xs font-bold text-amber-600 block mt-0.5">{{ wo.product }}</span>
                                <span class="text-[10px] text-slate-400 block mt-0.5"><i
                                        class="pi pi-users text-[9px]"></i> {{ wo.pic }}</span>
                            </td>

                            <td class="py-4 px-4 text-center">
                                <span class="text-sm font-black text-slate-800">{{ wo.qty }}</span>
                                <span class="text-[10px] font-medium text-slate-500 ml-1">{{ wo.unit }}</span>
                            </td>

                            <td class="py-4 px-4 text-center">
                                <span class="text-xs font-medium text-slate-700"><i
                                        class="pi pi-calendar text-[10px] text-slate-400"></i> {{ wo.target_date
                                        }}</span>
                            </td>

                            <td class="py-4 px-4 text-center">
                                <span :class="getStatusBadge(wo.status)"
                                    class="px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-wide whitespace-nowrap">
                                    {{ wo.status }}
                                </span>
                            </td>

                            <td class="py-4 px-6">
                                <div class="flex flex-col gap-1.5">
                                    <div class="flex justify-between items-center">
                                        <span class="text-[10px] font-bold text-slate-500">{{ wo.progress }}%
                                            Selesai</span>
                                        <span v-if="wo.status === 'Completed'"
                                            class="text-[10px] font-bold text-emerald-500"><i
                                                class="pi pi-check"></i></span>
                                    </div>
                                    <div
                                        class="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                                        <div :class="wo.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'"
                                            :style="{ width: wo.progress + '%' }"
                                            class="h-full transition-all duration-500"></div>
                                    </div>
                                </div>
                            </td>

                            <td class="py-4 px-4 text-center">
                                <button v-if="wo.status !== 'Completed'" @click="updateProgress(wo, 20)"
                                    class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors inline-flex items-center justify-center border border-amber-100"
                                    title="Tambah Progress 20%">
                                    <i class="pi pi-plus text-xs"></i>
                                </button>
                                <span v-else class="text-emerald-500"><i class="pi pi-verified text-xl"></i></span>
                            </td>

                        </tr>
                    </tbody>
                </table>
                <div v-if="filteredWO.length === 0" class="py-12 text-center flex flex-col items-center">
                    <i class="pi pi-file-excel text-4xl text-slate-300 mb-3"></i>
                    <p class="text-slate-500 text-sm font-medium">Work Order tidak ditemukan.</p>
                </div>
            </div>
        </div>

        <div v-if="showAddModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            @click.self="showAddModal = false">
            <div
                class="bg-white w-full max-w-lg rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up">

                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 class="text-base font-bold text-slate-800">Terbitkan Work Order</h3>
                    <button @click="showAddModal = false" class="text-slate-400 hover:text-red-500 transition-colors">
                        <i class="pi pi-times text-lg"></i>
                    </button>
                </div>

                <div class="p-6 space-y-4">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-500">NOMOR WORK ORDER</label>
                        <input type="text" v-model="formWO.wo_id" placeholder="Contoh: WO-2606-005"
                            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase" />
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-500">PRODUK TARGET (FINISHED GOOD)</label>
                        <input type="text" v-model="formWO.product"
                            placeholder="Nama produk jadi yang akan diproduksi..."
                            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">TARGET KUANTITAS</label>
                            <input type="number" v-model="formWO.qty" min="1" placeholder="0"
                                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">SATUAN (UNIT)</label>
                            <select v-model="formWO.unit"
                                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option value="Liter">Liter (L)</option>
                                <option value="Kg">Kilogram (Kg)</option>
                                <option value="Pcs">Pieces (Pcs)</option>
                                <option value="Box">Kardus / Box</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">TENGGAT WAKTU (DEADLINE)</label>
                            <input type="date" v-model="formWO.target_date"
                                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">TIM PELAKSANA (PIC)</label>
                            <input type="text" v-model="formWO.pic" placeholder="Contoh: Shift 1 / Pak Budi"
                                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                    </div>
                </div>

                <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                    <button @click="showAddModal = false"
                        class="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Batal</button>
                    <button @click="simpanWO"
                        class="px-6 py-2 text-xs font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 shadow-md">Terbitkan
                        WO</button>
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

.spin-slow {
    animation: spin 3s linear infinite;
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

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}
</style>