import { ref } from 'vue'
import api from '@/utils/api'

export function useProcurement() {
    const dataPO = ref([])
    const dataSupplier = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('suplier/')
            dataSupplier.value = response.data.results || response.data
        } catch (err) {
            error.value = "Gagal memuat data master supplier."
            console.error("Gagal memuat data master supplier:", err)
        }
    }

    const fetchPO = async () => {
        isLoading.value = true
        error.value = null
        try {
            const response = await api.get('purchase-order/')
            dataPO.value = response.data.results || response.data
        } catch (err) {
            error.value = "Gagal memuat riwayat Purchase Order dari database."
            console.error(err)
        } finally {
            isLoading.value = false
        }
    }

    const simpanPO = async (payload) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await api.post('purchase-order/', payload)
            if (response.status === 201 || response.status === 200) {
                await fetchPO()
                return { success: true }
            }
        } catch (err) {
            console.error("Gagal menyimpan PO:", err.response?.data || err)
            error.value = err.response?.data?.message || "Gagal menyimpan PO."
            return {
                success: false,
                message: error.value
            }
        } finally {
            isLoading.value = false
        }
    }


    const getBulanRomawi = () => {
        const romawi = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
        return romawi[new Date().getMonth()];
    }

    const generateIdPT = async () => {
        try {
            const response = await api.get('purchase-order/generate-id-pt/')
            const nomorUrut = response.data.urutan
            const tahun = new Date().getFullYear()
            const bulanRomawi = getBulanRomawi()

            return `PO/PCJM/${tahun}/${bulanRomawi}/${nomorUrut}`
        } catch (err) {
            console.error("Gagal men-generate ID PO PT:", err)
            return "PO/PCJM/ERROR"
        }
    }

    return {
        dataPO,
        dataSupplier,
        isLoading,
        error,
        fetchSuppliers,
        fetchPO,
        simpanPO,
        generateIdPT
    }
}