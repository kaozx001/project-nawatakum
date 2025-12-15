/**
 * ============================================
 * ⚙️ Settings Page - หน้าตั้งค่า (Minimal Theme)
 * ============================================
 * 
 * ฟังก์ชัน:
 * - ตั้งค่าการแจ้งเตือน
 * - ตั้งค่าภาษา
 * - ตั้งค่าความเป็นส่วนตัว
 * - ลบบัญชี
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

function Settings() {
    const navigate = useNavigate();
    const { user, isLoggedIn, logout } = useAuth();

    // ============================================
    // State
    // ============================================
    const [settings, setSettings] = useState({
        emailNotifications: true,
        orderUpdates: true,
        promotions: false,
        language: 'th',
        currency: 'THB',
        darkMode: true,
        twoFactorAuth: false
    });
    const [saved, setSaved] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // ============================================
    // Redirect if not logged in
    // ============================================
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    /**
     * ============================================
     * 🔄 Handle Toggle Change
     * ============================================
     */
    const handleToggle = (key) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        setSaved(false);
    };

    /**
     * ============================================
     * 📝 Handle Select Change
     * ============================================
     */
    const handleSelect = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
        setSaved(false);
    };

    /**
     * ============================================
     * 💾 Handle Save Settings
     * ============================================
     */
    const handleSave = () => {
        // Simulate saving
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    /**
     * ============================================
     * 🗑️ Handle Delete Account
     * ============================================
     */
    const handleDeleteAccount = () => {
        // Simulate account deletion
        logout();
        navigate('/');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="settings-page">
            <div className="settings-container">
                {/* Header */}
                <header className="settings-header">
                    <h1>ตั้งค่า</h1>
                    <p>จัดการการตั้งค่าบัญชีและความเป็นส่วนตัวของคุณ</p>
                </header>

                {/* Success Message */}
                {saved && (
                    <div className="settings-toast">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        บันทึกการตั้งค่าเรียบร้อยแล้ว
                    </div>
                )}

                {/* Notification Settings */}
                <section className="settings-section">
                    <div className="settings-section__header">
                        <div className="settings-section__icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>
                        <div>
                            <h2>การแจ้งเตือน</h2>
                            <p>ตั้งค่าการรับการแจ้งเตือนต่างๆ</p>
                        </div>
                    </div>

                    <div className="settings-list">
                        <div className="settings-item">
                            <div className="settings-item__info">
                                <span className="settings-item__label">การแจ้งเตือนทางอีเมล</span>
                                <span className="settings-item__desc">รับข่าวสารและอัพเดทผ่านอีเมล</span>
                            </div>
                            <button 
                                className={`settings-toggle ${settings.emailNotifications ? 'settings-toggle--active' : ''}`}
                                onClick={() => handleToggle('emailNotifications')}
                                aria-label="Toggle email notifications"
                            >
                                <span className="settings-toggle__slider" />
                            </button>
                        </div>

                        <div className="settings-item">
                            <div className="settings-item__info">
                                <span className="settings-item__label">อัพเดทคำสั่งซื้อ</span>
                                <span className="settings-item__desc">รับการแจ้งเตือนสถานะคำสั่งซื้อ</span>
                            </div>
                            <button 
                                className={`settings-toggle ${settings.orderUpdates ? 'settings-toggle--active' : ''}`}
                                onClick={() => handleToggle('orderUpdates')}
                                aria-label="Toggle order updates"
                            >
                                <span className="settings-toggle__slider" />
                            </button>
                        </div>

                        <div className="settings-item">
                            <div className="settings-item__info">
                                <span className="settings-item__label">โปรโมชั่นและข้อเสนอ</span>
                                <span className="settings-item__desc">รับข้อเสนอพิเศษและโปรโมชั่น</span>
                            </div>
                            <button 
                                className={`settings-toggle ${settings.promotions ? 'settings-toggle--active' : ''}`}
                                onClick={() => handleToggle('promotions')}
                                aria-label="Toggle promotions"
                            >
                                <span className="settings-toggle__slider" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Preferences */}
                <section className="settings-section">
                    <div className="settings-section__header">
                        <div className="settings-section__icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </div>
                        <div>
                            <h2>การตั้งค่าทั่วไป</h2>
                            <p>ปรับแต่งประสบการณ์การใช้งาน</p>
                        </div>
                    </div>

                    <div className="settings-list">
                        <div className="settings-item">
                            <div className="settings-item__info">
                                <span className="settings-item__label">ภาษา</span>
                                <span className="settings-item__desc">เลือกภาษาที่ต้องการใช้งาน</span>
                            </div>
                            <select 
                                className="settings-select"
                                value={settings.language}
                                onChange={(e) => handleSelect('language', e.target.value)}
                            >
                                <option value="th">ไทย</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        <div className="settings-item">
                            <div className="settings-item__info">
                                <span className="settings-item__label">สกุลเงิน</span>
                                <span className="settings-item__desc">สกุลเงินที่แสดงราคา</span>
                            </div>
                            <select 
                                className="settings-select"
                                value={settings.currency}
                                onChange={(e) => handleSelect('currency', e.target.value)}
                            >
                                <option value="THB">บาท (฿)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                        </div>

                        <div className="settings-item">
                            <div className="settings-item__info">
                                <span className="settings-item__label">โหมดมืด</span>
                                <span className="settings-item__desc">ใช้งานธีมสีเข้ม</span>
                            </div>
                            <button 
                                className={`settings-toggle ${settings.darkMode ? 'settings-toggle--active' : ''}`}
                                onClick={() => handleToggle('darkMode')}
                                aria-label="Toggle dark mode"
                            >
                                <span className="settings-toggle__slider" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Security */}
                <section className="settings-section">
                    <div className="settings-section__header">
                        <div className="settings-section__icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <div>
                            <h2>ความปลอดภัย</h2>
                            <p>จัดการความปลอดภัยบัญชี</p>
                        </div>
                    </div>

                    <div className="settings-list">
                        <div className="settings-item">
                            <div className="settings-item__info">
                                <span className="settings-item__label">การยืนยันตัวตนสองชั้น</span>
                                <span className="settings-item__desc">เพิ่มความปลอดภัยให้บัญชีของคุณ</span>
                            </div>
                            <button 
                                className={`settings-toggle ${settings.twoFactorAuth ? 'settings-toggle--active' : ''}`}
                                onClick={() => handleToggle('twoFactorAuth')}
                                aria-label="Toggle two-factor authentication"
                            >
                                <span className="settings-toggle__slider" />
                            </button>
                        </div>

                        <div className="settings-item settings-item--action">
                            <div className="settings-item__info">
                                <span className="settings-item__label">เปลี่ยนรหัสผ่าน</span>
                                <span className="settings-item__desc">อัพเดทรหัสผ่านบัญชีของคุณ</span>
                            </div>
                            <button className="settings-btn settings-btn--outline">
                                เปลี่ยนรหัสผ่าน
                            </button>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="settings-section settings-section--danger">
                    <div className="settings-section__header">
                        <div className="settings-section__icon settings-section__icon--danger">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <div>
                            <h2>โซนอันตราย</h2>
                            <p>การกระทำเหล่านี้ไม่สามารถย้อนกลับได้</p>
                        </div>
                    </div>

                    <div className="settings-list">
                        <div className="settings-item settings-item--action">
                            <div className="settings-item__info">
                                <span className="settings-item__label">ลบบัญชี</span>
                                <span className="settings-item__desc">ลบบัญชีและข้อมูลทั้งหมดของคุณอย่างถาวร</span>
                            </div>
                            <button 
                                className="settings-btn settings-btn--danger"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                ลบบัญชี
                            </button>
                        </div>
                    </div>
                </section>

                {/* Save Button */}
                <div className="settings-actions">
                    <button 
                        className="settings-btn settings-btn--secondary"
                        onClick={() => navigate('/profile')}
                    >
                        ยกเลิก
                    </button>
                    <button 
                        className="settings-btn settings-btn--primary"
                        onClick={handleSave}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>
                        บันทึกการตั้งค่า
                    </button>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="settings-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="settings-modal" onClick={e => e.stopPropagation()}>
                        <div className="settings-modal__icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <h3>ยืนยันการลบบัญชี</h3>
                        <p>การกระทำนี้ไม่สามารถย้อนกลับได้ ข้อมูลทั้งหมดของคุณจะถูกลบอย่างถาวร</p>
                        <div className="settings-modal__actions">
                            <button 
                                className="settings-btn settings-btn--secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ยกเลิก
                            </button>
                            <button 
                                className="settings-btn settings-btn--danger"
                                onClick={handleDeleteAccount}
                            >
                                ลบบัญชีของฉัน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
