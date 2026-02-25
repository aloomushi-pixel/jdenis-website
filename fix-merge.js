const fs = require('fs');
let content = fs.readFileSync('website/src/pages/Home.tsx', 'utf8');

// Block 1
const b1Start = '<<<<<<< HEAD';
const b1EndStr = '>>>>>>> a75a184 (feat(home): autoplay y controles para reels)';
let idx1 = content.indexOf(b1Start);
let idx2 = content.indexOf(b1EndStr);

if (idx1 !== -1 && idx2 !== -1) {
    const endPos = content.indexOf('\\n', idx2) + 1;
    const replacement1 = `import { motion, AnimatePresence, useInView } from 'framer-motion';
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
        if (match) return 'https://img.youtube.com/vi/' + match[1] + '/hqdefault.jpg';
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
    const [isMuted, setIsMuted] = useState(true);
    const [isManualPaused, setIsManualPaused] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isReelsInView && !isReelPaused && !isManualPaused) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => { });
            }
        } else {
            video.pause();
        }
    }, [isReelsInView, isReelPaused, isManualPaused]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    return (
        <motion.div
            key={reel.id}
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="group absolute inset-0 cursor-pointer"
        >
            <div className={\`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br \${style.gradient} shadow-2xl ring-2 ring-gold/30\`}>
                {reel.video_url ? (
                    <>
                        <video
                            ref={videoRef}
                            src={reel.video_url}
                            playsInline
                            onEnded={onNextReel}
                            className="reel-video absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 flex flex-col gap-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMuted(!isMuted); }}
                                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsManualPaused(!isManualPaused); }}
                                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                            >
                                {isManualPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
                            </button>
                        </div>
                    </>
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
                        <a href={reel.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 text-white shadow-lg">
                                {style.icon}
                            </div>
                        </a>
                    </>
                )}

                <div className="absolute top-3 left-3 z-20">
                    <a href={reel.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold text-white bg-black/50 backdrop-blur-md hover:bg-black/70 transition-colors shadow-lg">
                        <span className="w-3.5 h-3.5 flex items-center justify-center">{style.icon}</span> {style.label}
                    </a>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 z-20 pointer-events-none">
                    <p className="text-white text-sm font-medium leading-snug line-clamp-2 drop-shadow-md">
                        {reel.title}
                    </p>
                </div>

                {!reel.video_url && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
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
}
\n`;
    content = content.substring(0, idx1) + replacement1 + content.substring(endPos);
}

let idx3 = content.indexOf(b1Start);
let idx4 = content.indexOf(b1EndStr, idx3);
if (idx3 !== -1 && idx4 !== -1) {
    const endPos = content.indexOf('\\n', idx4) + 1;
    const replacement2 = `                <section ref={reelsRef} id="reels-section" className="py-20 relative overflow-hidden bg-forest">\n`;
    content = content.substring(0, idx3) + replacement2 + content.substring(endPos);
}

let idx5 = content.indexOf(b1Start);
let idx6 = content.indexOf(b1EndStr, idx5);
if (idx5 !== -1 && idx6 !== -1) {
    const endPos = content.indexOf('\\n', idx6) + 1;
    const replacement3 = `                                            <ReelCard
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
                                            />\n`;
    content = content.substring(0, idx5) + replacement3 + content.substring(endPos);
}

fs.writeFileSync('website/src/pages/Home.tsx', content);
console.log('Merged successfully!');
