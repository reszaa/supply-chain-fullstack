<script setup>
import { ref, computed, reactive, onMounted } from 'vue'

// State Kontrol
const searchQuery = ref('')
const categoryFilter = ref('all') // all, Mesin Produksi, Alat Ukur, Kendaraan
const showAddModal = ref(false)

// State Form Tambah/Edit Alat
const formTool = reactive({
    kode_alat: '',
    nama_alat: '',
    kategori: 'Mesin Produksi',
    status: 'Operational',
    pic: '',
    terakhir_perawatan: '',
    jadwal_perawatan: ''
})

// Database Lokal Simulasi Aset Alat
const toolsList = ref([])

onMounted(() => {
    const localData = JSON.parse(localStorage.getItem('pracindo_factory_tools'))

    if (localData && localData.length > 0) {
        toolsList.value = localData
    } else {
        // Data Dummy Awal Aset Pabrik
        const dummyTools = [
            { kode_alat: 'MCH-MX-01', nama_alat: 'Mixing Tank 1000L', kategori: 'Mesin Produksi', status: 'Operational', pic: 'Budi Santoso', terakhir_perawatan: '2026-05-15', jadwal_perawatan: '2026-08-15' },
            { kode_alat: 'TL-SCL-04', nama_alat: 'Timbangan Digital 150Kg', kategori: 'Alat Ukur', status: 'Need Calibration', pic: 'Andi M.', terakhir_perawatan: '2025-12-10', jadwal_perawatan: '2026-06-10' },
            { kode_alat: 'VEH-FL-02', nama_alat: 'Forklift Elektrik 3T', kategori: 'Kendaraan', status: 'Under Maintenance', pic: 'Tim Logistik', terakhir_perawatan: '2026-06-01', jadwal_perawatan: '2026-09-01' },
            { kode_alat: 'MCH-FL-01', nama_alat: 'Filling Machine Otomatis', kategori: 'Mesin Produksi', status: 'Operational', pic: 'Budi Santoso', terakhir_perawatan: '2026-04-20', jadwal_perawatan: '2026-07-20' },
            { kode_alat: 'TL-PH-01', nama_alat: 'pH Meter Laboratorium', kategori: 'Alat Ukur', status: 'Broken', pic: 'Siska QA', terakhir_perawatan: '2026-01-15', jadwal_perawatan: '2026-07-15' },
        ]
        toolsList.value = dummyTools
        localStorage.setItem('pracindo_factory_tools', JSON.stringify(dummyTools))
    }
})

// Logika Statistik Kartu
const totalTools = computed(() => toolsList.value.length)
const operationalCount = computed(() => toolsList.value.filter(t => t.status === 'Operational').length)
const issueCount = computed(() => toolsList.value.filter(t => t.status !== 'Operational').length)

// Logika Filter Tabel
const filteredTools = computed(() => {
    return toolsList.value.filter(tool => {
        const matchCategory = categoryFilter.value === 'all' || tool.kategori === categoryFilter.value
        const matchSearch =
            tool.kode_alat.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            tool.nama_alat.toLowerCase().includes(searchQuery.value.toLowerCase())

        return matchCategory && matchSearch
    })
})

