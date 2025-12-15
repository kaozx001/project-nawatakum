/**
 * ============================================
 * 🚀 Innovation Page - หน้านวัตกรรมและสินค้าล้ำสมัย
 * ============================================
 * 
 * ฟังก์ชัน:
 * - แสดงเทคโนโลยีใหม่ล่าสุด
 * - นวัตกรรมที่กำลังจะมาถึง
 * - สินค้าล้ำสมัย
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './Innovation.css';

// Innovation Data
const innovations = [
    {
        id: 1,
        title: 'AI-Powered Gaming',
        subtitle: 'ปัญญาประดิษฐ์เพื่อเกมเมอร์',
        description: 'เทคโนโลยี AI ที่จะเปลี่ยนประสบการณ์การเล่นเกมของคุณไปตลอดกาล ด้วยระบบ Deep Learning ที่ปรับแต่งการตั้งค่าอัตโนมัติ',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        icon: '🧠',
        status: 'coming-soon',
        statusLabel: 'เร็วๆ นี้',
        features: ['DLSS 4.0', 'AI Frame Generation', 'Smart Noise Reduction']
    },
    {
        id: 2,
        title: 'Quantum Computing Ready',
        subtitle: 'พร้อมสำหรับยุค Quantum',
        description: 'ฮาร์ดแวร์รุ่นใหม่ที่ออกแบบมาเพื่อรองรับการประมวลผลควอนตัมในอนาคต',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        icon: '⚛️',
        status: 'research',
        statusLabel: 'R&D',
        features: ['Hybrid Architecture', 'Cryo-Compatible', 'Error Correction']
    },
    {
        id: 3,
        title: 'Holographic Display',
        subtitle: 'จอแสดงผลโฮโลแกรม',
        description: 'มอนิเตอร์แบบโฮโลแกรม 3 มิติ ไม่ต้องใช้แว่นตา สัมผัสอนาคตได้แล้ววันนี้',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        icon: '🔮',
        status: 'prototype',
        statusLabel: 'Prototype',
        features: ['True 3D', 'No Glasses', '8K Resolution']
    }
];

const upcomingProducts = [
    {
        id: 1,
        name: 'ROG Zephyrus X 2025',
        category: 'Gaming Laptop',
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600',
        releaseDate: 'Q1 2025',
        specs: ['Intel Core Ultra 9', 'RTX 5090', '64GB DDR6', '4K OLED 240Hz'],
        price: 'เริ่มต้น ฿189,900'
    },
    {
        id: 2,
        name: 'GeForce RTX 5090 Ti',
        category: 'Graphics Card',
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600',
        releaseDate: 'Q2 2025',
        specs: ['32GB GDDR7', 'Ada Lovelace+', '600W TDP', '21,000 CUDA Cores'],
        price: 'เริ่มต้น ฿89,900'
    },
    {
        id: 3,
        name: 'Corsair Void Pro XR',
        category: 'VR Headset',
        image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600',
        releaseDate: 'Q3 2025',
        specs: ['8K Per Eye', '200° FOV', 'Haptic Feedback', 'Brain-Computer Interface'],
        price: 'เริ่มต้น ฿45,900'
    },
    {
        id: 4,
        name: 'Intel Arrow Lake Ultra',
        category: 'Processor',
        image: 'https://images.unsplash.com/photo-1555617778-02518510b9fa?w=600',
        releaseDate: 'Q4 2025',
        specs: ['40 Cores', '8nm Process', '6.5GHz Boost', '125W TDP'],
        price: 'เริ่มต้น ฿35,900'
    }
];

const techTimeline = [
    { year: '2024', event: 'DDR6 Memory Launch', icon: '💾' },
    { year: '2025', event: 'RTX 50 Series Release', icon: '🎮' },
    { year: '2026', event: 'Consumer Quantum PCs', icon: '⚛️' },
    { year: '2027', event: 'Neural Interface Gaming', icon: '🧠' },
    { year: '2028', event: 'Holographic Displays', icon: '🔮' }
];

function Innovation() {
    return (
        <div className="innovation-page">
            {/* Hero Section */}
            <section className="innovation-hero">
                <div className="innovation-hero__bg"></div>
                <div className="innovation-hero__content">
                    <span className="innovation-hero__badge">🚀 INNOVATION</span>
                    <h1>นวัตกรรมแห่งอนาคต</h1>
                    <p>สำรวจเทคโนโลยีล้ำสมัยที่จะเปลี่ยนโลกของ Gaming และ Computing</p>
                </div>
                <div className="innovation-hero__scroll">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                </div>
            </section>

            {/* Main Innovations */}
            <section className="innovation-section">
                <div className="innovation-container">
                    <div className="innovation-section__header">
                        <h2>เทคโนโลยีที่กำลังจะมาถึง</h2>
                        <p>นวัตกรรมที่จะเปลี่ยนอนาคตของ Computing</p>
                    </div>

                    <div className="innovation-grid">
                        {innovations.map((item) => (
                            <article key={item.id} className="innovation-card">
                                <div className="innovation-card__image">
                                    <img src={item.image} alt={item.title} />
                                    <div className="innovation-card__overlay">
                                        <span className={`innovation-card__status innovation-card__status--${item.status}`}>
                                            {item.statusLabel}
                                        </span>
                                    </div>
                                </div>
                                <div className="innovation-card__content">
                                    <div className="innovation-card__icon">{item.icon}</div>
                                    <h3>{item.title}</h3>
                                    <span className="innovation-card__subtitle">{item.subtitle}</span>
                                    <p>{item.description}</p>
                                    <div className="innovation-card__features">
                                        {item.features.map((feature, idx) => (
                                            <span key={idx} className="innovation-card__feature">{feature}</span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Timeline */}
            <section className="innovation-section innovation-section--dark">
                <div className="innovation-container">
                    <div className="innovation-section__header">
                        <h2>Technology Roadmap</h2>
                        <p>แผนที่นำทางเทคโนโลยีในอีก 5 ปีข้างหน้า</p>
                    </div>

                    <div className="innovation-timeline">
                        {techTimeline.map((item, index) => (
                            <div key={index} className="innovation-timeline__item">
                                <div className="innovation-timeline__year">{item.year}</div>
                                <div className="innovation-timeline__dot">
                                    <span>{item.icon}</span>
                                </div>
                                <div className="innovation-timeline__event">{item.event}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upcoming Products */}
            <section className="innovation-section">
                <div className="innovation-container">
                    <div className="innovation-section__header">
                        <h2>สินค้าที่กำลังจะเปิดตัว</h2>
                        <p>เตรียมพบกับสินค้าใหม่ล่าสุดจากแบรนด์ชั้นนำ</p>
                    </div>

                    <div className="innovation-products">
                        {upcomingProducts.map((product) => (
                            <article key={product.id} className="innovation-product">
                                <div className="innovation-product__image">
                                    <img src={product.image} alt={product.name} />
                                    <span className="innovation-product__release">{product.releaseDate}</span>
                                </div>
                                <div className="innovation-product__content">
                                    <span className="innovation-product__category">{product.category}</span>
                                    <h3>{product.name}</h3>
                                    <ul className="innovation-product__specs">
                                        {product.specs.map((spec, idx) => (
                                            <li key={idx}>{spec}</li>
                                        ))}
                                    </ul>
                                    <div className="innovation-product__footer">
                                        <span className="innovation-product__price">{product.price}</span>
                                        <button className="innovation-product__notify">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                            </svg>
                                            แจ้งเตือน
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="innovation-cta">
                <div className="innovation-container">
                    <div className="innovation-cta__content">
                        <div className="innovation-cta__icon">📬</div>
                        <h2>ติดตามนวัตกรรมใหม่ๆ</h2>
                        <p>รับข่าวสารเกี่ยวกับเทคโนโลยีและสินค้าใหม่ก่อนใคร</p>
                        <form className="innovation-cta__form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="กรอกอีเมลของคุณ" />
                            <button type="submit">สมัครรับข่าวสาร</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="innovation-links">
                <div className="innovation-container">
                    <Link to="/products" className="innovation-link">
                        <span className="innovation-link__icon">🛒</span>
                        <span>ดูสินค้าทั้งหมด</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                    <Link to="/community" className="innovation-link">
                        <span className="innovation-link__icon">👥</span>
                        <span>เข้าร่วม Community</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                    <Link to="/support" className="innovation-link">
                        <span className="innovation-link__icon">💬</span>
                        <span>ติดต่อเรา</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Innovation;
