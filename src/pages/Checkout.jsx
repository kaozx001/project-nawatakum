/**
 * ============================================
 * 💳 Checkout Page - หน้าชำระเงิน
 * ============================================
 * 
 * หน้านี้ประกอบด้วย:
 * - ฟอร์มกรอกข้อมูลจัดส่ง
 * - เลือกวิธีการชำระเงิน (Credit, Bank, PromptPay, COD)
 * - สรุปคำสั่งซื้อ
 * - สร้าง Order และนำทางไป OrderConfirmation
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import './Checkout.css';

/**
 * ============================================
 * 💳 PAYMENT METHODS
 * ============================================
 */
const PAYMENT_METHODS = [
    {
        id: 'credit',
        name: 'บัตรเครดิต/เดบิต',
        icon: '💳',
        description: 'Visa, Mastercard, JCB'
    },
    {
        id: 'bank',
        name: 'โอนเงินผ่านธนาคาร',
        icon: '🏦',
        description: 'กสิกร, กรุงเทพ, ไทยพาณิชย์'
    },
    {
        id: 'promptpay',
        name: 'PromptPay QR',
        icon: '📱',
        description: 'สแกน QR ผ่านแอปธนาคาร'
    },
    {
        id: 'cod',
        name: 'เก็บเงินปลายทาง',
        icon: '📦',
        description: 'ชำระเงินเมื่อรับสินค้า (+฿50)'
    }
];

