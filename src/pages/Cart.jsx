/**
 * ============================================
 * 🛒 Cart Page - หน้าตะกร้าสินค้า
 * ============================================
 * 
 * แสดงสินค้าในตะกร้า พร้อมฟังก์ชัน:
 * - อัพเดทจำนวน
 * - ลบสินค้า
 * - สรุปราคา
 * - ไปหน้า Checkout
 * 
 * 📝 ส่วนที่ต้องแก้ไข:
 * - ข้อความ UI ต่างๆ
 * - การคำนวณราคา (ใน CartContext)
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getOrderSummary, clearCart } = useCart();
    const { isLoggedIn } = useAuth();

    // คำนวณสรุปราคา
    const summary = getOrderSummary();

    /**
     * ============================================
     * 💳 ไปหน้า Checkout
     * ============================================
     * ต้อง Login ก่อนถึงจะไปหน้า Checkout ได้
     */
    const handleCheckout = () => {
        if (!isLoggedIn) {
            // ถ้ายังไม่ Login ให้ไป Login ก่อน
            navigate('/login', { state: { from: { pathname: '/checkout' } } });
        } else {
            navigate('/checkout');
        }
    };

    // ถ้าตะกร้าว่าง
    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-page__container">
                    <div className="cart-empty">
                        <span className="cart-empty__icon">🛒</span>
                        <h2 className="cart-empty__title">ตะกร้าของคุณว่างเปล่า</h2>
                        <p className="cart-empty__text">เริ่มช้อปปิ้งเพื่อเพิ่มสินค้าลงตะกร้า</p>
                        <Link to="/" className="cart-empty__btn">
                            เริ่มช้อปปิ้ง
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-page__container">
                {/* Header */}
                <div className="cart-page__header">
                    <Link to="/" className="cart-page__back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        <span>ช้อปปิ้งต่อ</span>
                    </Link>
                    <h1 className="cart-page__title">🛒 ตะกร้าสินค้า</h1>
                    <span className="cart-page__count">{summary.itemCount} รายการ</span>
                </div>

                <div className="cart-page__content">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                {/* Product Image */}
                                <Link to={`/product/${item.id}`} className="cart-item__image">
                                    <img src={item.image} alt={item.name} />
                                </Link>

                                {/* Product Info */}
                                <div className="cart-item__info">
                                    <Link to={`/product/${item.id}`} className="cart-item__name">
                                        {item.name}
                                    </Link>
                                    <p className="cart-item__price">{item.price}</p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="cart-item__quantity">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="cart-item__qty-btn"
                                    >
                                        −
                                    </button>
                                    <span className="cart-item__qty-value">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="cart-item__qty-btn"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Total Price */}
                                <div className="cart-item__total">
                                    ฿{(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toLocaleString()}
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="cart-item__remove"
                                    title="ลบสินค้า"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                    </svg>
                                </button>
                            </div>
                        ))}

                        {/* Clear Cart */}
                        <button onClick={clearCart} className="cart-items__clear">
                            🗑️ ล้างตะกร้าทั้งหมด
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="cart-summary">
                        <h3 className="cart-summary__title">สรุปคำสั่งซื้อ</h3>

                        <div className="cart-summary__row">
                            <span>ราคาสินค้า</span>
                            <span>฿{summary.subtotal.toLocaleString()}</span>
                        </div>

                        <div className="cart-summary__row">
                            <span>ค่าจัดส่ง</span>
                            <span>
                                {summary.shipping === 0
                                    ? <span className="cart-summary__free">ฟรี!</span>
                                    : `฿${summary.shipping.toLocaleString()}`
                                }
                            </span>
                        </div>

                        <div className="cart-summary__row">
                            <span>ภาษี (7%)</span>
                            <span>฿{summary.tax.toLocaleString()}</span>
                        </div>

                        <div className="cart-summary__divider"></div>

                        <div className="cart-summary__row cart-summary__row--total">
                            <span>ยอดรวมทั้งหมด</span>
                            <span>฿{summary.total.toLocaleString()}</span>
                        </div>

                        <button onClick={handleCheckout} className="cart-summary__checkout">
                            {isLoggedIn ? (
                                <>
                                    <span>ดำเนินการสั่งซื้อ</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </>
                            ) : (
                                <>
                                    <span>เข้าสู่ระบบเพื่อสั่งซื้อ</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {!isLoggedIn && (
                            <p className="cart-summary__note">
                                * ต้องเข้าสู่ระบบก่อนดำเนินการสั่งซื้อ
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
