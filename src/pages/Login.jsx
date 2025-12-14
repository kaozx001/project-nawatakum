/**
 * ============================================
 * 🔐 Login Page - หน้าเข้าสู่ระบบ/สมัครสมาชิก
 * ============================================
 * 
 * หน้านี้มี 2 โหมด:
 * 1. Login - เข้าสู่ระบบ
 * 2. Register - สมัครสมาชิกใหม่
 * 
 * 📝 ส่วนที่ต้องแก้ไข:
 * - ข้อความต่างๆ ใน UI
 * - Validation rules
 * - Social login buttons (ถ้าต้องการ)
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useAuth();

    // ดึง redirect path (ถ้ามา redirect จากหน้าอื่น)
    const from = location.state?.from?.pathname || '/';

    // State สำหรับสลับระหว่าง Login/Register
    const [isLogin, setIsLogin] = useState(true);

    // State สำหรับ form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // State สำหรับ errors และ loading
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * ============================================
     * 📝 จัดการการเปลี่ยนแปลง input
     * ============================================
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(''); // ล้าง error เมื่อ user พิมพ์
    };

    /**
     * ============================================
     * 🔑 จัดการการ Submit Form
     * ============================================
     * 
     * 📝 ส่วนที่ต้องแก้ไข:
     * - Validation rules ตามต้องการ
     * - Error messages
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // === LOGIN ===
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    navigate(from, { replace: true });
                } else {
                    setError(result.error);
                }
            } else {
                // === REGISTER ===
                // ตรวจสอบ password match
                if (formData.password !== formData.confirmPassword) {
                    setError('รหัสผ่านไม่ตรงกัน');
                    setLoading(false);
                    return;
                }

                // ตรวจสอบความยาว password
                if (formData.password.length < 6) {
                    setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
                    setLoading(false);
                    return;
                }

                const result = await register(
                    formData.name,
                    formData.email,
                    formData.password
                );

                if (result.success) {
                    navigate(from, { replace: true });
                } else {
                    setError(result.error);
                }
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        }

        setLoading(false);
    };

    /**
     * ============================================
     * สลับระหว่าง Login/Register
     * ============================================
     */
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="login-page">
            {/* Background Effects */}
            <div className="login-page__bg">
                <div className="login-page__orb login-page__orb--1"></div>
                <div className="login-page__orb login-page__orb--2"></div>
            </div>

            <div className="login-page__container">
                {/* Back to Home Link */}
                <Link to="/" className="login-page__back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>กลับหน้าหลัก</span>
                </Link>

                {/* Login Card */}
                <div className="login-card">
                    {/* Logo */}
                    <div className="login-card__logo">
                        <span className="login-card__logo-icon">🔧</span>
                        <span className="login-card__logo-text">
                            JAK<span className="login-card__logo-accent">TECH</span>
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="login-card__title">
                        {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                    </h1>
                    <p className="login-card__subtitle">
                        {isLogin
                            ? 'ยินดีต้อนรับกลับมา! เข้าสู่ระบบเพื่อดำเนินการต่อ'
                            : 'สร้างบัญชีใหม่เพื่อเริ่มช้อปปิ้ง'
                        }
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="login-card__error">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="login-card__form">
                        {/* Name Field (Register only) */}
                        {!isLogin && (
                            <div className="login-card__field">
                                <label htmlFor="name">ชื่อ-นามสกุล</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="กรอกชื่อ-นามสกุล"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="login-card__field">
                            <label htmlFor="email">อีเมล</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="login-card__field">
                            <label htmlFor="password">รหัสผ่าน</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Confirm Password (Register only) */}
                        {!isLogin && (
                            <div className="login-card__field">
                                <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="login-card__submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="login-card__loading">
                                    <span className="login-card__spinner"></span>
                                    กำลังดำเนินการ...
                                </span>
                            ) : (
                                isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'
                            )}
                        </button>
                    </form>

                    {/* Toggle Mode */}
                    <p className="login-card__toggle">
                        {isLogin ? 'ยังไม่มีบัญชี?' : 'มีบัญชีอยู่แล้ว?'}
                        <button type="button" onClick={toggleMode}>
                            {isLogin ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
                        </button>
                    </p>

                    {/* Demo Credentials */}
                    {isLogin && (
                        <div className="login-card__demo">
                            <p>📝 ทดสอบด้วยบัญชี Demo:</p>
                            <code>demo@jaktech.com / demo123</code>
                            <p style={{ marginTop: '4px', fontSize: '0.8em' }}>👑 Admin: admin@jaktech.com / admin123</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
