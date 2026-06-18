<script setup>
import { ref } from 'vue'

// State untuk memunculkan modal
const showModal = ref(false)

// Data Dummy Akun Kurir
const couriers = ref([
    { id: 'KRR-001', name: 'Andi Santoso', username: 'andi_motor', pin: '1234', vehicle: 'Motor', plate: 'B 3345 TKL', status: 'Aktif' },
    { id: 'KRR-002', name: 'Bambang', username: 'bambang_fuso', pin: '8899', vehicle: 'Truk Fuso', plate: 'D 8812 XA', status: 'Aktif' },
    { id: 'KRR-003', name: 'Candra', username: 'candra_engkel', pin: '5555', vehicle: 'Truk Engkel', plate: 'B 9091 KKY', status: 'Cuti' }
])

// Form Data
const formData = ref({
    name: '',
    username: '',
    pin: '',
    vehicle: 'Motor',
    plate: ''
})

// Fungsi Simpan Akun Kurir Baru
const saveCourier = () => {
    if (!formData.value.name || !formData.value.username || !formData.value.pin) {
        alert('Nama, Username, dan PIN wajib diisi!')
        return
    }

    const newId = 'KRR-' + String(couriers.value.length + 1).padStart(3, '0')

    couriers.value.push({
        id: newId,
        name: formData.value.name,
        username: formData.value.username.toLowerCase(),
        pin: formData.value.pin,
        vehicle: formData.value.vehicle,
        plate: formData.value.plate.toUpperCase(),
        status: 'Aktif'
    })

    // Reset Form & Tutup Modal
    formData.value = { name: '', username: '', pin: '', vehicle: 'Motor', plate: '' }
    showModal.value = false
}

const getStatusBadge = (status) => {
    return status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
}
</script>

<template>
    <div class="space-y-6 animate-fade-in relative">

        <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-slate-200/60 rounded-2xl shadow-sm">
            <div>
                <h2 class="text-lg font-bold text-slate-800">Manajemen Akun Kurir</h2>
                <p class="text-sm text-slate-500">Kelola akses login dan data armada kurir.</p>
            </div>

            <button @click="showModal = true"
                class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-slate-900/20 transition-all flex items-center gap-2">
                <i class="pi pi-user-plus"></i>
                <span>Daftarkan Kurir Baru</span>
            </button>
        </div>

        <div class="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                        <tr>
                            <th class="px-6 py-4 font-semibold">ID</th>
                            <th class="px-6 py-4 font-semibold">Nama Kurir</th>
                            <th class="px-6 py-4 font-semibold">Kredensial Login</th>
                            <th class="px-6 py-4 font-semibold">Armada</th>
                            <th class="px-6 py-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="item in couriers" :key="item.id" class="hover:bg-slate-50/50 transition-colors">
                            <td class="px-6 py-4 font-bold text-slate-800">{{ item.id }}</td>
                            <td class="px-6 py-4 font-medium">{{ item.name }}</td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col">
                                    <span class="text-xs text-slate-400">User: <b class="text-slate-700">{{
                                        item.username }}</b></span>
                                    <span class="text-xs text-slate-400">PIN: <b class="text-slate-700">{{ item.pin
                                    }}</b></span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="font-medium text-slate-700">{{ item.vehicle }}</span>
                                <span class="block text-xs text-slate-400">{{ item.plate }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="getStatusBadge(item.status)"
                                    class="px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                                    {{ item.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            @click.self="showModal = false">
            <div
                class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">

                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 class="text-lg font-bold text-slate-800">Buat Akun Kurir</h3>
                    <button @click="showModal = false" class="text-slate-400 hover:text-red-500 transition-colors">
                        <i class="pi pi-times text-xl"></i>
                    </button>
                </div>

                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">NAMA LENGKAP</label>
                        <input type="text" v-model="formData.name" placeholder="Nama kurir..."
                            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">USERNAME LOGIN</label>
                            <input type="text" v-model="formData.username" placeholder="cth: budi_m"
                                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">PIN AKSES</label>
                            <input type="text" v-model="formData.pin" maxlength="6" placeholder="4-6 digit angka"
                                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">JENIS ARMADA</label>
                            <select v-model="formData.vehicle"
                                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
                                <option value="Motor">Motor</option>
                                <option value="Mobil Van">Mobil Van</option>
                                <option value="Truk Engkel">Truk Engkel</option>
                                <option value="Truk Fuso">Truk Fuso</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">PLAT NOMOR</label>
                            <input type="text" v-model="formData.plate" placeholder="B 1234 XX"
                                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm uppercase focus:ring-2 focus:ring-slate-900 outline-none" />
                        </div>
                    </div>
                </div>

                <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                    <button @click="showModal = false"
                        class="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Batal</button>
                    <button @click="saveCourier"
                        class="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800">Simpan
                        Akun</button>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

.animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>