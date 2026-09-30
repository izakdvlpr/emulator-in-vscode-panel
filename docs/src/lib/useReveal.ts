import { useEffect, useRef } from 'react';

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          for (const target of targets) target.classList.add('is-in');
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return ref;
}
