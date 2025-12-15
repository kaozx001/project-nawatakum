/**
 * ============================================
 * 🚀 Main App Entry - JAK TECH IT Store
 * ============================================
 * 
 * ไฟล์นี้เป็น entry point ของ React App
 * ประกอบด้วย:
 * - Router setup
 * - Context Providers (Auth, Cart, Order, Review, Product)
 * - Route definitions (User + Admin)
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ReviewProvider } from './context/ReviewContext';
import { ProductProvider, useProduct } from './context/ProductContext';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Row from './components/Row';
import FeaturedBrands from './components/FeaturedBrands';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

// User Pages
import Login from './pages/Login';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Category from './pages/Category';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Innovation from './pages/Innovation';
import Community from './pages/Community';
import Support from './pages/Support';
import InfoPage from './pages/InfoPage';

import ProductCatalog from './pages/ProductCatalog';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ProductManagement from './admin/ProductManagement';
import CategoryManagement from './admin/CategoryManagement';
import OrderManagement from './admin/OrderManagement';
import UserManagement from './admin/UserManagement';

// Note: categories now comes from ProductContext for dynamic updates

// Styles
import './App.css';

/**
 * ============================================
 * 🏠 Home Page Component
 * ============================================
 */
function HomePage() {
  const { categories } = useProduct();

  return (
    <>
      <Hero />
      <main className="main-content">
        {categories.map((category, index) => (
          <Row
            key={category.id}
            title={category.title}
            items={category.items}
            isLargeRow={index === 0}
          />
        ))}
      </main>
      <FeaturedBrands />
      <Newsletter />
    </>
  );
}

/**
 * ============================================
 * 🎯 Main App Component
 * ============================================
 */
function App() {
  return (
    <BrowserRouter>
      {/* Context Providers */}
      <ProductProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <ReviewProvider>
                <div className="app">
                  {/* Navbar แสดงทุกหน้า (ยกเว้น Admin) */}
                  <Routes>
                    {/* ============================================
                      Admin Routes - ไม่แสดง Navbar/Footer
                      ============================================ */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<ProductManagement />} />
                      <Route path="categories" element={<CategoryManagement />} />
                      <Route path="orders" element={<OrderManagement />} />
                      <Route path="users" element={<UserManagement />} />
                    </Route>

                    {/* ============================================
                      User Routes - แสดง Navbar/Footer
                      ============================================ */}
                    <Route path="*" element={
                      <>
                        <Navbar />
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/category/:type" element={<Category />} />
                          <Route path="/category/:type/:subtype" element={<Category />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/innovation" element={<Innovation />} />
                          <Route path="/community" element={<Community />} />
                          <Route path="/support" element={<Support />} />
                          {/* Content Pages */}
                          <Route path="/about" element={
                            <InfoPage
                              title="About JAK TECH"
                              subtitle="ร้านขายอุปกรณ์ IT ชั้นนำที่คุณไว้ใจได้"
                              icon="🏢"
                              content={
                                <div>
                                  <p>ก่อตั้งขึ้นในปี 2024, JAK TECH มุ่งมั่นที่จะนำเสนออุปกรณ์ Gaming Gear และ Computer Hardware ที่ดีที่สุดให้กับเกมเมอร์ชาวไทย เราคัดสรรเฉพาะสินค้าคุณภาพสูงจากแบรนด์ชั้นนำระดับโลก</p>
                                  <br />
                                  <h3>Our Mission</h3>
                                  <p>เป้าหมายของเราคือการสร้างประสบการณ์การช้อปปิ้งที่เหนือระดับ พร้อมบริการหลังการขายที่รวดเร็วและเป็นกันเอง</p>
                                </div>
                              }
                            />
                          } />
                          <Route path="/help" element={
                            <InfoPage
                              title="Help Center"
                              subtitle="ศูนย์ช่วยเหลือและบริการลูกค้า"
                              icon="❓"
                              content={
                                <div>
                                  <h3>การจัดส่งสินค้า (Shipping)</h3>
                                  <p>เราจัดส่งสินค้าทุกวันจันทร์ - เสาร์ ตัดรอบเวลา 14:00 น. ใช้เวลาจัดส่ง 1-3 วันทำการทั่วประเทศ</p>
                                  <br />
                                  <h3>การรับประกัน (Warranty)</h3>
                                  <p>สินค้าทุกชิ้นมีประกันศูนย์ไทยแท้ 100% หากมีปัญหาภายใน 7 วัน เปลี่ยนตัวใหม่ทันที</p>
                                </div>
                              }
                            />
                          } />
                          <Route path="/contact" element={
                            <InfoPage
                              title="Contact Us"
                              subtitle="ติดต่อเรา"
                              icon="📞"
                              content={
                                <div>
                                  <p><strong>ที่อยู่:</strong> 123 Cyberpunk Tower, Digital District, Bangkok 10110</p>
                                  <p><strong>Email:</strong> support@jaktech.com</p>
                                  <p><strong>Tel:</strong> 02-123-4567</p>
                                  <p><strong>Line:</strong> @jaktech</p>
                                </div>
                              }
                            />
                          } />
                          <Route path="/privacy" element={
                            <InfoPage
                              title="Privacy Policy"
                              subtitle="นโยบายความเป็นส่วนตัว"
                              icon="🔒"
                              content={<p>เราให้ความสำคัญกับข้อมูลส่วนบุคคลของคุณ... (Mock Privacy Policy Content)</p>}
                            />
                          } />
                          <Route path="/terms" element={
                            <InfoPage
                              title="Terms of Service"
                              subtitle="ข้อกำหนดและเงื่อนไข"
                              icon="📜"
                              content={<p>ข้อตกลงการใช้งานเว็บไซต์ JAK TECH... (Mock Terms Content)</p>}
                            />
                          } />

                          <Route path="/products" element={<ProductCatalog />} />
                        </Routes>
                        <Footer />
                      </>
                    } />
                  </Routes>
                </div>
              </ReviewProvider>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </ProductProvider>
    </BrowserRouter>
  );
}

export default App;
