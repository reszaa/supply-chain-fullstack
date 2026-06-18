import { reactive, watch } from 'vue'


const savedData = JSON.parse(localStorage.getItem('dataSuplierLokal')) || []

export const globalStore = reactive({
    suplierList: savedData
})


watch(
    () => globalStore.suplierList,
    (DataBaru) => {
        localStorage.setItem('dataSuplierLokal', JSON.stringify(DataBaru))
    },
    { deep: true }
)