<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (path) => {
    router.push(path)
}
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div class="max-w-7xl w-full">

            <div class="text-center mb-16 animate-fade-in">
                <div
                    class="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-900/20">
                    <i class="pi pi-box text-3xl text-white"></i>
                </div>
                <h1 class="text-4xl font-black text-slate-800 tracking-tight mb-3">Pracindo Central Hub</h1>
                <p class="text-slate-500 font-medium max-w-lg mx-auto">Pilih modul departemen untuk mengelola rantai
                    pasok, proses produksi, inventaris gudang, hingga distribusi lapangan.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

                <div @click="goTo('/accounting')"
                    class="group bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center">
                    <div
                        class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <i class="pi pi-receipt text-xl"></i>
                    </div>
                    <h2 class="text-lg font-bold text-slate-800 mb-2">Accounting</h2>
                    <p class="text-[11px] text-slate-500 font-medium leading-relaxed">Kelola Purchase Order (PO), data
                        supplier, dan tagihan pengadaan material.</p>
                </div>
                <div @click="goTo('/rnd')"
                    class="group bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-purple-900/5 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center relative overflow-hidden">
                    <div
                        class="absolute top-0 left-0 w-full h-1 bg-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500">
                    </div>
                    <div
                        class="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">

                        <img src="../assets/lab-click.svg" alt="Lab Icon"
                            class="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />

                    </div>
                    <h2 class="text-lg font-bold text-slate-800 mb-2">Research & Dev</h2>
                    <p class="text-[11px] text-slate-500 font-medium leading-relaxed">Formulasi resep kimia, proses
                        operasional reaktor mixing, dan pengisian cairan.</p>
                </div>

                <div @click="goTo('/warehouse')"
                    class="group bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center">
                    <div
                        class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <i class="pi pi-building text-xl"></i>
                    </div>
                    <h2 class="text-lg font-bold text-slate-800 mb-2">Warehouse</h2>
                    <p class="text-[11px] text-slate-500 font-medium leading-relaxed">Penerimaan barang fisik dari
                        supplier, raw material, dan pengemasan boks produk.</p>
                </div>
                <div @click="goTo('/factory')"
                    class="group bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center">

                    <div
                        class="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <i class="pi pi-cog text-xl group-hover:spin-slow"></i>
                    </div>

                    <h2 class="text-lg font-bold text-slate-800 mb-2">Pabrik & Produksi</h2>
                    <p class="text-[11px] text-slate-500 font-medium leading-relaxed">
                        Kelola stok bahan, manajemen mesin, dan Work Order harian.
                    </p>
                </div>
                <div @click="goTo('/logistik')"
                    class="group bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-amber-900/5 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center relative overflow-hidden">
                    <div
                        class="absolute top-0 left-0 w-full h-1 bg-amber-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500">
                    </div>
                    <div
                        class="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <i class="pi pi-truck text-xl"></i>
                    </div>
                    <h2 class="text-lg font-bold text-slate-800 mb-2">Logistik</h2>
                    <p class="text-[11px] text-slate-500 font-medium leading-relaxed">Manajemen rute retail/customer,
                        data master armada, dan alokasi surat jalan manifest.</p>
                </div>

                <div @click="goTo('/kurir')"
                    class="group bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center relative overflow-hidden">
                    <div
                        class="absolute top-0 left-0 w-full h-1 bg-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500">
                    </div>
                    <div
                        class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <i class="pi pi-mobile text-xl"></i>
                    </div>
                    <h2 class="text-lg font-bold text-slate-800 mb-2">Kurir Mobile</h2>
                    <p class="text-[11px] text-slate-500 font-medium leading-relaxed">Simulasi aplikasi HP kurir di
                        lapangan untuk pantau tugas, detail rute, dan konfirmasi tujuan.</p>
                </div>

            </div>

        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>