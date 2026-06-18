import { ref, reactive, watch, onMounted } from 'vue'

export function useWarehouse() {
    const isSaving = ref(false)

    // ==========================================
    // DATABASE LOKAL (MOCKING LOCALSTORAGE)
    // ==========================================
    // Jika belum ada data di browser, kita buat data pancingan (dummy)
    const defaultPO = [
        {
            id: 'PO-001',
            ref_text: 'PO-001 - PT Sumber Makmur (Garam)',
            items: [{ nama: 'Garam Industri', packaging: 'Karung 50Kg', qty: 20 }]
        },
        {
            id: 'PO-002',
            ref_text: 'PO-002 - PT Kimia Tirta (Zat Pewarna)',
            items: [{ nama: 'Pewarna Biru', packaging: 'Pail 20Kg', qty: 5 }]
        }
    ]

    // Mengambil data dari localStorage atau gunakan default
    const poList = ref(JSON.parse(localStorage.getItem('mock_poList')) || defaultPO)
    const stokBahanBakuLokal = JSON.parse(localStorage.getItem('mock_stokBahanBaku')) || []

    // ==========================================
    // STATE PENERIMAAN
    // ==========================================
    const rawHeader = reactive({
        ref_id: '',
        po_no: '',
        tanggal_datang: new Date().toISOString().split('T')[0]
    })
    const rawItems = ref([{ nama_bahan: '', unit_kg: 0, total_unit: 0, berat: 0 }])
    const selectedPODetail = ref(null)

    // Memantau perubahan dan otomatis simpan ke browser
    watch(poList, (val) => localStorage.setItem('mock_poList', JSON.stringify(val)), { deep: true })

    // ==========================================
    // FUNGSI PENGGANTI API (TANPA BACKEND)
    // ==========================================
    const fetchAvailablePO = () => {
        // Karena pakai localStorage, data poList sudah otomatis terisi di atas
    }

    const fetchPODetail = (id) => {
        if (!id) {
            selectedPODetail.value = null
            return
        }
        // Cari PO dari array lokal, bukan dari axios
        const foundPO = poList.value.find(po => po.id === id)
        if (foundPO) {
            selectedPODetail.value = foundPO

            // Otomatis isi tabel input berdasarkan PO yang dipilih
            if (rawItems.value[0].nama_bahan === '') {
                rawItems.value = foundPO.items.map(item => ({
                    nama_bahan: item.nama,
                    unit_kg: 0,
                    total_unit: item.qty,
                    berat: 0
                }))
            }
        }
    }

    const saveData = () => {
        isSaving.value = true

        // Simulasi jeda loading seolah-olah sedang mengirim ke server
        setTimeout(() => {
            // 1. Simpan data penerimaan ke dalam stok bahan baku lokal
            rawItems.value.forEach(item => {
                const totalBerat = item.unit_kg * item.total_unit

                // Cek apakah bahan sudah ada di stok
                const existingItem = stokBahanBakuLokal.find(b => b.nama_bahan === item.nama_bahan)
                if (existingItem) {
                    existingItem.stok += totalBerat
                } else {
                    stokBahanBakuLokal.push({
                        nama_bahan: item.nama_bahan,
                        stok: totalBerat
                    })
                }
            })

            // 2. Simpan stok terbaru ke browser
            localStorage.setItem('mock_stokBahanBaku', JSON.stringify(stokBahanBakuLokal))

            // 3. Hapus PO yang sudah selesai diproses dari daftar pilihan
            poList.value = poList.value.filter(po => po.id !== rawHeader.ref_id)

            alert("Simpan Berhasil! Data sudah masuk ke Stok Bahan Baku lokal.")
            resetFormPenerimaan()
            isSaving.value = false
        }, 800) // delay 0.8 detik
    }

    // --- FUNGSI RESET & UI ---
    const resetFormPenerimaan = () => {
        rawHeader.ref_id = ''
        rawHeader.tanggal_datang = new Date().toISOString().split('T')[0]
        rawItems.value = [{ nama_bahan: '', unit_kg: 0, total_unit: 0, berat: 0 }]
        selectedPODetail.value = null
    }

    const addRow = () => rawItems.value.push({ nama_bahan: '', unit_kg: 0, total_unit: 0, berat: 0 })
    const removeRow = (index) => rawItems.value.splice(index, 1)

    onMounted(() => {
        fetchAvailablePO()
    })

    return {
        isSaving,
        poList,
        rawHeader,
        rawItems,
        selectedPODetail,
        fetchPODetail,
        addRow,
        removeRow,
        saveData,
        resetFormPenerimaan
    }
}