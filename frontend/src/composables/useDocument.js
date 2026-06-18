import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/utils/api'
import { calculatePOFinance } from '@/utils/paymentHelper'

export function useDocument() {
    const searchQuery = ref('')
    const statusFilter = ref('all')
    const uploadForm = reactive({
        po_reference: '',
        document_type: 'Invoice',
        document_number: '',
        partner_name: '',
        upload_date: new Date().toISOString().split('T')[0]
    })

    const auditGroupedDocs = ref([])

    const fetchDocuments = async () => {
        try {
            const response = await api.get('purchase-order/')
            let realPOs = []
            if (Array.isArray(response.data)) {
                realPOs = response.data
            } else if (response.data && Array.isArray(response.data.results)) {
                realPOs = response.data.results
            } else if (response.data && Array.isArray(response.data.data)) {
                realPOs = response.data.data
            } else {
                realPOs = [response.data]
            }

            const localFiles = JSON.parse(localStorage.getItem('pracindo_docs_status')) || {}

            const mappedData = realPOs.map(po => {
                const poId = po.id_transaksi || po.po_no || 'UNKNOWN_PO'

                // Panggil Kalkulator Global
                const finance = calculatePOFinance(po)

                let savedFiles = localFiles[poId]
                if (!savedFiles || !savedFiles.invoice || !savedFiles.faktur_pajak || !savedFiles.surat_jalan) {
                    savedFiles = {
                        invoice: { exists: false, doc_no: '-', date: '-' },
                        faktur_pajak: { exists: false, doc_no: '-', date: '-' },
                        surat_jalan: { exists: false, doc_no: '-', date: '-' }
                    }
                }

                let namaPartner = '-'
                if (po.nama_supplier) {
                    namaPartner = po.nama_supplier
                } else if (po.supplier && po.supplier.nama_suplier) {
                    namaPartner = po.supplier.nama_suplier
                }

                // ✅ KEMBALIKAN IDENTITAS ASLI UNTUK HALAMAN DOCUMENT
                return {
                    po_id: poId,
                    partner: namaPartner,
                    date: po.tanggal || '-',
                    files: savedFiles,
                    payment_status: finance.status // Ambil status dari kalkulator
                }
            })

            auditGroupedDocs.value = mappedData

        } catch (error) {
            console.error("Gagal mengambil data PO dari server:", error)
        }
    }

    const getComplianceStats = (files) => {
        if (!files || !files.invoice || !files.faktur_pajak || !files.surat_jalan) {
            return { count: 0, percentage: 0, isComplete: false }
        }

        const totalRequired = 3
        let uploadedCount = 0

        if (files.invoice.exists) uploadedCount++
        if (files.faktur_pajak.exists) uploadedCount++
        if (files.surat_jalan.exists) uploadedCount++

        return {
            count: uploadedCount,
            percentage: Math.round((uploadedCount / totalRequired) * 100),
            isComplete: uploadedCount === totalRequired
        }
    }

    const totalTransactions = computed(() => auditGroupedDocs.value.length)
    const fullyCompliantCount = computed(() => auditGroupedDocs.value.filter(item => getComplianceStats(item.files).isComplete).length)
    const missingDocsCount = computed(() => totalTransactions.value - fullyCompliantCount.value)

    const filteredAuditData = computed(() => {
        return auditGroupedDocs.value.filter(item => {
            const stats = getComplianceStats(item.files)
            const matchFilter = statusFilter.value === 'all' ||
                (statusFilter.value === 'lengkap' && stats.isComplete) ||
                (statusFilter.value === 'tidak_lengkap' && !stats.isComplete)

            const safePoId = String(item.po_id || '').toLowerCase()
            const safePartner = String(item.partner || '').toLowerCase()
            const safeQuery = String(searchQuery.value || '').toLowerCase()

            const matchSearch = safePoId.includes(safeQuery) || safePartner.includes(safeQuery)

            return matchFilter && matchSearch
        })
    })

    const saveToLocalStatus = () => {
        const statusToSave = {}
        auditGroupedDocs.value.forEach(item => {
            statusToSave[item.po_id] = item.files
        })
        localStorage.setItem('pracindo_docs_status', JSON.stringify(statusToSave))
    }

    const handleUploadDocument = async () => {
        if (!uploadForm.po_reference || !uploadForm.document_number) return false

        let poIndex = auditGroupedDocs.value.findIndex(item => item.po_id.toUpperCase() === uploadForm.po_reference.toUpperCase())
        if (poIndex !== -1) {
            const targetType = uploadForm.document_type.toLowerCase()
            if (targetType === 'invoice') auditGroupedDocs.value[poIndex].files.invoice = { exists: true, doc_no: uploadForm.document_number, date: uploadForm.upload_date }
            else if (targetType === 'faktur pajak') auditGroupedDocs.value[poIndex].files.faktur_pajak = { exists: true, doc_no: uploadForm.document_number, date: uploadForm.upload_date }
            else if (targetType === 'surat jalan') auditGroupedDocs.value[poIndex].files.surat_jalan = { exists: true, doc_no: uploadForm.document_number, date: uploadForm.upload_date }

            saveToLocalStatus()
            return true
        }
        return false
    }

    const hapusDokumen = async (item, type) => {
        if (confirm(`Hapus dokumen ${type} ini?`)) {
            if (type === 'Invoice') item.files.invoice = { exists: false, doc_no: '-', date: '-' }
            if (type === 'Faktur Pajak') item.files.faktur_pajak = { exists: false, doc_no: '-', date: '-' }
            if (type === 'Surat Jalan') item.files.surat_jalan = { exists: false, doc_no: '-', date: '-' }
            saveToLocalStatus()
        }
    }

    onMounted(() => {
        fetchDocuments()
    })

    return {
        searchQuery, statusFilter, uploadForm, auditGroupedDocs,
        totalTransactions, fullyCompliantCount, missingDocsCount,
        filteredAuditData, getComplianceStats, handleUploadDocument,
        hapusDokumen, fetchDocuments
    }
}