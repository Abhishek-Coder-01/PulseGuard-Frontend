export const THEME_KEY = "pulseguard-theme";
export const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

export function getStoredThemePreference() {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
  } catch {
    return null;
  }
}

export function getSystemTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light";
}

export function getResolvedTheme(themePreference) {
  return themePreference ?? getSystemTheme();
}

export function applyTheme(theme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function persistThemePreference(themePreference) {
  try {
    if (themePreference) {
      localStorage.setItem(THEME_KEY, themePreference);
      return;
    }

    localStorage.removeItem(THEME_KEY);
  } catch {
    void 0;
  }
}
