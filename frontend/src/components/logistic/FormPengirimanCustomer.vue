<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'save'])

const formData = ref({
    customer: '',
    address: '',
    courier: 'Menunggu Alokasi'
})

const submitForm = () => {
    if (!formData.value.customer || !formData.value.address) {
        alert('Mohon isi Nama Customer dan Alamat Tujuan.')
        return
    }

    const randomId = 'TRX-CUS-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0')

    emit('save', {
        id: randomId,
        customer: formData.value.customer,
        address: formData.value.address,
        courier: formData.value.courier,
        status: 'Menunggu Kurir'
    })
}
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
        <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col relative" @click.stop>

            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 class="text-lg font-bold text-slate-800">Buat Pengiriman Baru</h3>
                <button @click="emit('close')"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <i class="pi pi-times"></i>
                </button>
            </div>

            <div class="p-6 space-y-5">
                <div>
                    <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Nama
                        Customer</label>
                    <input type="text" v-model="formData.customer" placeholder="Contoh: Budi Santoso"
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700" />
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Alamat
                        Tujuan</label>
                    <textarea v-model="formData.address" rows="3" placeholder="Masukkan alamat lengkap pengiriman..."
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 resize-none"></textarea>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Alokasi
                        Kurir (Opsional)</label>
                    <select v-model="formData.courier"
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 appearance-none">
                        <option value="Menunggu Alokasi">-- Pilih Nanti (Menunggu Alokasi) --</option>
                        <option value="Andi (Motor)">Andi (Motor)</option>
                        <option value="Bambang (Mobil)">Bambang (Mobil)</option>
                    </select>
                </div>
            </div>

            <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button @click="emit('close')"
                    class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all">
                    Batal
                </button>
                <button @click="submitForm"
                    class="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md shadow-slate-900/20 transition-all flex items-center gap-2">
                    <i class="pi pi-check-circle"></i>
                    Simpan Pengiriman
                </button>
            </div>

        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>