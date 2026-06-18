<template>
    <div class="space-y-10 animate-fade-in w-full">

        <div class="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm">
            <div class="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                <div class="w-2 h-6 bg-purple-600 rounded-full"></div>
                <h3 class="text-lg font-bold text-slate-800">Form Input Packaging</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                <div class="flex flex-col gap-3">
                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Pemilik
                        (Entitas)</label>
                    <Select v-model="formPackaging.pemilik" :options="opsiEntitas" placeholder="-- Pilih Entitas --"
                        class="w-full !rounded-xl shadow-sm bg-slate-50" />
                </div>

                <div class="flex flex-col gap-3">
                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Sumber</label>
                    <Select v-model="formPackaging.sumber_tangki" :options="['MIXING', 'BLENDING']"
                        class="w-full !rounded-xl shadow-sm bg-slate-50" @change="fetchProduk" />
                </div>

                <div class="flex flex-col gap-3 xl:col-span-2">
                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Pilih
                        Produk</label>
                    <Select v-model="formPackaging.item_id" :options="produkList" optionLabel="nama" optionValue="id"
                        filter :disabled="produkList.length === 0" placeholder="-- Pilih Produk di Tangki --"
                        class="w-full !rounded-xl shadow-sm bg-slate-50" @change="updateSisaStok" />
                </div>
            </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm">
            <div class="flex items-center justify-between mb-8">
                <h3 class="text-lg font-bold text-slate-800 flex items-center gap-3">
                    <span class="w-2 h-6 bg-amber-500 rounded-full"></span>
                    Spesifikasi Kemasan
                </h3>
                <div class="px-5 py-2 bg-slate-50 border border-slate-100 rounded-full shadow-inner">
                    <span class="text-xs font-bold text-slate-500">Sisa Saldo Tangki: <span
                            class="text-blue-600 font-black text-sm">{{ sisaStokAktif }} Kg</span></span>
                </div>
            </div>

            <div
                class="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-50/50 p-8 rounded-[1.5rem] border border-slate-100">
                <div class="flex flex-col gap-3">
                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Kategori
                        Kemasan</label>
                    <Select v-model="formPackaging.kategori_kemasan" :options="kategoriOptions" optionLabel="label"
                        optionValue="value" class="w-full !rounded-xl shadow-sm bg-white" />
                </div>

                <div class="flex flex-col gap-3">
                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Jumlah Unit
                        Kemasan</label>
                    <InputText type="number" v-model.number="formPackaging.jumlah_kemasan"
                        placeholder="Masukkan jumlah unit"
                        class="!font-black !text-lg text-center shadow-sm !rounded-xl bg-white !py-3" />
                </div>
            </div>

            <div class="flex justify-end mt-12">
                <div
                    class="bg-slate-900 p-1.5 rounded-[2rem] flex items-center gap-6 pr-10 shadow-xl shadow-purple-900/10 border border-slate-800">
                    <div
                        class="bg-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-inner">
                        <i class="pi pi-box text-xl"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Total
                            Cairan Ditarik</span>
                        <span class="text-3xl font-black text-white leading-none tracking-tight"
                            :class="{ 'text-red-400': parseFloat(totalBeratKalkulasi) > parseFloat(sisaStokAktif) }">
                            {{ totalBeratKalkulasi }} <span class="text-sm font-medium text-slate-500">kg</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end gap-6 pt-4 pb-10">
            <Button label="Reset Data" severity="secondary" text
                class="!font-bold !px-8 hover:!bg-slate-100 !rounded-xl" @click="resetFormPackaging" />
            <Button :label="isSavingPackaging ? 'Menyimpan...' : 'SIMPAN PACKAGING'" icon="pi pi-save"
                :loading="isSavingPackaging" :disabled="isSavingPackaging || formPackaging.jumlah_kemasan <= 0"
                @click="submitPackaging"
                class="!bg-purple-600 !border-none !rounded-xl !px-10 !py-4 !font-black !shadow-lg !shadow-purple-600/30 hover:!scale-105 transition-transform" />
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const isSavingPackaging = ref(false)
const produkList = ref([])
const sisaStokAktif = ref(0)

const formPackaging = ref({
    tanggal: new Date().toISOString().split('T')[0],
    pemilik: 'PT',
    sumber_tangki: 'MIXING',
    item_id: '',
    kategori_kemasan: 'GALON',
    jumlah_kemasan: 0
})