function Checkout() {
    const navigate = useNavigate();
    const { cartItems, getOrderSummary, clearCart } = useCart();
    const { user, isLoggedIn } = useAuth();
    const { createOrder, markOrderAsPaid } = useOrder();

    // Redirect ถ้าไม่ได้ login หรือตะกร้าว่าง
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: { pathname: '/checkout' } } });
        } else if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [isLoggedIn, cartItems, navigate]);

    // State สำหรับ form
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: '',
        postalCode: '',
        note: ''
    });

    // State สำหรับ payment
    const [paymentMethod, setPaymentMethod] = useState('credit');
    const [paymentStep, setPaymentStep] = useState(1); // 1: Form, 2: Payment, 3: Complete

    // Credit card form (mockup)
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

    // State สำหรับ order processing
    const [processing, setProcessing] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);

    const summary = getOrderSummary();

    // Add COD fee
    const codFee = paymentMethod === 'cod' ? 50 : 0;
    const finalTotal = summary.total + codFee;

    /**
     * ============================================
     * 📝 จัดการการเปลี่ยนแปลง input
     * ============================================
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * ============================================
     * 📦 Step 1: Submit Shipping Info
     * ============================================
     */
    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setPaymentStep(2);
    };

    /**
     * ============================================
     * 💳 Step 2: Process Payment
     * ============================================
     */
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // จำลองการประมวลผล payment
        await new Promise(resolve => setTimeout(resolve, 2000));

        // สร้าง Order
        const newOrder = createOrder({
            userId: user.id,
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity
            })),
            shipping: {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                note: formData.note
            },
            subtotal: `฿${summary.subtotal.toLocaleString()}`,
            shippingFee: `฿${summary.shipping.toLocaleString()}`,
            tax: `฿${summary.tax.toLocaleString()}`,
            codFee: codFee > 0 ? `฿${codFee.toLocaleString()}` : null,
            total: `฿${finalTotal.toLocaleString()}`
        });

        // Mark as paid (ยกเว้น COD)
        if (paymentMethod !== 'cod') {
            markOrderAsPaid(newOrder.id, {
                method: PAYMENT_METHODS.find(p => p.id === paymentMethod)?.name,
                transactionId: `TXN-${Date.now()}`
            });
        }

        setCreatedOrder(newOrder);

        // ล้างตะกร้า
        clearCart();

        // ไปหน้า complete
        setPaymentStep(3);
        setProcessing(false);
    };

    // ============================================
    // Step 3: Order Complete
    // ============================================
    if (paymentStep === 3 && createdOrder) {
        return (
            <div className="checkout-page">
                <div className="checkout-page__container">
                    <div className="order-success">
                        <div className="order-success__icon">✅</div>
                        <h1 className="order-success__title">สั่งซื้อสำเร็จ!</h1>
                        <p className="order-success__message">
                            ขอบคุณสำหรับคำสั่งซื้อ เราจะจัดส่งสินค้าให้เร็วที่สุด
                        </p>

                        <div className="order-success__details">
                            <div className="order-success__order-id">
                                <span>หมายเลขคำสั่งซื้อ:</span>
                                <strong>{createdOrder.id}</strong>
                            </div>
                            <div className="order-success__info">
                                <div className="order-success__info-item">
                                    <span>💳 การชำระเงิน:</span>
                                    <span>{PAYMENT_METHODS.find(p => p.id === paymentMethod)?.name}</span>
                                </div>
                                <div className="order-success__info-item">
                                    <span>📦 สถานะ:</span>
                                    <span>{paymentMethod === 'cod' ? 'รอชำระเงินปลายทาง' : 'ชำระเงินแล้ว'}</span>
                                </div>
                                <div className="order-success__info-item">
                                    <span>💰 ยอดรวม:</span>
                                    <span className="order-success__total">{createdOrder.total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="order-success__items">
                            <h3>รายการสินค้า</h3>
                            {createdOrder.items.map((item, idx) => (
                                <div key={idx} className="order-success__item">
                                    <img src={item.image} alt={item.name} />
                                    <span>{item.name}</span>
                                    <span>x{item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-success__actions">
                            <Link to="/profile?tab=orders" className="order-success__btn order-success__btn--secondary">
                                ดูคำสั่งซื้อ
                            </Link>
                            <Link to="/" className="order-success__btn order-success__btn--primary">
                                กลับหน้าแรก
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-page__container">
                {/* Progress Steps */}
                <div className="checkout-steps">
                    <div className={`checkout-step ${paymentStep >= 1 ? 'checkout-step--active' : ''}`}>
                        <span className="checkout-step__number">1</span>
                        <span className="checkout-step__label">ข้อมูลจัดส่ง</span>
                    </div>
                    <div className="checkout-step__line"></div>
                    <div className={`checkout-step ${paymentStep >= 2 ? 'checkout-step--active' : ''}`}>
                        <span className="checkout-step__number">2</span>
                        <span className="checkout-step__label">ชำระเงิน</span>
                    </div>
                    <div className="checkout-step__line"></div>
                    <div className={`checkout-step ${paymentStep >= 3 ? 'checkout-step--active' : ''}`}>
                        <span className="checkout-step__number">3</span>
                        <span className="checkout-step__label">สำเร็จ</span>
                    </div>
                </div>

                {/* Header */}
                <div className="checkout-page__header">
                    <Link to="/cart" className="checkout-page__back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        <span>กลับไปตะกร้า</span>
                    </Link>
                    <h1 className="checkout-page__title">
                        {paymentStep === 1 ? '📋 ข้อมูลการจัดส่ง' : '💳 ชำระเงิน'}
                    </h1>
                </div>

                {/* Step 1: Shipping Form */}
                {paymentStep === 1 && (
                    <form onSubmit={handleShippingSubmit} className="checkout-page__content">
                        <div className="checkout-form">
                            <h2 className="checkout-form__title">ข้อมูลการจัดส่ง</h2>

                            <div className="checkout-form__grid">
                                {/* Full Name */}
                                <div className="checkout-form__field checkout-form__field--full">
                                    <label htmlFor="fullName">ชื่อ-นามสกุล *</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="กรอกชื่อ-นามสกุล"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="checkout-form__field">
                                    <label htmlFor="email">อีเมล *</label>
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

                                {/* Phone */}
                                <div className="checkout-form__field">
                                    <label htmlFor="phone">เบอร์โทรศัพท์ *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="08X-XXX-XXXX"
                                        required
                                    />
                                </div>

                                {/* Address */}
                                <div className="checkout-form__field checkout-form__field--full">
                                    <label htmlFor="address">ที่อยู่จัดส่ง *</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล/แขวง, อำเภอ/เขต"
                                        rows={3}
                                        required
                                    />
                                </div>

                                {/* City */}
                                <div className="checkout-form__field">
                                    <label htmlFor="city">จังหวัด *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="จังหวัด"
                                        required
                                    />
                                </div>

                                {/* Postal Code */}
                                <div className="checkout-form__field">
                                    <label htmlFor="postalCode">รหัสไปรษณีย์ *</label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        placeholder="XXXXX"
                                        required
                                    />
                                </div>

                                {/* Note */}
                                <div className="checkout-form__field checkout-form__field--full">
                                    <label htmlFor="note">หมายเหตุ (ถ้ามี)</label>
                                    <textarea
                                        id="note"
                                        name="note"
                                        value={formData.note}
                                        onChange={handleChange}
                                        placeholder="หมายเหตุเพิ่มเติมสำหรับการจัดส่ง"
                                        rows={2}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="checkout-form__next-btn">
                                ไปขั้นตอนถัดไป
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className="checkout-summary">
                            <h2 className="checkout-summary__title">สรุปคำสั่งซื้อ</h2>

                            <div className="checkout-summary__items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="checkout-summary__item">
                                        <img src={item.image} alt={item.name} />
                                        <div className="checkout-summary__item-info">
                                            <span className="checkout-summary__item-name">{item.name}</span>
                                            <span className="checkout-summary__item-qty">x{item.quantity}</span>
                                        </div>
                                        <span className="checkout-summary__item-price">
                                            ฿{(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="checkout-summary__divider"></div>

                            <div className="checkout-summary__row">
                                <span>ราคาสินค้า</span>
                                <span>฿{summary.subtotal.toLocaleString()}</span>
                            </div>

                            <div className="checkout-summary__row">
                                <span>ค่าจัดส่ง</span>
                                <span>
                                    {summary.shipping === 0
                                        ? <span className="checkout-summary__free">ฟรี!</span>
                                        : `฿${summary.shipping.toLocaleString()}`
                                    }
                                </span>
                            </div>

                            <div className="checkout-summary__row">
                                <span>ภาษี (7%)</span>
                                <span>฿{summary.tax.toLocaleString()}</span>
                            </div>

                            <div className="checkout-summary__divider"></div>

                            <div className="checkout-summary__row checkout-summary__row--total">
                                <span>ยอดรวมทั้งหมด</span>
                                <span>฿{summary.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </form>
                )}

                {/* Step 2: Payment */}
                {paymentStep === 2 && (
                    <form onSubmit={handlePaymentSubmit} className="checkout-page__content">
                        <div className="checkout-form">
                            <div className="checkout-form__back-btn" onClick={() => setPaymentStep(1)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                กลับไปแก้ไขข้อมูล
                            </div>

                            <h2 className="checkout-form__title">เลือกวิธีการชำระเงิน</h2>

                            <div className="checkout-form__payment-methods">
                                {PAYMENT_METHODS.map(method => (
                                    <label
                                        key={method.id}
                                        className={`checkout-form__payment ${paymentMethod === method.id ? 'checkout-form__payment--active' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method.id}
                                            checked={paymentMethod === method.id}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span className="checkout-form__payment-icon">{method.icon}</span>
                                        <div className="checkout-form__payment-info">
                                            <span className="checkout-form__payment-name">{method.name}</span>
                                            <span className="checkout-form__payment-desc">{method.description}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Credit Card Form (Mockup) */}
                            {paymentMethod === 'credit' && (
                                <div className="checkout-form__card">
                                    <h3>ข้อมูลบัตร</h3>
                                    <div className="checkout-form__grid">
                                        <div className="checkout-form__field checkout-form__field--full">
                                            <label>หมายเลขบัตร</label>
                                            <input
                                                type="text"
                                                name="number"
                                                value={cardData.number}
                                                onChange={handleCardChange}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                required
                                            />
                                        </div>
                                        <div className="checkout-form__field checkout-form__field--full">
                                            <label>ชื่อบนบัตร</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={cardData.name}
                                                onChange={handleCardChange}
                                                placeholder="JOHN DOE"
                                                required
                                            />
                                        </div>
                                        <div className="checkout-form__field">
                                            <label>วันหมดอายุ</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                value={cardData.expiry}
                                                onChange={handleCardChange}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                required
                                            />
                                        </div>
                                        <div className="checkout-form__field">
                                            <label>CVV</label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={cardData.cvv}
                                                onChange={handleCardChange}
                                                placeholder="123"
                                                maxLength={3}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <p className="checkout-form__card-note">
                                        🔒 ข้อมูลของคุณปลอดภัยด้วยการเข้ารหัส SSL
                                    </p>
                                </div>
                            )}

                            {/* Bank Transfer Info */}
                            {paymentMethod === 'bank' && (
                                <div className="checkout-form__bank">
                                    <h3>ข้อมูลการโอนเงิน</h3>
                                    <div className="checkout-form__bank-details">
                                        <p><strong>ธนาคาร:</strong> กสิกรไทย</p>
                                        <p><strong>ชื่อบัญชี:</strong> บริษัท เทคเวิร์ส จำกัด</p>
                                        <p><strong>เลขบัญชี:</strong> 123-4-56789-0</p>
                                    </div>
                                    <p className="checkout-form__bank-note">
                                        กรุณาโอนเงินภายใน 24 ชั่วโมง และแนบหลักฐานการโอน
                                    </p>
                                </div>
                            )}

                            {/* PromptPay QR */}
                            {paymentMethod === 'promptpay' && (
                                <div className="checkout-form__promptpay">
                                    <h3>PromptPay QR Code</h3>
                                    <div className="checkout-form__qr">
                                        <div className="checkout-form__qr-placeholder">
                                            📱 QR Code จะแสดงหลังยืนยันคำสั่งซื้อ
                                        </div>
                                    </div>
                                    <p className="checkout-form__promptpay-note">
                                        สแกน QR ผ่านแอปธนาคารของคุณ
                                    </p>
                                </div>
                            )}

                            {/* COD Note */}
                            {paymentMethod === 'cod' && (
                                <div className="checkout-form__cod">
                                    <h3>เก็บเงินปลายทาง</h3>
                                    <p>ชำระเงินเมื่อได้รับสินค้า</p>
                                    <p className="checkout-form__cod-fee">
                                        ⚠️ มีค่าบริการเพิ่มเติม ฿50
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="checkout-summary">
                            <h2 className="checkout-summary__title">สรุปคำสั่งซื้อ</h2>

                            <div className="checkout-summary__items checkout-summary__items--compact">
                                {cartItems.map(item => (
                                    <div key={item.id} className="checkout-summary__item">
                                        <img src={item.image} alt={item.name} />
                                        <div className="checkout-summary__item-info">
                                            <span className="checkout-summary__item-name">{item.name}</span>
                                            <span className="checkout-summary__item-qty">x{item.quantity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="checkout-summary__divider"></div>

                            <div className="checkout-summary__row">
                                <span>ราคาสินค้า</span>
                                <span>฿{summary.subtotal.toLocaleString()}</span>
                            </div>

                            <div className="checkout-summary__row">
                                <span>ค่าจัดส่ง</span>
                                <span>
                                    {summary.shipping === 0
                                        ? <span className="checkout-summary__free">ฟรี!</span>
                                        : `฿${summary.shipping.toLocaleString()}`
                                    }
                                </span>
                            </div>

                            <div className="checkout-summary__row">
                                <span>ภาษี (7%)</span>
                                <span>฿{summary.tax.toLocaleString()}</span>
                            </div>

                            {codFee > 0 && (
                                <div className="checkout-summary__row">
                                    <span>ค่าบริการ COD</span>
                                    <span>฿{codFee.toLocaleString()}</span>
                                </div>
                            )}

                            <div className="checkout-summary__divider"></div>

                            <div className="checkout-summary__row checkout-summary__row--total">
                                <span>ยอดรวมทั้งหมด</span>
                                <span>฿{finalTotal.toLocaleString()}</span>
                            </div>

                            <button
                                type="submit"
                                className="checkout-summary__submit"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <span className="checkout-summary__spinner"></span>
                                        <span>กำลังดำเนินการ...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>ยืนยันชำระเงิน</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Checkout;
