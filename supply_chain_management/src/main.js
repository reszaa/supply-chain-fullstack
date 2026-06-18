import './style.css'
import 'primeicons/primeicons.css'
import Tooltip from 'primevue/tooltip'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Select from 'primevue/select';
import Chart from 'primevue/chart'

const app = createApp(App)

app.use(router)
app.directive('tooltip', Tooltip)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: 'none'
        }
    }
})
app.component('Chart', Chart)
app.component('Select', Select);

app.mount('#app')