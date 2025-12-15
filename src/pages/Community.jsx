/**
 * ============================================
 * 👥 Community Page - Sci-Fi Minimal Theme
 * ============================================
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Scene3D from '../components/Scene3D';
import './Community.css';

const squads = [
    { id: 1, name: 'Cyber Dragons', members: 1240, rank: 'Diamond', icon: '🐉' },
    { id: 2, name: 'Neon Samurai', members: 856, rank: 'Platinum', icon: '⚔️' },
    { id: 3, name: 'Quantum Strikers', members: 2100, rank: 'Elite', icon: '⚡' },
    { id: 4, name: 'Void Walkers', members: 660, rank: 'Gold', icon: '🌌' },
];

const discussions = [
    { id: 1, title: 'Best build for RTX 5090? (Need case recommendations)', author: 'TechGod_99', replies: 45, views: '1.2k', tag: 'Hardware' },
    { id: 2, title: 'Anyone tried the new VR haptics suit from Nexus?', author: 'SimRacerX', replies: 28, views: '890', tag: 'VR' },
    { id: 3, title: 'Overclocking guide for Arrow Lake processors', author: 'SiliconMaster', replies: 156, views: '5.4k', tag: 'Guides' },
    { id: 4, title: 'Cyberpunk 2077 Path Tracing 2.0 is INSANE', author: 'NightCity_Runner', replies: 89, views: '3.1k', tag: 'Gaming' },
    { id: 5, title: 'LFP: Ranked Squad (Diamond+) - Need Healer', author: 'Void_Leader', replies: 12, views: '450', tag: 'Recruitment' },
    { id: 6, title: 'My custom liquid cooling loop leaked... help!', author: 'WetCircuit', replies: 34, views: '2.2k', tag: 'Support' },
    { id: 7, title: 'Is the 16TB Quantum SSD worth the price?', author: 'StorageHoarder', replies: 67, views: '4.5k', tag: 'Hardware' },
    { id: 8, title: 'Theory: The AI NPCs are becoming sentient', author: 'TinFoilHat', replies: 230, views: '10k', tag: 'Lore' },
    { id: 9, title: '[Official] Server Maintenance Schedule - Q4', author: 'Admin_Bot', replies: 0, views: '15k', tag: 'Announcement' },
    { id: 10, title: 'Show off your battlestation (December Edition)', author: 'RGB_King', replies: 567, views: '25k', tag: 'Community' },
    { id: 11, title: 'Valorant Agent 26 abilities leak?', author: 'LeakerPro', replies: 99, views: '8.8k', tag: 'Gaming' },
    { id: 12, title: 'Mechanical Keyboard switch tier list 2025', author: 'ClackAddict', replies: 44, views: '1.9k', tag: 'Peripherals' },
    { id: 13, title: 'Looking for a mentor in StarCitizen', author: 'SpaceNoob', replies: 5, views: '120', tag: 'Gaming' },
    { id: 14, title: 'Review: Logitech G Pro X Superlight 3', author: 'MouseReviewer', replies: 21, views: '3.3k', tag: 'Reviews' },
    { id: 15, title: 'Windows 12 concept UI - Thoughts?', author: 'DesignGeek', replies: 112, views: '6.7k', tag: 'Software' },
    { id: 16, title: 'Fix for "Error 0x887A0005" in newest driver?', author: 'CrashDummy', replies: 18, views: '900', tag: 'Support' },
    { id: 17, title: 'Next Gen Console rumors: Ps6 specs', author: 'ConsolePeasant', replies: 340, views: '12k', tag: 'Rumors' },
    { id: 18, title: 'Streaming setup for under $500', author: 'StreamDream', replies: 28, views: '2.1k', tag: 'Guides' },
    { id: 19, title: 'Monitor calibration settings for OLED G9', author: 'ScreenGuru', replies: 15, views: '1.5k', tag: 'Guides' },
    { id: 20, title: 'Anyone attending the Cyber Winter LAN?', author: 'FragFestoper', replies: 56, views: '2.8k', tag: 'Events' },
    { id: 21, title: 'Best budget GPU for 1440p gaming?', author: 'BudgetGamer', replies: 88, views: '5.6k', tag: 'Hardware' },
    { id: 22, title: 'Hidden easter eggs in GTA VI trailer', author: 'RockstarFan', replies: 145, views: '9.2k', tag: 'Gaming' },
    { id: 23, title: 'My PC turns on then off immediately PSU?', author: 'Sparky', replies: 42, views: '3.5k', tag: 'Support' },
    { id: 24, title: 'WiFi 7 routers - Are they worth upgrading?', author: 'NetRunner', replies: 27, views: '1.8k', tag: 'Networking' },
    { id: 25, title: 'Code for the beta access giveaway!', author: 'GenerousDev', replies: 999, views: '50k', tag: 'Giveaway' }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    },
    exit: { opacity: 0 }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i = 0) => ({
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12,
            delay: (i % 4) * 0.1
        }
    })
};

function Community() {
    const [visibleCount, setVisibleCount] = useState(4);

    const handleShowMore = () => {
        setVisibleCount(prev => prev + 4);
    };

    return (
        <motion.div
            className="community-page"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
        >
            <Scene3D variant="stars" />

            <div className="community-container">
                <motion.header className="community-header" variants={itemVariants}>
                    <div className="community-header__content">
                        <span className="scifi-badge">NEXUS_HUB // V.2.0</span>
                        <h1>COMMUNITY</h1>
                        <p>Join the elite network of gamers and creators.</p>
                    </div>
                </motion.header>

                <div className="community-grid">
                    {/* Sidebar / Stats */}
                    <motion.aside className="community-stats" variants={itemVariants}>
                        <div className="scifi-card">
                            <h3>SERVER STATUS</h3>
                            <div className="status-row">
                                <span className="status-dot online"></span>
                                <span>Asian Server: <span className="neon-text">Helsinki-01</span></span>
                            </div>
                            <div className="status-row">
                                <span className="status-dot warning"></span>
                                <span>Maintenance: <span className="warning-text">03:00 UTC</span></span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-label">ONLINE USERS</span>
                                <span className="stat-value">14,205</span>
                            </div>
                        </div>

                        <div className="scifi-card mt-4">
                            <h3>TOP SQUADS</h3>
                            <div className="squad-list">
                                {squads.map(squad => (
                                    <div key={squad.id} className="squad-item">
                                        <span className="squad-icon">{squad.icon}</span>
                                        <div className="squad-info">
                                            <span className="squad-name">{squad.name}</span>
                                            <span className="squad-rank">{squad.rank} // {squad.members} Members</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.aside>

                    {/* Main Feed */}
                    <main className="community-feed">
                        <motion.div className="feed-actions" variants={itemVariants}>
                            <button className="scifi-btn active">TRENDING</button>
                            <button className="scifi-btn">NEWEST</button>
                            <button className="scifi-btn">MY SQUAD</button>
                        </motion.div>

                        <motion.div className="discussion-list" variants={itemVariants}>
                            {discussions.slice(0, visibleCount).map((topic, index) => (
                                <motion.div
                                    key={topic.id}
                                    custom={index}
                                    className="discussion-card scifi-card-h"
                                    whileHover={{ scale: 1.02 }}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <div className="discussion-content">
                                        <h3>
                                            <span className="discussion-tag">[{topic.tag}]</span> {topic.title}
                                        </h3>
                                        <div className="discussion-meta">
                                            <span>BY: {topic.author}</span>
                                            <span>REPLIES: {topic.replies}</span>
                                            <span>VIEWS: {topic.views}</span>
                                        </div>
                                    </div>
                                    <div className="discussion-action">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {visibleCount < discussions.length && (
                            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '20px' }}>
                                <button className="scifi-btn" onClick={handleShowMore}>
                                    SHOW MORE +
                                </button>
                            </motion.div>
                        )}

                        <motion.div className="community-banner" variants={itemVariants}>
                            <div className="banner-content">
                                <h2>TOURNAMENT: CYBER WINTER</h2>
                                <p>Registration ends in 24:00:00</p>
                                <button className="scifi-btn scifi-btn--primary">JOIN NOW</button>
                            </div>
                        </motion.div>
                    </main>
                </div>
            </div>
        </motion.div>
    );
}

export default Community;
