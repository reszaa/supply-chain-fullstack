<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { accountingMenus } from '../utils/menuData.js' // Mengambil data menu dari utils

const router = useRouter()
const activeMenu = ref('dashboard')
const isMobileMenuOpen = ref(false)

// Menggunakan defineAsyncComponent untuk memisahkan chunk kode (Lazy Loading yang efektif)
const componentMap = {
    dashboard: defineAsyncComponent(() => import('../components/accounting/Dashboard.vue')),
    procurement: defineAsyncComponent(() => import('../components/accounting/Procurement.vue')),
    suplier: defineAsyncComponent(() => import('../components/accounting/Suplier.vue')),
    customer: defineAsyncComponent(() => import('../components/accounting/Customer.vue')),
    tagihan: defineAsyncComponent(() => import('../components/accounting/BukuTagihan.vue')),
    document: defineAsyncComponent(() => import('../components/accounting/Document.vue')),
    belanja: defineAsyncComponent(() => import('../components/accounting/Belanja.vue'))
}

// Computed property untuk mendeteksi komponen mana yang sedang aktif secara dinamis
const activeComponent = computed(() => componentMap[activeMenu.value])

const switchMenu = (id) => {
    activeMenu.value = id
    isMobileMenuOpen.value = false
}

const goToMainHub = () => {
    router.push('/')
}
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex font-sans w-full overflow-x-hidden relative">

        <button @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden fixed top-4 right-4 z-[60] w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition-colors">
            <i :class="isMobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
        </button>

        <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false"
            class="md:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 transition-opacity">
        </div>

        <aside :class="[
            isMobileMenuOpen ? 'flex fixed top-4 left-4 h-[calc(100vh-2rem)] w-24 animate-slide-in' : 'hidden md:flex',
            'w-24 bg-white border border-slate-200/60 text-slate-600 flex-col fixed h-[calc(100vh-3rem)] md:top-6 md:left-6 rounded-[2rem] shadow-xl shadow-slate-200/50 z-50 transition-all overflow-hidden md:overflow-visible'
        ]">
            <div class="h-24 flex items-center justify-center border-b border-slate-100/80 shrink-0">
                <div @click="goToMainHub"
                    class="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer">
                    <span class="text-white font-black text-xl tracking-tighter">PR</span>
                </div>
            </div>

            <div class="flex-1 py-8 w-full overflow-y-auto custom-scrollbar md:overflow-visible">
                <nav class="flex flex-col items-center gap-4 w-full">

                    <button v-for="menu in accountingMenus" :key="menu.id" @click="switchMenu(menu.id)"
                        v-tooltip.right="menu.name"
                        class="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group mx-auto shrink-0"
                        :class="activeMenu === menu.id ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'">

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
        </aside>

        <main
            class="flex-1 ml-0 md:ml-[136px] p-4 md:p-8 w-full h-screen overflow-y-auto custom-scrollbar pt-20 md:pt-8">
            <div class="mx-auto w-full">
                <component :is="activeComponent" />
            </div>
        </main>

    </div>
</template>

<style scoped>
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
</style>