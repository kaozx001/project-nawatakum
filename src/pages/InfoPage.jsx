import React from 'react';
import { Link } from 'react-router-dom';
import './Category.css';

function InfoPage({ title, subtitle, content, icon = '📄' }) {
    return (
        <div className="category-page" style={{ paddingTop: '120px', minHeight: '100vh', background: '#0a0a0f' }}>
            <div className="category-page__header">
                <div className="category-page__header-content">
                    <nav className="category-page__breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>{title}</span>
                    </nav>
                    <h1 className="category-page__title">{title}</h1>
                    {subtitle && <p className="category-page__description">{subtitle}</p>}
                </div>
            </div>

            <div className="category-page__content" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="glass-window" style={{
                    maxWidth: '1000px',
                    width: '100%',
                    background: 'rgba(20, 20, 25, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    color: '#e0e0e0',
                    lineHeight: '1.8'
                }}>
                    <div style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '2.5rem' }}>{icon}</span>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>{title}</h2>
                            <p style={{ color: '#00f5ff' }}>JAK TECH Official Info</p>
                        </div>
                    </div>

                    <div className="content-body" style={{ fontSize: '1.05rem' }}>
                        {content || (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p>Content for <strong>{title}</strong> is currently being updated.</p>
                                <p>Thank you for your interest in JAK TECH.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoPage;
