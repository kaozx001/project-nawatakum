/**
 * ============================================
 * 📦 Product Management - จัดการสินค้า (Full CRUD)
 * ============================================
 * 
 * ฟังก์ชัน:
 * - แสดงรายการสินค้าทั้งหมด
 * - เพิ่มสินค้าใหม่
 * - แก้ไขสินค้า
 * - ลบสินค้า
 * - เปลี่ยนหมวดหมู่
 */

import React, { useState } from 'react';
import { useProduct } from '../context/ProductContext';

function ProductManagement() {
    const {
        categories,
        getAllProducts,
        addProduct,
        updateProduct,
        deleteProduct
    } = useProduct();

    // State
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        price: '',
        originalPrice: '',
        description: '',
        badge: '',
        categoryId: ''
    });

    // Image file ref for upload
    const fileInputRef = React.useRef(null);

    // Get all products
    const allProducts = getAllProducts();

    // กรองสินค้า
    const filteredProducts = allProducts.filter(product => {
        const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
        return matchSearch && matchCategory;
    });

    /**
     * ============================================
     * 📝 Handle Form Change
     * ============================================
     */
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * ============================================
     * 🖼️ Handle Image Upload - อัปโหลดไฟล์รูปภาพ
     * ============================================
     */
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // ตรวจสอบขนาดไฟล์ (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('ไฟล์ใหญ่เกินไป! กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB');
                return;
            }

            // ตรวจสอบประเภทไฟล์
            if (!file.type.startsWith('image/')) {
                alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    /**
     * ============================================
     * ➕ Open Add Modal
     * ============================================
     */
    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            image: '',
            price: '',
            originalPrice: '',
            description: '',
            badge: '',
            categoryId: categories[0]?.id || ''
        });
        setIsModalOpen(true);
    };

    /**
     * ============================================
     * ✏️ Open Edit Modal
     * ============================================
     */
    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            image: product.image || '',
            price: product.price || '',
            originalPrice: product.originalPrice || '',
            description: product.description || '',
            badge: product.badge || '',
            categoryId: product.categoryId || ''
        });
        setIsModalOpen(true);
    };

    /**
     * ============================================
     * 💾 Save Product (Add or Update)
     * ============================================
     */
    const handleSave = () => {
        if (!formData.name.trim()) {
            alert('กรุณากรอกชื่อสินค้า');
            return;
        }
        if (!formData.price.trim()) {
            alert('กรุณากรอกราคา');
            return;
        }
        if (!formData.categoryId) {
            alert('กรุณาเลือกหมวดหมู่');
            return;
        }

        // Format price
        const formattedPrice = formData.price.startsWith('฿')
            ? formData.price
            : `฿${formData.price}`;
        const formattedOriginalPrice = formData.originalPrice
            ? (formData.originalPrice.startsWith('฿') ? formData.originalPrice : `฿${formData.originalPrice}`)
            : '';

        const productData = {
            name: formData.name.trim(),
            image: formData.image.trim() || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
            price: formattedPrice,
            originalPrice: formattedOriginalPrice || null,
            description: formData.description.trim(),
            badge: formData.badge || null
        };

        if (editingProduct) {
            // Update existing product
            updateProduct(editingProduct.id, productData);
        } else {
            // Add new product
            addProduct(formData.categoryId, productData);
        }

        setIsModalOpen(false);
        setEditingProduct(null);
    };

    /**
     * ============================================
     * 🗑️ Delete Product
     * ============================================
     */
    const handleDelete = (productId) => {
        deleteProduct(productId);
        setDeleteConfirm(null);
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>📦 จัดการสินค้า</h1>
                <button className="admin-btn admin-btn--primary" onClick={openAddModal}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    เพิ่มสินค้าใหม่
                </button>
            </div>

            {/* Filters */}
            <div className="admin-filters">
                <div className="admin-filter">
                    <input
                        type="text"
                        placeholder="ค้นหาสินค้า..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="admin-input"
                    />
                </div>
                <div className="admin-filter">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="admin-select"
                    >
                        <option value="all">หมวดหมู่ทั้งหมด</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Product Table */}
            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>รูปภาพ</th>
                                <th>ชื่อสินค้า</th>
                                <th>หมวดหมู่</th>
                                <th>ราคา</th>
                                <th>Rating</th>
                                <th>การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="admin-table__image"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <div className="admin-table__product-name">
                                            {product.name}
                                            {product.badge && (
                                                <span className={`admin-badge admin-badge--${product.badge.toLowerCase()}`}>
                                                    {product.badge}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{product.categoryTitle}</td>
                                    <td className="admin-table__price">{product.price}</td>
                                    <td>
                                        <span className="admin-table__rating">
                                            ⭐ {product.rating || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-table__actions">
                                            <button
                                                className="admin-icon-btn admin-icon-btn--edit"
                                                title="แก้ไข"
                                                onClick={() => openEditModal(product)}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>
                                            <button
                                                className="admin-icon-btn admin-icon-btn--delete"
                                                title="ลบ"
                                                onClick={() => setDeleteConfirm(product)}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="admin-table-footer">
                    <span>แสดง {filteredProducts.length} จาก {allProducts.length} รายการ</span>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <h2>{editingProduct ? '✏️ แก้ไขสินค้า' : '➕ เพิ่มสินค้าใหม่'}</h2>
                            <button className="admin-modal__close" onClick={() => setIsModalOpen(false)}>
                                ✕
                            </button>
                        </div>

                        <div className="admin-modal__body">
                            {/* Preview Image */}
                            <div className="admin-form__preview">
                                <img
                                    src={formData.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'}
                                    alt="Preview"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
                                    }}
                                />
                            </div>

                            <div className="admin-form__grid">
                                <div className="admin-form__field admin-form__field--full">
                                    <label>ชื่อสินค้า *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        placeholder="กรอกชื่อสินค้า"
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-form__field admin-form__field--full">
                                    <label>รูปภาพสินค้า</label>
                                    <div className="admin-image-upload">
                                        {/* File Upload Button */}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn--outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{ marginBottom: '8px', width: '100%' }}
                                        >
                                            📁 เลือกไฟล์รูปภาพ
                                        </button>
                                        <small style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                                            หรือใส่ URL รูปภาพด้านล่าง:
                                        </small>
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleFormChange}
                                            placeholder="https://example.com/image.jpg"
                                            className="admin-input"
                                        />
                                    </div>
                                </div>

                                <div className="admin-form__field">
                                    <label>ราคา (฿) *</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleFormChange}
                                        placeholder="฿1,990"
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-form__field">
                                    <label>ราคาเดิม (ถ้ามี)</label>
                                    <input
                                        type="text"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleFormChange}
                                        placeholder="฿2,490"
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-form__field">
                                    <label>หมวดหมู่ *</label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleFormChange}
                                        className="admin-select"
                                    >
                                        <option value="">เลือกหมวดหมู่</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="admin-form__field">
                                    <label>Badge</label>
                                    <select
                                        name="badge"
                                        value={formData.badge}
                                        onChange={handleFormChange}
                                        className="admin-select"
                                    >
                                        <option value="">ไม่มี Badge</option>
                                        <option value="HOT">🔥 HOT</option>
                                        <option value="NEW">✨ NEW</option>
                                        <option value="BESTSELLER">⭐ BESTSELLER</option>
                                    </select>
                                </div>

                                <div className="admin-form__field admin-form__field--full">
                                    <label>รายละเอียด</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        placeholder="รายละเอียดสินค้า..."
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
                                {editingProduct ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
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
                            <p>คุณต้องการลบสินค้า <strong>"{deleteConfirm.name}"</strong> ใช่หรือไม่?</p>
                            <p className="admin-modal__warning">⚠️ การกระทำนี้ไม่สามารถย้อนกลับได้</p>
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
                                ลบสินค้า
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductManagement;
