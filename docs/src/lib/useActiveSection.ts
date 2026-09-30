import { useEffect, useState } from 'react';

export function useActiveSection(ids: readonly string[]): string | undefined {
  const [active, setActive] = useState<string | undefined>(ids[0]);
  const key = ids.join('|');

  useEffect(() => {
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    const visible = new Set<string>();

    // A faixa de cima da viewport decide a seção ativa; o resto da tela é ignorado.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = elements.find((element) => visible.has(element.id));
        if (first) setActive(first.id);
      },
      { rootMargin: '-72px 0px -65% 0px' },
    );
    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [key]);

  return active;
}
