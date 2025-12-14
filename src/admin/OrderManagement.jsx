/**
 * ============================================
 * 📋 Order Management - จัดการคำสั่งซื้อ
 * ============================================
 * 
 * ฟังก์ชัน:
 * - แสดงรายการคำสั่งซื้อทั้งหมด
 * - อัพเดทสถานะคำสั่งซื้อ
 * - กรองตามสถานะ
 */

import React, { useState } from 'react';
import { useOrder, ORDER_STATUS } from '../context/OrderContext';

function OrderManagement() {
    const { getAllOrders, updateOrderStatus } = useOrder();
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const orders = getAllOrders();

    // กรอง orders
    const filteredOrders = orders.filter(order =>
        filterStatus === 'all' || order.status === filterStatus
    );

    /**
     * ============================================
     * 🔄 Handle Status Update
     * ============================================
     */
    const handleStatusUpdate = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
        setSelectedOrder(null);
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>📋 จัดการคำสั่งซื้อ</h1>
            </div>

            {/* Status Filters */}
            <div className="admin-status-filters">
                <button
                    className={`admin-status-filter ${filterStatus === 'all' ? 'admin-status-filter--active' : ''}`}
                    onClick={() => setFilterStatus('all')}
                >
                    ทั้งหมด ({orders.length})
                </button>
                {Object.entries(ORDER_STATUS).map(([key, value]) => {
                    const count = orders.filter(o => o.status === key).length;
                    return (
                        <button
                            key={key}
                            className={`admin-status-filter ${filterStatus === key ? 'admin-status-filter--active' : ''}`}
                            onClick={() => setFilterStatus(key)}
                            style={{
                                backgroundColor: filterStatus === key ? `${value.color}20` : undefined,
                                borderColor: filterStatus === key ? value.color : undefined
                            }}
                        >
                            {value.icon} {value.label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Orders Table */}
            <div className="admin-card">
                <div className="admin-table-container">
                    {filteredOrders.length > 0 ? (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>ลูกค้า</th>
                                    <th>รายการ</th>
                                    <th>ยอดรวม</th>
                                    <th>สถานะ</th>
                                    <th>วันที่</th>
                                    <th>การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="admin-table__id">{order.id}</td>
                                        <td>
                                            <div className="admin-table__customer">
                                                <span>{order.shipping?.fullName || '-'}</span>
                                                <small>{order.shipping?.email || '-'}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="admin-table__items">
                                                {order.items?.slice(0, 2).map((item, idx) => (
                                                    <img key={idx} src={item.image} alt={item.name} title={item.name} />
                                                ))}
                                                {order.items?.length > 2 && (
                                                    <span>+{order.items.length - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="admin-table__price">{order.total}</td>
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
                                        <td className="admin-table__date">
                                            {new Date(order.createdAt).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td>
                                            <div className="admin-table__actions">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className="admin-select admin-select--small"
                                                >
                                                    {Object.entries(ORDER_STATUS).map(([key, value]) => (
                                                        <option key={key} value={key}>
                                                            {value.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="admin-empty">
                            <span>📦</span>
                            <p>ยังไม่มีคำสั่งซื้อ</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Flow Info */}
            <div className="admin-info-box">
                <h3>📝 สถานะคำสั่งซื้อ</h3>
                <div className="admin-status-flow">
                    <span className="admin-status-flow__item">⏳ รอชำระ</span>
                    <span className="admin-status-flow__arrow">→</span>
                    <span className="admin-status-flow__item">💳 ชำระแล้ว</span>
                    <span className="admin-status-flow__arrow">→</span>
                    <span className="admin-status-flow__item">📦 กำลังจัดเตรียม</span>
                    <span className="admin-status-flow__arrow">→</span>
                    <span className="admin-status-flow__item">🚚 กำลังจัดส่ง</span>
                    <span className="admin-status-flow__arrow">→</span>
                    <span className="admin-status-flow__item">✅ สำเร็จ</span>
                </div>
            </div>
        </div>
    );
}

export default OrderManagement;
