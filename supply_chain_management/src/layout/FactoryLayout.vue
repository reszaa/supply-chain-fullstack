<template>
    <div class="flex min-h-screen bg-[#F8FAFC] font-sans w-full overflow-x-hidden relative text-slate-700">

        <button @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden fixed top-4 right-4 z-[60] w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-amber-600 transition-colors">
            <i :class="isMobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
        </button>

        <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false"
            class="md:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 transition-opacity">
        </div>

        <aside :class="[
            isMobileMenuOpen ? 'flex fixed top-4 left-4 h-[calc(100vh-2rem)] w-24 animate-slide-in' : 'hidden md:flex',
            'w-24 bg-white flex-col fixed h-[calc(100vh-3rem)] md:top-6 md:left-6 z-50 items-center rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all overflow-hidden md:overflow-visible'
        ]">

            <div class="h-24 flex items-center justify-center border-b border-slate-100/80 shrink-0 w-full">
                <div @click="goToMainHub"
                    class="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-md shadow-amber-500/30 hover:scale-105 transition-transform cursor-pointer">
                    <i class="pi pi-building text-xl text-white"></i>
                </div>
            </div>

            <div class="flex-1 py-8 w-full overflow-y-auto custom-scrollbar md:overflow-visible">
                <nav class="flex flex-col items-center gap-4 w-full">

                    <button v-for="menu in menus" :key="menu.id" @click="switchMenu(menu.id)"
                        v-tooltip.right="menu.name"
                        class="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 mx-auto group shrink-0"
                        :class="activeMenu === menu.id ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'">

                        <svg v-if="menu.svgPath" xmlns="http://www.w3.org/2000/svg"
                            class="w-6 h-6 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" :d="menu.svgPath" />
                        </svg>
                        <i v-else
                            :class="['pi', menu.icon, 'text-xl', 'transition-transform', 'group-hover:scale-110']"></i>

                    </button>

                </nav>
            </div>

            <div
                class="h-24 flex items-center justify-center flex-col gap-2 shrink-0 border-t border-slate-100/80 w-full">
                <div @click="logout"
                    class="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-amber-500 hover:border-amber-600 transition-all shadow-sm"
                    title="Logout">
                    <img src="https://ui-avatars.com/api/?name=Kepala+Pabrik&background=f59e0b&color=fff"
                        alt="User Avatar" class="w-full h-full object-cover">
                </div>
            </div>
        </aside>

        <main
            class="flex-1 ml-0 md:ml-[136px] p-4 md:p-8 lg:p-10 max-w-[1400px] w-full min-h-screen pt-20 md:pt-8 flex flex-col">

            <header
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 flex-shrink-0 gap-4">
                <div>
                    <h2 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Factory & Warehouse
                        Operation</h2>
                    <h1 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                        {{ currentMenuName }}
                    </h1>
                </div>

                <div
                    class="flex w-full sm:w-auto bg-white px-4 py-2.5 rounded-xl border border-slate-200 items-center gap-3 shadow-sm">
                    <i class="pi pi-search text-slate-400 text-sm"></i>
                    <input type="text" placeholder="Search"
                        class="bg-transparent border-none outline-none text-sm w-full sm:w-32 focus:w-48 transition-all text-slate-700">
                </div>
            </header>

            <div class="relative w-full flex-1">
                <StockGudang v-if="activeMenu === 'stock'" />
                <ToolsManagement v-else-if="activeMenu === 'alat'" />
                <WorkOrder v-else-if="activeMenu === 'produksi'" />
            </div>

        </main>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Import Sub-Komponen Factory
import StockGudang from '../components/factory/StockGudang.vue'
import ToolsManagement from '../components/factory/ToolsManagement.vue'
import WorkOrder from '../components/factory/WorkOrder.vue'

const router = useRouter()
const activeMenu = ref('stock')
const isMobileMenuOpen = ref(false)

// Array Data-Driven untuk Menu Pabrik
const menus = [
    { id: 'stock', name: 'Stock Gudang', icon: 'pi-box' },
    { id: 'alat', name: 'Manajemen Alat', icon: 'pi-cog' },
    { id: 'produksi', name: 'Work Order', icon: 'pi-hammer' }
]

// Menghasilkan nama judul otomatis
const currentMenuName = computed(() => {
    const menu = menus.find(m => m.id === activeMenu.value)
    return menu ? menu.name : 'Factory Operations'
})

const switchMenu = (id) => {
    activeMenu.value = id
    isMobileMenuOpen.value = false // Auto tutup sidebar saat di HP
}

const goToMainHub = () => {
    router.push('/')
}

const logout = () => {
    localStorage.clear()
    window.location.href = '/'
}
</script>

<style scoped>
/* Animasi menu meluncur khusus HP */
.animate-slide-in {
    animation: slideIn 0.25s ease-out forwards;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background-color: #94a3b8;
}
</style>