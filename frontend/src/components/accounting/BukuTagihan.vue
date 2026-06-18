<template>
    <!-- [UBAH] Menambahkan overflow-hidden dan max-w-full pada container paling luar agar aman di layar HP -->
    <div class="flex flex-col w-full animate-fade-in overflow-hidden max-w-full">

        <div class="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
                <!-- [UBAH] Menyesuaikan ukuran font (text-xl sm:text-2xl) untuk HP -->
                <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Buku Tagihan (Invoices)</h2>
                <!-- [UBAH] Menyesuaikan ukuran font deskripsi (text-xs sm:text-sm) -->
                <p class="text-slate-500 text-xs sm:text-sm mt-1">Kelola semua tagihan vendor, jatuh tempo, dan status
                    pembayaran.
                </p>
            </div>
            <!-- [UBAH] Menambahkan w-full sm:w-auto dan justify-center agar tombol memanjang penuh di HP -->
            <button
                class="w-full sm:w-auto justify-center px-6 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 transform hover:-translate-y-0.5 whitespace-nowrap">
                <i class="pi pi-plus"></i> Buat Tagihan Baru
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
                class="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm flex items-center gap-5 relative overflow-hidden group">
                <div
                    class="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform">
                </div>
                <div
                    class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <i class="pi pi-clock text-2xl"></i>
                </div>
                <div>
                    <p class="text-sm font-bold text-slate-500 mb-1">Belum Dibayar (Unpaid)</p>
                    <!-- [UBAH] Ukuran font angka disesuaikan text-xl sm:text-2xl agar tidak kepanjangan di HP -->
                    <h3 class="text-xl sm:text-2xl font-extrabold text-slate-800">Rp {{ Math.round(totalUnpaid ||
                        0).toLocaleString('id-ID') }}</h3>
                </div>
            </div>

            <div
                class="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm flex items-center gap-5 relative overflow-hidden group">
                <div
                    class="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform">
                </div>
                <div
                    class="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <i class="pi pi-check-circle text-2xl"></i>
                </div>
                <div>
                    <p class="text-sm font-bold text-slate-500 mb-1">Sudah Lunas (Paid)</p>
                    <!-- [UBAH] Ukuran font angka disesuaikan text-xl sm:text-2xl -->
                    <h3 class="text-xl sm:text-2xl font-extrabold text-slate-800">Rp {{ Math.round(totalPaid ||
                        0).toLocaleString('id-ID') }}</h3>
                </div>
            </div>

            <div
                class="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm flex items-center gap-5 relative overflow-hidden group">
                <div
                    class="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform">
                </div>
                <div
                    class="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                    <i class="pi pi-exclamation-triangle text-2xl"></i>
                </div>
                <div>
                    <p class="text-sm font-bold text-slate-500 mb-1">Jatuh Tempo (Overdue)</p>
                    <!-- [UBAH] Ukuran font angka disesuaikan text-xl sm:text-2xl -->
                    <h3 class="text-xl sm:text-2xl font-extrabold text-slate-800">Rp {{ Math.round(totalOverdue ||
                        0).toLocaleString('id-ID') }}</h3>
                </div>
            </div>
        </div>

        <!-- [UBAH] Menambahkan w-full overflow-hidden, padding p-4 sm:p-6 -->
        <div
            class="bg-white border border-slate-200 rounded-[24px] p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex-1 flex flex-col w-full overflow-hidden">

            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div class="relative w-full sm:w-72">
                    <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" placeholder="Cari No. Invoice / Suplier..."
                        class="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all text-sm font-medium text-slate-700">
                </div>

                <!-- [UBAH] Menambahkan w-full sm:w-auto agar grup tombol memenuhi layar di HP -->
                <div class="flex gap-2 w-full sm:w-auto">
                    <!-- [UBAH] flex-1 sm:flex-none dan justify-center agar tombol Filter dan Export membagi ruang sama rata di HP -->
                    <button @click="comingSoon('Filter')"
                        class="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <i class="pi pi-filter"></i> Filter
                    </button>
                    <button @click="comingSoon('Export')"
                        class="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <i class="pi pi-download"></i> Export
                    </button>
                </div>
            </div>

            <!-- [UBAH] Menambahkan custom-scrollbar dan pb-2 untuk memfasilitasi horizontal scroll -->
            <div class="border border-slate-200 rounded-2xl overflow-x-auto custom-scrollbar pb-2">
                <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                            <th class="p-4 font-bold">No. Invoice</th>
                            <th class="p-4 font-bold">Suplier / Vendor</th>
                            <th class="p-4 font-bold">Tgl Terbit</th>
                            <th class="p-4 font-bold">Jatuh Tempo</th>
                            <th class="p-4 font-bold text-right">Nominal (Rp)</th>
                            <th class="p-4 font-bold text-center">Status</th>
                            <th class="p-4 font-bold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="tagihanList.length === 0" class="border-b border-slate-100">
                            <td colspan="7" class="p-8 text-center text-slate-500 font-medium">
                                <i class="pi pi-inbox text-2xl mb-2 text-slate-300 block"></i>
                                Belum ada tagihan terdaftar atau sedang memuat data...
                            </td>
                        </tr>

                        <tr v-for="(invoice, index) in tagihanList" :key="index"
                            class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
                            <td class="p-4 font-bold text-slate-800">{{ invoice.id }}</td>

                            <td class="p-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                                        :class="getAvatarColor(index)">
                                        {{ invoice.vendor.substring(0, 2).toUpperCase() }}
                                    </div>
                                    <span class="font-bold text-slate-700">{{ invoice.vendor }}</span>
                                </div>
                            </td>

                            <td class="p-4 text-slate-500 font-medium">{{ invoice.tglTerbit }}</td>
                            <td class="p-4 font-medium"
                                :class="invoice.status === 'Overdue' ? 'text-red-600 font-bold' : 'text-slate-500'">
                                {{ invoice.jatuhTempo }}
                            </td>

                            <td class="p-4 text-right font-extrabold text-slate-800">
                                {{ Math.round(invoice.nominal).toLocaleString('id-ID') }}
                            </td>

                            <td class="p-4 text-center">
                                <span :class="getStatusBadge(invoice.status)"
                                    class="px-3 py-1.5 rounded-lg text-xs font-bold inline-block min-w-[90px]">
                                    {{ invoice.status }}
                                </span>
                            </td>

                            <td class="p-4 text-center">
                                <button @click="openPaymentModal(invoice)"
                                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-all mx-auto shadow-sm">
                                    <i class="pi pi-ellipsis-h"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- MODAL PEMBAYARAN -->
        <!-- [UBAH] z-[70] agar lebih di atas backdrop navigasi HP -->
        <div v-if="showModal"
            class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <!-- [UBAH] flex flex-col max-h-[90vh] agar modal bisa di-scroll di layar HP pendek -->
            <div
                class="bg-white w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">

                <!-- [UBAH] shrink-0 agar header modal tidak ikut mengecil saat di-scroll -->
                <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                    <h3 class="font-bold text-slate-800 text-sm sm:text-base">Catat Pembayaran - {{ selectedInvoice?.id
                    }}</h3>
                    <button @click="showModal = false" class="text-slate-400 hover:text-red-500">
                        <i class="pi pi-times"></i>
                    </button>
                </div>

                <!-- [UBAH] overflow-y-auto custom-scrollbar agar body form bisa di-scroll vertikal -->
                <div class="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar">
                    <div
                        class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span class="text-xs font-bold text-blue-600 uppercase">Sisa Tagihan</span>
                        <span class="text-lg font-black text-blue-700">Rp {{ Math.round(selectedInvoice?.sisa ||
                            0).toLocaleString('id-ID') }}</span>
                    </div>

                    <!-- [UBAH] grid-cols-1 sm:grid-cols-2 agar di HP form input turun satu per satu -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-slate-500">Nominal Transfer (Rp)</label>
                            <input type="number" v-model="paymentForm.nominal"
                                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-slate-500">Tanggal Bayar</label>
                            <input type="date" v-model="paymentForm.tanggal"
                                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-slate-500">Catatan / Referensi</label>
                        <input type="text" v-model="paymentForm.catatan" placeholder="Contoh: DP 50% / Pelunasan"
                            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-slate-500">Upload Bukti Transfer</label>
                        <!-- [UBAH] text-xs sm:text-sm menyesuaikan font input file di HP -->
                        <input type="file" @change="handleFileUpload"
                            class="w-full text-xs sm:text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                </div>

                <!-- [UBAH] shrink-0 dan penyesuaian flex-col/row pada tombol aksi -->
                <div class="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                    <button @click="showModal = false"
                        class="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Batal</button>
                    <button @click="handleBayar"
                        class="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md transition-all">Simpan
                        Pembayaran</button>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useTagihan } from '@/composables/useTagihan'
