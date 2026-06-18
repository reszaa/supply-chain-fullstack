import { ref } from 'vue'
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Token ${token}`
    }
    return config
})

export function useAccountingDashboard() {
    const dashboardSummary = ref({
        saldo_kas: 0,
        total_pengeluaran: 0,
        total_pemasukan: 0
    })

    const isLoading = ref(false)
    const error = ref(null)

    const fetchDashboardSummary = async () => {
        isLoading.value = true
        error.value = null
        try {
            const response = await api.get('belanja/dashboard-summary/')
            dashboardSummary.value = response.data
        } catch (err) {
            console.error("Gagal mengambil ringkasan dashboard:", err)
            error.value = "Gagal memuat data ringkasan kas. Pastikan koneksi server stabil."
        } finally {
            isLoading.value = false
        }
    }

    return {
        dashboardSummary,
        isLoading,
        error,
        fetchDashboardSummary
    }
}