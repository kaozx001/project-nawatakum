import React, { useState } from 'react';
import './Newsletter.css';

function Newsletter() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <section className="newsletter">
            <div className="newsletter__bg">
                <div className="newsletter__orb newsletter__orb--1"></div>
                <div className="newsletter__orb newsletter__orb--2"></div>
            </div>

            <div className="newsletter__container">
                <div className="newsletter__content">
                    <span className="newsletter__icon">📧</span>
                    <h2 className="newsletter__title">
                        Get <span className="newsletter__title-accent">Exclusive</span> Deals
                    </h2>
                    <p className="newsletter__description">
                        สมัครรับข่าวสารเพื่อรับส่วนลดพิเศษ โปรโมชั่น และข้อเสนอสุดพิเศษก่อนใคร!
                    </p>

                    <form className="newsletter__form" onSubmit={handleSubmit}>
                        <div className="newsletter__input-wrapper">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="newsletter__input"
                                required
                            />
                            <button type="submit" className="newsletter__btn">
                                {subscribed ? (
                                    <>
                                        <span>✓</span>
                                        <span>Subscribed!</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Subscribe</span>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="newsletter__features">
                        <div className="newsletter__feature">
                            <span>🎁</span>
                            <span>Exclusive Offers</span>
                        </div>
                        <div className="newsletter__feature">
                            <span>🚀</span>
                            <span>Early Access</span>
                        </div>
                        <div className="newsletter__feature">
                            <span>🔔</span>
                            <span>New Arrivals</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Newsletter;
