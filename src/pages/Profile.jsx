/**
 * ============================================
 * 👤 Profile Page - หน้าโปรไฟล์ผู้ใช้
 * ============================================
 * 
 * ฟังก์ชัน:
 * - แสดงข้อมูลผู้ใช้
 * - แก้ไขโปรไฟล์ (ชื่อ, เบอร์โทร, ที่อยู่)
 * - แสดงประวัติคำสั่งซื้อ
 * - Tab navigation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder, ORDER_STATUS } from '../context/OrderContext';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, isLoggedIn, updateProfile } = useAuth();
    const { getUserOrders } = useOrder();

    // ============================================
    // State
    // ============================================
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // ============================================
    // Redirect if not logged in
    // ============================================
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    // ============================================
    // Load user data into form
    // ============================================
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    // ============================================
    // Get user orders
    // ============================================
    const orders = user ? getUserOrders(user.id) : [];

    /**
     * ============================================
     * 📝 Handle Form Change
     * ============================================
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * ============================================
     * 💾 Handle Save Profile
     * ============================================
     */
    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const result = await updateProfile(formData);
            if (result.success) {
                setMessage({ type: 'success', text: 'บันทึกข้อมูลเรียบร้อยแล้ว!' });
                setIsEditing(false);
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'เกิดข้อผิดพลาด กรุณาลองใหม่' });
        }

        setSaving(false);
    };

    /**
     * ============================================
     * ❌ Handle Cancel Edit
     * ============================================
     */
    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            phone: user?.phone || '',
            address: user?.address || ''
        });
        setIsEditing(false);
        setMessage(null);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="profile-page">
            <div className="profile-page__container">
                {/* Sidebar */}
                <aside className="profile-sidebar">
                    {/* User Info */}
                    <div className="profile-sidebar__user">
                        <div className="profile-sidebar__avatar">
                            <span>{user.avatar || user.name?.charAt(0) || 'U'}</span>
                        </div>
                        <h2 className="profile-sidebar__name">{user.name}</h2>
                        <p className="profile-sidebar__email">{user.email}</p>
                        {user.role === 'admin' && (
                            <span className="profile-sidebar__badge">👑 Admin</span>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="profile-sidebar__nav">
                        <button
                            className={`profile-sidebar__link ${activeTab === 'profile' ? 'profile-sidebar__link--active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span>ข้อมูลส่วนตัว</span>
                        </button>

                        <button
                            className={`profile-sidebar__link ${activeTab === 'orders' ? 'profile-sidebar__link--active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            <span>คำสั่งซื้อ</span>
                            {orders.length > 0 && (
                                <span className="profile-sidebar__count">{orders.length}</span>
                            )}
                        </button>

                        {user.role === 'admin' && (
                            <Link to="/admin" className="profile-sidebar__link profile-sidebar__link--admin">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <line x1="3" y1="9" x2="21" y2="9" />
                                    <line x1="9" y1="21" x2="9" y2="9" />
                                </svg>
                                <span>Admin Panel</span>
                            </Link>
                        )}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="profile-content">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="profile-tab">
                            <div className="profile-tab__header">
                                <h1>ข้อมูลส่วนตัว</h1>
                                {!isEditing ? (
                                    <button
                                        className="profile-tab__edit-btn"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        แก้ไข
                                    </button>
                                ) : null}
                            </div>

                            {/* Message */}
                            {message && (
                                <div className={`profile-message profile-message--${message.type}`}>
                                    {message.type === 'success' ? '✅' : '❌'} {message.text}
                                </div>
                            )}

                            {/* Profile Form */}
                            <div className="profile-form">
                                {/* Email (read only) */}
                                <div className="profile-form__group">
                                    <label>อีเมล</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="profile-form__input profile-form__input--disabled"
                                    />
                                </div>

                                {/* Name */}
                                <div className="profile-form__group">
                                    <label>ชื่อ-นามสกุล</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="profile-form__input"
                                        placeholder="กรอกชื่อ-นามสกุล"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="profile-form__group">
                                    <label>เบอร์โทรศัพท์</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="profile-form__input"
                                        placeholder="กรอกเบอร์โทรศัพท์"
                                    />
                                </div>

                                {/* Address */}
                                <div className="profile-form__group">
                                    <label>ที่อยู่จัดส่ง</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="profile-form__textarea"
                                        placeholder="กรอกที่อยู่สำหรับจัดส่งสินค้า"
                                        rows={3}
                                    />
                                </div>

                                {/* Member Since */}
                                <div className="profile-form__group">
                                    <label>สมาชิกตั้งแต่</label>
                                    <input
                                        type="text"
                                        value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('th-TH', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'ไม่ระบุ'}
                                        disabled
                                        className="profile-form__input profile-form__input--disabled"
                                    />
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="profile-form__actions">
                                        <button
                                            className="profile-form__btn profile-form__btn--cancel"
                                            onClick={handleCancel}
                                            disabled={saving}
                                        >
                                            ยกเลิก
                                        </button>
                                        <button
                                            className="profile-form__btn profile-form__btn--save"
                                            onClick={handleSave}
                                            disabled={saving}
                                        >
                                            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="profile-tab">
                            <div className="profile-tab__header">
                                <h1>ประวัติคำสั่งซื้อ</h1>
                            </div>

                            {orders.length > 0 ? (
                                <div className="orders-list">
                                    {orders.map((order) => (
                                        <div key={order.id} className="order-card">
                                            {/* Order Header */}
                                            <div className="order-card__header">
                                                <div className="order-card__id">
                                                    <span className="order-card__label">เลขที่คำสั่งซื้อ</span>
                                                    <span className="order-card__value">{order.id}</span>
                                                </div>
                                                <div
                                                    className="order-card__status"
                                                    style={{
                                                        backgroundColor: `${ORDER_STATUS[order.status]?.color}20`,
                                                        color: ORDER_STATUS[order.status]?.color
                                                    }}
                                                >
                                                    {ORDER_STATUS[order.status]?.icon} {ORDER_STATUS[order.status]?.label}
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="order-card__items">
                                                {order.items?.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="order-card__item">
                                                        <img src={item.image} alt={item.name} />
                                                        <div className="order-card__item-info">
                                                            <span className="order-card__item-name">{item.name}</span>
                                                            <span className="order-card__item-qty">x{item.quantity}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.items?.length > 3 && (
                                                    <div className="order-card__more">
                                                        +{order.items.length - 3} รายการอื่น
                                                    </div>
                                                )}
                                            </div>

                                            {/* Order Footer */}
                                            <div className="order-card__footer">
                                                <div className="order-card__date">
                                                    {new Date(order.createdAt).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                                <div className="order-card__total">
                                                    รวม: <strong>{order.total}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="orders-empty">
                                    <span className="orders-empty__icon">📦</span>
                                    <h3>ยังไม่มีคำสั่งซื้อ</h3>
                                    <p>เริ่มช้อปปิ้งกันเลย!</p>
                                    <Link to="/" className="orders-empty__btn">
                                        ไปช้อปปิ้ง
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Profile;
