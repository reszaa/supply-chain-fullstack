import { ref, computed } from 'vue'
import api from '@/utils/api' // Pastikan import meriam utamanya benar

export function useSuplier() {
    const dataSupplier = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    const searchQuery = ref('')

    // 1. Fungsi Ambil Data (GET)
    const fetchSuppliers = async () => {
        isLoading.value = true
        error.value = null
        try {
            const response = await api.get('/api/suplier/') // Tambahkan /api/
            dataSupplier.value = response.data.results || response.data
        } catch (err) {
            console.error("Gagal memuat data master supplier:", err)
            error.value = "Gagal memuat data dari database."
        } finally {
            isLoading.value = false
        }
    }

    // 2. Fungsi Simpan/Tambah Data (POST) - PENGHANCUR ERROR 405!
    const addSupplier = async (formData) => {
        try {
            const response = await api.post('/api/suplier/', formData)
            await fetchSuppliers() // Segarkan data setelah berhasil menyimpan
            return { success: true, data: response.data }
        } catch (err) {
            console.error("Gagal menyimpan supplier:", err)
            return { success: false, message: "Gagal menyimpan data ke server." }
        }
    }

    // 3. Fungsi Hapus Data (DELETE)
    const deleteSupplier = async (id_suplier) => {
        try {
            // Perbaiki ejaan 'supplier' menjadi 'suplier' dan tambahkan /api/
            await api.delete(`/api/suplier/${id_suplier}/`)
            await fetchSuppliers()
            return { success: true }
        } catch (err) {
            console.error("Gagal menghapus supplier:", err)
            return { success: false, message: "Gagal menghapus data dari server." }
        }
    }

    // 4. Fitur Pencarian Dinamis (Frontend filter)
    const filteredSupplier = computed(() => {
        if (!searchQuery.value) return dataSupplier.value

        const lowerCaseQuery = searchQuery.value.toLowerCase()
        return dataSupplier.value.filter(sup => {
            const nama = (sup.nama_perusahaan || sup.nama_suplier || '').toLowerCase()
            const pic = (sup.pic_name || '').toLowerCase() // Sesuaikan dengan field di backend
            return nama.includes(lowerCaseQuery) || pic.includes(lowerCaseQuery)
        })
    })

    return {
        dataSupplier,
        filteredSupplier,
        searchQuery,
        isLoading,
        error,
        fetchSuppliers,
        addSupplier,     // Jangan lupa di-export agar bisa dipakai di .vue
        deleteSupplier
    }
}