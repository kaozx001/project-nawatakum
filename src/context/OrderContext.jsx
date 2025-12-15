/**
 * ============================================
 * 📋 Order Context - จัดการคำสั่งซื้อ
 * ============================================
 * 
 * ฟังก์ชัน:
 * - สร้าง order ใหม่
 * - ดึง orders ของ user
 * - อัพเดทสถานะ order (สำหรับ Admin)
 * - เก็บข้อมูลใน localStorage
 * 
 * สถานะ Order:
 * - pending: รอการชำระเงิน
 * - paid: ชำระเงินแล้ว
 * - preparing: กำลังจัดเตรียม
 * - shipping: กำลังจัดส่ง
 * - completed: จัดส่งสำเร็จ
 * - cancelled: ยกเลิก
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================
// 📝 สร้าง Context
// ============================================
const OrderContext = createContext();

/**
 * ============================================
 * 🎣 useOrder Hook
 * ============================================
 * ใช้เรียก OrderContext ใน component อื่น
 */
export function useOrder() {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
}

/**
 * ============================================
 * 📦 Order Status Labels (ภาษาไทย)
 * ============================================
 */
export const ORDER_STATUS = {
    pending: { label: 'รอการชำระเงิน', color: '#ffd700', icon: '⏳' },
    paid: { label: 'ชำระเงินแล้ว', color: '#00ff88', icon: '💳' },
    preparing: { label: 'กำลังจัดเตรียม', color: '#00d4ff', icon: '📦' },
    shipping: { label: 'กำลังจัดส่ง', color: '#b967ff', icon: '🚚' },
    completed: { label: 'จัดส่งสำเร็จ', color: '#00ff88', icon: '✅' },
    cancelled: { label: 'ยกเลิก', color: '#ff4466', icon: '❌' }
};

/**
 * ============================================
 * 🏪 OrderProvider Component
 * ============================================
 * ห่อ App เพื่อให้ทุก component เข้าถึง orders ได้
 */
export function OrderProvider({ children }) {
    // ============================================
    // State - โหลดจาก localStorage
    // ============================================
    const [orders, setOrders] = useState(() => {
        try {
            const saved = localStorage.getItem('techverse_orders');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // ============================================
    // 💾 บันทึกลง localStorage เมื่อ orders เปลี่ยน
    // ============================================
    useEffect(() => {
        localStorage.setItem('techverse_orders', JSON.stringify(orders));
    }, [orders]);

    /**
     * ============================================
     * 🆕 สร้าง Order ใหม่
     * ============================================
     * @param {Object} orderData - ข้อมูลคำสั่งซื้อ
     * @returns {Object} - Order ที่สร้าง
     */
    const createOrder = (orderData) => {
        const newOrder = {
            id: `ORD-${Date.now()}`, // สร้าง ID จาก timestamp
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            statusHistory: [
                {
                    status: 'pending',
                    timestamp: new Date().toISOString(),
                    note: 'สร้างคำสั่งซื้อ'
                }
            ]
        };

        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };

    /**
     * ============================================
     * 📋 ดึง Orders ของ User
     * ============================================
     * @param {string} userId - ID ของ user
     * @returns {Array} - รายการ orders
     */
    const getUserOrders = (userId) => {
        return orders.filter(order => order.userId === userId);
    };

    /**
     * ============================================
     * 📋 ดึง Order ตาม ID
     * ============================================
     * @param {string} orderId - ID ของ order
     * @returns {Object|null} - Order หรือ null
     */
    const getOrderById = (orderId) => {
        return orders.find(order => order.id === orderId) || null;
    };

    /**
     * ============================================
     * 📋 ดึง Orders ทั้งหมด (สำหรับ Admin)
     * ============================================
     */
    const getAllOrders = () => {
        return orders;
    };

    /**
     * ============================================
     * 🔄 อัพเดทสถานะ Order
     * ============================================
     * @param {string} orderId - ID ของ order
     * @param {string} newStatus - สถานะใหม่
     * @param {string} note - หมายเหตุ (optional)
     */
    const updateOrderStatus = (orderId, newStatus, note = '') => {
        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    status: newStatus,
                    updatedAt: new Date().toISOString(),
                    statusHistory: [
                        ...order.statusHistory,
                        {
                            status: newStatus,
                            timestamp: new Date().toISOString(),
                            note: note || ORDER_STATUS[newStatus]?.label || 'อัพเดทสถานะ'
                        }
                    ]
                };
            }
            return order;
        }));
    };

    /**
     * ============================================
     * 💳 Mark Order as Paid
     * ============================================
     * @param {string} orderId - ID ของ order
     * @param {Object} paymentInfo - ข้อมูลการชำระเงิน
     */
    const markOrderAsPaid = (orderId, paymentInfo) => {
        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    status: 'paid',
                    paymentInfo,
                    paidAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    statusHistory: [
                        ...order.statusHistory,
                        {
                            status: 'paid',
                            timestamp: new Date().toISOString(),
                            note: `ชำระเงินผ่าน ${paymentInfo.method}`
                        }
                    ]
                };
            }
            return order;
        }));
    };

    /**
     * ============================================
     * ❌ ยกเลิก Order
     * ============================================
     */
    const cancelOrder = (orderId, reason = 'ผู้ใช้ยกเลิก') => {
        updateOrderStatus(orderId, 'cancelled', reason);
    };

    /**
     * ============================================
     * 📊 สถิติ Orders (สำหรับ Admin Dashboard)
     * ============================================
     */
    const getOrderStats = () => {
        const stats = {
            total: orders.length,
            pending: 0,
            paid: 0,
            preparing: 0,
            shipping: 0,
            completed: 0,
            cancelled: 0,
            totalRevenue: 0
        };

        orders.forEach(order => {
            stats[order.status] = (stats[order.status] || 0) + 1;

            // คำนวณรายได้จาก orders ที่ไม่ถูกยกเลิก
            if (order.status !== 'cancelled') {
                const total = parseInt(order.total?.replace(/[^\d]/g, '') || 0);
                stats.totalRevenue += total;
            }
        });

        return stats;
    };

    // ============================================
    // 📤 Context Value
    // ============================================
    const value = {
        orders,
        createOrder,
        getUserOrders,
        getOrderById,
        getAllOrders,
        updateOrderStatus,
        markOrderAsPaid,
        cancelOrder,
        getOrderStats,
        ORDER_STATUS
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
}

export default OrderContext;
