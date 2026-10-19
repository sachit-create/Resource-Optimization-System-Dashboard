const THEME_KEY = "theme";

export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
}

export function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  localStorage.setItem(THEME_KEY, nextTheme);
  return nextTheme;
}