import api from '../../utils/api';
const { tagihanList, totalUnpaid, totalPaid, totalOverdue, submitPembayaran } = useTagihan()

const showModal = ref(false)
const selectedInvoice = ref(null)

const paymentForm = reactive({
    nominal: '',
    tanggal: new Date().toISOString().split('T')[0],
    catatan: '',
    file: null
})

const openPaymentModal = (invoice) => {
    selectedInvoice.value = invoice
    paymentForm.nominal = invoice.sisa
    paymentForm.tanggal = new Date().toISOString().split('T')[0]
    paymentForm.catatan = ''
    paymentForm.file = null
    showModal.value = true
}

const handleFileUpload = (event) => {
    paymentForm.file = event.target.files[0]
}

const handleBayar = async () => {
    if (!paymentForm.nominal || !paymentForm.tanggal) {
        alert("Nominal dan Tanggal wajib diisi!")
        return
    }

    const formData = new FormData()
    formData.append('po_referensi', selectedInvoice.value.id)
    formData.append('nominal_dibayar', paymentForm.nominal)
    formData.append('tanggal_bayar', paymentForm.tanggal)
    formData.append('catatan', paymentForm.catatan)

    if (paymentForm.file) {
        formData.append('bukti_transfer', paymentForm.file)
    }

    const result = await submitPembayaran(formData)

    if (result.success) {
        alert("Pembayaran berhasil dicatat!")
        showModal.value = false
    } else {
        alert("Gagal: " + result.message)
    }
}

const comingSoon = (fitur) => alert(`Fitur ${fitur} sedang dalam pengembangan, Kapten! 🚀`)

const getStatusBadge = (status) => {
    if (status === 'Paid') return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    if (status === 'Partial') return 'bg-blue-100 text-blue-700 border border-blue-200'
    if (status === 'Unpaid') return 'bg-amber-100 text-amber-700 border border-amber-200'
    if (status === 'Overdue') return 'bg-red-100 text-red-700 border border-red-200'
    return 'bg-slate-100 text-slate-700'
}

const getAvatarColor = (index) => {
    const colors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-orange-100 text-orange-700', 'bg-cyan-100 text-cyan-700', 'bg-pink-100 text-pink-700']
    return colors[index % colors.length]
}
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

.animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}


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