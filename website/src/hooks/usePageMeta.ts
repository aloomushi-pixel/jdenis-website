/**
 * usePageMeta — Maneja meta tags dinámicos (title, description, canonical, og:*)
 * y JSON-LD structured data.
 */
import { useEffect } from 'react';

interface PageMetaOptions {
    title: string;
    description?: string;
    canonical?: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    jsonLd?: Record<string, unknown> | Record<string, unknown>[];
    noindex?: boolean;
}

const SITE_NAME = 'J. Denis México';
const BASE_URL = 'https://jdenis.store';
const DEFAULT_IMAGE = 'https://jdenis.store/hero-products.jpg';

export function usePageMeta({
    title,
    description = 'Más de 25 años innovando en belleza profesional. Productos certificados para cejas, pestañas y lash lifting con patentes mexicanas.',
    canonical,
    image = DEFAULT_IMAGE,
    type = 'website',
    jsonLd,
    noindex = false,
}: PageMetaOptions) {
    useEffect(() => {
        // Title
        const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
        document.title = fullTitle;

        // Helper to set/update meta tags
        const setMeta = (selector: string, content: string, attr = 'content') => {
            let el = document.querySelector(selector) as HTMLMetaElement | null;
            if (!el) {
                el = document.createElement('meta');
                const attrName = selector.includes('[name=') ? 'name' : 'property';
                const attrValue = selector.match(/["']([^"']+)["']/)?.[1] || '';
                el.setAttribute(attrName, attrValue);
                document.head.appendChild(el);
            }
            el.setAttribute(attr, content);
        };

        // Helper to set/update link tags
        const setLink = (rel: string, href: string) => {
            let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
            if (!el) {
                el = document.createElement('link');
                el.rel = rel;
                document.head.appendChild(el);
            }
            el.href = href;
        };

        // Basic meta
        setMeta('meta[name="description"]', description);
        if (noindex) {
            setMeta('meta[name="robots"]', 'noindex, nofollow');
        } else {
            setMeta('meta[name="robots"]', 'index, follow, max-snippet:-1, max-image-preview:large');
        }

        // Canonical
        const canonicalUrl = canonical || `${BASE_URL}${window.location.pathname}`;
        setLink('canonical', canonicalUrl);

        // Open Graph
        setMeta('meta[property="og:title"]', fullTitle);
        setMeta('meta[property="og:description"]', description);
        setMeta('meta[property="og:type"]', type);
        setMeta('meta[property="og:url"]', canonicalUrl);
        setMeta('meta[property="og:image"]', image.startsWith('http') ? image : `${BASE_URL}${image}`);

        // Twitter Card
        setMeta('meta[name="twitter:title"]', fullTitle);
        setMeta('meta[name="twitter:description"]', description);
        setMeta('meta[name="twitter:image"]', image.startsWith('http') ? image : `${BASE_URL}${image}`);

        // JSON-LD
        const existingJsonLd = document.querySelectorAll('script[data-dynamic-jsonld]');
        existingJsonLd.forEach(el => el.remove());

        if (jsonLd) {
            const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
            schemas.forEach(schema => {
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.setAttribute('data-dynamic-jsonld', 'true');
                script.textContent = JSON.stringify(schema);
                document.head.appendChild(script);
            });
        }

        return () => {
            // Restore default title on unmount con un pequeño delay
            // para no limpiar si hay navegación a otra ruta
        };
    }, [title, description, canonical, image, type, noindex, jsonLd]);
}
