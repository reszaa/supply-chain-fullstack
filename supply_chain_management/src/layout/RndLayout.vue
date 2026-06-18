<template>
    <div class="flex min-h-screen bg-[#F8FAFC] font-sans w-full overflow-x-hidden relative">

        <button @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden fixed top-4 right-4 z-[60] w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition-colors">
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
                    class="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer">
                    <i class="pi pi-flask text-xl text-white"></i>
                </div>
            </div>

            <div class="flex-1 py-8 w-full overflow-y-auto custom-scrollbar md:overflow-visible">
                <nav class="flex flex-col items-center gap-4 w-full">

                    <button v-for="menu in rndMenus" :key="menu.id" @click="switchTab(menu.id)"
                        v-tooltip.right="menu.name"
                        class="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 mx-auto group shrink-0"
                        :class="activeTab === menu.id ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'">

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
                    class="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-md hover:ring-2 hover:ring-slate-300 transition-all"
                    title="Logout">
                    RM
                </div>
            </div>
        </aside>

        <main class="flex-1 ml-0 md:ml-[136px] p-4 md:p-8 lg:p-10 max-w-[1400px] w-full min-h-screen pt-20 md:pt-8">

            <header
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 flex-shrink-0 gap-4">
                <div>
                    <h2 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">R&D Management</h2>
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

            <div class="relative w-full">
                <Mixing v-if="activeTab === 'mixing'" />
                <Filling v-if="activeTab === 'filling'" />
                <TankMonitoring v-if="activeTab === 'tanks'" />
                <FormulaMaster v-if="activeTab === 'formulas'" />
            </div>

        </main>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Import semua sub-komponen R&D
import Mixing from '../components/rnd/Mixing.vue'
import Filling from '../components/rnd/Filling.vue'
import TankMonitoring from '../components/rnd/TankMonitoring.vue'
import FormulaMaster from '../components/rnd/FormulaMaster.vue'

const router = useRouter()
const activeTab = ref('mixing')
const isMobileMenuOpen = ref(false)

// Array Data-Driven untuk Menu R&D
const rndMenus = [
    { id: 'mixing', name: 'Proses Mixing (Reaktor)', icon: 'pi-sync' },
    { id: 'filling', name: 'Proses Filling & Kemas', icon: 'pi-filter' },
    { id: 'tanks', name: 'Monitoring Tangki', icon: 'pi-database' },
    { id: 'formulas', name: 'Master Formula', icon: 'pi-book' }
]

// Menghasilkan nama judul otomatis
const currentMenuName = computed(() => {
    const menu = rndMenus.find(m => m.id === activeTab.value)
    return menu ? menu.name : 'R&D Management'
})

const switchTab = (tab) => {
    activeTab.value = tab
    isMobileMenuOpen.value = false // Auto tutup saat di layar HP
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