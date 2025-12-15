/**
 * ============================================
 * 📦 ProductDetail Page - หน้ารายละเอียดสินค้า
 * ============================================
 * 
 * แสดงข้อมูลสินค้าแบบละเอียด:
 * - รูปภาพ
 * - ชื่อ, ราคา, rating
 * - คำอธิบาย
 * - ปุ่มเพิ่มลงตะกร้า
 * - ระบบรีวิว (⭐ NEW)
 * - ระบบถาม-ตอบ Q&A (⭐ NEW)
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useReview } from '../context/ReviewContext';
import { categories } from '../data/products';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user, isLoggedIn } = useAuth();
    const {
        addReview,
        getProductReviews,
        getRatingStats,
        markHelpful,
        addQuestion,
        getProductQuestions,
        addAnswer
    } = useReview();

    // State
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    // Review State
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    // Q&A State
    const [questionText, setQuestionText] = useState('');
    const [answerTexts, setAnswerTexts] = useState({});

    /**
     * ============================================
     * 📝 ค้นหาสินค้าจาก ID
     * ============================================
     */
    useEffect(() => {
        let foundProduct = null;

        for (const category of categories) {
            const found = category.items.find(item => item.id === parseInt(id));
            if (found) {
                foundProduct = { ...found, category: category.title };
                break;
            }
        }

        if (foundProduct) {
            setProduct(foundProduct);
        } else {
            navigate('/');
        }
    }, [id, navigate]);

    // Get reviews and questions
    const reviews = product ? getProductReviews(product.id) : [];
    const ratingStats = product ? getRatingStats(product.id) : { stats: {}, total: 0, average: 0 };
    const questions = product ? getProductQuestions(product.id) : [];

    /**
     * ============================================
     * 🛒 เพิ่มลงตะกร้า
     * ============================================
     */
    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    /**
     * ============================================
     * 🛍️ ซื้อเลย
     * ============================================
     */
    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    /**
     * ============================================
     * ⭐ Submit Review
     * ============================================
     */
    const handleSubmitReview = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (!reviewComment.trim()) {
            alert('กรุณาเขียนความคิดเห็น');
            return;
        }

        setReviewSubmitting(true);

        addReview({
            productId: product.id,
            userId: user.id,
            userName: user.name,
            rating: reviewRating,
            comment: reviewComment
        });

        setReviewComment('');
        setReviewRating(5);
        setReviewSubmitting(false);
    };

    /**
     * ============================================
     * ❓ Submit Question
     * ============================================
     */
    const handleSubmitQuestion = () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (!questionText.trim()) {
            alert('กรุณาเขียนคำถาม');
            return;
        }

        addQuestion({
            productId: product.id,
            userId: user.id,
            userName: user.name,
            question: questionText
        });

        setQuestionText('');
    };

    /**
     * ============================================
     * 💬 Submit Answer
     * ============================================
     */
    const handleSubmitAnswer = (questionId) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const answerText = answerTexts[questionId];
        if (!answerText?.trim()) return;

        addAnswer(questionId, {
            userId: user.id,
            userName: user.name,
            isAdmin: user.role === 'admin',
            answer: answerText
        });

        setAnswerTexts(prev => ({ ...prev, [questionId]: '' }));
    };

    /**
     * ============================================
     * ⭐ แสดงดาว Rating
     * ============================================
     */
    const renderStars = (rating, interactive = false, onSelect = null) => {
        const stars = [];
        const fullStars = Math.floor(rating);

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= fullStars ? 'star--filled' : ''} ${interactive ? 'star--interactive' : ''}`}
                    onClick={interactive && onSelect ? () => onSelect(i) : undefined}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    if (!product) {
        return (
            <div className="product-detail__loading">
                <div className="product-detail__spinner"></div>
                <p>กำลังโหลด...</p>
            </div>
        );
    }

    return (
        <div className="product-detail">
            <div className="product-detail__container">
                {/* Breadcrumb */}
                <nav className="product-detail__breadcrumb">
                    <Link to="/">หน้าแรก</Link>
                    <span>/</span>
                    <span>{product.category}</span>
                    <span>/</span>
                    <span>{product.name}</span>
                </nav>

                <div className="product-detail__content">
                    {/* Image Section */}
                    <div className="product-detail__gallery">
                        <div className="product-detail__main-image">
                            {product.badge && (
                                <span className={`product-detail__badge product-detail__badge--${product.badge.toLowerCase()}`}>
                                    {product.badge}
                                </span>
                            )}
                            <img src={product.image} alt={product.name} />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="product-detail__info">
                        <h1 className="product-detail__name">{product.name}</h1>

                        {/* Rating */}
                        {product.rating && (
                            <div className="product-detail__rating">
                                <div className="product-detail__stars">
                                    {renderStars(ratingStats.average > 0 ? parseFloat(ratingStats.average) : product.rating)}
                                </div>
                                <span className="product-detail__rating-value">
                                    {ratingStats.average > 0 ? ratingStats.average : product.rating}
                                </span>
                                <span className="product-detail__reviews">
                                    ({ratingStats.total > 0 ? ratingStats.total : product.reviews?.toLocaleString()} รีวิว)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="product-detail__price-section">
                            <span className="product-detail__price">{product.price}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="product-detail__original-price">{product.originalPrice}</span>
                                    <span className="product-detail__discount">
                                        ลดราคา {Math.round((1 - parseFloat(product.price.replace(/[^0-9.]/g, '')) / parseFloat(product.originalPrice.replace(/[^0-9.]/g, ''))) * 100)}%
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <div className="product-detail__description">
                            <h3>รายละเอียดสินค้า</h3>
                            <p>
                                {product.description || 'สินค้าคุณภาพสูงจากแบรนด์ชั้นนำ พร้อมรับประกันคุณภาพและบริการหลังการขายที่เป็นเลิศ จัดส่งทั่วประเทศ'}
                            </p>
                        </div>

                        {/* Quantity */}
                        <div className="product-detail__quantity">
                            <label>จำนวน:</label>
                            <div className="product-detail__quantity-controls">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    −
                                </button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="product-detail__actions">
                            <button
                                onClick={handleAddToCart}
                                className={`product-detail__add-cart ${addedToCart ? 'product-detail__add-cart--added' : ''}`}
                            >
                                {addedToCart ? (
                                    <>
                                        <span>✓</span>
                                        <span>เพิ่มแล้ว!</span>
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                            <line x1="3" y1="6" x2="21" y2="6" />
                                            <path d="M16 10a4 4 0 01-8 0" />
                                        </svg>
                                        <span>เพิ่มลงตะกร้า</span>
                                    </>
                                )}
                            </button>

                            <button onClick={handleBuyNow} className="product-detail__buy-now">
                                ซื้อเลย
                            </button>
                        </div>

                        {/* Features */}
                        <div className="product-detail__features">
                            <div className="product-detail__feature">
                                <span>🚚</span>
                                <span>จัดส่งฟรี เมื่อซื้อครบ ฿1,500</span>
                            </div>
                            <div className="product-detail__feature">
                                <span>🔄</span>
                                <span>เปลี่ยนคืนได้ภายใน 30 วัน</span>
                            </div>
                            <div className="product-detail__feature">
                                <span>🛡️</span>
                                <span>รับประกันสินค้า 1 ปี</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ============================================
                    ⭐ TABS: Reviews & Q&A Section
                    ============================================ */}
                <div className="product-detail__tabs">
                    <div className="product-detail__tabs-header">
                        <button
                            className={`product-detail__tab ${activeTab === 'description' ? 'product-detail__tab--active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            📝 รายละเอียด
                        </button>
                        <button
                            className={`product-detail__tab ${activeTab === 'reviews' ? 'product-detail__tab--active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            ⭐ รีวิว ({reviews.length})
                        </button>
                        <button
                            className={`product-detail__tab ${activeTab === 'qa' ? 'product-detail__tab--active' : ''}`}
                            onClick={() => setActiveTab('qa')}
                        >
                            ❓ ถาม-ตอบ ({questions.length})
                        </button>
                    </div>

                    <div className="product-detail__tabs-content">
                        {/* Description Tab */}
                        {activeTab === 'description' && (
                            <div className="tab-content">
                                <h2>รายละเอียดสินค้า</h2>
                                <p className="tab-content__desc">
                                    {product.description || 'สินค้าคุณภาพสูงจากแบรนด์ชั้นนำ พร้อมรับประกันคุณภาพและบริการหลังการขายที่เป็นเลิศ จัดส่งทั่วประเทศ'}
                                </p>
                                <div className="tab-content__specs">
                                    <h3>คุณสมบัติเด่น</h3>
                                    <ul>
                                        <li>✅ สินค้าของแท้ 100%</li>
                                        <li>✅ รับประกันจากผู้ผลิต</li>
                                        <li>✅ จัดส่งรวดเร็วทั่วประเทศ</li>
                                        <li>✅ บริการหลังการขาย</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="tab-content">
                                {/* Review Summary */}
                                <div className="reviews-summary">
                                    <div className="reviews-summary__score">
                                        <span className="reviews-summary__number">
                                            {ratingStats.average > 0 ? ratingStats.average : product.rating}
                                        </span>
                                        <div className="reviews-summary__stars">
                                            {renderStars(ratingStats.average > 0 ? parseFloat(ratingStats.average) : product.rating)}
                                        </div>
                                        <span className="reviews-summary__count">
                                            จาก {ratingStats.total} รีวิว
                                        </span>
                                    </div>
                                    <div className="reviews-summary__breakdown">
                                        {[5, 4, 3, 2, 1].map(star => (
                                            <div key={star} className="reviews-summary__bar">
                                                <span>{star} ดาว</span>
                                                <div className="reviews-summary__bar-track">
                                                    <div
                                                        className="reviews-summary__bar-fill"
                                                        style={{
                                                            width: ratingStats.total > 0
                                                                ? `${(ratingStats.stats[star] || 0) / ratingStats.total * 100}%`
                                                                : '0%'
                                                        }}
                                                    ></div>
                                                </div>
                                                <span>{ratingStats.stats[star] || 0}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Write Review Form */}
                                <div className="review-form">
                                    <h3>เขียนรีวิว</h3>
                                    {isLoggedIn ? (
                                        <>
                                            <div className="review-form__rating">
                                                <label>ให้คะแนน:</label>
                                                <div className="review-form__stars">
                                                    {renderStars(reviewRating, true, setReviewRating)}
                                                </div>
                                            </div>
                                            <textarea
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                placeholder="แชร์ประสบการณ์การใช้งานสินค้านี้..."
                                                rows={4}
                                            />
                                            <button
                                                onClick={handleSubmitReview}
                                                disabled={reviewSubmitting}
                                            >
                                                {reviewSubmitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
                                            </button>
                                        </>
                                    ) : (
                                        <p className="review-form__login">
                                            กรุณา <Link to="/login">เข้าสู่ระบบ</Link> เพื่อเขียนรีวิว
                                        </p>
                                    )}
                                </div>

                                {/* Reviews List */}
                                <div className="reviews-list">
                                    {reviews.length > 0 ? (
                                        reviews.map((review) => (
                                            <div key={review.id} className="review-item">
                                                <div className="review-item__header">
                                                    <div className="review-item__user">
                                                        <span className="review-item__avatar">
                                                            {review.userName?.charAt(0) || 'U'}
                                                        </span>
                                                        <div>
                                                            <span className="review-item__name">{review.userName}</span>
                                                            <span className="review-item__date">
                                                                {new Date(review.createdAt).toLocaleDateString('th-TH')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="review-item__rating">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </div>
                                                <p className="review-item__comment">{review.comment}</p>
                                                <button
                                                    className="review-item__helpful"
                                                    onClick={() => markHelpful(review.id)}
                                                >
                                                    👍 มีประโยชน์ ({review.helpful})
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="reviews-empty">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวสินค้านี้!</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Q&A Tab */}
                        {activeTab === 'qa' && (
                            <div className="tab-content">
                                {/* Ask Question Form */}
                                <div className="qa-form">
                                    <h3>ถามคำถาม</h3>
                                    {isLoggedIn ? (
                                        <>
                                            <textarea
                                                value={questionText}
                                                onChange={(e) => setQuestionText(e.target.value)}
                                                placeholder="มีคำถามเกี่ยวกับสินค้านี้? ถามได้เลย!"
                                                rows={3}
                                            />
                                            <button onClick={handleSubmitQuestion}>
                                                ส่งคำถาม
                                            </button>
                                        </>
                                    ) : (
                                        <p className="qa-form__login">
                                            กรุณา <Link to="/login">เข้าสู่ระบบ</Link> เพื่อถามคำถาม
                                        </p>
                                    )}
                                </div>

                                {/* Questions List */}
                                <div className="qa-list">
                                    {questions.length > 0 ? (
                                        questions.map((q) => (
                                            <div key={q.id} className="qa-item">
                                                <div className="qa-item__question">
                                                    <span className="qa-item__icon">❓</span>
                                                    <div className="qa-item__content">
                                                        <p className="qa-item__text">{q.question}</p>
                                                        <span className="qa-item__meta">
                                                            โดย {q.userName} • {new Date(q.createdAt).toLocaleDateString('th-TH')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Answers */}
                                                {q.answers?.map((ans) => (
                                                    <div key={ans.id} className="qa-item__answer">
                                                        <span className="qa-item__icon qa-item__icon--answer">
                                                            {ans.isAdmin ? '👑' : '💬'}
                                                        </span>
                                                        <div className="qa-item__content">
                                                            <p className="qa-item__text">{ans.answer}</p>
                                                            <span className="qa-item__meta">
                                                                {ans.isAdmin ? '(ทีมงาน) ' : ''}{ans.userName} • {new Date(ans.createdAt).toLocaleDateString('th-TH')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Answer Form (for logged in users) */}
                                                {isLoggedIn && (
                                                    <div className="qa-item__reply">
                                                        <input
                                                            type="text"
                                                            value={answerTexts[q.id] || ''}
                                                            onChange={(e) => setAnswerTexts(prev => ({
                                                                ...prev,
                                                                [q.id]: e.target.value
                                                            }))}
                                                            placeholder="ตอบคำถามนี้..."
                                                        />
                                                        <button onClick={() => handleSubmitAnswer(q.id)}>
                                                            ตอบ
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="qa-empty">ยังไม่มีคำถาม เป็นคนแรกที่ถามได้เลย!</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
