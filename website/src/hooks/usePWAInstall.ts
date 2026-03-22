import { useEffect, useRef, useState } from 'react';

type PWAStatus = 'idle' | 'installable' | 'ios' | 'installed' | 'unsupported';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
    const [status, setStatus] = useState<PWAStatus>('idle');
    const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }

        // Detect iOS Safari (no beforeinstallprompt)
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        const isInStandaloneMode =
            ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true) ||
            window.matchMedia('(display-mode: standalone)').matches;

        if (isInStandaloneMode) {
            setStatus('installed');
            return;
        }

        if (isIOS) {
            // Only show on iOS Safari (not Chrome for iOS)
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            if (isSafari) setStatus('ios');
            return;
        }

        // Chrome / Edge / Samsung Browser
        const handler = (e: Event) => {
            e.preventDefault();
            deferredPrompt.current = e as BeforeInstallPromptEvent;
            setStatus('installable');
        };

        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', () => setStatus('installed'));

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const install = async (): Promise<boolean> => {
        if (!deferredPrompt.current) return false;
        await deferredPrompt.current.prompt();
        const { outcome } = await deferredPrompt.current.userChoice;
        if (outcome === 'accepted') {
            setStatus('installed');
            deferredPrompt.current = null;
            return true;
        }
        return false;
    };

    const dismiss = () => setStatus('idle');

    return { status, install, dismiss };
}
