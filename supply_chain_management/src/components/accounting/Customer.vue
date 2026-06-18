<template>
    <div class="flex flex-col w-full animate-fade-in">

        <div class="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
                <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Master Data Customer</h2>
                <p class="text-slate-500 text-sm mt-1">Kelola direktori klien dan pelanggan produk.</p>
            </div>
            <button
                class="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 transform hover:-translate-y-0.5">
                <i class="pi pi-plus"></i> Tambah Customer Baru
            </button>
        </div>

        <div class="bg-white border border-slate-200 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex-1">
            <div class="flex items-center gap-4 mb-6">
                <div class="relative w-full sm:w-80">
                    <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" placeholder="Cari nama customer..."
                        class="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium text-slate-700">
                </div>
            </div>

            <div class="border border-slate-200 rounded-2xl overflow-x-auto">
                <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                            <th class="p-4 font-bold">Nama Customer</th>
                            <th class="p-4 font-bold">Kategori</th>
                            <th class="p-4 font-bold">No. Telepon</th>
                            <th class="p-4 font-bold">Alamat Pengiriman</th>
                            <th class="p-4 font-bold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td class="p-4 font-bold text-slate-800">CV. Mitra Distribusi</td>
                            <td class="p-4"><span
                                    class="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">Distributor</span>
                            </td>
                            <td class="p-4 text-slate-600">0899-8765-4321</td>
                            <td class="p-4 text-slate-500 truncate max-w-[200px]">Jl. Sudirman No. 45, Jakarta Raya</td>
                            <td class="p-4 text-center">
                                <button
                                    class="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all mx-auto">
                                    <i class="pi pi-pencil"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<script setup>

</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
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