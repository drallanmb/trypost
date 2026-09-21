export type Theme = 'solar' | 'afterglow';

export const THEME_STORAGE_KEY = 'social-anamnesismd.theme';

type ThemeEnvironment = {
    document: {
        documentElement: {
            dataset: { theme?: string };
            style: { colorScheme: string };
        };
    };
    localStorage: Pick<Storage, 'getItem' | 'setItem'>;
};

const browser = () => (typeof window === 'undefined' ? undefined : window);

function applyTheme(value: unknown, environment?: ThemeEnvironment): Theme {
    const theme = value === 'afterglow' ? 'afterglow' : 'solar';
    if (environment) {
        environment.document.documentElement.dataset.theme = theme;
        environment.document.documentElement.style.colorScheme =
            theme === 'afterglow' ? 'dark' : 'light';
    }
    return theme;
}

export function initializeTheme(environment = browser()): Theme {
    let saved: string | null = null;
    try {
        saved = environment?.localStorage.getItem(THEME_STORAGE_KEY) ?? null;
    } catch {
        // Private browsing and embedded contexts may deny storage access.
    }
    return applyTheme(saved, environment);
}

export function setTheme(value: unknown, environment = browser()): Theme {
    const theme = applyTheme(value, environment);
    try {
        environment?.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // The visible preference still works for this visit without storage.
    }
    return theme;
}
