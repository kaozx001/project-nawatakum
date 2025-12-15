/**
 * ============================================
 * 🧭 Navbar Component - แถบนำทางพร้อม Dropdown Menu
 * ============================================
 * 
 * ส่วนประกอบ:
 * - Logo (link ไปหน้าแรก)
 * - Navigation links พร้อม dropdown menu หมวดหมู่
 * - Search bar
 * - Shopping cart (แสดงจำนวนสินค้า)
 * - User avatar/login button
 * 
 * 📝 หมวดหมู่สินค้า:
 * - Laptops: Gaming Laptops, Business, Ultrabooks
 * - Components: GPU, CPU, RAM, Motherboard, PSU, Storage
 * - Peripherals: Headphones, Keyboards, Mouse, Monitors
 * - Deals: สินค้าลดราคา
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';
import './Navbar.css';

/**
 * ============================================
 * 📦 CATEGORY DATA - ข้อมูลหมวดหมู่สินค้า
 * ============================================
 * โครงสร้าง: { id, name, icon, subcategories }
 */
const categoryData = [
    {
        id: 'laptops',
        name: 'Laptops',
        icon: '💻',
        subcategories: [
            { id: 'gaming-laptops', name: 'Gaming Laptops', icon: '🎮' },
            { id: 'business-laptops', name: 'Business Laptops', icon: '💼' },
            { id: 'ultrabooks', name: 'Ultrabooks', icon: '✨' },
            { id: 'all-laptops', name: 'ดูทั้งหมด', icon: '📦' }
        ]
    },
    {
        id: 'components',
        name: 'Components',
        icon: '🔧',
        subcategories: [
            { id: 'gpu', name: 'การ์ดจอ (GPU)', icon: '🎨' },
            { id: 'cpu', name: 'ซีพียู (CPU)', icon: '⚡' },
            { id: 'ram', name: 'แรม (RAM)', icon: '📊' },
            { id: 'motherboard', name: 'เมนบอร์ด', icon: '🔌' },
            { id: 'psu', name: 'พาวเวอร์ซัพพลาย', icon: '🔋' },
            { id: 'storage', name: 'ฮาร์ดดิสก์ / SSD', icon: '💾' },
            { id: 'all-components', name: 'ดูทั้งหมด', icon: '📦' }
        ]
    },
    {
        id: 'peripherals',
        name: 'Peripherals',
        icon: '🖱️',
        subcategories: [
            { id: 'headphones', name: 'หูฟัง', icon: '🎧' },
            { id: 'keyboards', name: 'คีย์บอร์ด', icon: '⌨️' },
            { id: 'mouse', name: 'เมาส์', icon: '🖱️' },
            { id: 'monitors', name: 'จอมอนิเตอร์', icon: '🖥️' },
            { id: 'webcam', name: 'กล้องเว็บแคม', icon: '📷' },
            { id: 'all-peripherals', name: 'ดูทั้งหมด', icon: '📦' }
        ]
    }
];

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoggedIn, logout } = useAuth();
    const { getCartCount } = useCart();
    const { categories: productCategories } = useProduct();

    // สร้าง navigation categories จาก ProductContext
    const navCategories = useMemo(() => {
        return productCategories.map(cat => ({
            id: cat.id,
            name: cat.title,
            icon: cat.icon || '📦',
            link: `/category/${cat.id}`
        }));
    }, [productCategories]);

    // State สำหรับ scroll effect
    const [scrolled, setScrolled] = useState(false);
    // State สำหรับ search
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    // State สำหรับ user dropdown
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    // State สำหรับ category dropdown
    const [activeDropdown, setActiveDropdown] = useState(null);

    // จำนวนสินค้าในตะกร้า
    const cartCount = getCartCount();

    /**
     * ============================================
     * Scroll Effect - เปลี่ยน background เมื่อ scroll
     * ============================================
     */
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /**
     * ============================================
     * Click Outside - ปิด dropdown เมื่อคลิกข้างนอก
     * ============================================
     */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.navbar__link--dropdown') &&
                !e.target.closest('.navbar__user-menu')) {
                setActiveDropdown(null);
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    /**
     * ============================================
     * 🔍 Handle Search
     * ============================================
     */
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setSearchOpen(false);
        }
    };

    /**
     * ============================================
     * 🚪 Handle Logout
     * ============================================
     */
    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        navigate('/');
    };

    /**
     * ============================================
     * 📍 Check Active Route
     * ============================================
     */
    const isActiveRoute = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
            <div className="navbar__container">
                {/* ============================================
                    📝 LOGO - ชื่อร้าน
                    ============================================ */}
                <Link to="/" className="navbar__logo">
                    <span className="navbar__logo-icon">🔧</span>
                    <span className="navbar__logo-text">
                        JAK<span className="navbar__logo-accent">TECH</span>
                    </span>
                </Link>

                {/* ============================================
                    📝 NAVIGATION LINKS พร้อม Dropdown
                    ============================================ */}
                <ul className="navbar__links">
                    {/* Groups: Products (Mega Menu), Innovation, Community, Support */}

                    {/* 1. PRODUCTS (Mega Menu) */}
                    <li className="navbar__link navbar__link--mega">
                        <Link to="/products">PRODUCT</Link>
                        <div className="navbar__link-indicator"></div>

                        {/* Mega Menu Dropdown */}
                        <div className="navbar__mega-menu">
                            <div className="navbar__mega-content">
                                <div className="navbar__mega-column">
                                    <h3 className="navbar__mega-title">Laptops & PC</h3>
                                    <ul className="navbar__mega-list">
                                        <li><Link to="/category/gaming-laptops">Gaming Laptops</Link></li>
                                        <li><Link to="/category/creators">For Creators</Link></li>
                                        <li><Link to="/category/desktops">Gaming Desktops</Link></li>
                                    </ul>
                                </div>
                                <div className="navbar__mega-column">
                                    <h3 className="navbar__mega-title">Components</h3>
                                    <ul className="navbar__mega-list">
                                        <li><Link to="/category/graphics-cards">Graphics Cards</Link></li>
                                        <li><Link to="/category/motherboards">Motherboards</Link></li>
                                        <li><Link to="/category/monitors">Monitors</Link></li>
                                    </ul>
                                </div>
                                <div className="navbar__mega-column">
                                    <h3 className="navbar__mega-title">Peripherals</h3>
                                    <ul className="navbar__mega-list">
                                        <li><Link to="/category/keyboards">Keyboards</Link></li>
                                        <li><Link to="/category/mice">Mice & Mousepads</Link></li>
                                        <li><Link to="/category/headsets">Headsets & Audio</Link></li>
                                    </ul>
                                </div>
                                <div className="navbar__mega-column navbar__mega-column--highlight">
                                    <h3 className="navbar__mega-title">Featured Categories</h3>
                                    <ul className="navbar__mega-list">
                                        {/* Dynamic Categories from Context */}
                                        {navCategories.map((category) => (
                                            <li key={category.id}>
                                                <Link to={category.link}>
                                                    {/* Removed icon for cleaner look */}
                                                    {category.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>

                    {/* 2. Other ROG-like Links */}
                    <li className="navbar__link">
                        <Link to="/innovation">INNOVATION</Link>
                        <div className="navbar__link-indicator"></div>
                    </li>
                    <li className="navbar__link">
                        <Link to="/community">COMMUNITY</Link>
                        <div className="navbar__link-indicator"></div>
                    </li>
                    <li className="navbar__link">
                        <Link to="/support">SUPPORT</Link>
                        <div className="navbar__link-indicator"></div>
                    </li>

                    {/* Deals */}
                    <li className={`navbar__link ${isActiveRoute('/category/deals') ? 'navbar__link--active' : ''}`}>
                        <Link to="/category/deals">WHAT'S HOT</Link>
                        <span className="navbar__badge">HOT</span>
                    </li>
                </ul>

                {/* Actions Section */}
                <div className="navbar__actions">
                    {/* Search */}
                    <form
                        onSubmit={handleSearch}
                        className={`navbar__search ${searchOpen ? "navbar__search--open" : ""}`}
                    >
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้า..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="navbar__search-input"
                        />
                        <button
                            type="button"
                            className="navbar__search-btn"
                            onClick={() => setSearchOpen(!searchOpen)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                        </button>
                    </form>

                    {/* Cart */}
                    <Link to="/cart" className="navbar__cart">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="navbar__cart-badge">{cartCount}</span>
                        )}
                    </Link>

                    {/* User Section */}
                    {isLoggedIn ? (
                        /* Logged In - Show User Menu */
                        <div className="navbar__user-menu">
                            <button
                                className="navbar__avatar"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <span>{user?.avatar || user?.name?.charAt(0) || 'U'}</span>
                            </button>

                            {userMenuOpen && (
                                <div className="navbar__dropdown">
                                    <div className="navbar__dropdown-header">
                                        <span className="navbar__dropdown-name">{user?.name}</span>
                                        <span className="navbar__dropdown-email">{user?.email}</span>
                                        {user?.role === 'admin' && (
                                            <span className="navbar__dropdown-role">👑 Admin</span>
                                        )}
                                    </div>
                                    <div className="navbar__dropdown-divider"></div>

                                    {/* Profile Link */}
                                    <Link
                                        to="/profile"
                                        className="navbar__dropdown-item"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <span>โปรไฟล์</span>
                                    </Link>

                                    {/* Admin Link - แสดงเฉพาะ admin */}
                                    {user?.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            className="navbar__dropdown-item navbar__dropdown-item--admin"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <line x1="3" y1="9" x2="21" y2="9" />
                                                <line x1="9" y1="21" x2="9" y2="9" />
                                            </svg>
                                            <span>Admin Panel</span>
                                        </Link>
                                    )}

                                    {/* Orders Link */}
                                    <Link
                                        to="/profile?tab=orders"
                                        className="navbar__dropdown-item"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                            <line x1="3" y1="6" x2="21" y2="6" />
                                            <path d="M16 10a4 4 0 01-8 0" />
                                        </svg>
                                        <span>คำสั่งซื้อ</span>
                                    </Link>

                                    {/* Settings Link */}
                                    <Link
                                        to="/settings"
                                        className="navbar__dropdown-item"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="3" />
                                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                        </svg>
                                        <span>ตั้งค่า</span>
                                    </Link>

                                    <div className="navbar__dropdown-divider"></div>

                                    {/* Logout */}
                                    <button
                                        onClick={handleLogout}
                                        className="navbar__dropdown-item navbar__dropdown-item--logout"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                                        </svg>
                                        <span>ออกจากระบบ</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Not Logged In - Show Login Button */
                        <Link to="/login" className="navbar__login-btn">
                            <span>เข้าสู่ระบบ</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
