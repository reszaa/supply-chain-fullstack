<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('monitor') // monitor, confirm, review

// State untuk simulasi akun kurir yang login
const currentCourier = ref({
    name: 'Andi Santoso',
    vehicle: 'Truk Engkel (B 3345 TKL)'
})

// Data dummy lokal untuk manifest yang dibawa kurir ini
const myManifests = ref([
    { id: 'DO-RET-001', destination: 'Toko Makmur Abadi', items: '150 Box Bahan Kimia', address: 'Kawasan Niaga Terpadu Blok A1, Jakarta', status: 'Dalam Perjalanan' },
    { id: 'DO-CUS-042', destination: 'Ibu Rina (Personal)', items: '2 Pail Cairan WIP', address: 'Jl. Merpati No. 12, Jakarta Barat', status: 'Menunggu Kurir' }
])

// Riwayat pengiriman yang sudah selesai untuk ditinjau
const deliveryHistory = ref([
    { id: 'DO-RET-004', destination: 'Retail Nusantara', date: 'Hari ini, 10:30', status: 'Selesai Terkirim' },
    { id: 'DO-CUS-021', destination: 'Budi Santoso', date: 'Kemarin, 14:15', status: 'Selesai Terkirim' }
])

// Fungsi Konfirmasi Pengiriman (Mengubah Status)
const confirmDelivery = (index) => {
    const confirmation = confirm(`Konfirmasi bahwa paket untuk ${myManifests.value[index].destination} telah sampai tujuan?`)
    if (confirmation) {
        // Pindahkan ke riwayat
        deliveryHistory.value.unshift({
            id: myManifests.value[index].id,
            destination: myManifests.value[index].destination,
            date: 'Hari ini, Baru saja',
            status: 'Selesai Terkirim'
        })
        // Hapus dari daftar aktif
        myManifests.value.splice(index, 1)
        alert('Pengiriman berhasil dikonfirmasi!')
    }
}

const handleLogout = () => {
    if (confirm('Keluar dari akun kurir?')) {
        router.push('/')
    }
}
</script>

<template>
    <div class="min-h-screen bg-slate-900 md:bg-slate-100 flex items-center justify-center font-sans antialiased">

        <div
            class="w-full max-w-md min-h-screen md:min-h-[85vh] md:max-h-[85vh] bg-slate-50 md:rounded-[2.5rem] md:shadow-2xl md:border-8 md:border-slate-800 relative flex flex-col overflow-hidden">

            <header class="bg-slate-900 text-white px-6 py-5 shrink-0 shadow-md">
                <div class="flex justify-between items-center">
                    <div>
                        <span class="text-xs font-bold text-amber-400 tracking-wider uppercase">Pracindo Courier
                            Mobile</span>
                        <h2 class="text-lg font-black tracking-tight mt-0.5">{{ currentCourier.name }}</h2>
                        <p class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <i class="pi pi-truck text-[9px]"></i> {{ currentCourier.vehicle }}
                        </p>
                    </div>
                    <button @click="handleLogout"
                        class="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors">
                        <i class="pi pi-sign-out text-sm"></i>
                    </button>
                </div>
            </header>

            <main class="flex-1 p-5 overflow-y-auto pb-24 custom-scrollbar">

                <div v-if="activeTab === 'monitor'" class="space-y-4 animate-fade-in">
                    <div class="flex justify-between items-center mb-1">
                        <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider">Pantau Rute Aktif</h3>
                        <span class="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">{{
                            myManifests.length }} Tugas</span>
                    </div>

                    <div v-for="item in myManifests" :key="item.id"
                        class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="text-xs font-bold text-slate-400">{{ item.id }}</span>
                                <h4 class="font-bold text-slate-800 text-base mt-0.5">{{ item.destination }}</h4>
                            </div>
                            <span
                                class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold border border-blue-100 uppercase tracking-wide">{{
                                    item.status }}</span>
                        </div>
                        <div
                            class="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <p class="flex items-center gap-2"><i class="pi pi-box text-slate-400 text-[10px]"></i> {{
                                item.items }}</p>
                            <p class="flex items-start gap-2"><i
                                    class="pi pi-map-marker text-red-400 text-[10px] mt-0.5"></i> <span
                                    class="line-clamp-2">{{ item.address }}</span></p>
                        </div>
                    </div>

                    <div v-if="myManifests.length === 0" class="text-center py-12 text-slate-400">
                        <i class="pi pi-check-circle text-5xl text-emerald-400 mb-2"></i>
                        <p class="text-sm font-medium">Semua tugas hari ini selesai terkirim!</p>
                    </div>
                </div>

                <div v-else-if="activeTab === 'confirm'" class="space-y-4 animate-fade-in">
                    <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Konfirmasi Kedatangan
                    </h3>

                    <div v-for="(item, index) in myManifests" :key="'conf-' + item.id"
                        class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                                <i class="pi pi-map-marker text-lg"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-800 text-sm">{{ item.destination }}</h4>
                                <p class="text-xs text-slate-400 truncate max-w-[220px]">{{ item.address }}</p>
                            </div>
                        </div>
                        <button @click="confirmDelivery(index)"
                            class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                            <i class="pi pi-check"></i>
                            <span>Konfirmasi Sampai Tujuan</span>
                        </button>
                    </div>

                    <div v-if="myManifests.length === 0" class="text-center py-12 text-slate-400">
                        <i class="pi pi-thumbs-up text-5xl text-slate-300 mb-2"></i>
                        <p class="text-sm">Tidak ada pengiriman yang perlu dikonfirmasi.</p>
                    </div>
                </div>

                <div v-else-if="activeTab === 'review'" class="space-y-4 animate-fade-in">
                    <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Tinjau Riwayat</h3>

                    <div v-for="log in deliveryHistory" :key="log.id"
                        class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex justify-between items-center">
                        <div class="space-y-0.5">
                            <div class="flex items-center gap-2">
                                <span class="text-[11px] font-bold text-slate-400">{{ log.id }}</span>
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            </div>
                            <h4 class="font-bold text-slate-800 text-sm">{{ log.destination }}</h4>
                            <p class="text-[10px] text-slate-400">{{ log.date }}</p>
                        </div>
                        <span
                            class="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-100">SUKSES</span>
                    </div>
                </div>

            </main>

            <nav
                class="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2.5 flex justify-around items-center shadow-lg z-50">
                <button @click="activeTab = 'monitor'" class="flex flex-col items-center gap-1 py-1 transition-all"
                    :class="activeTab === 'monitor' ? 'text-slate-900 scale-105 font-bold' : 'text-slate-400 hover:text-slate-600'">
                    <i class="pi pi-map text-lg"></i>
                    <span class="text-[10px]">Memantau</span>
                </button>

                <button @click="activeTab = 'confirm'" class="flex flex-col items-center gap-1 py-1 transition-all"
                    :class="activeTab === 'confirm' ? 'text-slate-900 scale-105 font-bold' : 'text-slate-400 hover:text-slate-600'">
                    <div class="relative">
                        <i class="pi pi-check-square text-lg"></i>
                        <span v-if="myManifests.length > 0"
                            class="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                            {{ myManifests.length }}
                        </span>
                    </div>
                    <span class="text-[10px]">Konfirmasi</span>
                </button>

                <button @click="activeTab = 'review'" class="flex flex-col items-center gap-1 py-1 transition-all"
                    :class="activeTab === 'review' ? 'text-slate-900 scale-105 font-bold' : 'text-slate-400 hover:text-slate-600'">
                    <i class="pi pi-history text-lg"></i>
                    <span class="text-[10px]">Meninjau</span>
                </button>
            </nav>

        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>