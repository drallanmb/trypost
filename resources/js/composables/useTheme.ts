import { readonly, ref } from 'vue';

import { initializeTheme, setTheme } from '@/lib/theme';

const theme = ref(initializeTheme());

export function useTheme() {
    const toggleTheme = () => {
        theme.value = setTheme(theme.value === 'solar' ? 'afterglow' : 'solar');
    };

    return { theme: readonly(theme), toggleTheme };
}
