<script setup>
import { onMounted, computed, ref } from 'vue';
import { useAccounting } from '@/composables/useAccounting';
import api from '../../utils/api';
const { daftarBelanja, dashboardSummary, fetchSemuaBelanja, fetchDashboardSummary, isLoading } = useAccounting();

const selectedEntitas = ref('PT');


const ubahEntitas = async (entitas) => {
    selectedEntitas.value = entitas;
    await fetchDashboardSummary(entitas);
    await fetchSemuaBelanja(entitas);
};

onMounted(async () => {
    await fetchDashboardSummary(selectedEntitas.value);
    await fetchSemuaBelanja(selectedEntitas.value);
});

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka || 0);
};

const transaksiTerbaru = computed(() => {
    return daftarBelanja.value.slice(0, 5);
});

const saldoBank = computed(() => dashboardSummary.value?.saldo_elektrik || 0);
const saldoTunai = computed(() => dashboardSummary.value?.saldo_fisik || 0);
const saldoPiutang = computed(() => dashboardSummary.value?.saldo_piutang || 0);
const totalPengeluaran = computed(() => dashboardSummary.value?.total_pengeluaran || 0);


const chartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
        {
            type: 'bar',
            label: 'Pemasukan',
            backgroundColor: '#CBD5E1',
            data: [4000, 10000, 15000, 4000, 16000, 8000, 12000, 14000, 17000, 5000, 12000, 6000]
        },
        {
            type: 'bar',
            label: 'Pengeluaran (Kas)',
            backgroundColor: '#94A3B8',
            data: [2100, 8400, 2400, 7500, 3700, 6500, 7400, 8000, 4800, 9000, 7600, 4200]
        },
        {
            type: 'bar',
            label: 'Saldo Akhir',
            backgroundColor: '#0F172A',
            data: [4100, 5200, 3400, 7400, 3900, 3800, 7200, 7900, 4900, 8700, 7300, 4000]
        }
    ]
});

const chartOptions = ref({
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
        legend: { display: false }
    },
    scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, border: { display: false } }
    }
});
</script>

