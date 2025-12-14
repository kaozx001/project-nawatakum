/**
 * ============================================
 * 🔐 AuthContext - ระบบจัดการ Authentication
 * ============================================
 * 
 * ไฟล์นี้จัดการ:
 * - การ Login/Logout
 * - เก็บข้อมูล User ที่ Login อยู่
 * - ตรวจสอบสถานะการ Login
 * - Role-based access (user/admin)
 * 
 * 📝 ส่วนที่ต้องแก้ไข:
 * - MOCK_USERS: เปลี่ยนเป็น API call จริงเมื่อมี backend
 * - login function: เชื่อมต่อ API จริง
 * - register function: เชื่อมต่อ API จริง
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// สร้าง Context
const AuthContext = createContext(null);

/**
 * ============================================
 * 📝 MOCK DATA - ข้อมูลจำลองสำหรับทดสอบ
 * ============================================
 * 
 * ⚠️ หมายเหตุ: เมื่อมี Backend จริง ให้ลบส่วนนี้
 * และเปลี่ยนไปใช้ API calls แทน
 * 
 * Roles:
 * - user: ผู้ใช้ทั่วไป (ซื้อสินค้า, รีวิว)
 * - admin: ผู้ดูแลระบบ (จัดการสินค้า, คำสั่งซื้อ, ผู้ใช้)
 */
const getStoredUsers = () => {
    try {
        const saved = localStorage.getItem('jaktech_all_users');
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error('Error loading users:', e);
    }

    // Default users
    return [
        {
            id: 1,
            email: 'demo@jaktech.com',
            password: 'demo123',
            name: 'Demo User',
            avatar: 'D',
            role: 'user',  // 🔑 Role: user
            phone: '0812345678',
            address: '123/45 ถนนสุขุมวิท กรุงเทพฯ 10110',
            createdAt: '2024-01-15T10:00:00.000Z'
        },
        {
            id: 2,
            email: 'admin@jaktech.com',
            password: 'admin123',
            name: 'Admin User',
            avatar: 'A',
            role: 'admin',  // 🔑 Role: admin
            phone: '0898765432',
            address: 'สำนักงานใหญ่ JAK TECH',
            createdAt: '2024-01-01T00:00:00.000Z'
        }
    ];
};

/**
 * AuthProvider Component
 * ครอบ App เพื่อให้ทุก component เข้าถึง auth state ได้
 */
export function AuthProvider({ children }) {
    // State เก็บข้อมูล user ที่ login อยู่
    const [user, setUser] = useState(null);
    // State แสดงว่ากำลังโหลดข้อมูลอยู่หรือไม่
    const [loading, setLoading] = useState(true);
    // State เก็บ users ทั้งหมด (สำหรับ admin)
    const [allUsers, setAllUsers] = useState(getStoredUsers);

    /**
     * ============================================
     * เมื่อ App โหลด ให้เช็ค localStorage
     * ว่ามี user login ค้างอยู่หรือไม่
     * ============================================
     */
    useEffect(() => {
        const savedUser = localStorage.getItem('jaktech_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('jaktech_user');
            }
        }
        setLoading(false);
    }, []);

    /**
     * ============================================
     * บันทึก users ลง localStorage เมื่อมีการเปลี่ยนแปลง
     * ============================================
     */
    useEffect(() => {
        localStorage.setItem('jaktech_all_users', JSON.stringify(allUsers));
    }, [allUsers]);

    /**
     * ============================================
     * 🔑 Login Function
     * ============================================
     */
    const login = async (email, password) => {
        // จำลองการ delay ของ API
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundUser = allUsers.find(
            u => u.email === email && u.password === password
        );

        if (foundUser) {
            // สร้าง user object (ไม่รวม password)
            const userData = {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name,
                avatar: foundUser.avatar,
                role: foundUser.role,  // 🔑 เพิ่ม role
                phone: foundUser.phone,
                address: foundUser.address,
                createdAt: foundUser.createdAt
            };

            setUser(userData);
            localStorage.setItem('jaktech_user', JSON.stringify(userData));
            return { success: true };
        }

        return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    };

    /**
     * ============================================
     * 📝 Register Function
     * ============================================
     */
    const register = async (name, email, password) => {
        // จำลองการ delay ของ API
        await new Promise(resolve => setTimeout(resolve, 500));

        // ตรวจสอบว่า email ซ้ำหรือไม่
        const exists = allUsers.find(u => u.email === email);
        if (exists) {
            return { success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว' };
        }

        // สร้าง user ใหม่
        const newUser = {
            id: Date.now(),
            email,
            password, // เก็บ password สำหรับ mock (ในระบบจริงต้อง hash)
            name,
            avatar: name.charAt(0).toUpperCase(),
            role: 'user',  // 🔑 Default role เป็น user
            phone: '',
            address: '',
            createdAt: new Date().toISOString()
        };

        // เพิ่มใน allUsers
        setAllUsers(prev => [...prev, newUser]);

        // Login user ที่สร้างใหม่
        const userData = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            avatar: newUser.avatar,
            role: newUser.role,
            phone: newUser.phone,
            address: newUser.address,
            createdAt: newUser.createdAt
        };

        setUser(userData);
        localStorage.setItem('jaktech_user', JSON.stringify(userData));
        return { success: true };
    };

    /**
     * ============================================
     * ✏️ Update Profile Function
     * ============================================
     */
    const updateProfile = async (updates) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        if (!user) {
            return { success: false, error: 'กรุณาเข้าสู่ระบบ' };
        }

        // อัพเดท user ใน allUsers
        setAllUsers(prev => prev.map(u => {
            if (u.id === user.id) {
                return { ...u, ...updates };
            }
            return u;
        }));

        // อัพเดท current user
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('jaktech_user', JSON.stringify(updatedUser));

        return { success: true };
    };

    /**
     * ============================================
     * 🚪 Logout Function
     * ============================================
     */
    const logout = () => {
        setUser(null);
        localStorage.removeItem('jaktech_user');
    };

    /**
     * ============================================
     * 👑 Check Admin
     * ============================================
     */
    const isAdmin = () => {
        return user?.role === 'admin';
    };

    /**
     * ============================================
     * 📋 Get All Users (Admin only)
     * ============================================
     */
    const getAllUsers = () => {
        if (!isAdmin()) return [];
        return allUsers.map(u => ({
            id: u.id,
            email: u.email,
            name: u.name,
            avatar: u.avatar,
            role: u.role,
            phone: u.phone,
            createdAt: u.createdAt
        }));
    };

    /**
     * ============================================
     * 🔄 Update User Role (Admin only)
     * ============================================
     */
    const updateUserRole = (userId, newRole) => {
        if (!isAdmin()) return { success: false, error: 'ไม่มีสิทธิ์' };

        setAllUsers(prev => prev.map(u => {
            if (u.id === userId) {
                return { ...u, role: newRole };
            }
            return u;
        }));

        return { success: true };
    };

    // ค่าที่ส่งออกไปให้ component อื่นใช้
    const value = {
        user,               // ข้อมูล user ที่ login อยู่
        loading,            // สถานะกำลังโหลด
        isLoggedIn: !!user, // true ถ้า login แล้ว
        isAdmin: isAdmin(), // true ถ้าเป็น admin
        login,              // function login
        register,           // function register
        logout,             // function logout
        updateProfile,      // function อัพเดทโปรไฟล์
        getAllUsers,        // function ดึง users ทั้งหมด (admin)
        updateUserRole      // function เปลี่ยน role (admin)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom Hook สำหรับใช้ Auth Context
 * ใช้งาน: const { user, login, logout } = useAuth();
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
