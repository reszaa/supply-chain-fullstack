import { ref, reactive } from 'vue'
import api from '@/utils/api'

export function useReceived() {
    const isLoading = ref(false)
    const isSaving = ref(false)
    const poList = ref([])
    const selectedPODetail = ref(null)

    const formHeader = reactive({
        ref_id: '',
        po_no: '',
        tanggal_datang: new Date().toISOString().split('T')[0]
    })

    const formItems = ref([
        { nama_bahan: '', packaging: '', unit_kg: 0, total_unit: 0, berat: 0 }
    ])

    const fetchAvailablePO = async () => {
        isLoading.value = true
        try {
            const response = await api.get('purchase-order/')

            let allPO = []
            if (Array.isArray(response.data)) {
                allPO = response.data
            } else if (response.data && Array.isArray(response.data.data)) {
                allPO = response.data.data
            } else if (response.data && Array.isArray(response.data.results)) {
                allPO = response.data.results
            }

            poList.value = allPO
                .filter(po => po.status_audit === false || po.status_audit === 'false' || po.status_audit === 'False' || !po.status_audit)
                .map(po => ({
                    id: po.id_transaksi,
                    ref_text: `${po.id_transaksi} - ${po.nama_supplier}`
                }))

        } catch (error) {
            console.error("Gagal memuat daftar PO:", error)
        } finally {
            isLoading.value = false
        }
    }


    const fetchPODetail = async (id) => {
        if (!id) {
            selectedPODetail.value = null
            return
        }
        isLoading.value = true
        try {
            const response = await api.get(`purchase-order/${id}/`)

            const data = response.data.data || response.data.results || response.data

            selectedPODetail.value = {
                ...data,
                items: data.daftar_item || []
            }

            formHeader.po_no = data.id_transaksi || ''

            if (data.daftar_item && data.daftar_item.length > 0) {
                formItems.value = data.daftar_item.map(item => ({
                    nama_bahan: item.nama_item || '',
                    packaging: item.packaging || 'sak',
                    unit_kg: parseFloat(item.unit_kg) || 0,
                    total_unit: parseFloat(item.total_unit) || 0,
                    berat: (parseFloat(item.unit_kg) * parseFloat(item.total_unit)) || 0
                }))
            }
        } catch (error) {
            console.error("Gagal memuat detail PO:", error)
        } finally {
            isLoading.value = false
        }
    }

    const calcWeight = (index) => {
        const item = formItems.value[index]
        item.berat = (parseFloat(item.unit_kg) * parseFloat(item.total_unit)) || 0
    }

    const addRow = () => {
        formItems.value.push({ nama_bahan: '', packaging: '', unit_kg: 0, total_unit: 0, berat: 0 })
    }

    const removeRow = (index) => {
        if (formItems.value.length > 1) {
            formItems.value.splice(index, 1)
        } else {
            alert("Minimal harus ada 1 item barang!")
        }
    }

    const resetForm = () => {
        formHeader.ref_id = ''
        formHeader.po_no = ''
        formHeader.tanggal_datang = new Date().toISOString().split('T')[0]
        formItems.value = [{ nama_bahan: '', packaging: '', unit_kg: 0, total_unit: 0, berat: 0 }]
        selectedPODetail.value = null
    }

    const saveData = async () => {
        if (!formHeader.ref_id) return alert("Pilih Referensi PO terlebih dahulu!")

        isSaving.value = true
        try {
            const payload = {
                header: formHeader,
                items: formItems.value
            }

            const response = await api.post('purchase-order/terima-barang/', payload)

            if (response.status === 200 || response.status === 201) {
                alert("Penerimaan Berhasil! Status PO kini siap diaudit Akuntansi.")
                resetForm()
                await fetchAvailablePO()
            }
        } catch (error) {
            console.error("Gagal menyimpan penerimaan:", error)
            alert("Gagal menyimpan data. Pastikan koneksi server stabil.")
        } finally {
            isSaving.value = false
        }
    }

    return {
        isLoading, isSaving, poList, selectedPODetail, formHeader, formItems,
        fetchAvailablePO, fetchPODetail, calcWeight, addRow, removeRow, resetForm, saveData
    }
}