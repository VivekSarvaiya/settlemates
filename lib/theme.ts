// AnimatedThemeToggler saves the choice under this key; with no saved choice, follow the system setting.
// Runs inline in <head> so the right theme is on <html> before the first paint.
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;
