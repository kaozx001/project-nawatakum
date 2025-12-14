/**
 * ============================================
 * 📁 Category Management - จัดการหมวดหมู่ (Full CRUD)
 * ============================================
 * 
 * ฟังก์ชัน:
 * - แสดงรายการหมวดหมู่
 * - เพิ่มหมวดหมู่ใหม่
 * - แก้ไขหมวดหมู่
 * - ลบหมวดหมู่
 */

import React, { useState } from 'react';
import { useProduct } from '../context/ProductContext';

function CategoryManagement() {
    const {
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        resetToDefault
    } = useProduct();

    // State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        description: ''
    });

    /**
     * ============================================
     * 📝 Handle Form Change
     * ============================================
     */
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto generate type from title
        if (name === 'title') {
            const autoType = value
                .toLowerCase()
                .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s]/g, '')
                .replace(/\s+/g, '-');
            setFormData(prev => ({ ...prev, type: autoType }));
        }
    };

    /**
     * ============================================
     * ➕ Open Add Modal
     * ============================================
     */
    const openAddModal = () => {
        setEditingCategory(null);
        setFormData({
            title: '',
            type: '',
            description: ''
        });
        setIsModalOpen(true);
    };

    /**
     * ============================================
     * ✏️ Open Edit Modal
     * ============================================
     */
    const openEditModal = (category) => {
        setEditingCategory(category);
        setFormData({
            title: category.title || '',
            type: category.type || '',
            description: category.description || ''
        });
        setIsModalOpen(true);
    };

    /**
     * ============================================
     * 💾 Save Category (Add or Update)
     * ============================================
     */
    const handleSave = () => {
        if (!formData.title.trim()) {
            alert('กรุณากรอกชื่อหมวดหมู่');
            return;
        }

        const categoryData = {
            title: formData.title.trim(),
            type: formData.type.trim() || formData.title.toLowerCase().replace(/\s+/g, '-'),
            description: formData.description.trim()
        };

        if (editingCategory) {
            // Update existing category
            updateCategory(editingCategory.id, categoryData);
        } else {
            // Add new category
            addCategory(categoryData);
        }

        setIsModalOpen(false);
        setEditingCategory(null);
    };

    /**
     * ============================================
     * 🗑️ Delete Category
     * ============================================
     */
    const handleDelete = (categoryId) => {
        deleteCategory(categoryId);
        setDeleteConfirm(null);
    };

    /**
     * ============================================
     * 🔄 Reset to Default
     * ============================================
     */
    const handleReset = () => {
        if (confirm('คุณต้องการรีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้นหรือไม่?\nสินค้าและหมวดหมู่ที่เพิ่มใหม่จะหายไป')) {
            resetToDefault();
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>📁 จัดการหมวดหมู่</h1>
                <div className="admin-page-header__actions">
                    <button
                        className="admin-btn admin-btn--outline"
                        onClick={handleReset}
                    >
                        🔄 รีเซ็ตข้อมูล
                    </button>
                    <button
                        className="admin-btn admin-btn--primary"
                        onClick={openAddModal}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        เพิ่มหมวดหมู่ใหม่
                    </button>
                </div>
            </div>

            {/* Category Grid */}
            <div className="admin-category-grid">
                {categories.map((category) => (
                    <div key={category.id} className="admin-category-card">
                        <div className="admin-category-card__header">
                            <h3>{category.title}</h3>
                            <span className="admin-category-card__count">
                                {category.items?.length || 0} สินค้า
                            </span>
                        </div>

                        {category.description && (
                            <p className="admin-category-card__desc">
                                {category.description}
                            </p>
                        )}

                        <div className="admin-category-card__type">
                            <span>Type: </span>
                            <code>{category.type}</code>
                        </div>

                        <div className="admin-category-card__products">
                            {category.items?.slice(0, 4).map(item => (
                                <img
                                    key={item.id}
                                    src={item.image}
                                    alt={item.name}
                                    title={item.name}
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
                                    }}
                                />
                            ))}
                            {(category.items?.length || 0) > 4 && (
                                <span className="admin-category-card__more">
                                    +{category.items.length - 4}
                                </span>
                            )}
                            {(!category.items || category.items.length === 0) && (
                                <span className="admin-category-card__empty">
                                    ยังไม่มีสินค้า
                                </span>
                            )}
                        </div>

                        <div className="admin-category-card__actions">
                            <button
                                className="admin-btn admin-btn--small admin-btn--outline"
                                onClick={() => openEditModal(category)}
                            >
                                ✏️ แก้ไข
                            </button>
                            <button
                                className="admin-btn admin-btn--small admin-btn--outline admin-btn--danger"
                                onClick={() => setDeleteConfirm(category)}
                            >
                                🗑️ ลบ
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Category Card */}
                <div
                    className="admin-category-card admin-category-card--add"
                    onClick={openAddModal}
                >
                    <div className="admin-category-card__add-icon">➕</div>
                    <span>เพิ่มหมวดหมู่ใหม่</span>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="admin-modal admin-modal--small" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <h2>{editingCategory ? '✏️ แก้ไขหมวดหมู่' : '➕ เพิ่มหมวดหมู่ใหม่'}</h2>
                            <button className="admin-modal__close" onClick={() => setIsModalOpen(false)}>
                                ✕
                            </button>
                        </div>

                        <div className="admin-modal__body">
                            <div className="admin-form__grid">
                                <div className="admin-form__field admin-form__field--full">
                                    <label>ชื่อหมวดหมู่ *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleFormChange}
                                        placeholder="เช่น 🎧 หูฟังไร้สาย"
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-form__field admin-form__field--full">
                                    <label>Type (สำหรับ URL)</label>
                                    <input
                                        type="text"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleFormChange}
                                        placeholder="headphones"
                                        className="admin-input"
                                    />
                                    <small>จะถูกใช้ใน URL เช่น /category/headphones</small>
                                </div>

                                <div className="admin-form__field admin-form__field--full">
                                    <label>คำอธิบาย</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        placeholder="คำอธิบายหมวดหมู่..."
                                        rows={3}
                                        className="admin-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="admin-modal__footer">
                            <button
                                className="admin-btn admin-btn--outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="admin-btn admin-btn--primary"
                                onClick={handleSave}
                            >
                                {editingCategory ? 'บันทึกการแก้ไข' : 'เพิ่มหมวดหมู่'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="admin-modal admin-modal--small" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <h2>🗑️ ยืนยันการลบ</h2>
                        </div>

                        <div className="admin-modal__body">
                            <p>คุณต้องการลบหมวดหมู่ <strong>"{deleteConfirm.title}"</strong> ใช่หรือไม่?</p>
                            {deleteConfirm.items?.length > 0 && (
                                <p className="admin-modal__warning">
                                    ⚠️ หมวดหมู่นี้มี {deleteConfirm.items.length} สินค้า สินค้าทั้งหมดจะถูกลบไปด้วย!
                                </p>
                            )}
                        </div>

                        <div className="admin-modal__footer">
                            <button
                                className="admin-btn admin-btn--outline"
                                onClick={() => setDeleteConfirm(null)}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="admin-btn admin-btn--danger"
                                onClick={() => handleDelete(deleteConfirm.id)}
                            >
                                ลบหมวดหมู่
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryManagement;
