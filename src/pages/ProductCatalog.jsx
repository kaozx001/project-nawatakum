import React, { useState, useMemo } from 'react';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './ProductCatalog.css';

function ProductCatalog() {
    const { categories } = useProduct();
    const { addToCart } = useCart();

    // Filters
    const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [sortBy, setSortBy] = useState('default');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Combine all products from all categories
    const allProducts = useMemo(() => {
        return categories.flatMap(cat => cat.items || []);
    }, [categories]);

    // Extract unique brands (mock logic for now as brand isn't always in item data, using logic from name)
    const availableBrands = useMemo(() => {
        const brands = new Set();
        allProducts.forEach(p => {
            const name = p.name.toUpperCase();
            if (name.includes('ASUS') || name.includes('ROG')) brands.add('ASUS');
            else if (name.includes('MSI')) brands.add('MSI');
            else if (name.includes('RAZER')) brands.add('RAZER');
            else if (name.includes('LOGITECH')) brands.add('LOGITECH');
            else if (name.includes('NVIDIA')) brands.add('NVIDIA');
            else if (name.includes('AMD')) brands.add('AMD');
            else if (name.includes('KEYCHRON')) brands.add('KEYCHRON');
            else if (name.includes('SAMSUNG')) brands.add('SAMSUNG');
            else if (name.includes('LG')) brands.add('LG');
            else if (name.includes('APPLE')) brands.add('APPLE');
            else if (name.includes('SONY')) brands.add('SONY');
            else brands.add('OTHER');
        });
        return Array.from(brands).sort();
    }, [allProducts]);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            const price = parseInt(product.price.replace(/[^\d]/g, ''));
            const matchesPrice = price >= priceRange.min && price <= priceRange.max;

            let matchesBrand = true;
            if (selectedBrands.length > 0) {
                const name = product.name.toUpperCase();
                matchesBrand = selectedBrands.some(brand => name.includes(brand));
            }

            return matchesPrice && matchesBrand;
        });
    }, [allProducts, priceRange, selectedBrands]);

    // Sort Logic
    const sortedProducts = useMemo(() => {
        const products = [...filteredProducts];
        if (sortBy === 'price-low') {
            products.sort((a, b) => parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, '')));
        } else if (sortBy === 'price-high') {
            products.sort((a, b) => parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, '')));
        } else if (sortBy === 'rating') {
            products.sort((a, b) => b.rating - a.rating);
        }
        return products;
    }, [filteredProducts, sortBy]);

    const toggleBrand = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    return (
        <div className="catalog-page">
            <div className="catalog-container">
                {/* Sidebar Filter */}
                <aside className="catalog-sidebar">
                    <div className="filter-group">
                        <h3 className="filter-title">ช่วงราคา</h3>
                        <div className="price-inputs">
                            <input
                                type="number"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                className="price-input"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                className="price-input"
                            />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="200000"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                            className="price-slider"
                        />
                    </div>

                    <div className="filter-group">
                        <h3 className="filter-title">แบรนด์</h3>
                        <div className="brand-list">
                            {availableBrands.map(brand => (
                                <label key={brand} className="brand-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => toggleBrand(brand)}
                                    />
                                    <span>{brand}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="catalog-main">
                    <div className="catalog-header">
                        <h1>สินค้าทั้งหมด ({sortedProducts.length})</h1>
                        <div className="catalog-controls">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                                <option value="default">แนะนำ</option>
                                <option value="price-low">ราคา: ต่ำ - สูง</option>
                                <option value="price-high">ราคา: สูง - ต่ำ</option>
                                <option value="rating">คะแนนรีวิว</option>
                            </select>
                            <div className="view-toggle">
                                <button
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    ⊞
                                </button>
                                <button
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    ☰
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                        {sortedProducts.map(product => (
                            <Link to={`/product/${product.id}`} key={product.id} className="catalog-card">
                                <img src={product.image} alt={product.name} className="catalog-card__img" />
                                <div className="catalog-card__info">
                                    {product.badge && <span className="catalog-card__badge">{product.badge}</span>}
                                    <h3 className="catalog-card__title">{product.name}</h3>
                                    <div className="catalog-card__rating">★ {product.rating} ({product.reviews})</div>
                                    <div className="catalog-card__price">{product.price}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ProductCatalog;
