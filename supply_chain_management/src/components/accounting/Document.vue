<script setup>
import { ref } from 'vue'
import { useDocument } from '@/composables/useDocument'
import api from '../../utils/api';
const {
    searchQuery, statusFilter, uploadForm, totalTransactions,
    fullyCompliantCount, missingDocsCount, filteredAuditData,
    getComplianceStats, handleUploadDocument, hapusDokumen
} = useDocument()

const showUploadModal = ref(false)
const showDetailModal = ref(false)
const selectedAuditItem = ref(null)

// ✅ FUNGSI WARNA BADGE YANG TADI TERLEWAT
const getPaymentBadge = (status) => {
    if (status === 'Paid') return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    if (status === 'Partial') return 'bg-blue-100 text-blue-700 border border-blue-200'
    return 'bg-amber-100 text-amber-700 border border-amber-200'
}

const openDetailModal = (item) => {
    selectedAuditItem.value = item
    showDetailModal.value = true
}

const submitUpload = async () => {
    const success = await handleUploadDocument()
    if (success) {
        alert('Dokumen berhasil diunggah ke arsip sistem audit!')
        showUploadModal.value = false
    }
}

const hapusDokumenModal = (type) => {
    hapusDokumen(selectedAuditItem.value, type)
}

const openUploadModalFor = (po_id, partner, docType) => {
    uploadForm.po_reference = po_id
    uploadForm.partner_name = partner
    uploadForm.document_type = docType
    uploadForm.document_number = ''
    showUploadModal.value = true
}
</script>

