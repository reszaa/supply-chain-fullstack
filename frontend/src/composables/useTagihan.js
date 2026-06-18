import { ref, computed, onMounted } from 'vue'
import api from '@/utils/api'

export function useTagihan() {
    const tagihanList = ref([])
    const isLoading = ref(false)
    const fetchTagihan = async () => {
        isLoading.value = true
        try {
            const response = await api.get('purchase-order/')


            let poData = []
            if (Array.isArray(response.data)) {
                poData = response.data
            } else if (response.data && Array.isArray(response.data.data)) {
                poData = response.data.data
            } else if (response.data && Array.isArray(response.data.results)) {
                poData = response.data.results
            } else {
                console.warn("Format data tidak dikenali dari backend:", response.data)
                poData = [response.data]
            }

            const validPO = poData.filter(po => po.status_audit === true)

            const mapped = validPO.map(po => {
                let subtotal = 0
                if (po.daftar_item && po.daftar_item.length > 0) {
                    po.daftar_item.forEach(item => {
                        subtotal += (parseFloat(item.total_unit || 0) * parseFloat(item.harga_satuan || 0))
                    })
                }


                const ppn = subtotal * 0.11
                const grandTotal = subtotal + ppn

                let totalTerbayar = 0
                if (po.riwayat_pembayaran && po.riwayat_pembayaran.length > 0) {
                    po.riwayat_pembayaran.forEach(bayar => {
                        totalTerbayar += parseFloat(bayar.nominal_dibayar || 0)
                    })
                }


                const sisaTagihan = grandTotal - totalTerbayar


                let finalStatus = 'Unpaid'
                if (totalTerbayar >= grandTotal && grandTotal > 0) {
                    finalStatus = 'Paid'
                } else if (totalTerbayar > 0 && sisaTagihan > 0) {
                    finalStatus = 'Partial'
                } else {
                    if (po.tanggal_jatuh_tempo) {
                        const today = new Date()
                        const due = new Date(po.tanggal_jatuh_tempo)
                        if (today > due) {
                            finalStatus = 'Overdue'
                        }
                    }
                }

                return {
                    id: po.id_transaksi || po.po_no,
                    vendor: po.nama_supplier || (po.supplier ? po.supplier.nama_suplier : '-'),
                    tglTerbit: po.tanggal || '-',
                    jatuhTempo: po.tanggal_jatuh_tempo || 'Belum Diset',
                    nominal: grandTotal,
                    terbayar: totalTerbayar,
                    sisa: sisaTagihan,
                    status: finalStatus
                }
            })

            tagihanList.value = mapped.sort((a, b) => new Date(b.tglTerbit) - new Date(a.tglTerbit))

        } catch (error) {
            console.error("Gagal memuat data tagihan:", error)
        } finally {
            isLoading.value = false
        }
    }

    const submitPembayaran = async (formData) => {
        isLoading.value = true
        try {
            const response = await api.post('purchase-order/bayar/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            await fetchTagihan()
            return { success: true }
        } catch (error) {
            console.error("Gagal mengirim pembayaran:", error)
            return {
                success: false,
                message: error.response?.data?.message || "Terjadi kesalahan saat memproses pembayaran."
            }
        } finally {
            isLoading.value = false
        }
    }

    const totalUnpaid = computed(() => {
        return tagihanList.value
            .filter(t => t.status === 'Unpaid' || t.status === 'Partial')
            .reduce((sum, t) => sum + t.sisa, 0)
    })

    const totalPaid = computed(() => {
        return tagihanList.value
            .filter(t => t.status === 'Paid')
            .reduce((sum, t) => sum + t.nominal, 0)
    })

    const totalOverdue = computed(() => {
        return tagihanList.value
            .filter(t => t.status === 'Overdue')
            .reduce((sum, t) => sum + t.sisa, 0)
    })

    onMounted(() => {
        fetchTagihan()
    })

    return {
        tagihanList,
        isLoading,
        totalUnpaid,
        totalPaid,
        totalOverdue,
        fetchTagihan,
        submitPembayaran
    }
}