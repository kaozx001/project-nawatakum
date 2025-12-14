/**
 * ============================================
 * 🛒 CartContext - ระบบจัดการตะกร้าสินค้า
 * ============================================
 * 
 * ไฟล์นี้จัดการ:
 * - เพิ่ม/ลบสินค้าในตะกร้า
 * - อัพเดทจำนวนสินค้า
 * - คำนวณราคารวม
 * - บันทึกตะกร้าใน localStorage
 * 
 * 📝 ส่วนที่ต้องแก้ไข:
 * - ถ้าต้องการ sync กับ backend ให้เพิ่ม API calls
 * - ปรับปรุง pricing logic ตามต้องการ
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// สร้าง Context
const CartContext = createContext(null);

/**
 * CartProvider Component
 * ครอบ App เพื่อให้ทุก component เข้าถึง cart state ได้
 */
export function CartProvider({ children }) {
    // State เก็บสินค้าในตะกร้า
    const [cartItems, setCartItems] = useState([]);

    /**
     * ============================================
     * โหลดตะกร้าจาก localStorage เมื่อ App เริ่มต้น
     * ============================================
     */
    useEffect(() => {
        const savedCart = localStorage.getItem('techverse_cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                localStorage.removeItem('techverse_cart');
            }
        }
    }, []);

    /**
     * ============================================
     * บันทึกตะกร้าลง localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
     * ============================================
     */
    useEffect(() => {
        localStorage.setItem('techverse_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    /**
     * ============================================
     * ➕ เพิ่มสินค้าลงตะกร้า
     * ============================================
     * 
     * @param {Object} product - สินค้าที่จะเพิ่ม
     * @param {number} quantity - จำนวน (default: 1)
     * 
     * 📝 ส่วนที่ต้องแก้ไข:
     * ถ้าต้องการ sync กับ backend:
     * await fetch('/api/cart/add', { method: 'POST', body: ... })
     */
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            // เช็คว่ามีสินค้านี้ในตะกร้าแล้วหรือไม่
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // ถ้ามีแล้ว เพิ่มจำนวน
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // ถ้ายังไม่มี เพิ่มสินค้าใหม่
            return [...prevItems, { ...product, quantity }];
        });
    };

    /**
     * ============================================
     * ➖ ลบสินค้าออกจากตะกร้า
     * ============================================
     * 
     * @param {number} productId - ID ของสินค้าที่จะลบ
     */
    const removeFromCart = (productId) => {
        setCartItems(prevItems =>
            prevItems.filter(item => item.id !== productId)
        );
    };

    /**
     * ============================================
     * 🔄 อัพเดทจำนวนสินค้า
     * ============================================
     * 
     * @param {number} productId - ID ของสินค้า
     * @param {number} quantity - จำนวนใหม่
     */
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    /**
     * ============================================
     * 🗑️ ล้างตะกร้าทั้งหมด
     * ============================================
     */
    const clearCart = () => {
        setCartItems([]);
    };

    /**
     * ============================================
     * 💰 คำนวณจำนวนสินค้าทั้งหมด
     * ============================================
     */
    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    /**
     * ============================================
     * 💵 คำนวณราคารวม
     * ============================================
     * 
     * 📝 ส่วนที่ต้องแก้ไข:
     * - ปรับ logic การคำนวณตามต้องการ
     * - เพิ่มส่วนลด, ค่าจัดส่ง, ภาษี ฯลฯ
     */
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            // แปลงราคาจาก string "$1,599" เป็นตัวเลข
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            return total + (price * item.quantity);
        }, 0);
    };

    /**
     * ============================================
     * 📝 สรุปราคาทั้งหมด (รวมค่าจัดส่ง, ส่วนลด)
     * ============================================
     * 
     * 📝 ส่วนที่ต้องแก้ไข:
     * - SHIPPING_FEE: ค่าจัดส่ง
     * - FREE_SHIPPING_THRESHOLD: ยอดสั่งซื้อขั้นต่ำที่ได้ส่งฟรี
     * - TAX_RATE: อัตราภาษี
     */
    const getOrderSummary = () => {
        const subtotal = getCartTotal();

        // ⚠️ TODO: ปรับค่าเหล่านี้ตามต้องการ
        const SHIPPING_FEE = 150;             // ค่าจัดส่ง 150 บาท
        const FREE_SHIPPING_THRESHOLD = 5000; // ยอดขั้นต่ำส่งฟรี 5,000 บาท
        const TAX_RATE = 0.07;                // ภาษี 7%

        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
        const tax = subtotal * TAX_RATE;
        const total = subtotal + shipping + tax;

        return {
            subtotal,
            shipping,
            tax,
            total,
            itemCount: getCartCount()
        };
    };

    // ค่าที่ส่งออกไปให้ component อื่นใช้
    const value = {
        cartItems,          // สินค้าในตะกร้า
        addToCart,          // เพิ่มสินค้า
        removeFromCart,     // ลบสินค้า
        updateQuantity,     // อัพเดทจำนวน
        clearCart,          // ล้างตะกร้า
        getCartCount,       // จำนวนสินค้าทั้งหมด
        getCartTotal,       // ราคารวม
        getOrderSummary     // สรุปราคา
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

/**
 * Custom Hook สำหรับใช้ Cart Context
 * ใช้งาน: const { cartItems, addToCart } = useCart();
 */
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export default CartContext;
