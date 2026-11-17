import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";

export default function ScrollCue() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissed = window.scrollY > 24;
    let unmountTimer;
    let revealFrame;
    const delay = document.documentElement.classList.contains("home-intro-pending") ? 3600 : 1400;
    const timer = window.setTimeout(() => {
      if (dismissed) return;
      setMounted(true);
      revealFrame = window.requestAnimationFrame(() => setVisible(true));
    }, delay);
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setVisible(false);
      unmountTimer = window.setTimeout(() => setMounted(false), 300);
    };
    const hideAfterScroll = () => {
      if (window.scrollY > 24) dismiss();
    };
    const hideOnWheel = (event) => {
      if (event.deltaY !== 0) dismiss();
    };

    window.addEventListener("scroll", hideAfterScroll, { passive: true });
    window.addEventListener("wheel", hideOnWheel, { passive: true });
    window.addEventListener("touchmove", dismiss, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(unmountTimer);
      window.cancelAnimationFrame(revealFrame);
      window.removeEventListener("scroll", hideAfterScroll);
      window.removeEventListener("wheel", hideOnWheel);
      window.removeEventListener("touchmove", dismiss);
    };
  }, []);

  if (!mounted) return null;

  return (
    <a
      href="#whats-keika"
      aria-label="Desplazarse a la siguiente sección"
      title="Seguir desplazándose"
      onClick={(event) => {
        const target = document.getElementById("whats-keika");
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        });
      }}
      className={`scroll-cue fixed bottom-6 left-1/2 z-10 flex size-11 -translate-x-1/2 items-center justify-center text-green-800 transition-[opacity,translate,color] duration-300 ease-out motion-reduce:transition-none hover:text-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
    >
      <ArrowDown className="scroll-cue-icon" size={24} strokeWidth={1.75} aria-hidden="true" />
    </a>
  );
}