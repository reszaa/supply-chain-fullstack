<template>
    <div class="flex flex-col w-full animate-fade-in">

        <div class="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
                <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Master Data Suplier</h2>
                <p class="text-slate-500 text-sm mt-1">Kelola direktori vendor dan mitra pemasok bahan Pracindo.</p>
            </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm min-h-[400px] flex-1">

            <div class="flex items-center gap-4 mb-6">
                <div class="relative w-full sm:w-80">
                    <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input v-model="searchQuery" type="text" placeholder="Cari nama perusahaan atau PIC..."
                        class="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium text-slate-700">
                </div>
            </div>

            <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 text-slate-400">
                <i class="pi pi-spin pi-spinner text-4xl mb-4 text-emerald-500"></i>
                <p>Memuat data dari PostgreSQL...</p>
            </div>

            <div v-else class="border border-slate-200 rounded-2xl overflow-x-auto">
                <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                            <th class="p-4 font-bold">Nama Suplier</th>
                            <th class="p-4 font-bold">PIC / Kontak</th>
                            <th class="p-4 font-bold">No. Telepon</th>
                            <th class="p-4 font-bold">Alamat</th>
                            <th class="p-4 font-bold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="sup in filteredSupplier" :key="sup.id_supplier"
                            class="border-b border-slate-100 hover:bg-slate-50 transition-colors">

                            <td class="p-4 font-bold text-slate-800">{{ sup.nama_perusahaan || '-' }}</td>
                            <td class="p-4 text-slate-600">{{ sup.pic_name || '-' }}</td>
                            <td class="p-4 text-slate-600">{{ sup.telepon || '-' }}</td>
                            <td class="p-4 text-slate-500 truncate max-w-[200px]" :title="sup.alamat">{{ sup.alamat ||
                                '-' }}</td>

                            <td class="p-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button
                                        class="w-8 h-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                                        <i class="pi pi-pencil"></i>
                                    </button>

                                    <button @click="hapus(sup.id_supplier)"
                                        class="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                                        <i class="pi pi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredSupplier.length === 0">
                            <td colspan="5" class="p-12 text-center text-slate-400">
                                <div
                                    class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <i class="pi pi-inbox text-3xl text-slate-300"></i>
                                </div>
                                <h3 class="text-lg font-bold text-slate-600 mb-1">Buku Suplier Kosong</h3>
                                <p>Belum ada data suplier atau pencarian tidak ditemukan.</p>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSuplier } from '@/composables/useSuplier'

// Hapus import api yang tidak terpakai agar file lebih bersih
const {
    filteredSupplier,
    searchQuery,
    isLoading,
    fetchSuppliers,
    deleteSupplier
} = useSuplier()

// Muat data segera setelah halaman terbuka
onMounted(() => {
    fetchSuppliers()
})

// Fungsi Hapus Suplier
const hapus = async (id) => {
    if (!id) return;

    if (confirm("Apakah Anda yakin ingin menghapus data suplier ini dari Database?")) {
        const hasil = await deleteSupplier(id)
        if (hasil.success) {
            alert("Data suplier berhasil dihapus!")
        } else {
            alert(hasil.message)
        }
    }
}
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