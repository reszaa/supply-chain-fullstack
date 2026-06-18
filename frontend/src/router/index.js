import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import AccountingLayout from '../layout/AccountingLayout.vue'
import WarehouseLayout from '../layout/WarehouseLayout.vue'
import RndLayout from '../layout/RndLayout.vue'
import LogistikLayout from '../layout/LogistikLayout.vue'
import FactoryLayout from '../layout/FactoryLayout.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'main',
            component: Main
        },

        {
            path: '/accounting',
            component: AccountingLayout,
            children: [
                {

                    path: '',
                    name: 'AccountingDashboard',
                    component: () => import('../components/accounting/Dashboard.vue')
                },
                {
                    path: 'tagihan',
                    name: 'BukuTagihan',
                    component: () => import('../components/accounting/BukuTagihan.vue')
                },
                {
                    path: 'dokumen',
                    name: 'AccountingDocument',
                    component: () => import('../components/accounting/Document.vue')
                },
                {
                    path: 'belanja',
                    name: 'Belanja',
                    component: () => import('../components/accounting/Belanja.vue')
                }

            ]
        },


        {
            path: '/rnd',
            component: RndLayout,
            children: [
                /* {
                     path: '',
                     name: 'RndDashboard',
                     component: () => import('../components/rnd/Dashboard.vue')
                 },*/

            ]
        },


        {
            path: '/warehouse',
            component: WarehouseLayout,
            children: [
                {
                    path: 'received',
                    name: 'Received',
                    component: () => import('../components/warehouse/Received.vue')
                },
                {
                    path: 'raw-stock',
                    name: 'RawStock',
                    component: () => import('../components/warehouse/RawStock.vue')
                }
            ]
        },


        {
            path: '/factory',
            component: FactoryLayout,
            children: [
                /* {
                     path: '',
                     name: 'FactoryDashboard',
                     component: () => import('../components/factory/Dashboard.vue')
                 },
              */
            ]
        },


        {
            path: '/logistik',
            component: LogistikLayout,
            children: [
                /*{
                    path: '',
                    name: 'LogistikDashboard',
                    component: () => import('../components/logistik/Dashboard.vue')
                },*/

            ]
        },


        {
            path: '/kurir',
            component: () => import('../layout/KurirLayout.vue'),
            children: [
                /*{
                    path: '',
                    name: 'KurirDashboard',
                    component: () => import('../components/kurir/Dashboard.vue')
                },
                */
            ]
        }
    ]
})

export default router