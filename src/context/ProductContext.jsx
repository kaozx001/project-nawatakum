/**
 * ============================================
 * 📦 Product Context - จัดการสินค้าและหมวดหมู่
 * ============================================
 * 
 * ฟังก์ชันหลัก:
 * - CRUD สินค้า (เพิ่ม, แก้ไข, ลบ)
 * - CRUD หมวดหมู่ (เพิ่ม, แก้ไข, ลบ)
 * - จัดเก็บใน localStorage
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { categories as initialCategories } from '../data/products';

const ProductContext = createContext();

/**
 * ============================================
 * 🎯 useProduct Hook
 * ============================================
 */
export function useProduct() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
}

/**
 * ============================================
 * 📦 Product Provider
 * ============================================
 */
export function ProductProvider({ children }) {
    // ============================================
    // 📊 State - Categories (รวม products อยู่ใน category)
    // ============================================
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('productCategories');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return initialCategories;
            }
        }
        return initialCategories;
    });

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('productCategories', JSON.stringify(categories));
    }, [categories]);

    // ============================================
    // 📊 Helper: Generate unique ID
    // ============================================
    const generateId = () => {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    };

    // ============================================
    // 📦 Get all products (flat list)
    // ============================================
    const getAllProducts = () => {
        return categories.flatMap(cat =>
            cat.items.map(item => ({
                ...item,
                categoryId: cat.id,
                categoryTitle: cat.title
            }))
        );
    };

    // ============================================
    // 📦 Get product by ID
    // ============================================
    const getProductById = (productId) => {
        for (const category of categories) {
            const product = category.items.find(item => item.id === productId);
            if (product) {
                return { ...product, categoryId: category.id, categoryTitle: category.title };
            }
        }
        return null;
    };

    // ============================================
    // 📦 Get products by category
    // ============================================
    const getProductsByCategory = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.items : [];
    };

    // ============================================
    // ➕ Add Product
    // ============================================
    const addProduct = (categoryId, productData) => {
        const newProduct = {
            id: parseInt(generateId()),
            ...productData,
            rating: productData.rating || 0,
            reviews: productData.reviews || 0,
            createdAt: new Date().toISOString()
        };

        setCategories(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    items: [...cat.items, newProduct]
                };
            }
            return cat;
        }));

        return newProduct;
    };

    // ============================================
    // ✏️ Update Product
    // ============================================
    const updateProduct = (productId, updates) => {
        setCategories(prev => prev.map(cat => ({
            ...cat,
            items: cat.items.map(item =>
                item.id === productId
                    ? { ...item, ...updates, updatedAt: new Date().toISOString() }
                    : item
            )
        })));
    };

    // ============================================
    // 🗑️ Delete Product
    // ============================================
    const deleteProduct = (productId) => {
        setCategories(prev => prev.map(cat => ({
            ...cat,
            items: cat.items.filter(item => item.id !== productId)
        })));
    };

    // ============================================
    // 🔄 Move Product to another category
    // ============================================
    const moveProduct = (productId, newCategoryId) => {
        let productToMove = null;

        // Find and remove from current category
        setCategories(prev => {
            const updated = prev.map(cat => {
                const product = cat.items.find(item => item.id === productId);
                if (product) {
                    productToMove = product;
                    return {
                        ...cat,
                        items: cat.items.filter(item => item.id !== productId)
                    };
                }
                return cat;
            });

            // Add to new category
            if (productToMove) {
                return updated.map(cat => {
                    if (cat.id === newCategoryId) {
                        return {
                            ...cat,
                            items: [...cat.items, productToMove]
                        };
                    }
                    return cat;
                });
            }

            return updated;
        });
    };

    // ============================================
    // 📁 Add Category
    // ============================================
    const addCategory = (categoryData) => {
        const newCategory = {
            id: generateId(),
            title: categoryData.title,
            type: categoryData.type || categoryData.title.toLowerCase().replace(/\s+/g, '-'),
            description: categoryData.description || '',
            items: [],
            createdAt: new Date().toISOString()
        };

        setCategories(prev => [...prev, newCategory]);
        return newCategory;
    };

    // ============================================
    // ✏️ Update Category
    // ============================================
    const updateCategory = (categoryId, updates) => {
        setCategories(prev => prev.map(cat =>
            cat.id === categoryId
                ? { ...cat, ...updates, updatedAt: new Date().toISOString() }
                : cat
        ));
    };

    // ============================================
    // 🗑️ Delete Category
    // ============================================
    const deleteCategory = (categoryId) => {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    };

    // ============================================
    // 📊 Get Category Stats
    // ============================================
    const getCategoryStats = () => {
        return categories.map(cat => ({
            id: cat.id,
            title: cat.title,
            type: cat.type,
            productCount: cat.items.length,
            totalValue: cat.items.reduce((sum, item) => {
                const price = parseFloat(item.price?.replace(/[^0-9.]/g, '') || 0);
                return sum + price;
            }, 0)
        }));
    };

    // ============================================
    // 🔄 Reset to default
    // ============================================
    const resetToDefault = () => {
        setCategories(initialCategories);
        localStorage.removeItem('productCategories');
    };

    const value = {
        // Data
        categories,

        // Product functions
        getAllProducts,
        getProductById,
        getProductsByCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        moveProduct,

        // Category functions
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryStats,

        // Utils
        resetToDefault
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

export default ProductContext;