// Helper Visual (Warna Status & Ikon Kategori)
const getStatusBadge = (status) => {
    switch (status) {
        case 'Operational': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
        case 'Need Calibration': return 'bg-amber-100 text-amber-700 border-amber-200'
        case 'Under Maintenance': return 'bg-blue-100 text-blue-700 border-blue-200'
        case 'Broken': return 'bg-red-100 text-red-700 border-red-200'
        default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
}

const getCategoryIcon = (kategori) => {
    switch (kategori) {
        case 'Mesin Produksi': return 'pi-cog text-indigo-500'
        case 'Alat Ukur': return 'pi-chart-bar text-teal-500'
        case 'Kendaraan': return 'pi-truck text-amber-500'
        default: return 'pi-box text-slate-500'
    }
}

// Menghitung Sisa Hari Menuju Perawatan Berikutnya
const calculateDaysLeft = (targetDate) => {
    if (!targetDate) return '-'
    const today = new Date('2026-06-11') // Menggunakan konteks waktu saat ini
    const target = new Date(targetDate)
    const diffTime = target - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { text: `Terlewat ${Math.abs(diffDays)} Hari`, class: 'text-red-600 font-bold' }
    if (diffDays <= 14) return { text: `${diffDays} Hari Lagi`, class: 'text-amber-600 font-bold' }
    return { text: `${diffDays} Hari Lagi`, class: 'text-slate-500' }
}

// Fungsi Simpan Item Baru
const simpanAlat = () => {
    if (!formTool.kode_alat || !formTool.nama_alat) {
        alert("Kode dan Nama Alat wajib diisi!")
        return
    }

    toolsList.value.unshift({ ...formTool })
    localStorage.setItem('pracindo_factory_tools', JSON.stringify(toolsList.value))

    alert(`Alat/Mesin ${formTool.nama_alat} berhasil diregistrasi!`)
    showAddModal.value = false

    // Reset Form
    Object.assign(formTool, {
        kode_alat: '', nama_alat: '', kategori: 'Mesin Produksi', status: 'Operational', pic: '', terakhir_perawatan: '', jadwal_perawatan: ''
    })
}
</script>

<template>
    <div class="space-y-6 animate-fade-in text-slate-700 p-4 sm:p-0">

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Tools & Machine Management</h2>
                <p class="text-slate-500 text-xs sm:text-sm mt-1">Registrasi aset mesin, alat ukur, dan jadwal kalibrasi
                    pabrik.</p>
            </div>

            <button @click="showAddModal = true"
                class="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                <i class="pi pi-plus text-base"></i>
                <span>Registrasi Alat Baru</span>
            </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            <div
                class="bg-white border border-slate-200 rounded-[20px] p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div
                    class="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center shrink-0 border border-slate-200">
                    <i class="pi pi-database text-xl"></i>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Aset Terdaftar</p>
                    <h3 class="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">{{ totalTools }} <span
                            class="text-xs sm:text-sm font-semibold text-slate-500">Unit</span></h3>
                </div>
            </div>

            <div
                class="bg-white border border-emerald-100 rounded-[20px] p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(16,185,129,0.05)] relative overflow-hidden">
                <div
                    class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
                    <i class="pi pi-check-circle text-xl"></i>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Kondisi Prima
                        (Beroperasi)</p>
                    <h3 class="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">{{ operationalCount }} <span
                            class="text-xs sm:text-sm font-semibold text-emerald-600">Unit</span></h3>
                </div>
            </div>

            <div
                class="bg-white border border-amber-100 rounded-[20px] p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(245,158,11,0.05)] relative overflow-hidden sm:col-span-2 md:col-span-1">
                <div
                    class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                    <i class="pi pi-wrench text-xl"></i>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Perlu Tindakan (Rusak / MT)
                    </p>
                    <h3 class="text-xl sm:text-2xl font-black text-amber-700 mt-0.5">{{ issueCount }} <span
                            class="text-xs sm:text-sm font-semibold text-amber-600">Unit</span></h3>
                </div>
            </div>
        </div>

        <div
            class="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
            <div class="flex bg-slate-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto hide-scrollbar">
                <button @click="categoryFilter = 'all'"
                    :class="categoryFilter === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none">Semua
                    Aset</button>
                <button @click="categoryFilter = 'Mesin Produksi'"
                    :class="categoryFilter === 'Mesin Produksi' ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none">Mesin
                    Produksi</button>
                <button @click="categoryFilter = 'Alat Ukur'"
                    :class="categoryFilter === 'Alat Ukur' ? 'bg-white text-teal-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none">Alat
                    Ukur</button>
                <button @click="categoryFilter = 'Kendaraan'"
                    :class="categoryFilter === 'Kendaraan' ? 'bg-white text-amber-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none">Kendaraan</button>
            </div>

            <div class="relative w-full lg:w-72">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input type="text" v-model="searchQuery" placeholder="Cari Kode atau Nama Alat..."
                    class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-700" />
            </div>
        </div>

        <div
            class="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div class="overflow-x-auto hide-scrollbar">
                <table class="w-full text-left text-sm border-collapse min-w-[800px]">
                    <thead class="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <tr>
                            <th class="py-4 px-6 font-semibold whitespace-nowrap">Kode & Nama Aset</th>
                            <th class="py-4 px-4 font-semibold whitespace-nowrap">Status Fisik</th>
                            <th class="py-4 px-4 font-semibold whitespace-nowrap">Penanggung Jawab</th>
                            <th class="py-4 px-4 font-semibold whitespace-nowrap">MT Terakhir</th>
                            <th class="py-4 px-6 font-semibold whitespace-nowrap">Jadwal MT / Kalibrasi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        <tr v-for="item in filteredTools" :key="item.kode_alat"
                            class="hover:bg-slate-50/40 transition-colors">

                            <td class="py-4 px-6 whitespace-nowrap">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                        <i :class="['pi', getCategoryIcon(item.kategori)]"></i>
                                    </div>
                                    <div>
                                        <span class="font-bold text-slate-900 block text-sm">{{ item.kode_alat }}</span>
                                        <span class="text-xs font-medium text-slate-500 block mt-0.5">{{ item.nama_alat
                                        }}</span>
                                    </div>
                                </div>
                            </td>

                            <td class="py-4 px-4 whitespace-nowrap">
                                <span :class="getStatusBadge(item.status)"
                                    class="px-2.5 py-1 rounded-md text-[11px] font-bold border tracking-wide whitespace-nowrap">
                                    {{ item.status }}
                                </span>
                            </td>

                            <td class="py-4 px-4 whitespace-nowrap">
                                <span class="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                                    <i class="pi pi-user text-[10px] text-slate-400"></i> {{ item.pic || 'Belum diatur'
                                    }}
                                </span>
                            </td>

                            <td class="py-4 px-4 whitespace-nowrap">
                                <span class="text-xs text-slate-600">{{ item.terakhir_perawatan || '-' }}</span>
                            </td>

                            <td class="py-4 px-6 whitespace-nowrap">
                                <div class="flex flex-col">
                                    <span class="text-sm font-bold text-slate-800">{{ item.jadwal_perawatan || '-'
                                    }}</span>
                                    <span class="text-[10px] mt-0.5"
                                        :class="calculateDaysLeft(item.jadwal_perawatan).class">
                                        <i class="pi pi-clock text-[9px]"></i> {{
                                            calculateDaysLeft(item.jadwal_perawatan).text }}
                                    </span>
                                </div>
                            </td>

                        </tr>
                    </tbody>
                </table>
                <div v-if="filteredTools.length === 0" class="py-12 text-center flex flex-col items-center w-full">
                    <i class="pi pi-inbox text-4xl text-slate-300 mb-3"></i>
                    <p class="text-slate-500 text-sm font-medium">Aset mesin/alat tidak ditemukan.</p>
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
                    <h3 class="text-base font-bold text-slate-800">Registrasi Aset Pabrik</h3>
                    <button @click="showAddModal = false"
                        class="text-slate-400 hover:text-red-500 transition-colors p-1">
                        <i class="pi pi-times text-lg"></i>
                    </button>
                </div>

                <div class="p-6 space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">KODE ASET / ALAT</label>
                            <input type="text" v-model="formTool.kode_alat" placeholder="Contoh: MCH-001"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 uppercase" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">KATEGORI</label>
                            <select v-model="formTool.kategori"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                                <option value="Mesin Produksi">Mesin Produksi</option>
                                <option value="Alat Ukur">Alat Ukur (Butuh Kalibrasi)</option>
                                <option value="Kendaraan">Kendaraan Logistik</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-500">NAMA ALAT / MESIN</label>
                        <input type="text" v-model="formTool.nama_alat" placeholder="Nama spesifik aset..."
                            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">STATUS FISIK AWAL</label>
                            <select v-model="formTool.status"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                                <option value="Operational">Operational (Normal)</option>
                                <option value="Under Maintenance">Under Maintenance</option>
                                <option value="Need Calibration">Need Calibration</option>
                                <option value="Broken">Broken (Rusak)</option>
                            </select>
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">PENANGGUNG JAWAB (PIC)</label>
                            <input type="text" v-model="formTool.pic" placeholder="Nama teknisi / operator..."
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">TERAKHIR PERAWATAN</label>
                            <input type="date" v-model="formTool.terakhir_perawatan"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-700" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">JADWAL MT BERIKUTNYA</label>
                            <input type="date" v-model="formTool.jadwal_perawatan"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-700" />
                        </div>
                    </div>
                </div>

                <div
                    class="sticky bottom-0 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 bg-slate-50/95 backdrop-blur-sm">
                    <button @click="showAddModal = false"
                        class="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Batal</button>
                    <button @click="simpanAlat"
                        class="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-md">Simpan
                        Registrasi</button>
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

/* Sembunyikan scrollbar tapi tetap bisa di-scroll */
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