<template>
    <div class="space-y-6 animate-fade-in text-slate-700">

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Document Control & Audit</h2>
                <p class="text-slate-500 text-sm mt-1">Monitoring kelengkapan berkas legal pengiriman dan penagihan.</p>
            </div>

            <button @click="showUploadModal = true"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-[0_4px_15px_rgba(16,185,129,0.2)] transition-all flex items-center gap-2">
                <i class="pi pi-cloud-upload text-base"></i>
                <span>Upload Dokumen Baru</span>
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div
                class="bg-white border border-slate-200 rounded-[20px] p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div
                    class="w-11 h-11 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                    <i class="pi pi-folder text-lg"></i>
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Transaksi PO</p>
                    <h3 class="text-xl font-black text-slate-800 mt-0.5">{{ totalTransactions }} Rute</h3>
                </div>
            </div>

            <div
                class="bg-white border border-slate-200 rounded-[20px] p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div
                    class="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
                    <i class="pi pi-verified text-lg"></i>
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Lengkap (Audit Pass)</p>
                    <h3 class="text-xl font-black text-emerald-600 mt-0.5">{{ fullyCompliantCount }} Terverifikasi</h3>
                </div>
            </div>

            <div
                class="bg-white border border-slate-200 rounded-[20px] p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div
                    class="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                    <i class="pi pi-exclamation-triangle text-lg"></i>
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Belum Lengkap (Missing)</p>
                    <h3 class="text-xl font-black text-amber-600 mt-0.5">{{ missingDocsCount }} Pending</h3>
                </div>
            </div>
        </div>

        <div
            class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
            <div class="flex bg-slate-100 p-1 rounded-xl w-full lg:w-auto">
                <button @click="statusFilter = 'all'"
                    :class="statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap">Semua Berkas</button>
                <button @click="statusFilter = 'lengkap'"
                    :class="statusFilter === 'lengkap' ? 'bg-white text-emerald-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap">Lengkap (100%)</button>
                <button @click="statusFilter = 'tidak_lengkap'"
                    :class="statusFilter === 'tidak_lengkap' ? 'bg-white text-amber-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
                    class="px-4 py-2 text-xs rounded-lg transition-all whitespace-nowrap">Belum Lengkap</button>
            </div>

            <div class="relative w-full lg:w-72">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input type="text" v-model="searchQuery" placeholder="Cari No. PO atau Supplier..."
                    class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-700" />
            </div>
        </div>

        <div
            class="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm border-collapse">
                    <thead class="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <tr>
                            <th class="py-4 px-6 font-semibold">Referensi Transaksi</th>
                            <th class="py-4 px-4 font-semibold text-center">1. Invoice</th>
                            <th class="py-4 px-4 font-semibold text-center">2. Faktur Pajak</th>
                            <th class="py-4 px-4 font-semibold text-center">3. Surat Jalan</th>
                            <th class="py-4 px-6 font-semibold text-center">Status Audit</th>
                            <th class="py-4 px-4 font-semibold text-center">Status Pembayaran</th>
                            <th class="py-4 px-4 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        <tr v-for="item in filteredAuditData" :key="item.po_id"
                            class="hover:bg-slate-50/40 transition-colors">

                            <td class="py-4 px-6">
                                <span class="font-bold text-slate-900 block text-base">{{ item.po_id }}</span>
                                <span class="text-xs font-medium text-slate-500 block mt-0.5">{{ item.partner }}</span>
                            </td>

                            <td class="py-4 px-4 text-center">
                                <div v-if="item.files.invoice.exists"
                                    class="inline-flex flex-col items-center bg-emerald-50/60 border border-emerald-100 px-3 py-1.5 rounded-xl">
                                    <span class="text-xs font-bold text-emerald-700 flex items-center gap-1"><i
                                            class="pi pi-check text-[10px]"></i> Tersedia</span>
                                    <span class="text-[9px] text-emerald-600 font-medium mt-0.5">{{
                                        item.files.invoice.doc_no }}</span>
                                </div>
                                <button v-else @click="openUploadModalFor(item.po_id, item.partner, 'Invoice')"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 rounded-xl text-xs font-bold tracking-wide transition-colors shadow-sm">
                                    <i class="pi pi-cloud-upload text-[10px]"></i> Upload
                                </button>
                            </td>

                            <td class="py-4 px-4 text-center">
                                <div v-if="item.files.faktur_pajak.exists"
                                    class="inline-flex flex-col items-center bg-emerald-50/60 border border-emerald-100 px-3 py-1.5 rounded-xl">
                                    <span class="text-xs font-bold text-emerald-700 flex items-center gap-1"><i
                                            class="pi pi-check text-[10px]"></i> Tersedia</span>
                                    <span class="text-[9px] text-emerald-600 font-medium mt-0.5">{{
                                        item.files.faktur_pajak.doc_no }}</span>
                                </div>
                                <button v-else @click="openUploadModalFor(item.po_id, item.partner, 'Faktur Pajak')"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 rounded-xl text-xs font-bold tracking-wide transition-colors shadow-sm">
                                    <i class="pi pi-cloud-upload text-[10px]"></i> Upload
                                </button>
                            </td>

                            <td class="py-4 px-4 text-center">
                                <div v-if="item.files.surat_jalan.exists"
                                    class="inline-flex flex-col items-center bg-emerald-50/60 border border-emerald-100 px-3 py-1.5 rounded-xl">
                                    <span class="text-xs font-bold text-emerald-700 flex items-center gap-1"><i
                                            class="pi pi-check text-[10px]"></i> Tersedia</span>
                                    <span class="text-[9px] text-emerald-600 font-medium mt-0.5">{{
                                        item.files.surat_jalan.doc_no }}</span>
                                </div>
                                <button v-else @click="openUploadModalFor(item.po_id, item.partner, 'Surat Jalan')"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 rounded-xl text-xs font-bold tracking-wide transition-colors shadow-sm">
                                    <i class="pi pi-cloud-upload text-[10px]"></i> Upload
                                </button>
                            </td>

                            <td class="py-4 px-6 text-center">
                                <div class="flex flex-col items-center gap-1.5">
                                    <span
                                        :class="getComplianceStats(item.files).isComplete ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-700'"
                                        class="px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                                        {{ getComplianceStats(item.files).isComplete ? 'PASSED' : 'INCOMPLETE' }}
                                    </span>
                                    <div
                                        class="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                                        <div :class="getComplianceStats(item.files).isComplete ? 'bg-emerald-500' : 'bg-amber-500'"
                                            :style="{ width: getComplianceStats(item.files).percentage + '%' }"
                                            class="h-full transition-all"></div>
                                    </div>
                                    <span class="text-[10px] text-slate-400 font-bold">{{
                                        getComplianceStats(item.files).percentage }}% Lengkap</span>
                                </div>
                            </td>

                            <td class="py-4 px-4 text-center">
                                <span :class="getPaymentBadge(item.payment_status)"
                                    class="px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider inline-block min-w-[80px]">
                                    {{ item.payment_status }}
                                </span>
                            </td>

                            <td class="py-4 px-4 text-center">
                                <button @click="openDetailModal(item)"
                                    class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 transition-colors inline-flex items-center justify-center shadow-sm"
                                    title="Lihat Detail Transaksi">
                                    <i class="pi pi-eye text-sm"></i>
                                </button>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showUploadModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            @click.self="showUploadModal = false">
            <div
                class="bg-white w-full max-w-md rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up">

                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 class="text-base font-bold text-slate-800">Upload Berkas Pendukung</h3>
                    <button @click="showUploadModal = false"
                        class="text-slate-400 hover:text-red-500 transition-colors">
                        <i class="pi pi-times text-lg"></i>
                    </button>
                </div>

                <div class="p-6 space-y-4">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-500">REFERENSI NO. PO / ID</label>
                        <input type="text" v-model="uploadForm.po_reference" placeholder="Contoh: PO-2026-06-002"
                            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 uppercase" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">JENIS DOKUMEN</label>
                            <select v-model="uploadForm.document_type"
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800">
                                <option value="Invoice">1. Invoice</option>
                                <option value="Faktur Pajak">2. Faktur Pajak</option>
                                <option value="Surat Jalan">3. Surat Jalan</option>
                            </select>
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-500">NOMOR DOKUMEN</label>
                            <input type="text" v-model="uploadForm.document_number" placeholder="No. Seri Berkas..."
                                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-500">NAMA REKANAN / SUPPLIER</label>
                        <input type="text" v-model="uploadForm.partner_name"
                            placeholder="Isi jika rute transaksi PO baru..."
                            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" />
                    </div>
                </div>

                <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                    <button @click="showUploadModal = false"
                        class="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Batal</button>
                    <button @click="handleUploadDocument"
                        class="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-600/10">Arsipkan
                        Dokumen</button>
                </div>
            </div>
        </div>

        <div v-if="showDetailModal && selectedAuditItem"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            @click.self="showDetailModal = false">
            <div
                class="bg-white w-full max-w-3xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up">

                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 class="text-base font-bold text-slate-800">Detail Transaksi Audit</h3>
                    <button @click="showDetailModal = false"
                        class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center">
                        <i class="pi pi-times text-sm"></i>
                    </button>
                </div>

                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">

                    <div>
                        <h4 class="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <i class="pi pi-info-circle text-emerald-500"></i> Informasi Transaksi
                        </h4>
                        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">REFERENSI
                                    PO</p>
                                <p class="text-lg font-black text-slate-800">{{ selectedAuditItem.po_id }}</p>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        TANGGAL PO</p>
                                    <p class="text-sm font-bold text-slate-700">{{ selectedAuditItem.date }}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        REKANAN</p>
                                    <p class="text-sm font-bold text-slate-700">{{ selectedAuditItem.partner }}</p>
                                </div>
                            </div>
                            <div class="pt-2 border-t border-slate-200">
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">STATUS
                                    AUDIT</p>
                                <div class="flex items-center justify-between mb-1.5">
                                    <span class="text-xs font-bold"
                                        :class="getComplianceStats(selectedAuditItem.files).isComplete ? 'text-emerald-600' : 'text-amber-600'">
                                        {{ getComplianceStats(selectedAuditItem.files).isComplete ? 'Lengkap 100%' :
                                            'Belum Lengkap' }}
                                    </span>
                                    <span class="text-xs font-bold text-slate-500">{{
                                        getComplianceStats(selectedAuditItem.files).count }} / 3 Berkas</span>
                                </div>
                                <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div :class="getComplianceStats(selectedAuditItem.files).isComplete ? 'bg-emerald-500' : 'bg-amber-500'"
                                        :style="{ width: getComplianceStats(selectedAuditItem.files).percentage + '%' }"
                                        class="h-full transition-all duration-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 class="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <i class="pi pi-folder-open text-emerald-500"></i> Kelengkapan Berkas
                        </h4>
                        <div class="space-y-3">

                            <div
                                class="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm hover:border-emerald-200 transition-colors">
                                <div>
                                    <p class="text-xs font-bold text-slate-800 mb-1">1. Invoice</p>
                                    <span v-if="selectedAuditItem.files.invoice.exists"
                                        class="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100">
                                        Tersedia: {{ selectedAuditItem.files.invoice.doc_no }}
                                    </span>
                                    <span v-else
                                        class="inline-block px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100">Belum
                                        Ada</span>
                                </div>
                                <div v-if="selectedAuditItem.files.invoice.exists" class="flex items-center gap-2">
                                    <button
                                        class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center"
                                        title="Unduh Berkas">
                                        <i class="pi pi-download text-xs"></i>
                                    </button>
                                    <button @click="hapusDokumen('Invoice')"
                                        class="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                                        title="Hapus Berkas">
                                        <i class="pi pi-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>

                            <div
                                class="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm hover:border-emerald-200 transition-colors">
                                <div>
                                    <p class="text-xs font-bold text-slate-800 mb-1">2. Faktur Pajak</p>
                                    <span v-if="selectedAuditItem.files.faktur_pajak.exists"
                                        class="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100">
                                        Tersedia: {{ selectedAuditItem.files.faktur_pajak.doc_no }}
                                    </span>
                                    <span v-else
                                        class="inline-block px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100">Belum
                                        Ada</span>
                                </div>
                                <div v-if="selectedAuditItem.files.faktur_pajak.exists" class="flex items-center gap-2">
                                    <button
                                        class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center"
                                        title="Unduh Berkas">
                                        <i class="pi pi-download text-xs"></i>
                                    </button>
                                    <button @click="hapusDokumen('Faktur Pajak')"
                                        class="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                                        title="Hapus Berkas">
                                        <i class="pi pi-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>

                            <div
                                class="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm hover:border-emerald-200 transition-colors">
                                <div>
                                    <p class="text-xs font-bold text-slate-800 mb-1">3. Surat Jalan</p>
                                    <span v-if="selectedAuditItem.files.surat_jalan.exists"
                                        class="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100">
                                        Tersedia: {{ selectedAuditItem.files.surat_jalan.doc_no }}
                                    </span>
                                    <span v-else
                                        class="inline-block px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100">Belum
                                        Ada</span>
                                </div>
                                <div v-if="selectedAuditItem.files.surat_jalan.exists" class="flex items-center gap-2">
                                    <button
                                        class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center"
                                        title="Unduh Berkas">
                                        <i class="pi pi-download text-xs"></i>
                                    </button>
                                    <button @click="hapusDokumen('Surat Jalan')"
                                        class="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                                        title="Hapus Berkas">
                                        <i class="pi pi-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
                    <button @click="showDetailModal = false"
                        class="px-6 py-2.5 text-xs font-bold text-white bg-slate-800 rounded-xl hover:bg-slate-900 shadow-md transition-all">Tutup</button>
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