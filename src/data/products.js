/**
 * ============================================
 * 📦 PRODUCT DATA - ข้อมูลสินค้า
 * ============================================
 * 
 * 📝 ส่วนที่ต้องแก้ไข:
 * - เพิ่ม/ลบ/แก้ไขข้อมูลสินค้าได้ที่นี่
 * - เปลี่ยนรูปภาพ (ใช้ URL หรือ import จาก assets)
 * - เปลี่ยนราคา, rating, reviews
 * - เปลี่ยน badge (HOT, NEW, BESTSELLER, หรือ null)
 * 
 * 💴 หมายเหตุ: ราคาเป็นบาท (฿)
 */

export const categories = [
    // ============================================
    // 📝 หมวดหมู่ที่ 1: สินค้าขายดี
    // ============================================
    {
        id: 'cat-hot',
        title: "🔥 สินค้าขายดี",
        type: "hot-items",
        description: "สินค้าขายดีที่สุดประจำเดือน",
        items: [
            {
                id: 1,
                name: "NVIDIA GeForce RTX 4090",
                image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
                price: "฿55,900",
                originalPrice: "฿62,900",
                rating: 4.9,
                reviews: 2847,
                badge: "HOT",
                // 📝 เพิ่ม description สำหรับหน้ารายละเอียด
                description: "กราฟิกการ์ดระดับเรือธง สถาปัตยกรรม Ada Lovelace รองรับ Ray Tracing และ DLSS 3.0"
            },
            {
                id: 2,
                name: "MacBook Pro 16\" M3 Max",
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
                price: "฿122,900",
                originalPrice: "฿139,900",
                rating: 4.8,
                reviews: 1523,
                badge: "BESTSELLER",
                description: "โน๊ตบุ๊คระดับมืออาชีพ ชิป M3 Max แรงสุดขีด หน้าจอ Liquid Retina XDR"
            },
            {
                id: 3,
                name: "Sony WH-1000XM5",
                image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop",
                price: "฿12,200",
                originalPrice: "฿13,990",
                rating: 4.7,
                reviews: 5621,
                badge: null,
                description: "หูฟังไร้สายตัดเสียงรบกวนระดับพรีเมียม เสียงดี แบตอึด ใส่สบาย"
            },
            {
                id: 4,
                name: "Keychron Q1 Pro",
                image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=300&fit=crop",
                price: "฿6,990",
                rating: 4.6,
                reviews: 892,
                badge: "NEW",
                description: "คีย์บอร์ด Mechanical ระดับ Custom ไร้สาย Bluetooth 5.1"
            },
            {
                id: 5,
                name: "LG C3 65\" OLED",
                image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop",
                price: "฿52,900",
                originalPrice: "฿62,900",
                rating: 4.9,
                reviews: 3241,
                badge: null,
                description: "ทีวี OLED 65 นิ้ว 4K สีสันสดใส สมจริง รองรับ Dolby Vision และ Atmos"
            },
            {
                id: 6,
                name: "Samsung Odyssey G9",
                image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
                price: "฿38,500",
                originalPrice: "฿45,400",
                rating: 4.5,
                reviews: 1876,
                badge: "HOT",
                description: "จอโค้ง Super Ultrawide 49 นิ้ว 240Hz สำหรับเกมเมอร์ตัวจริง"
            },
        ]
    },
    // ============================================
    // 📝 หมวดหมู่ที่ 2: Gaming Laptops
    // ============================================
    {
        id: 'cat-laptops',
        title: "💻 Gaming Laptops",
        type: "laptops",
        description: "โน๊ตบุ๊คเกมมิ่งประสิทธิภาพสูง",
        items: [
            {
                id: 11,
                name: "Alienware x16 R2",
                image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
                price: "฿90,900",
                originalPrice: "฿104,900",
                rating: 4.7,
                reviews: 756,
                badge: "NEW",
                description: "Gaming Laptop ระดับพรีเมียม หน้าจอ 16 นิ้ว QHD+ 240Hz"
            },
            {
                id: 12,
                name: "Razer Blade 18",
                image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop",
                price: "฿111,900",
                rating: 4.8,
                reviews: 432,
                badge: null,
                description: "Gaming Laptop ทรงพรีเมียม บางเบา แรงสุด ดีไซน์เรียบหรู"
            },
            {
                id: 13,
                name: "ASUS ROG Zephyrus G14",
                image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop",
                price: "฿52,400",
                originalPrice: "฿59,400",
                rating: 4.6,
                reviews: 1289,
                badge: "BESTSELLER",
                description: "Gaming Laptop 14 นิ้ว พกพาง่าย แรงสุดในขนาดกระทัดรัด"
            },
            {
                id: 14,
                name: "MSI Raider GE78 HX",
                image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
                price: "฿97,900",
                rating: 4.5,
                reviews: 567,
                badge: null,
                description: "Gaming Laptop ตัวท็อป หน้าจอ 17 นิ้ว RTX 4090"
            },
            {
                id: 15,
                name: "Lenovo Legion Pro 7",
                image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
                price: "฿76,900",
                originalPrice: "฿87,400",
                rating: 4.7,
                reviews: 823,
                badge: "HOT",
                description: "Gaming Laptop คุ้มค่า ประสิทธิภาพสูง ระบายความร้อนดีเยี่ยม"
            },
        ]
    },
    // ============================================
    // 📝 หมวดหมู่ที่ 3: อุปกรณ์เสริม
    // ============================================
    {
        id: 'cat-peripherals',
        title: "🖱️ อุปกรณ์เสริมพรีเมียม",
        type: "peripherals",
        description: "เมาส์ คีย์บอร์ด หูฟัง และอุปกรณ์เสริมคุณภาพสูง",
        items: [
            {
                id: 21,
                name: "Logitech MX Master 3S",
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
                price: "฿3,490",
                rating: 4.8,
                reviews: 8934,
                badge: "BESTSELLER",
                description: "เมาส์ไร้สายระดับมืออาชีพ เงียบสนิท แม่นยำสูง ชาร์จเร็ว"
            },
            {
                id: 22,
                name: "Wooting 60HE",
                image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=300&fit=crop",
                price: "฿6,125",
                rating: 4.9,
                reviews: 2341,
                badge: "HOT",
                description: "คีย์บอร์ด Analog สำหรับเกมเมอร์ ปรับ Actuation Point ได้"
            },
            {
                id: 23,
                name: "Finalmouse UltralightX",
                image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=300&fit=crop",
                price: "฿6,650",
                rating: 4.4,
                reviews: 673,
                badge: "NEW",
                description: "เมาส์เกมมิ่งเบาที่สุดในโลก น้ำหนักเพียง 29 กรัม"
            },
            {
                id: 24,
                name: "SteelSeries Arctis Nova Pro",
                image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=300&fit=crop",
                price: "฿12,200",
                originalPrice: "฿13,990",
                rating: 4.6,
                reviews: 1567,
                badge: null,
                description: "หูฟังเกมมิ่งระดับพรีเมียม ANC, Hi-Fi Audio"
            },
            {
                id: 25,
                name: "Elgato Stream Deck+",
                image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=300&fit=crop",
                price: "฿6,990",
                rating: 4.7,
                reviews: 2189,
                badge: null,
                description: "อุปกรณ์ควบคุมสำหรับ Streamer และ Content Creator"
            },
        ]
    },
    // ============================================
    // 📝 หมวดหมู่ที่ 4: ชิ้นส่วนคอมพิวเตอร์
    // ============================================
    {
        id: 'cat-components',
        title: "🎮 ชิ้นส่วนคอมพิวเตอร์",
        type: "components",
        description: "CPU, GPU, RAM, SSD และอุปกรณ์ประกอบคอมพิวเตอร์",
        items: [
            {
                id: 31,
                name: "AMD Ryzen 9 7950X3D",
                image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop",
                price: "฿24,450",
                originalPrice: "฿27,950",
                rating: 4.9,
                reviews: 1876,
                badge: "HOT",
                description: "CPU ที่ดีที่สุดสำหรับเกม 3D V-Cache เร็วที่สุดในโลก"
            },
            {
                id: 32,
                name: "ASUS ROG Maximus Z790",
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
                price: "฿22,000",
                rating: 4.7,
                reviews: 534,
                badge: null,
                description: "เมนบอร์ดระดับเรือธง LGA 1700 รองรับ DDR5"
            },
            {
                id: 33,
                name: "G.Skill Trident Z5 RGB 64GB",
                image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop",
                price: "฿10,450",
                originalPrice: "฿12,200",
                rating: 4.8,
                reviews: 2341,
                badge: "BESTSELLER",
                description: "RAM DDR5 6000MHz 64GB (32x2) RGB สำหรับ Workstation"
            },
            {
                id: 34,
                name: "Samsung 990 Pro 2TB",
                image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
                price: "฿6,260",
                originalPrice: "฿8,010",
                rating: 4.9,
                reviews: 4521,
                badge: null,
                description: "SSD NVMe PCIe 4.0 เร็วที่สุด อ่าน 7,450 MB/s"
            },
            {
                id: 35,
                name: "Corsair HX1500i PSU",
                image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=300&fit=crop",
                price: "฿13,950",
                rating: 4.8,
                reviews: 876,
                badge: "NEW",
                description: "Power Supply 1500W 80+ Platinum Full Modular"
            },
        ]
    }
];

