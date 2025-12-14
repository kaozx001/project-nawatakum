/**
 * ============================================
 * 🃏 ProductCard Component - การ์ดสินค้า
 * ============================================
 * 
 * แสดงข้อมูลสินค้าแบบย่อ:
 * - รูปภาพ
 * - ชื่อ, ราคา, rating
 * - Badge (HOT, NEW, BESTSELLER)
 * - ปุ่ม Quick actions
 * 
 * 📝 ส่วนที่ต้องแก้ไข:
 * - Icons ของ action buttons
 * - การแสดงผล badge
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product, isLarge = false }) {
    const { addToCart } = useCart();
    const [addedToCart, setAddedToCart] = useState(false);

    const { id, name, image, price, originalPrice, rating, reviews, badge } = product;

    // คำนวณส่วนลด
    const discount = originalPrice
        ? Math.round((1 - parseFloat(price.replace(/[^0-9.]/g, '')) / parseFloat(originalPrice.replace(/[^0-9.]/g, ''))) * 100)
        : null;

    /**
     * ============================================
     * ⭐ แสดงดาว Rating
     * ============================================
     */
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="star star--filled">★</span>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<span key={i} className="star star--half">★</span>);
            } else {
                stars.push(<span key={i} className="star">★</span>);
            }
        }
        return stars;
    };

    /**
     * ============================================
     * 🛒 เพิ่มลงตะกร้า
     * ============================================
     */
    const handleAddToCart = (e) => {
        e.preventDefault(); // ป้องกัน navigation
        e.stopPropagation();

        addToCart(product, 1);
        setAddedToCart(true);

        // Reset animation หลัง 2 วินาที
        setTimeout(() => setAddedToCart(false), 2000);
    };

    return (
        <Link to={`/product/${id}`} className={`product-card ${isLarge ? 'product-card--large' : ''}`}>
            {/* Badges */}
            <div className="product-card__badges">
                {badge && (
                    <span className={`product-card__badge product-card__badge--${badge.toLowerCase()}`}>
                        {/* 📝 แก้ไขข้อความ badge ที่นี่ */}
                        {badge}
                    </span>
                )}
                {discount && (
                    <span className="product-card__badge product-card__badge--discount">
                        -{discount}%
                    </span>
                )}
            </div>

            {/* Image Container */}
            <div className="product-card__image-container">
                <img
                    src={image}
                    alt={name}
                    className="product-card__image"
                    loading="lazy"
                />

                {/* Overlay Actions */}
                <div className="product-card__overlay">
                    {/* Quick View - ไปหน้ารายละเอียด */}
                    <button className="product-card__action" title="ดูรายละเอียด">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>

                    {/* Add to Cart */}
                    <button
                        className={`product-card__action product-card__action--primary ${addedToCart ? 'product-card__action--added' : ''}`}
                        title="เพิ่มลงตะกร้า"
                        onClick={handleAddToCart}
                    >
                        {addedToCart ? (
                            <span>✓</span>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                        )}
                    </button>

                    {/* Wishlist */}
                    <button className="product-card__action" title="เพิ่มในรายการโปรด">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="product-card__content">
                {/* Rating */}
                {rating && (
                    <div className="product-card__rating">
                        <div className="product-card__stars">
                            {renderStars(rating)}
                        </div>
                        {reviews && (
                            <span className="product-card__reviews">({reviews.toLocaleString()})</span>
                        )}
                    </div>
                )}

                {/* Name */}
                <h3 className="product-card__name">{name}</h3>

                {/* Price */}
                <div className="product-card__price-container">
                    <span className="product-card__price">{price}</span>
                    {originalPrice && (
                        <span className="product-card__original-price">{originalPrice}</span>
                    )}
                </div>
            </div>

            {/* Glow Effect */}
            <div className="product-card__glow"></div>
        </Link>
    );
}

export default ProductCard;
