
import { ref, onMounted, onUnmounted } from 'vue'

export function useMobile() {
    const isMobile = ref(false)

    const checkScreen = () => {
        isMobile.value = window.innerWidth < 768
    }

    onMounted(() => {
        checkScreen()
        window.addEventListener('resize', checkScreen)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', checkScreen)
    })

    return { isMobile }
}