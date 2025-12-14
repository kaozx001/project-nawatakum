/**
 * ============================================
 * 📦 Category Page - หน้าแสดงสินค้าตามหมวดหมู่
 * ============================================
 * 
 * ฟังก์ชัน:
 * - รับ category type จาก URL parameter
 * - กรองสินค้าตาม category
 * - แสดง product cards แบบ grid
 * - รองรับ subcategory filtering
 */

import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import './Category.css';

/**
 * ============================================
 * 📝 CATEGORY MAPPING - แผนที่หมวดหมู่
 * ============================================
 * จับคู่ URL parameter กับข้อมูลสินค้า
 */
const categoryConfig = {
    laptops: {
        title: '💻 Laptops',
        description: 'โน๊ตบุ๊คสำหรับทุกการใช้งาน Gaming, Business, Ultrabook',
        keywords: ['laptop', 'notebook', 'โน๊ตบุ๊ค', 'Gaming Laptop'],
        matchCategory: 'Gaming Laptops'
    },
    components: {
        title: '🔧 Components',
        description: 'อุปกรณ์คอมพิวเตอร์ การ์ดจอ CPU RAM เมนบอร์ด',
        keywords: ['gpu', 'cpu', 'ram', 'การ์ดจอ', 'rtx', 'geforce'],
        matchCategory: null // ดึงจากทุกหมวดที่มี keywords
    },
    peripherals: {
        title: '🖱️ Peripherals',
        description: 'อุปกรณ์เสริม หูฟัง คีย์บอร์ด เมาส์ จอมอนิเตอร์',
        keywords: ['หูฟัง', 'คีย์บอร์ด', 'เมาส์', 'จอ', 'monitor', 'keyboard', 'mouse', 'headphone'],
        matchCategory: 'อุปกรณ์เสริมพรีเมียม'
    },
    deals: {
        title: '🔥 Deals & Promotions',
        description: 'สินค้าลดราคา โปรโมชั่นพิเศษ',
        filterByBadge: 'HOT'
    },
    // Mega Menu Categories
    'gaming-laptops': {
        title: '💻 Gaming Laptops',
        description: 'โน๊ตบุ๊คเกมมิ่งประสิทธิภาพสูง',
        keywords: ['Gaming Laptop', 'Notebook', 'Alienware', 'ROG', 'MSI', 'Legion', 'Razer']
    },
    'creators': {
        title: '🎨 For Creators',
        description: 'แล็ปท็อปสำหรับงานกราฟิกและตัดต่อ',
        keywords: ['Creator', 'Workstation', 'MacBook', 'ProArt']
    },
    'desktops': {
        title: '🖥️ Gaming Desktops',
        description: 'คอมพิวเตอร์ตั้งโต๊ะสเปกแรง',
        keywords: ['Desktop', 'PC', 'Tower']
    },
    'graphics-cards': {
        title: '🎮 Graphics Cards',
        description: 'การ์ดจอแยก NVIDIA, AMD',
        keywords: ['GPU', 'RTX', 'GTX', 'Radeon', 'การ์ดจอ']
    },
    'motherboards': {
        title: '🔌 Motherboards',
        description: 'เมนบอร์ดคุณภาพสูง',
        keywords: ['Motherboard', 'Mainboard', 'เมนบอร์ด', 'Z790', 'B650']
    },
    'monitors': {
        title: '🖥️ Monitors',
        description: 'จอมอนิเตอร์ Gaming, 4K, Ultrawide',
        keywords: ['Monitor', 'จอ', 'OLED', 'IPS', 'Hz']
    },
    'keyboards': {
        title: '⌨️ Keyboards',
        description: 'คีย์บอร์ด Gaming, Mechanical, Custom',
        keywords: ['Keyboard', 'คีย์บอร์ด', 'Switch']
    },
    'mice': {
        title: '🖱️ Mice & Mousepads',
        description: 'เมาส์เกมมิ่ง แม่นยำสูง',
        keywords: ['Mouse', 'เมาส์', 'Wireless']
    },
    'headsets': {
        title: '🎧 Headsets & Audio',
        description: 'หูฟังเกมมิ่งและเครื่องเสียง',
        keywords: ['Headset', 'Headphone', 'หูฟัง', 'Speaker', 'Microphone']
    }
};

/**
 * ============================================
 * 🎯 Category Component
 * ============================================
 */
