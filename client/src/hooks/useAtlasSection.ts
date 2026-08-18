/**
 * Monumental Athletics: one-way, visibility-aware section choreography that never controls semantic state.
 */
import { useEffect, useRef, useState } from "react";

export function useAtlasSection<T extends HTMLElement>(threshold = 0.16) {
  const ref = useRef<T>(null);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || entered) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [entered, threshold]);
  return { ref, entered, className: entered ? "atlas-section atlas-section-entered" : "atlas-section" };
}
