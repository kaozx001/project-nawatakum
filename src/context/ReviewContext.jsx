/**
 * ============================================
 * ⭐ Review Context - ระบบรีวิวสินค้า
 * ============================================
 * 
 * ฟังก์ชัน:
 * - เพิ่มรีวิวใหม่
 * - ดึงรีวิวของสินค้า
 * - คำนวณ average rating
 * - เก็บข้อมูลใน localStorage
 * 
 * รีวิว:
 * - rating: 1-5 ดาว
 * - comment: ข้อความรีวิว
 * - userName: ชื่อผู้รีวิว
 * - createdAt: วันที่รีวิว
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================
// 📝 สร้าง Context
// ============================================
const ReviewContext = createContext();

/**
 * ============================================
 * 🎣 useReview Hook
 * ============================================
 */
export function useReview() {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReview must be used within a ReviewProvider');
    }
    return context;
}

/**
 * ============================================
 * 🏪 ReviewProvider Component
 * ============================================
 */
export function ReviewProvider({ children }) {
    // ============================================
    // State - Reviews
    // ============================================
    const [reviews, setReviews] = useState(() => {
        try {
            const saved = localStorage.getItem('techverse_reviews');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // ============================================
    // State - Q&A
    // ============================================
    const [questions, setQuestions] = useState(() => {
        try {
            const saved = localStorage.getItem('techverse_questions');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // ============================================
    // 💾 บันทึกลง localStorage
    // ============================================
    useEffect(() => {
        localStorage.setItem('techverse_reviews', JSON.stringify(reviews));
    }, [reviews]);

    useEffect(() => {
        localStorage.setItem('techverse_questions', JSON.stringify(questions));
    }, [questions]);

    /**
     * ============================================
     * ⭐ เพิ่มรีวิวใหม่
     * ============================================
     * @param {Object} reviewData - ข้อมูลรีวิว
     */
    const addReview = (reviewData) => {
        const newReview = {
            id: `REV-${Date.now()}`,
            ...reviewData,
            createdAt: new Date().toISOString(),
            helpful: 0, // จำนวนคนที่กด like
            verified: false // ซื้อจริงหรือไม่
        };

        setReviews(prev => [newReview, ...prev]);
        return newReview;
    };

    /**
     * ============================================
     * 📋 ดึงรีวิวของสินค้า
     * ============================================
     * @param {number|string} productId - ID ของสินค้า
     */
    const getProductReviews = (productId) => {
        return reviews.filter(review =>
            String(review.productId) === String(productId)
        );
    };

    /**
     * ============================================
     * 📊 คำนวณ Average Rating
     * ============================================
     * @param {number|string} productId - ID ของสินค้า
     */
    const getAverageRating = (productId) => {
        const productReviews = getProductReviews(productId);
        if (productReviews.length === 0) return 0;

        const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
        return (total / productReviews.length).toFixed(1);
    };

    /**
     * ============================================
     * 📊 ดึงสถิติ Rating
     * ============================================
     */
    const getRatingStats = (productId) => {
        const productReviews = getProductReviews(productId);
        const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        productReviews.forEach(review => {
            stats[review.rating] = (stats[review.rating] || 0) + 1;
        });

        return {
            stats,
            total: productReviews.length,
            average: getAverageRating(productId)
        };
    };

    /**
     * ============================================
     * 👍 Mark Review as Helpful
     * ============================================
     */
    const markHelpful = (reviewId) => {
        setReviews(prev => prev.map(review => {
            if (review.id === reviewId) {
                return { ...review, helpful: review.helpful + 1 };
            }
            return review;
        }));
    };

    /**
     * ============================================
     * ❓ เพิ่มคำถาม (Q&A)
     * ============================================
     */
    const addQuestion = (questionData) => {
        const newQuestion = {
            id: `QA-${Date.now()}`,
            ...questionData,
            createdAt: new Date().toISOString(),
            answers: []
        };

        setQuestions(prev => [newQuestion, ...prev]);
        return newQuestion;
    };

    /**
     * ============================================
     * 📋 ดึงคำถามของสินค้า
     * ============================================
     */
    const getProductQuestions = (productId) => {
        return questions.filter(q =>
            String(q.productId) === String(productId)
        );
    };

    /**
     * ============================================
     * 💬 ตอบคำถาม
     * ============================================
     */
    const addAnswer = (questionId, answerData) => {
        setQuestions(prev => prev.map(question => {
            if (question.id === questionId) {
                return {
                    ...question,
                    answers: [
                        ...question.answers,
                        {
                            id: `ANS-${Date.now()}`,
                            ...answerData,
                            createdAt: new Date().toISOString()
                        }
                    ]
                };
            }
            return question;
        }));
    };

    // ============================================
    // 📤 Context Value
    // ============================================
    const value = {
        // Reviews
        reviews,
        addReview,
        getProductReviews,
        getAverageRating,
        getRatingStats,
        markHelpful,

        // Q&A
        questions,
        addQuestion,
        getProductQuestions,
        addAnswer
    };

    return (
        <ReviewContext.Provider value={value}>
            {children}
        </ReviewContext.Provider>
    );
}

export default ReviewContext;
