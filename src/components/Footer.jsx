import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    const footerLinks = {
        shop: {
            title: 'Shop',
            links: [
                { name: 'All Products', path: '/products' }
            ]
        },
        support: {
            title: 'Support',
            links: [
                { name: 'Help Center', path: '/help' },
                { name: 'Shipping & Returns', path: '/help' },
                { name: 'Warranty Info', path: '/help' }
            ]
        },
        company: {
            title: 'Company',
            links: [
                { name: 'About Us', path: '/about' },
                { name: 'Contact Us', path: '/contact' }
            ]
        },
        legal: {
            title: 'Legal',
            links: [
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' }
            ]
        }
    };

    const socialLinks = [
        { name: 'Facebook', icon: '📘' },
        { name: 'Twitter', icon: '🐦' },
        { name: 'Instagram', icon: '📸' },
        { name: 'YouTube', icon: '📺' },
        { name: 'Discord', icon: '💬' },
    ];

    const paymentMethods = ['💳', '🔵', '🟡', '🟢', '🔴'];

    return (
        <footer className="footer">
            <div className="footer__container">
                {/* Top Section */}
                <div className="footer__top">
                    {/* Brand */}
                    <div className="footer__brand">
                        <div className="footer__logo">
                            <span className="footer__logo-icon">⚡</span>
                            <span className="footer__logo-text">
                                JAK <span className="footer__logo-accent">TECH</span>
                            </span>
                        </div>
                        <p className="footer__tagline">
                            ร้านขายอุปกรณ์ IT ชั้นนำ พร้อมบริการที่เหนือระดับ
                        </p>
                        <div className="footer__social">
                            {socialLinks.map((social, index) => (
                                <a key={index} href="#" className="footer__social-link" title={social.name}>
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([key, section]) => (
                        <div key={key} className="footer__links-section">
                            <h4 className="footer__links-title">{section.title}</h4>
                            <ul className="footer__links-list">
                                {section.links.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.path} className="footer__link">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="footer__divider"></div>

                {/* Bottom Section */}
                <div className="footer__bottom">
                    <div className="footer__copyright">
                        <p>&copy; 2025 JAK TECH. All rights reserved.</p>
                        <p className="footer__made-with">Made with 💜 in Thailand</p>
                    </div>

                    <div className="footer__payments">
                        <span className="footer__payments-label">We Accept:</span>
                        <div className="footer__payments-icons">
                            {paymentMethods.map((method, index) => (
                                <span key={index} className="footer__payment-icon">{method}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
