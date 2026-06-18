import { ref } from 'vue'
import api from '@/utils/api'
import { FilterMatchMode } from '@primevue/core/api'

export function useStockRaw() {
    const isLoading = ref(false)
    const stokBahanBakuList = ref([])

    const filters = ref({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    const fetchStokBahanBaku = async () => {
        isLoading.value = true
        try {

            const response = await api.get('stock-raw/saldo/')
            const rawData = response.data.data || response.data || []

            stokBahanBakuList.value = rawData.map(item => ({
                id: item.id,
                nama_bahan: item.nama_item,
                packaging: item.packaging,
                stok: parseFloat(item.total_stok) || 0
            }))
        } catch (error) {
            console.error("Gagal mengambil data stok:", error)
        } finally {
            isLoading.value = false
        }
    }

    return {
        isLoading,
        stokBahanBakuList,
        filters,
        fetchStokBahanBaku
    }
}