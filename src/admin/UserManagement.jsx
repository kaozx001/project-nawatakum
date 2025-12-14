/**
 * ============================================
 * 👥 User Management - จัดการผู้ใช้งาน
 * ============================================
 * 
 * ฟังก์ชัน:
 * - แสดงรายการผู้ใช้งานทั้งหมด
 * - เปลี่ยน role (user/admin)
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';

function UserManagement() {
    const { getAllUsers, updateUserRole, user: currentUser } = useAuth();
    const { getUserOrders } = useOrder();
    const [search, setSearch] = useState('');

    const users = getAllUsers();

    // กรอง users
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    /**
     * ============================================
     * 🔄 Handle Role Change
     * ============================================
     */
    const handleRoleChange = (userId, newRole) => {
        if (userId === currentUser?.id) {
            alert('ไม่สามารถเปลี่ยน role ของตัวเองได้');
            return;
        }

        const result = updateUserRole(userId, newRole);
        if (!result.success) {
            alert(result.error);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>👥 จัดการผู้ใช้งาน</h1>
            </div>

            {/* Search */}
            <div className="admin-filters">
                <div className="admin-filter">
                    <input
                        type="text"
                        placeholder="ค้นหาผู้ใช้..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="admin-input"
                    />
                </div>
            </div>

            {/* User Table */}
            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ผู้ใช้</th>
                                <th>อีเมล</th>
                                <th>Role</th>
                                <th>คำสั่งซื้อ</th>
                                <th>สมาชิกเมื่อ</th>
                                <th>การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(u => {
                                const orderCount = getUserOrders ? getUserOrders(u.id).length : 0;
                                const isCurrentUser = u.id === currentUser?.id;

                                return (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="admin-table__user">
                                                <div className="admin-table__avatar">
                                                    {u.avatar || u.name?.charAt(0) || 'U'}
                                                </div>
                                                <span>{u.name}</span>
                                                {isCurrentUser && (
                                                    <span className="admin-badge admin-badge--you">คุณ</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`admin-role-badge admin-role-badge--${u.role}`}>
                                                {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                                            </span>
                                        </td>
                                        <td>{orderCount} รายการ</td>
                                        <td className="admin-table__date">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('th-TH') : '-'}
                                        </td>
                                        <td>
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className="admin-select admin-select--small"
                                                disabled={isCurrentUser}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="admin-table-footer">
                    <span>แสดง {filteredUsers.length} ผู้ใช้งาน</span>
                </div>
            </div>

            {/* Role Info */}
            <div className="admin-info-box">
                <h3>🔑 ระดับสิทธิ์</h3>
                <div className="admin-role-info">
                    <div className="admin-role-info__item">
                        <span className="admin-role-badge admin-role-badge--user">👤 User</span>
                        <p>สามารถซื้อสินค้า, เขียนรีวิว, ถามคำถาม</p>
                    </div>
                    <div className="admin-role-info__item">
                        <span className="admin-role-badge admin-role-badge--admin">👑 Admin</span>
                        <p>จัดการสินค้า, คำสั่งซื้อ, ผู้ใช้, และตอบคำถาม</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserManagement;
