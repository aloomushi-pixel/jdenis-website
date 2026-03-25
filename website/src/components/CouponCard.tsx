import type { CouponVisualDesign } from '../lib/supabase';

const THEME_ICONS: Record<string, string> = {
    spring: '🌸',
    summer: '☀️',
    autumn: '🍂',
    winter: '❄️',
};

interface CouponCardProps {
    code: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    visualDesign: CouponVisualDesign;
    onRemove?: () => void;
    /** If true, shows an animated shimmer effect for the live preview */
    isPreview?: boolean;
}

export default function CouponCard({
    code,
    discountType,
    discountValue,
    visualDesign,
    onRemove,
    isPreview = false,
}: CouponCardProps) {
    const {
        backgroundColor = '#1a1a1a',
        textColor = '#D4AF37',
        theme,
    } = visualDesign;

    const icon = theme ? THEME_ICONS[theme] ?? '🎫' : '🎫';
    const discountLabel =
        discountType === 'percentage'
            ? `${discountValue}% OFF`
            : `$${discountValue.toFixed(2)} MXN OFF`;

    return (
        <div
            style={{
                backgroundColor,
                color: textColor,
                border: `1.5px solid ${textColor}`,
            }}
            className={`coupon-card${isPreview ? ' coupon-card--preview' : ''}`}
        >
            {/* Decorative dashed border inside */}
            <div
                className="coupon-card__inner"
                style={{ borderColor: `${textColor}55` }}
            >
                {/* Left: icon + theme */}
                <div className="coupon-card__left">
                    <span className="coupon-card__icon">{icon}</span>
                    {theme && (
                        <span
                            className="coupon-card__theme"
                            style={{ color: `${textColor}99` }}
                        >
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </span>
                    )}
                </div>

                {/* Center: code + discount */}
                <div className="coupon-card__center">
                    <span className="coupon-card__code">{code}</span>
                    <span className="coupon-card__discount">{discountLabel}</span>
                    <span
                        className="coupon-card__tag"
                        style={{ color: `${textColor}bb` }}
                    >
                        Cupón aplicado ✓
                    </span>
                </div>

                {/* Right: remove button */}
                {onRemove && (
                    <button
                        onClick={onRemove}
                        className="coupon-card__remove"
                        style={{ color: `${textColor}88` }}
                        aria-label="Quitar cupón"
                        title="Quitar cupón"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
