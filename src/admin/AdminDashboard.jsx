/**
 * ============================================
 * 📊 Admin Dashboard - หน้า Dashboard หลัก
 * ============================================
 * 
 * แสดงสถิติ:
 * - ยอดขายรวม
 * - จำนวน orders
 * - จำนวนลูกค้า
 * - สินค้าทั้งหมด
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useOrder, ORDER_STATUS } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/products';

function AdminDashboard() {
    const { getOrderStats, getAllOrders } = useOrder();
    const { getAllUsers } = useAuth();

    const stats = getOrderStats();
    const orders = getAllOrders();
    const users = getAllUsers();

    // นับสินค้าทั้งหมด
    const totalProducts = categories.reduce((sum, cat) => sum + cat.items.length, 0);

    // Recent orders
    const recentOrders = orders.slice(0, 5);

    return (
        <div className="admin-dashboard">
            <div className="admin-page-header">
                <h1>📊 Dashboard</h1>
                <p>ภาพรวมร้านค้า TechVerse</p>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats">
                <div className="admin-stat-card admin-stat-card--cyan">
                    <div className="admin-stat-card__icon">💰</div>
                    <div className="admin-stat-card__content">
                        <span className="admin-stat-card__value">
                            ฿{stats.totalRevenue.toLocaleString()}
                        </span>
                        <span className="admin-stat-card__label">ยอดขายรวม</span>
                    </div>
                </div>

                <div className="admin-stat-card admin-stat-card--magenta">
                    <div className="admin-stat-card__icon">📦</div>
                    <div className="admin-stat-card__content">
                        <span className="admin-stat-card__value">{stats.total}</span>
                        <span className="admin-stat-card__label">คำสั่งซื้อทั้งหมด</span>
                    </div>
                </div>

                <div className="admin-stat-card admin-stat-card--green">
                    <div className="admin-stat-card__icon">👥</div>
                    <div className="admin-stat-card__content">
                        <span className="admin-stat-card__value">{users.length}</span>
                        <span className="admin-stat-card__label">ผู้ใช้งาน</span>
                    </div>
                </div>

                <div className="admin-stat-card admin-stat-card--orange">
                    <div className="admin-stat-card__icon">🛍️</div>
                    <div className="admin-stat-card__content">
                        <span className="admin-stat-card__value">{totalProducts}</span>
                        <span className="admin-stat-card__label">สินค้าทั้งหมด</span>
                    </div>
                </div>
            </div>

            {/* Order Status Summary */}
            <div className="admin-grid">
                <div className="admin-card">
                    <div className="admin-card__header">
                        <h2>📋 สถานะคำสั่งซื้อ</h2>
                        <Link to="/admin/orders" className="admin-card__link">ดูทั้งหมด</Link>
                    </div>
                    <div className="admin-order-status-grid">
                        {Object.entries(ORDER_STATUS).map(([key, value]) => (
                            <div key={key} className="admin-order-status-item">
                                <span className="admin-order-status-icon">{value.icon}</span>
                                <span className="admin-order-status-count">{stats[key] || 0}</span>
                                <span className="admin-order-status-label">{value.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="admin-card">
                    <div className="admin-card__header">
                        <h2>🕒 คำสั่งซื้อล่าสุด</h2>
                        <Link to="/admin/orders" className="admin-card__link">ดูทั้งหมด</Link>
                    </div>
                    <div className="admin-table-container">
                        {recentOrders.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>สถานะ</th>
                                        <th>ยอดรวม</th>
                                        <th>วันที่</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="admin-table__id">{order.id}</td>
                                            <td>
                                                <span
                                                    className="admin-table__status"
                                                    style={{
                                                        backgroundColor: `${ORDER_STATUS[order.status]?.color}20`,
                                                        color: ORDER_STATUS[order.status]?.color
                                                    }}
                                                >
                                                    {ORDER_STATUS[order.status]?.icon} {ORDER_STATUS[order.status]?.label}
                                                </span>
                                            </td>
                                            <td className="admin-table__price">{order.total}</td>
                                            <td className="admin-table__date">
                                                {new Date(order.createdAt).toLocaleDateString('th-TH')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="admin-empty">ยังไม่มีคำสั่งซื้อ</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="admin-quick-links">
                <h2>⚡ ทางลัด</h2>
                <div className="admin-quick-links__grid">
                    <Link to="/admin/products" className="admin-quick-link">
                        <span>➕</span>
                        <span>เพิ่มสินค้าใหม่</span>
                    </Link>
                    <Link to="/admin/orders" className="admin-quick-link">
                        <span>📋</span>
                        <span>ดูคำสั่งซื้อทั้งหมด</span>
                    </Link>
                    <Link to="/admin/users" className="admin-quick-link">
                        <span>👥</span>
                        <span>จัดการผู้ใช้</span>
                    </Link>
                    <Link to="/" className="admin-quick-link">
                        <span>🏪</span>
                        <span>ดูหน้าร้าน</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
