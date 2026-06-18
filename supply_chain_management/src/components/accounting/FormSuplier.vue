<template>
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">

        <div
            class="bg-white w-full max-w-3xl rounded-[32px] shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">

            <button @click="tutupForm"
                class="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-full flex items-center justify-center transition-colors z-10">
                <i class="pi pi-times"></i>
            </button>

            <div class="p-8 overflow-y-auto custom-scrollbar">

                <h2 class="text-3xl font-extrabold text-slate-800 mb-2">Tambah Suplier Baru</h2>
                <p class="text-slate-500 mb-8">Mendaftarkan data vendor atau suplier baru ke dalam sistem database.</p>

                <form @submit.prevent="simpanSupplier" class="flex flex-col gap-6">

                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Nama Perusahaan / Suplier</label>
                        <div class="relative">
                            <i class="pi pi-building absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input v-model="formSupplier.nama_supplier" type="text" required
                                placeholder="Contoh: PT. Sumber Makmur Jaya"
                                class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all font-medium text-slate-700">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">No. Kontak / Telepon</label>
                            <div class="relative">
                                <i class="pi pi-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input v-model="formSupplier.kontak_telepon" type="text" required
                                    placeholder="Contoh: 021-xxxxxxx atau 0812..."
                                    class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all font-medium text-slate-700">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Alamat Email (Opsional)</label>
                            <div class="relative">
                                <i class="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input v-model="formSupplier.kontak_email" type="email"
                                    placeholder="Contoh: info@vendor.com"
                                    class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all font-medium text-slate-700">
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Nama PIC / Penanggung Jawab</label>
                        <div class="relative">
                            <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input v-model="formSupplier.pic" type="text" required
                                placeholder="Nama kontak person suplier..."
                                class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all font-medium text-slate-700">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Alamat Lengkap Kantor /
                            Gudang</label>
                        <div class="relative">
                            <i class="pi pi-map-marker absolute left-4 top-4 text-slate-400"></i>
                            <textarea v-model="formSupplier.alamat" required rows="3"
                                placeholder="Ketik alamat jalan, kota, dan kode pos..."
                                class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all font-medium text-slate-700 resize-none"></textarea>
                        </div>
                    </div>

                    <div class="flex justify-end items-center gap-4 mt-4 pt-6 border-t border-slate-100">
                        <button type="button" @click="tutupForm"
                            class="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all">
                            Batal
                        </button>
                        <button type="submit"
                            class="px-8 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 transform hover:-translate-y-0.5">
                            <i class="pi pi-save"></i> Simpan Suplier
                        </button>
                    </div>

                </form>
            </div>

        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
// Kita import dari composables, BUKAN api langsung
import { useSuplier } from '@/composables/useSuplier'

const emit = defineEmits(['close', 'saved'])
const isLoading = ref(false)

// Panggil meriam yang sudah disiapkan
const { addSupplier } = useSuplier()

const formSupplier = reactive({
    nama_supplier: '',
    kontak_telepon: '',
    kontak_email: '',
    pic: '',
    alamat: ''
})

const tutupForm = () => {
    emit('close')
}

const simpanSupplier = async () => {
    isLoading.value = true
    try {
        // Sesuaikan nama field dengan Backend Django (models.py)
        const payload = {
            id_supplier: `SPL-${Date.now()}`,
            nama_perusahaan: formSupplier.nama_supplier,
            pic_name: formSupplier.pic,
            telepon: formSupplier.kontak_telepon,
            email: formSupplier.kontak_email || null,
            alamat: formSupplier.alamat,
            status: 'ACTIVE'
        }

        // Tembak menggunakan fungsi dari composables
        const response = await addSupplier(payload)

        if (response.success) {
            alert("Berhasil! Data suplier telah disimpan ke database.")
            emit('saved')
        } else {
            alert("Gagal menyimpan: " + response.message)
        }
    } catch (error) {
        console.error("Kesalahan sistem:", error)
        alert("Terjadi kesalahan sistem saat menyimpan.")
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}

.animate-fade-in-up {
    animation: fadeInUp 0.4s ease-out forwards;
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
        transform: translateY(20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}
</style>