const kategoriOptions = ref([
    { label: 'PCS (1 Kg)', value: 'PCS' },
    { label: 'GALON (5 Kg)', value: 'GALON' },
    { label: 'DUS (10 Kg)', value: 'DUS' },
    { label: 'PAIL @ 20KG', value: 'PAIL@20KG' },
    { label: 'PAIL @ 25KG', value: 'PAIL@25KG' },
    { label: 'PAIL @ 30KG', value: 'PAIL@30KG' }
])

const opsiEntitas = ref(['PT', 'CV'])
const beratKemasan = { 'PCS': 1.0, 'GALON': 5.0, 'DUS': 10.0, 'PAIL@20KG': 20.0, 'PAIL@25KG': 25.0, 'PAIL@30KG': 30.0 }

// Memetakan nilai select ke properti objek tabel stok
const propertiKemasanDB = { 'PCS': 'pcs', 'GALON': 'galon', 'DUS': 'dus', 'PAIL@20KG': 'pail_20kg', 'PAIL@25KG': 'pail_25kg', 'PAIL@30KG': 'pail_30kg' }

const totalBeratKalkulasi = computed(() => {
    return (formPackaging.value.jumlah_kemasan * (beratKemasan[formPackaging.value.kategori_kemasan] || 0)).toFixed(2)
})

// MENGAMBIL DATA DARI LOCAL STORAGE (Pengganti API)
const fetchProduk = () => {
    let tangkiList = JSON.parse(localStorage.getItem('mock_produkTangki')) || []
    produkList.value = tangkiList.filter(t => t.sumber === formPackaging.value.sumber_tangki)
    formPackaging.value.item_id = ''
    sisaStokAktif.value = 0
}

const updateSisaStok = () => {
    const produk = produkList.value.find(p => p.id === formPackaging.value.item_id)
    sisaStokAktif.value = produk ? produk.stok : 0
}

const submitPackaging = () => {
    if (!formPackaging.value.item_id) return alert("Pilih produk terlebih dahulu!")
    if (parseFloat(totalBeratKalkulasi.value) > parseFloat(sisaStokAktif.value)) return alert("Stok tangki tidak mencukupi!")

    isSavingPackaging.value = true

    setTimeout(() => {
        // 1. Kurangi Saldo Tangki
        let tangkiList = JSON.parse(localStorage.getItem('mock_produkTangki')) || []
        let tangkiIndex = tangkiList.findIndex(t => t.id === formPackaging.value.item_id)
        if (tangkiIndex > -1) {
            tangkiList[tangkiIndex].stok -= totalBeratKalkulasi.value
            localStorage.setItem('mock_produkTangki', JSON.stringify(tangkiList))
        }

        // 2. Tambah ke Stok Barang Jadi (PT atau CV)
        let namaProdukTerpilih = produkList.value.find(p => p.id === formPackaging.value.item_id).nama
        let storageKey = formPackaging.value.pemilik === 'PT' ? 'mock_stokPT' : 'mock_stokCV'
        let stokBarangJadi = JSON.parse(localStorage.getItem(storageKey)) || []

        let existingStok = stokBarangJadi.find(s => s.nama_item === namaProdukTerpilih)
        let fieldTarget = propertiKemasanDB[formPackaging.value.kategori_kemasan]

        if (existingStok) {
            existingStok[fieldTarget] = (existingStok[fieldTarget] || 0) + formPackaging.value.jumlah_kemasan
            existingStok.terakhir_update = new Date().toLocaleString('id-ID')
        } else {
            let newItem = {
                nama_item: namaProdukTerpilih, pcs: 0, galon: 0, dus: 0, pail_20kg: 0, pail_25kg: 0, pail_30kg: 0,
                terakhir_update: new Date().toLocaleString('id-ID')
            }
            newItem[fieldTarget] = formPackaging.value.jumlah_kemasan
            stokBarangJadi.push(newItem)
        }

        localStorage.setItem(storageKey, JSON.stringify(stokBarangJadi))

        alert("Berhasil dipacking! Stok Barang Jadi telah ditambahkan.")
        resetFormPackaging()
        fetchProduk()
        isSavingPackaging.value = false
    }, 600)
}

const resetFormPackaging = () => {
    formPackaging.value.item_id = ''
    formPackaging.value.jumlah_kemasan = 0
    sisaStokAktif.value = 0
}

onMounted(() => {
    fetchProduk()
})
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>