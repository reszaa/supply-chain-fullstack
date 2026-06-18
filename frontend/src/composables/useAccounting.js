import { ref } from 'vue'
import api from '../utils/api'

export function useAccounting() {

    const daftarBelanja = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const dashboardSummary = ref({
        saldo_kas: 0,
        total_pengeluaran: 0,
        total_pemasukan: 0
    })

    const fetchSemuaBelanja = async (entitas = 'PT') => {
        isLoading.value = true
        error.value = null
        try {
            const response = await api.get('/api/belanja/', {
                params: { entitas }
            });

            let data = []
            if (Array.isArray(response.data)) {
                data = response.data
            } else if (response.data && Array.isArray(response.data.results)) {
                data = response.data.results
            } else if (response.data && Array.isArray(response.data.data)) {
                data = response.data.data
            } else {
                data = response.data ? [response.data] : []
            }

            daftarBelanja.value = data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))

        } catch (err) {
            console.error("Gagal mengambil data pengeluaran:", err)
            error.value = "Gagal memuat data pengeluaran dari server."
        } finally {
            isLoading.value = false
        }
    }

    const fetchDashboardSummary = async (entitas = 'PT') => {
        try {
            const response = await api.get('/api/belanja/dashboard-summary/', {
                params: { entitas }
            })
            dashboardSummary.value = response.data
        } catch (err) {
            console.error("Gagal mengambil ringkasan dashboard:", err)
        }
    }

    const tambahPengeluaran = async (payload) => {
        const formData = new FormData();

        formData.append('entitas', payload.entitas);
        formData.append('kategori', payload.kategori);
        formData.append('nama_pengeluaran', payload.nama_pengeluaran);
        formData.append('pemohon', payload.pemohon);
        formData.append('nominal', payload.nominal);

        if (payload.bukti_nota instanceof File) {
            formData.append('bukti_nota', payload.bukti_nota);
        }

        try {
            const response = await api.post('/api/belanja/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // SINKRONISASI OTOMATIS: 
            // Panggil ulang fetch data agar tabel dan dashboard langsung ter-update
            // tanpa pengguna harus menekan tombol refresh.
            await fetchSemuaBelanja(payload.entitas);
            await fetchDashboardSummary(payload.entitas);

            return response.data;
        } catch (err) {
            throw err.response?.data || err;
        }
    };

    return {
        daftarBelanja,
        isLoading,
        error,
        dashboardSummary,
        fetchSemuaBelanja,
        fetchDashboardSummary,
        tambahPengeluaran
    }
}