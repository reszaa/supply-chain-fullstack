<template>
    <div class="space-y-6 sm:space-y-8 animate-fade-in w-full overflow-hidden max-w-full text-slate-700 font-sans">

        <div class="bg-white border border-slate-200 rounded-[24px] p-4 sm:p-6 md:p-8 shadow-sm w-full">

            <div
                class="mb-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 class="text-base sm:text-lg font-bold text-slate-800 tracking-tight">Result (Proses Filling)</h3>
            </div>

            <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 bg-slate-50/50 p-4 sm:p-6 rounded-2xl border border-slate-100">

                <div class="flex flex-col gap-2 sm:gap-3">
                    <label class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Pilih
                        Hasil Mixing : </label>
                    <Select v-model="formFilling.mesin_id" :options="mesinList" optionLabel="nama_display"
                        optionValue="id" placeholder="-- Hasil Mixing --" @change="updateMaxLiquid"
                        class="w-full !rounded-xl bg-white shadow-sm" />
                    <span class="text-xs font-bold text-blue-600 mt-1">Sisa di mesin: {{ maxCairanTersedia }} Kg</span>
                </div>

                <div class="flex flex-col gap-2 sm:gap-3">
                    <label class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Tangki
                        Tujuan : </label>
                    <Select v-model="formFilling.tangki_tujuan" :options="tangkiOptions" optionLabel="label"
                        optionValue="value" placeholder="-- Pilih Tangki --"
                        class="w-full !rounded-xl bg-white shadow-sm" />
                </div>

                <div class="flex flex-col gap-2 sm:gap-3 md:col-span-2 mt-2 sm:mt-0">
                    <label class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Jumlah
                        Transfer (Kg) : </label>
                    <input type="number" v-model="formFilling.jumlah_transfer" placeholder="Masukkan angka..."
                        class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium" />
                </div>
            </div>

            <div class="mt-6 sm:mt-8 flex justify-end">
                <button @click="saveData" :disabled="isSaving"
                    class="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                    <i class="pi" :class="isSaving ? 'pi-spin pi-spinner' : 'pi-check'"></i>
                    {{ isSaving ? 'Memproses Transfer...' : 'Mulai Transfer ke Tangki' }}
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Select from 'primevue/select'

const isSaving = ref(false)
const mesinList = ref([])
const maxCairanTersedia = ref(0)
const formFilling = ref({ mesin_id: '', tangki_tujuan: 'TANGKI_A', jumlah_transfer: 0 })

const tangkiOptions = [
    { label: 'Tangki A (Bening)', value: 'TANGKI_A' },
    { label: 'Tangki B (Warna)', value: 'TANGKI_B' },
    { label: 'Tangki C (Warna)', value: 'TANGKI_C' },
    { label: 'Tangki D (Warna)', value: 'TANGKI_D' }
]

const loadMesinWip = () => {
    const dbMesin = JSON.parse(localStorage.getItem('mock_mesinWip')) || []
    mesinList.value = dbMesin.map(m => ({
        ...m,
        nama_display: `${m.nama} - Mesin ${m.mesin}`
    }))
}

const updateMaxLiquid = () => {
    const selected = mesinList.value.find(m => m.id === formFilling.value.mesin_id)
    maxCairanTersedia.value = selected ? selected.stok : 0
    formFilling.value.jumlah_transfer = maxCairanTersedia.value
}

const saveData = () => {
    if (!formFilling.value.mesin_id || formFilling.value.jumlah_transfer <= 0) {
        alert('Pilih mesin dan masukkan jumlah transfer yang valid!')
        return
    }
    if (formFilling.value.jumlah_transfer > maxCairanTersedia.value) {
        alert('Jumlah transfer melebihi sisa cairan di mesin!')
        return
    }

    isSaving.value = true
    setTimeout(() => {
        let dbMesin = JSON.parse(localStorage.getItem('mock_mesinWip')) || []
        let dbTangki = JSON.parse(localStorage.getItem('mock_produkTangki')) || []

        let mesinItem = dbMesin.find(m => m.id === formFilling.value.mesin_id)
        if (mesinItem) mesinItem.stok -= formFilling.value.jumlah_transfer

        let existingTangki = dbTangki.find(t => t.nama === mesinItem.nama && t.tangki === formFilling.value.tangki_tujuan)
        if (existingTangki) existingTangki.stok += formFilling.value.jumlah_transfer
        else dbTangki.push({ id: `TNK-${Date.now()}`, nama: mesinItem.nama, stok: formFilling.value.jumlah_transfer, tangki: formFilling.value.tangki_tujuan, sumber: 'MIXING' })

        dbMesin = dbMesin.filter(m => m.stok > 0)

        localStorage.setItem('mock_mesinWip', JSON.stringify(dbMesin))
        localStorage.setItem('mock_produkTangki', JSON.stringify(dbTangki))

        alert("Filling Selesai! Data berhasil ditransfer ke tangki tujuan.")
        formFilling.value = { mesin_id: '', tangki_tujuan: 'TANGKI_A', jumlah_transfer: 0 }
        maxCairanTersedia.value = 0
        loadMesinWip()
        isSaving.value = false
    }, 800)
}

onMounted(() => {
    loadMesinWip()
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