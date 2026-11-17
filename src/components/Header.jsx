import { useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

const navigationLinks = [
  ["01", "Arbolario", "/work"],
  ["02", "Blog", "/blog"],
  ["03", "About Me", "/about"],
  ["04", "Contact", "/contact"],
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    setIsDark(document.documentElement.dataset.theme === "dark");
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    function handlePointerDown(event) {
      if (!headerRef.current?.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [mobileMenuOpen]);

  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    setIsDark(nextTheme === "dark");
    try {
      localStorage.setItem("keikabonsai-theme", nextTheme);
    } catch {}
  }

  return (
    <header ref={headerRef} className="site-header fixed top-0 left-0 bg-green/30 backdrop-blur-md w-full h-20 z-20 flex items-center justify-between px-5">
      <h1 className="text-2xl md:text-4xl bbh-sans-bogle-regular text-green-800 cursor-pointer">
        <a href="/">KEIKABONSAI</a>
      </h1>
      <div className="ml-auto hidden items-center gap-5 md:flex">
        <nav aria-label="Navegación principal" className="flex items-center gap-7 lg:gap-10">
          {navigationLinks.map(([number, label, href]) => (
            <a key={href} href={href} className="header-link group relative flex flex-col items-center gap-0.5 px-1 py-2">
              <span className="text-[0.65rem] leading-none opacity-65">{number}</span>
              <span>{label}</span>
              <span aria-hidden="true" className="header-link-indicator absolute bottom-0 left-0 h-px w-0 bg-green-800 transition-all duration-200 group-hover:w-full group-focus-visible:w-full" />
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="theme-toggle flex size-11 items-center justify-center rounded-full text-green-800 transition-colors hover:bg-green-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
          aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
          title={isDark ? "Activar modo claro" : "Activar modo oscuro"}
          aria-pressed={isDark}
          onClick={toggleTheme}
        >
          {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
        </button>
      </div>
      <button
        ref={menuButtonRef}
        type="button"
        className="mobile-menu-toggle flex size-11 items-center justify-center rounded-full text-green-800 transition-colors hover:bg-green-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700 md:hidden"
        aria-label={mobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
      >
        {mobileMenuOpen ? <X size={24} strokeWidth={1.75} /> : <Menu size={24} strokeWidth={1.75} />}
      </button>
      <div
        className={`absolute left-0 right-0 top-full grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 md:hidden ${mobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
      >
        <nav id="mobile-navigation" aria-label="Navegación móvil" className="min-h-0 overflow-hidden border-t border-green-900/10 bg-stone-50/95 px-5 text-zinc-900 shadow-lg backdrop-blur-md">
          {navigationLinks.map(([number, label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 border-b border-zinc-900/10 py-4 last:border-b-0"
            >
              <span className="text-xs text-green-800">{number}</span>
              <span className="text-lg">{label}</span>
            </a>
          ))}
          <div role="group" aria-labelledby="mobile-accessibility-heading" className="border-t border-zinc-900/10 py-4">
            <p id="mobile-accessibility-heading" className="mb-2 text-xs font-medium uppercase text-green-700">Accesibilidad</p>
            <button
              type="button"
              className="theme-toggle flex min-h-11 w-full items-center gap-3 rounded px-2 py-2 text-left text-green-900 transition-colors hover:bg-green-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
              aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
              aria-pressed={isDark}
              onClick={toggleTheme}
            >
              {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
              <span>{isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
