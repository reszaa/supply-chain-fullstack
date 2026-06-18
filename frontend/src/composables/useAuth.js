import { ref } from 'vue';
import api from '../services/api';

export function useAuth() {
    const isLoading = ref(false);
    const error = ref(null);
    const userProfile = ref(null);

    const login = async (username, password) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.post('staff/login/', { username, password });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                userProfile.value = response.data.data;
                localStorage.setItem('userRole', userProfile.value.profil.role);

                return true;
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'Terjadi kesalahan saat login';
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        userProfile.value = null;

    };

    return { login, logout, isLoading, error, userProfile };
}