<template>
    <div class="flex flex-col w-full p-2 sm:p-4 text-slate-700 font-sans overflow-hidden max-w-full">

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h1 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Overview</h1>
                <h2 class="text-2xl sm:text-3xl font-bold text-slate-800">Dashboard Keuangan</h2>
            </div>

            <div class="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
                <div class="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto justify-between sm:justify-start">
                    <button @click="ubahEntitas('PT')" :disabled="isLoading"
                        :class="selectedEntitas === 'PT' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'"
                        class="flex-1 sm:flex-none px-4 py-1.5 rounded text-sm font-bold transition-all duration-200 disabled:opacity-50 text-center">
                        Dompet PT
                    </button>
                    <button @click="ubahEntitas('CV')" :disabled="isLoading"
                        :class="selectedEntitas === 'CV' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'"
                        class="flex-1 sm:flex-none px-4 py-1.5 rounded text-sm font-bold transition-all duration-200 disabled:opacity-50 text-center">
                        Dompet CV
                    </button>
                </div>

                <button
                    class="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-colors w-full sm:w-auto mt-2 sm:mt-0">
                    <span>Export</span>
                    <i class="pi pi-download"></i>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            <div
                class="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm overflow-hidden w-full">
                <div class="flex flex-wrap justify-between items-center mb-6 gap-3">
                    <h3 class="font-bold text-lg text-slate-800">Analisis Arus Kas</h3>
                    <div class="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-slate-500">
                        <span class="flex items-center gap-1.5"><span
                                class="w-2.5 h-2.5 rounded-full bg-slate-900"></span> Saldo</span>
                        <span class="flex items-center gap-1.5"><span
                                class="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Pengeluaran</span>
                        <span class="flex items-center gap-1.5"><span
                                class="w-2.5 h-2.5 rounded-full bg-slate-200"></span> Pemasukan</span>
                    </div>
                </div>

                <div class="h-[250px] w-full relative">
                    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-full w-full" />
                </div>
            </div>

            <div
                class="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col relative overflow-hidden w-full">
                <div v-if="isLoading"
                    class="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                    <i class="pi pi-spinner pi-spin text-3xl text-slate-800"></i>
                </div>

                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-lg text-slate-800">Buku Saldo {{ selectedEntitas }}</h3>
                    <button class="text-slate-400 hover:text-slate-800 transition-colors"><i
                            class="pi pi-ellipsis-h"></i></button>
                </div>

                <div class="flex h-2 w-full rounded-full overflow-hidden mb-8 bg-slate-100">
                    <div class="bg-emerald-500 w-[50%] transition-all duration-500"></div>
                    <div class="bg-amber-500 w-[25%] transition-all duration-500"></div>
                    <div class="bg-blue-500 w-[25%] transition-all duration-500"></div>
                </div>

                <div class="space-y-4 sm:space-y-5 mb-8">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2 sm:gap-3">
                            <div class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>
                            <span class="text-xs sm:text-sm font-bold text-slate-800">Cash Elektrik <span
                                    class="hidden sm:inline text-slate-400 font-semibold">(Bank)</span></span>
                        </div>
                        <span class="text-xs sm:text-sm font-bold text-slate-800">{{ formatRupiah(saldoBank) }}</span>
                    </div>

                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2 sm:gap-3">
                            <div class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500 shadow-sm"></div>
                            <span class="text-xs sm:text-sm font-bold text-slate-800">Cash Fisik <span
                                    class="hidden sm:inline text-slate-400 font-semibold">(Tunai)</span></span>
                        </div>
                        <span class="text-xs sm:text-sm font-bold text-slate-800">{{ formatRupiah(saldoTunai) }}</span>
                    </div>

                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2 sm:gap-3">
                            <div class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-500 shadow-sm"></div>
                            <span class="text-xs sm:text-sm font-bold text-slate-800">Piutang <span
                                    class="hidden sm:inline text-slate-400 font-semibold">(Belum Cair)</span></span>
                        </div>
                        <span class="text-xs sm:text-sm font-bold text-slate-800">{{ formatRupiah(saldoPiutang)
                            }}</span>
                    </div>

                    <hr class="border-slate-100">

                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2 sm:gap-3">
                            <div class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                            <span class="text-xs sm:text-sm font-bold text-slate-800">Pengeluaran <span
                                    class="hidden sm:inline text-slate-400 font-semibold">(Bulan Ini)</span></span>
                        </div>
                        <span class="text-xs sm:text-sm font-bold text-red-600">{{ formatRupiah(totalPengeluaran)
                            }}</span>
                    </div>
                </div>

                <div class="mt-auto border-t border-slate-100 pt-5">
                    <router-link to="/accounting/belanja"
                        class="block w-full text-center text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                        Lihat Seluruh Kas Kecil
                    </router-link>
                </div>
            </div>

        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm w-full overflow-hidden">
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-bold text-lg text-slate-800">Riwayat Transaksi Terakhir</h3>
                <router-link to="/accounting/belanja"
                    class="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Lihat
                    Semua</router-link>
            </div>

            <div class="overflow-x-auto custom-scrollbar pb-2">
                <table class="w-full text-left border-collapse text-sm whitespace-nowrap">
                    <thead>
                        <tr class="text-slate-800 border-b border-slate-200">
                            <th class="pb-3 px-2 font-bold">ID</th>
                            <th class="pb-3 px-2 font-bold">Entitas</th>
                            <th class="pb-3 px-2 font-bold">Keterangan</th>
                            <th class="pb-3 px-2 font-bold text-center">Kategori</th>
                            <th class="pb-3 px-2 font-bold">Tanggal</th>
                            <th class="pb-3 px-2 font-bold">Status</th>
                            <th class="pb-3 px-2 font-bold text-right">Nominal</th>
                        </tr>
                    </thead>
                    <tbody class="text-slate-500">
                        <tr v-for="item in transaksiTerbaru" :key="item.id_transaksi"
                            class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td class="py-3 px-2 font-mono text-xs">{{ item.id_transaksi.split('-')[1] ||
                                item.id_transaksi
                                }}</td>

                            <td class="py-3 px-2">
                                <span
                                    :class="item.entitas === 'PT' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'"
                                    class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border">
                                    {{ item.entitas || 'PT' }}
                                </span>
                            </td>

                            <td class="py-3 px-2 font-bold text-slate-800 flex items-center gap-3">
                                <div
                                    class="w-7 h-7 shrink-0 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px] uppercase">
                                    {{ item.pemohon ? item.pemohon.substring(0, 2) : 'UK' }}
                                </div>
                                {{ item.nama_pengeluaran }}
                            </td>
                            <td class="py-3 px-2">
                                <div class="w-7 h-7 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-600 tooltip"
                                    :title="item.kategori">
                                    <i class="pi pi-tag text-xs"></i>
                                </div>
                            </td>
                            <td class="py-3 px-2 font-medium">{{ new Date(item.tanggal).toLocaleDateString('id-ID', {
                                month:
                                    'short', day: 'numeric'
                            }) }}</td>
                            <td class="py-3 px-2">
                                <span
                                    class="px-2.5 py-1 bg-red-50 text-red-600 rounded-md font-bold text-[11px] uppercase tracking-wider">Keluar</span>
                            </td>
                            <td class="py-3 px-2 text-right font-bold text-slate-800">{{ formatRupiah(item.nominal) }}
                            </td>
                        </tr>
                        <tr v-if="transaksiTerbaru.length === 0">
                            <td colspan="7" class="py-12 text-center text-slate-400">
                                <i class="pi pi-inbox text-3xl mb-3 block"></i>
                                Belum ada riwayat transaksi yang tercatat.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<style scoped>
/* [UBAH] Penambahan custom scrollbar khusus file Dashboard agar seragam */
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