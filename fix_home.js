// 
// fix_home.js
const fs = require('fs');

const data = fs.readFileSync('website/src/pages/Home.tsx', 'utf8');

let fixed = data;

// Replace Block 1 (Lines 1-138)
fixed = fixed.replace(/<<<<<<< HEAD[\s\S]*?>>>>>>> 24bd2a2/, `import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { getFeaturedProducts, getReels, type SocialReel, type Product } from '../lib/supabase';
import GoogleReviews from '../components/GoogleReviews';

const platformStyles: Record<string, { gradient: string; icon: React.ReactNode; label: string }> = {
    youtube: { gradient: 'from-red-600 to-red-800', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>, label: 'YouTube' },
    tiktok: { gradient: 'from-[#00f2ea] via-[#ff0050] to-[#7c3aed]', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>, label: 'TikTok' },
    instagram: { gradient: 'from-[#f09433] via-[#e6683c] to-[#bc1888]', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>, label: 'Instagram' },
};

function getThumbnailUrl(reel: SocialReel, thumbs: Record<string, string>): string | null {
    if (reel.thumbnail_url) return reel.thumbnail_url;
    if (thumbs[reel.id]) return thumbs[reel.id];
    if (reel.platform === 'youtube') {
        const match = reel.url.match(/(?:shorts\\/|watch\\?v=|youtu\\.be\\/)([\\w-]{11})/);
        if (match) return \`https://img.youtube.com/vi/\${match[1]}/hqdefault.jpg\`;
    }
    return null;
}

function ReelCard({
    reel,
    thumb,
    isReelsInView,
    isReelPaused,
    onNextReel,
    currentReelIndex
}: {
    reel: SocialReel;
    thumb: string | null;
    isReelsInView: boolean;
    isReelPaused: boolean;
    onNextReel: () => void;
    currentReelIndex: number;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const style = platformStyles[reel.platform] || platformStyles.instagram;

    // Control video playback based on viewport intersection and pause state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isReelsInView && !isReelPaused) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => { });
            }
        } else {
            video.pause();
        }
    }, [isReelsInView, isReelPaused]);

    return (
        <motion.div
            key={reel.id}
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="group absolute inset-0"
            onClick={(e) => {
                if (reel.video_url) {
                    const video = e.currentTarget.querySelector('video');
                    if (video) {
                        video.muted = !video.muted;
                    }
                } else {
                    window.open(reel.url, '_blank');
                }
            }}
        >
            <div className={\`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br \${style.gradient} shadow-2xl ring-2 ring-gold/30 cursor-pointer\`}>
                {reel.video_url ? (
                    <video
                        ref={videoRef}
                        src={reel.video_url}
                        muted
                        playsInline
                        onEnded={onNextReel}
                        className="reel-video absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <>
                        {thumb && (
                            <img
                                src={thumb}
                                alt={reel.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 text-white">
                                {style.icon}
                            </div>
                        </div>
                    </>
                )}

                {/* Platform Badge */}
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-black/40 backdrop-blur-sm">
                        <span className="w-3 h-3">{style.icon}</span> {style.label}
                    </span>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium leading-snug line-clamp-2">
                        {reel.title}
                    </p>
                </div>

                {/* Simulated progress ring/bar for non-video reels */}
                {!reel.video_url && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
                        <motion.div
                            className="h-full bg-gold"
                            initial={{ width: '0%' }}
                            animate={{ width: isReelPaused ? undefined : '100%' }}
                            transition={{ duration: 5, ease: 'linear' }}
                            key={\`progress-\${currentReelIndex}\`}
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
}`);

// Fix initial state 
fixed = fixed.replace(`    const [isReelHovered, setIsReelHovered] = useState(false);
    const [isVideoPaused, setIsVideoPaused] = useState(false);
    const [isReelsMuted, setIsReelsMuted] = useState(true);
    const [isReelsSectionVisible, setIsReelsSectionVisible] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);`, `    const [isReelPaused, setIsReelPaused] = useState(false);`);

// Block 2
fixed = fixed.replace(/<<<<<<< HEAD[\s\S]*?=======[\s\S]*?>>>>>>> 24bd2a2/m, `    // Auto-rotate reels every 5 seconds (only for external link reels)
    useEffect(() => {
        if (reels.length <= 1 || isReelPaused || !isReelsInView) return;

        const currentHasVideo = reels[currentReel]?.video_url;
        if (currentHasVideo) return; // Wait for onEnded event of the video

        const timer = setInterval(() => {
            setCurrentReel(prev => (prev + 1) % reels.length);
        }, 5000);
        return () => clearInterval(timer);`);

// Block 3
fixed = fixed.replace(/<<<<<<< HEAD[\s\S]*?=======[\s\S]*?>>>>>>> 24bd2a2/m, `    }, [reels.length, isReelPaused, isReelsInView, currentReel, reels]);`);

// Update the event handler around line 629 to use isReelPaused
fixed = fixed.replace(`                            onMouseEnter={() => setIsReelHovered(true)}
                            onMouseLeave={() => setIsReelHovered(false)}`, `                            onMouseEnter={() => setIsReelPaused(true)}
                            onMouseLeave={() => setIsReelPaused(false)}`);

// Block 4
fixed = fixed.replace(/<<<<<<< HEAD[\s\S]*?=======[\s\S]*?>>>>>>> 24bd2a2/m, `                                            <ReelCard
                                                key={reel.id}
                                                reel={reel}
                                                thumb={thumb}
                                                isReelsInView={isReelsInView}
                                                isReelPaused={isReelPaused}
                                                currentReelIndex={currentReel}
                                                onNextReel={() => {
                                                    if (!isReelPaused) {
                                                        setCurrentReel(prev => (prev + 1) % reels.length);
                                                    }
                                                }}
                                            />`);

fs.writeFileSync('website/src/pages/Home.tsx', fixed);
console.log('Fixed Home.tsx');
