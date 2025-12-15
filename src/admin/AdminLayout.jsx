/**
 * ============================================
 * 🔐 Admin Layout - โครงสร้างหน้า Admin
 * ============================================
 * 
 * ประกอบด้วย:
 * - Sidebar navigation
 * - Header with user info
 * - Main content area (Outlet)
 * - Protected route (admin only)
 */

import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './admin.css';

function AdminLayout() {
    const navigate = useNavigate();
    const { user, isLoggedIn, isAdmin, logout } = useAuth();

    // ============================================
    // 🔒 Protected Route - Redirect if not admin
    // ============================================
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else if (!isAdmin) {
            navigate('/');
            alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        }
    }, [isLoggedIn, isAdmin, navigate]);

    if (!isLoggedIn || !isAdmin) {
        return null;
    }

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar__header">
                    <Link to="/" className="admin-sidebar__logo">
                        <span>🔧</span>
                        <span>JAK<span className="accent">TECH</span></span>
                    </Link>
                    <span className="admin-sidebar__badge">Admin</span>
                </div>

                <nav className="admin-sidebar__nav">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                        }
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                        }
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        <span>จัดการสินค้า</span>
                    </NavLink>

                    <NavLink
                        to="/admin/categories"
                        className={({ isActive }) =>
                            `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                        }
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                        </svg>
                        <span>หมวดหมู่</span>
                    </NavLink>

                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) =>
                            `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                        }
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <span>คำสั่งซื้อ</span>
                    </NavLink>

                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                        }
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                        </svg>
                        <span>ผู้ใช้งาน</span>
                    </NavLink>
                </nav>

                <div className="admin-sidebar__footer">
                    <Link to="/" className="admin-sidebar__link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span>กลับหน้าร้าน</span>
                    </Link>
                    <button className="admin-sidebar__logout" onClick={logout}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                        <span>ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Header */}
                <header className="admin-header">
                    <div className="admin-header__search">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input type="text" placeholder="ค้นหา..." />
                    </div>

                    <div className="admin-header__user">
                        <span className="admin-header__name">{user?.name}</span>
                        <div className="admin-header__avatar">
                            {user?.avatar || user?.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;
