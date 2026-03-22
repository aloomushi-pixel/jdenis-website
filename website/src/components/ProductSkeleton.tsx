/* Product Skeleton Loader Component */
interface ProductSkeletonProps {
    count?: number;
}

export function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="skeleton-card">
                    <div className="skeleton-image" />
                    <div className="p-4 space-y-2">
                        <div className="skeleton-text short" />
                        <div className="skeleton-text full" />
                        <div className="skeleton-text medium" />
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="skeleton-text price" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default ProductSkeleton;