function Category() {
    const { type, subtype } = useParams();
    const { addToCart } = useCart();
    const { categories } = useProduct();
    const [sortBy, setSortBy] = useState('default');
    const [addedProducts, setAddedProducts] = useState([]);

    /**
     * ============================================
     * 🔍 Get Category Info
     * ============================================
     */
    const categoryInfo = categoryConfig[type] || {
        title: '📦 สินค้าทั้งหมด',
        description: 'ดูสินค้าทั้งหมดในร้าน'
    };

    /**
     * ============================================
     * 📊 Filter Products
     * ============================================
     * กรองสินค้าตาม category และ subcategory
     */
    const filteredProducts = useMemo(() => {
        // 1. ลองหาจาก Context ก่อน (สำหรับ Dynamic Categories และ Featured Categories)
        const contextCategory = categories.find(c => c.id === type);
        if (contextCategory) {
            return contextCategory.items || [];
        }

        // 2. ถ้าไม่เจอใน Context ให้ใช้ Logic เดิม (รวมสินค้าทั้งหมดแล้วกรอง)
        const allProducts = categories.flatMap(cat => cat.items || []);

        // ถ้าเป็น deals - กรองตาม badge HOT
        if (type === 'deals') {
            return allProducts.filter(p => p.badge === 'HOT');
        }

        // อ่าน config
        const config = categoryConfig[type];

        // ถ้ามี matchCategory - กรองตามชื่อหมวดหมู่
        if (config?.matchCategory) {
            const matchedCat = categories.find(
                cat => cat.title.includes(config.matchCategory)
            );
            return matchedCat ? matchedCat.items || [] : [];
        }

        // ถ้ามี keywords - กรองตาม keywords
        if (config?.keywords) {
            return allProducts.filter(product =>
                config.keywords.some(keyword =>
                    product.name.toLowerCase().includes(keyword.toLowerCase()) ||
                    (product.description && product.description.toLowerCase().includes(keyword.toLowerCase()))
                )
            );
        }

        // Default - แสดงทั้งหมด (กรณีไม่เจอ Config และไม่ใช่ Category ID)
        return allProducts;
    }, [type, subtype, categories]);

    /**
     * ============================================
     * 📈 Sort Products
     * ============================================
     */
    const sortedProducts = useMemo(() => {
        const products = [...filteredProducts];

        switch (sortBy) {
            case 'price-low':
                return products.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
                    const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
                    return priceA - priceB;
                });
            case 'price-high':
                return products.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
                    const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
                    return priceB - priceA;
                });
            case 'rating':
                return products.sort((a, b) => b.rating - a.rating);
            case 'reviews':
                return products.sort((a, b) => b.reviews - a.reviews);
            default:
                return products;
        }
    }, [filteredProducts, sortBy]);

    /**
     * ============================================
     * 🛒 Handle Add to Cart
     * ============================================
     */
    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedProducts(prev => [...prev, product.id]);
        setTimeout(() => {
            setAddedProducts(prev => prev.filter(id => id !== product.id));
        }, 2000);
    };

    return (
        <div className="category-page">
            {/* Header Section */}
            <div className="category-page__header">
                <div className="category-page__header-content">
                    <nav className="category-page__breadcrumb">
                        <Link to="/">หน้าแรก</Link>
                        <span>/</span>
                        <span>{categoryInfo.title}</span>
                    </nav>
                    <h1 className="category-page__title">{categoryInfo.title}</h1>
                    <p className="category-page__description">{categoryInfo.description}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="category-page__content">
                {/* Toolbar */}
                <div className="category-page__toolbar">
                    <div className="category-page__count">
                        พบ <strong>{sortedProducts.length}</strong> สินค้า
                    </div>
                    <div className="category-page__sort">
                        <label>เรียงตาม:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="category-page__select"
                        >
                            <option value="default">เริ่มต้น</option>
                            <option value="price-low">ราคา: ต่ำ → สูง</option>
                            <option value="price-high">ราคา: สูง → ต่ำ</option>
                            <option value="rating">คะแนนสูงสุด</option>
                            <option value="reviews">รีวิวมากสุด</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {sortedProducts.length > 0 ? (
                    <div className="category-page__grid">
                        {sortedProducts.map((product) => (
                            <div key={product.id} className="category-card">
                                {/* Badge */}
                                {product.badge && (
                                    <span className={`category-card__badge category-card__badge--${product.badge.toLowerCase()}`}>
                                        {product.badge}
                                    </span>
                                )}

                                {/* Image */}
                                <Link to={`/product/${product.id}`} className="category-card__image-link">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="category-card__image"
                                    />
                                    <div className="category-card__overlay">
                                        <span>ดูรายละเอียด</span>
                                    </div>
                                </Link>

                                {/* Info */}
                                <div className="category-card__content">
                                    <Link to={`/product/${product.id}`} className="category-card__title">
                                        {product.name}
                                    </Link>

                                    {/* Rating */}
                                    <div className="category-card__rating">
                                        <span className="category-card__stars">
                                            {'★'.repeat(Math.floor(product.rating))}
                                            {'☆'.repeat(5 - Math.floor(product.rating))}
                                        </span>
                                        <span className="category-card__rating-value">{product.rating}</span>
                                        <span className="category-card__reviews">({product.reviews} รีวิว)</span>
                                    </div>

                                    {/* Price */}
                                    <div className="category-card__price">{product.price}</div>

                                    {/* Add to Cart Button */}
                                    <button
                                        className={`category-card__btn ${addedProducts.includes(product.id) ? 'category-card__btn--added' : ''}`}
                                        onClick={() => handleAddToCart(product)}
                                        disabled={addedProducts.includes(product.id)}
                                    >
                                        {addedProducts.includes(product.id) ? (
                                            <>✓ เพิ่มแล้ว</>
                                        ) : (
                                            <>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                                    <line x1="3" y1="6" x2="21" y2="6" />
                                                    <path d="M16 10a4 4 0 01-8 0" />
                                                </svg>
                                                เพิ่มลงตะกร้า
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="category-page__empty">
                        <span className="category-page__empty-icon">📦</span>
                        <h3>ไม่พบสินค้าในหมวดหมู่นี้</h3>
                        <p>ลองดูสินค้าหมวดอื่น หรือกลับไปหน้าแรก</p>
                        <Link to="/" className="category-page__empty-btn">
                            กลับหน้าแรก
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Category;
