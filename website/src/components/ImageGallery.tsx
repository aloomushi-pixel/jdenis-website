import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
    title?: string;
    variant?: 'academy' | 'blog' | 'event';
}

export default function ImageGallery({ images, title, variant = 'academy' }: ImageGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (lightboxOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [lightboxOpen]);

    if (!images || images.length === 0) return null;

    const openLightbox = (index: number) => {
        setActiveIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
    const goPrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

    // Determine grid layout based on number of images
    const getGridClass = () => {
        if (images.length === 1) return 'grid-cols-1 max-w-lg';
        if (images.length === 2) return 'grid-cols-2';
        if (images.length === 3) return 'grid-cols-3';
        return 'grid-cols-2 md:grid-cols-3';
    };

    // Variant-specific accent colors
    const accent = {
        academy: { border: 'border-gold/40', hoverBorder: 'hover:border-gold', bg: 'bg-gold/10', text: 'text-gold', overlay: 'from-forest/80' },
        blog: { border: 'border-gold/30', hoverBorder: 'hover:border-gold/60', bg: 'bg-forest/10', text: 'text-forest', overlay: 'from-forest/70' },
        event: { border: 'border-pink-300/40', hoverBorder: 'hover:border-pink-400', bg: 'bg-pink-50', text: 'text-pink-600', overlay: 'from-pink-900/70' },
    }[variant];

    return (
        <>
            {/* Gallery Grid */}
            <div className="mb-6">
                {title && (
                    <p className={`text-sm font-medium text-forest mb-3 flex items-center gap-2`}>
                        <span className={accent.text}>📸</span>
                        {title}
                    </p>
                )}
                <div className={`grid ${getGridClass()} gap-3`}>
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`group relative overflow-hidden rounded-lg border-2 ${accent.border} ${accent.hoverBorder} transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl`}
                            onClick={() => openLightbox(i)}
                        >
                            {/* Image with aspect ratio */}
                            <div className={`${images.length === 1 ? 'aspect-[4/3]' : 'aspect-square'} overflow-hidden`}>
                                <img
                                    src={img}
                                    alt={`${title || 'Imagen'} ${i + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="%23f3f4f6" width="200" height="200"/><text x="100" y="105" text-anchor="middle" fill="%239ca3af" font-size="14" font-family="sans-serif">Sin imagen</text></svg>';
                                    }}
                                />
                            </div>

                            {/* Hover Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${accent.overlay} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4`}>
                                <div className="flex items-center gap-2 text-white text-sm font-medium">
                                    <ZoomIn className="w-4 h-4" />
                                    Ver imagen
                                </div>
                            </div>

                            {/* Image number badge */}
                            {images.length > 1 && (
                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs flex items-center justify-center font-medium">
                                    {i + 1}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white bg-white/10 rounded-full backdrop-blur-sm transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Counter */}
                        {images.length > 1 && (
                            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm text-white/80 text-sm">
                                {activeIndex + 1} / {images.length}
                            </div>
                        )}

                        {/* Navigation arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Main image */}
                        <motion.img
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            src={images[activeIndex]}
                            alt={`${title || 'Imagen'} ${activeIndex + 1}`}
                            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Thumbnail strip */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === activeIndex ? 'border-gold scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