// ============================================
// 📝 สินค้า Featured ในหน้าแรก
// ============================================
export const featuredProduct = {
    name: "NVIDIA GeForce RTX 4090",
    description: "Beyond Fast. การ์ดจอ GeForce RTX™ 4090 คือสุดยอด GPU ที่มาพร้อมประสิทธิภาพที่ก้าวกระโดด AI-Powered Graphics และ Ray Tracing ขั้นสูง เพื่อประสบการณ์เล่นเกมที่สมจริงที่สุด",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1920&h=1080&fit=crop",
    // 📝 URL วิดีโอ YouTube (ใส่ ID ของวิดีโอ)
    videoId: "dQw4w9WgXcQ" // ⚠️ เปลี่ยนเป็น Video ID ของคุณ
};

// ============================================
// 📝 แบรนด์พาร์ทเนอร์
// ============================================
export const brands = [
    { name: 'NVIDIA', logo: '🟢' },
    { name: 'AMD', logo: '🔴' },
    { name: 'Intel', logo: '🔵' },
    { name: 'ASUS', logo: '⚫' },
    { name: 'MSI', logo: '🔶' },
    { name: 'Razer', logo: '💚' },
    { name: 'Logitech', logo: '🔷' },
    { name: 'Corsair', logo: '⬛' },
    { name: 'Samsung', logo: '🔹' },
    { name: 'Apple', logo: '⚪' },
    { name: 'Dell', logo: '💙' },
    { name: 'Sony', logo: '🖤' },
];
