import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../utils/telemetry';

type PWAStatus = 'idle' | 'installable' | 'ios' | 'installed' | 'unsupported';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
    const [status, setStatus] = useState<PWAStatus>(() => {
        if (typeof window === 'undefined') return 'idle';
        const isInStandaloneMode =
            ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true) ||
            window.matchMedia('(display-mode: standalone)').matches;
        if (isInStandaloneMode) return 'installed';
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        if (isIOS) {
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            if (isSafari) return 'ios';
        }
        return 'idle';
    });
    const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        if (status === 'installed' || status === 'ios') return;

        const handler = (e: Event) => {
            e.preventDefault();
            deferredPrompt.current = e as BeforeInstallPromptEvent;
            setStatus('installable');
        };

        const installedHandler = () => {
            setStatus('installed');
            trackEvent('pwa_installed', 'pwa', {
                platform: 'web_beforeinstallprompt',
            });
        };

        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', installedHandler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', installedHandler);
        };
    }, [status]);

    const install = async (): Promise<boolean> => {
        if (!deferredPrompt.current) return false;
        await deferredPrompt.current.prompt();
        const { outcome } = await deferredPrompt.current.userChoice;
        if (outcome === 'accepted') {
            setStatus('installed');
            deferredPrompt.current = null;
            trackEvent('pwa_installed', 'pwa', {
                outcome: 'accepted',
            });
            return true;
        }
        return false;
    };

    const dismiss = () => setStatus('idle');

    return { status, install, dismiss };
}
