/**
 * ============================================
 * 🦸 Hero Section - Cyberpunk Floating Equipment
 * ============================================
 * 
 * Design: อลังการยิ่งกว่า ROG
 * - Floating equipment with parallax
 * - Neon glow effects
 * - Particle backgrounds
 * - Stunning animations
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import { featuredProduct } from '../data/products';

function Hero() {
    const navigate = useNavigate();
    const [showVideo, setShowVideo] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);

    // Track mouse for parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Canvas Particle System
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        // Resize Canvas
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        // Mouse interaction
        const mouse = { x: null, y: null, radius: 150 };

        const handleCanvasMouseMove = (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        };

        const handleCanvasMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleCanvasMouseMove);
        window.addEventListener('mouseout', handleCanvasMouseLeave);

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1; // 1-3px
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
            }

            update() {
                // Natural floating movement
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges with damping
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

                // Mouse interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    // The "Bubble" Radius
                    const bubbleRadius = 150;
                    const influenceRadius = 250;

                    if (distance < influenceRadius) {
                        const angle = Math.atan2(dy, dx);
                        const forceDirectionX = Math.cos(angle);
                        const forceDirectionY = Math.sin(angle);
                        let force = 0;

                        if (distance < bubbleRadius) {
                            // Inside bubble: Strong repulsion
                            force = -0.15; // Push away harder
                        } else {
                            // Just outside bubble: Gentle attraction to create a "shell"
                            // dampen the particle speed too so they don't fly off
                            force = 0.02;
                        }

                        // Apply force
                        this.speedX += forceDirectionX * force;
                        this.speedY += forceDirectionY * force;

                        // Friction to stabilize orbit
                        this.speedX *= 0.95;
                        this.speedY *= 0.95;

                        this.x += this.speedX * 2; // boost reactiveness
                        this.y += this.speedY * 2;
                    }
                }
            }

            draw() {
                ctx.fillStyle = 'rgba(0, 245, 255, 0.8)'; // Cyan

                if (mouse.x != null) {
                    // Calculate angle to mouse for rotation (Dash effect)
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let angle = Math.atan2(dy, dx);
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 300) {
                        // Draw as DASH oriented to center
                        ctx.save();
                        ctx.translate(this.x, this.y);
                        ctx.rotate(angle);
                        ctx.beginPath();
                        // Draw slightly longer dash if closer, but capped
                        const len = Math.min(this.size * 4, 15);
                        ctx.rect(0, -this.size / 2, len, this.size);
                        ctx.fill();
                        ctx.restore();
                    } else {
                        // Normal dot if far away
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } else {
                    // Normal dot if no mouse interaction
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = Math.min(100, (window.innerWidth * window.innerHeight) / 15000); // Responsive count
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw connections if close roughly
                /* Optional: heavy performance cost, maybe skip for now or optimize
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 245, 255, ${0.1 - distance/1000})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                */
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        handleResize(); // Init
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleCanvasMouseMove);
            window.removeEventListener('mouseout', handleCanvasMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const stats = [
        {
            value: '500+', label: 'สินค้า', icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            )
        },
        {
            value: '50+', label: 'แบรนด์', icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            )
        },
        {
            value: '10K+', label: 'ลูกค้า', icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            )
        },
        {
            value: '24/7', label: 'Support', icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            )
        },
    ];

    const floatingEquipment = [
        { icon: <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>, delay: '0s', x: 10, y: 15, size: 80, duration: '8s' },
        { icon: <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="2" height="2"></rect><path d="M15 9h.01"></path><path d="M9 15h.01"></path><path d="M15 15h.01"></path></svg>, delay: '1s', x: 80, y: 10, size: 60, duration: '9s' },
        { icon: <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="12" rx="2" ry="2"></rect><path d="M6 20h12"></path><line x1="12" y1="16" x2="12" y2="20"></line></svg>, delay: '2s', x: 85, y: 60, size: 55, duration: '10s' },
        { icon: <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>, delay: '3s', x: 15, y: 75, size: 70, duration: '11s' },
        { icon: <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>, delay: '4s', x: 50, y: 85, size: 40, duration: '12s' },
    ];

    const handleShopNow = () => {
        const productsSection = document.querySelector('.main-content');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero">
            {/* ============================================
                BACKGROUND EFFECTS
                ============================================ */}
            <div className="hero__bg">
                {/* Canvas Particles */}
                <canvas ref={canvasRef} className="hero__canvas-particles"></canvas>

                {/* Gradient Orbs */}
                <div className="hero__orb hero__orb--cyan"></div>
                <div className="hero__orb hero__orb--magenta"></div>
                <div className="hero__orb hero__orb--purple"></div>

                {/* Grid Lines */}
                <div className="hero__grid"></div>

                {/* Scan Line Effect */}
                <div className="hero__scanline"></div>
            </div>

            {/* ============================================
                FLOATING EQUIPMENT (Icons)
                ============================================ */}
            <div className="hero__floating-equipment">
                {floatingEquipment.map((item, index) => (
                    <div
                        key={index}
                        className="hero__float-item"
                        style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            width: `${item.size}px`,
                            height: `${item.size}px`,
                            animationDelay: item.delay,
                            animationDuration: item.duration, /* Slowed down */
                            transform: `translate(${mousePosition.x * (0.5 + index * 0.1)}px, ${mousePosition.y * (0.5 + index * 0.1)}px)`
                        }}
                    >
                        {item.icon}
                        <div className="hero__float-glow"></div>
                    </div>
                ))}
            </div>

            {/* ============================================
                MAIN CONTENT
                ============================================ */}
            <div className="hero__container">
                <div className="hero__content">
                    {/* Cyber Badge */}
                    <div className="hero__badge">
                        <span className="hero__badge-icon">⚡</span>
                        <span className="hero__badge-text">Premium IT Equipment 2025</span>
                        <span className="hero__badge-glow"></span>
                    </div>

                    {/* Title with Glitch Effect */}
                    <h1 className="hero__title">
                        <span className="hero__title-line">
                            <span className="hero__title-text" data-text="NEXT LEVEL">NEXT LEVEL</span>
                        </span>
                        <span className="hero__title-line hero__title-gradient">
                            <span className="hero__title-text" data-text="GAMING GEAR">GAMING GEAR</span>
                        </span>
                        <span className="hero__title-line">
                            <span className="hero__title-text" data-text="EXPERIENCE">EXPERIENCE</span>
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="hero__description">
                        <span className="hero__description-highlight">JAK TECH</span> -
                        อุปกรณ์ IT ระดับพรีเมียมสำหรับเกมเมอร์และโปรเฟสชันนัล
                        ประสิทธิภาพสูงสุด ดีไซน์ล้ำสมัย
                    </p>

                    {/* CTA Buttons */}
                    <div className="hero__buttons">
                        <button className="hero__btn hero__btn--primary" onClick={handleShopNow}>
                            <span className="hero__btn-bg"></span>
                            <span className="hero__btn-content">
                                <span>เลือกซื้อสินค้า</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        </button>
                        <button className="hero__btn hero__btn--secondary" onClick={() => setShowVideo(true)}>
                            <span className="hero__btn-icon">▶</span>
                            <span>Watch Video</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="hero__stats">
                        {stats.map((stat, index) => (
                            <div key={index} className="hero__stat">
                                <span className="hero__stat-icon">{stat.icon}</span>
                                <span className="hero__stat-value">{stat.value}</span>
                                <span className="hero__stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ============================================
                    FEATURED PRODUCT SHOWCASE
                    ============================================ */}
                <div
                    className="hero__showcase"
                    style={{
                        transform: `perspective(1000px) rotateY(${mousePosition.x * 0.3}deg) rotateX(${-mousePosition.y * 0.3}deg)`
                    }}
                >
                    <div className="hero__product-frame">
                        <div className="hero__product-glow"></div>
                        <div className="hero__product-inner">
                            <img
                                src={featuredProduct?.image || "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=400&fit=crop"}
                                alt={featuredProduct?.name || "Featured Product"}
                                className="hero__product-image"
                            />
                            <div className="hero__product-overlay">

                                <h3 className="hero__product-name">{featuredProduct?.name || "NVIDIA RTX 4090"}</h3>
                                <p className="hero__product-price">{featuredProduct?.price || "฿55,900"}</p>
                            </div>
                        </div>
                        {/* Neon Border Animation */}
                        <div className="hero__product-border"></div>
                    </div>

                    {/* Floating Tech Labels */}
                    <div className="hero__tech-label hero__tech-label--1">
                        <span className="hero__tech-dot"></span>
                        <span>Ray Tracing</span>
                    </div>
                    <div className="hero__tech-label hero__tech-label--2">
                        <span className="hero__tech-dot"></span>
                        <span>DLSS 3.0</span>
                    </div>
                    <div className="hero__tech-label hero__tech-label--3">
                        <span className="hero__tech-dot"></span>
                        <span>24GB GDDR6X</span>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="hero__scroll">
                <span>Scroll</span>
                <div className="hero__scroll-line"></div>
            </div>

            {/* Video Modal */}
            {showVideo && (
                <div className="hero__video-modal" onClick={() => setShowVideo(false)}>
                    <div className="hero__video-container" onClick={(e) => e.stopPropagation()}>
                        <button className="hero__video-close" onClick={() => setShowVideo(false)}>✕</button>
                        <iframe
                            src={`https://www.youtube.com/embed/${featuredProduct?.videoId || 'dQw4w9WgXcQ'}?autoplay=1`}
                            title="Product Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Hero;
