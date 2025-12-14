import React, { useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import './Row.css';

function Row({ title, items, isLargeRow }) {
    const rowRef = useRef(null);

    // Auto-scroll logic
    useEffect(() => {
        const row = rowRef.current;
        let animationFrameId;

        const autoScroll = () => {
            if (row) {
                row.scrollLeft += 1; // Smooth distinct speed
                // If we've scrolled past the first set of items (halfway), reset to 0 instantly
                // We use scrollWidth / 2 because we duplicated the items
                if (row.scrollLeft >= row.scrollWidth / 2) {
                    row.scrollLeft = 0;
                }
            }
            animationFrameId = requestAnimationFrame(autoScroll);
        };

        // Start scrolling
        animationFrameId = requestAnimationFrame(autoScroll);

        // Pause on hover
        const handleMouseEnter = () => cancelAnimationFrame(animationFrameId);
        const handleMouseLeave = () => {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(autoScroll);
        };

        if (row) {
            row.addEventListener('mouseenter', handleMouseEnter);
            row.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (row) {
                row.removeEventListener('mouseenter', handleMouseEnter);
                row.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    const scroll = (direction) => {
        if (rowRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="row">
            {/* Section Header */}
            <div className="row__header">
                <div className="row__title-container">
                    <div className="row__title-accent"></div>
                    <h2 className="row__title">{title}</h2>
                </div>
                <button className="row__view-all">
                    View All
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Products Row */}
            <div className="row__container">
                {/* Left Scroll Button */}
                <button
                    className="row__scroll-btn row__scroll-btn--left"
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>

                {/* Products - Duplicated for seamless infinite scroll (x4 for safety) */}
                <div className="row__products" ref={rowRef}>
                    {[...items, ...items, ...items, ...items].map((item, index) => (
                        <ProductCard
                            key={`${item.id}-${index}`} // Unique key for duplicates
                            product={item}
                            isLarge={isLargeRow}
                        />
                    ))}
                </div>

                {/* Right Scroll Button */}
                <button
                    className="row__scroll-btn row__scroll-btn--right"
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </section>
    );
}

export default Row;
