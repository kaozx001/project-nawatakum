/**
 * ============================================
 * 🛠️ Support Page - Sci-Fi Minimal Theme
 * ============================================
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Scene3D from '../components/Scene3D';
import './Support.css';

const faqs = [
    {
        id: 1,
        question: "System Malfunction / Returns",
        answer: "Initiate return sequence within 7 cycles (days). Item must be in stasis state (original packaging)."
    },
    {
        id: 2,
        question: "Shipping Teleportation Time",
        answer: "Standard warp speed: 1-3 cycles. Express quantum tunneling: Next cycle."
    },
    {
        id: 3,
        question: "Warranty Protocol",
        answer: "All hardware units come with a standard 3-year core protection plan. Extended shielding available."
    }
];

function Support() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeAccordions, setActiveAccordions] = useState(null);

    const toggleAccordion = (id) => {
        setActiveAccordions(activeAccordions === id ? null : id);
    };

    return (
        <motion.div
            className="support-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Scene3D variant="stars" />

            <div className="support-container">
                <section className="support-hero">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="scifi-badge">SYSTEM_ASSIST_V1</span>
                        <h1>SUPPORT CENTER</h1>
                        <p>Diagnostic tools and assistance protocols activated.</p>
                    </motion.div>

                    <motion.div
                        className="search-matrix"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <input
                            type="text"
                            placeholder="Initialize search query..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button>SCAN</button>
                    </motion.div>
                </section>

                <section className="support-grid">
                    <div className="faq-sector">
                        <h2>// KNOWLEDGE_BASE</h2>
                        <div className="faq-list">
                            <AnimatePresence>
                                {faqs.map((faq) => (
                                    <motion.div
                                        key={faq.id}
                                        className={`faq-item ${activeAccordions === faq.id ? 'active' : ''}`}
                                        onClick={() => toggleAccordion(faq.id)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + faq.id * 0.1 }}
                                    >
                                        <div className="faq-header">
                                            <span>{faq.question}</span>
                                            <span className="toggle-icon">{activeAccordions === faq.id ? '−' : '+'}</span>
                                        </div>
                                        {activeAccordions === faq.id && (
                                            <motion.div
                                                className="faq-body"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                            >
                                                <p>{faq.answer}</p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="contact-sector">
                        <h2>// DIRECT_LINK</h2>
                        <form className="scifi-form">
                            <div className="form-group">
                                <label>USER_ID / EMAIL</label>
                                <input type="email" placeholder="Enter identification..." />
                            </div>
                            <div className="form-group">
                                <label>MESSAGE_DATA</label>
                                <textarea placeholder="Describe your anomaly..." rows="5"></textarea>
                            </div>
                            <button type="submit" className="scifi-btn scifi-btn--primary full-width">
                                TRANSMIT DATA
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </motion.div>
    );
}

export default Support;
