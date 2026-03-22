import { useEffect } from 'react';

/**
 * Punto 22: Scroll Reveal Hook
 * Adds IntersectionObserver to trigger reveal animations
 * Usage: call this hook in any page/component that uses .reveal, .reveal-left, .reveal-right classes
 */
export function useScrollReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        // Once revealed, stop observing
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        targets.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}
