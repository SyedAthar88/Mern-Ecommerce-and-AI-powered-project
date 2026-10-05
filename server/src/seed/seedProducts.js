import mongoose from "mongoose";
import { env } from "../config/env.js";
import { User } from "../models/User.model.js";
import { Category } from "../models/Category.model.js";
import { Product } from "../models/Product.model.js";

// ==========================================
// Category definitions (name + fallback metadata)
// These categories already exist OR will be created.
// Existing ones are preserved.
// ==========================================
const CATEGORY_DEFS = [
    {
        name: "Electronics",
        description: "Gadgets, devices, and consumer electronics",
        imageUrl:
            "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
    },
    {
        name: "Gaming",
        description: "Gaming gear, accessories, and setups",
        imageUrl:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    },
    {
        name: "Clothing",
        description: "Apparel and fashion essentials",
        imageUrl:
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
    },
];

// ==========================================
// Product seed data (24 products)
// categoryName is mapped to a real category._id at runtime
// ==========================================
const PRODUCTS = [
    // ---------- ELECTRONICS (10) ----------
    {
        name: "Premium Wireless Headphones",
        shortDescription: "Studio-quality sound with active noise cancellation",
        description:
            "Experience studio-quality sound with active noise cancellation, 40-hour battery life, and premium comfort. Perfect for travel, work, and everyday listening.",
        price: 249.99,
        compareAtPrice: 349.99,
        stock: 25,
        categoryName: "Electronics",
        tags: ["wireless", "audio", "headphones", "anc"],
        imageUrl:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        isFeatured: true,
    },
    {
        name: "Portable Bluetooth Speaker",
        shortDescription: "Waterproof speaker with 24-hour battery",
        description:
            "Take your music anywhere with this IPX7 waterproof portable speaker. Features 24-hour battery life, deep bass, and a rugged design built for adventure.",
        price: 79.99,
        compareAtPrice: 99.99,
        stock: 40,
        categoryName: "Electronics",
        tags: ["audio", "speaker", "bluetooth", "waterproof"],
        imageUrl:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    },
    {
        name: "Smart Fitness Watch",
        shortDescription: "Track health, workouts, and notifications",
        description:
            "Monitor your heart rate, sleep, and activity throughout the day. Syncs with iOS and Android, receives notifications, and lasts up to 7 days on a single charge.",
        price: 199.99,
        compareAtPrice: 249.99,
        stock: 30,
        categoryName: "Electronics",
        tags: ["wearable", "fitness", "smartwatch"],
        imageUrl:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        isFeatured: true,
    },
    {
        name: "4K Ultra HD Webcam",
        shortDescription: "Crystal clear video for streaming and calls",
        description:
            "Professional-grade 4K webcam with auto-focus, HDR, and dual noise-cancelling microphones. Ideal for remote work, streaming, and content creation.",
        price: 129.99,
        stock: 18,
        categoryName: "Electronics",
        tags: ["webcam", "4k", "streaming"],
        imageUrl:
            "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&q=80",
    },
    {
        name: "Mechanical Keyboard",
        shortDescription: "RGB backlit with tactile switches",
        description:
            "Full-size mechanical keyboard with Cherry MX switches, RGB backlighting, and durable aluminum frame. Great for typing and gaming.",
        price: 149.99,
        compareAtPrice: 179.99,
        stock: 35,
        categoryName: "Electronics",
        tags: ["keyboard", "mechanical", "rgb"],
        imageUrl:
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    },
    {
        name: "Ergonomic Wireless Mouse",
        shortDescription: "Silent click with precision tracking",
        description:
            "Ergonomic wireless mouse with silent click, adjustable DPI, and long battery life. Comfortable for extended use.",
        price: 39.99,
        stock: 60,
        categoryName: "Electronics",
        tags: ["mouse", "wireless", "ergonomic"],
        imageUrl:
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    },
    {
        name: "USB-C Hub Adapter",
        shortDescription: "7-in-1 connectivity for laptops",
        description:
            "Expand your laptop's ports with this 7-in-1 USB-C hub. Includes HDMI 4K, USB-A, SD card reader, and 100W power delivery.",
        price: 59.99,
        compareAtPrice: 79.99,
        stock: 45,
        categoryName: "Electronics",
        tags: ["usb-c", "hub", "adapter"],
        imageUrl:
            "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80",
    },
    {
        name: "Portable Power Bank 20000mAh",
        shortDescription: "Fast charging with dual USB ports",
        description:
            "Charge your phone up to 5 times with this 20000mAh power bank. Supports fast charging, dual USB ports, and USB-C input/output.",
        price: 49.99,
        stock: 80,
        categoryName: "Electronics",
        tags: ["powerbank", "charging", "portable"],
        imageUrl:
            "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
    },
    {
        name: "Smart LED Bulbs (Pack of 4)",
        shortDescription: "WiFi-enabled with 16 million colors",
        description:
            "Control your lighting from your phone with these smart LED bulbs. 16 million colors, scheduling, and voice control via Alexa and Google Assistant.",
        price: 44.99,
        compareAtPrice: 59.99,
        stock: 55,
        categoryName: "Electronics",
        tags: ["smart-home", "led", "wifi"],
        imageUrl:
            "https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&q=80",
    },
    {
        name: "Noise-Cancelling Earbuds",
        shortDescription: "True wireless with 30-hour battery case",
        description:
            "Compact true wireless earbuds with hybrid ANC, transparency mode, and a 30-hour charging case. IPX5 water-resistant.",
        price: 149.99,
        stock: 0, // out of stock example
        categoryName: "Electronics",
        tags: ["earbuds", "wireless", "anc"],
        imageUrl:
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    },

    // ---------- GAMING (7) ----------
    {
        name: "Pro Gaming Headset",
        shortDescription: "7.1 surround sound with noise-cancelling mic",
        description:
            "Immersive 7.1 surround sound, memory foam ear cushions, and a detachable noise-cancelling microphone. Compatible with PC, PS5, and Xbox.",
        price: 129.99,
        compareAtPrice: 169.99,
        stock: 22,
        categoryName: "Gaming",
        tags: ["gaming", "headset", "surround"],
        imageUrl:
            "https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80",
        isFeatured: true,
    },
    {
        name: "RGB Gaming Mouse",
        shortDescription: "16000 DPI with customizable buttons",
        description:
            "High-precision gaming mouse with 16000 DPI optical sensor, 8 programmable buttons, and customizable RGB lighting.",
        price: 69.99,
        stock: 45,
        categoryName: "Gaming",
        tags: ["gaming", "mouse", "rgb"],
        imageUrl:
            "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
    },
    {
        name: "Mechanical Gaming Keyboard",
        shortDescription: "Tactile switches with per-key RGB",
        description:
            "Compact TKL mechanical keyboard with hot-swappable switches, per-key RGB, and aircraft-grade aluminum chassis.",
        price: 139.99,
        compareAtPrice: 179.99,
        stock: 30,
        categoryName: "Gaming",
        tags: ["gaming", "keyboard", "mechanical"],
        imageUrl:
            "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
    },
    {
        name: "Ergonomic Gaming Chair",
        shortDescription: "Reclining with lumbar support",
        description:
            "High-back gaming chair with adjustable lumbar support, 4D armrests, and up to 180° recline. Breathable PU leather.",
        price: 299.99,
        compareAtPrice: 399.99,
        stock: 12,
        categoryName: "Gaming",
        tags: ["gaming", "chair", "ergonomic"],
        imageUrl:
            "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80",
    },
    {
        name: "Wireless Gaming Controller",
        shortDescription: "Low-latency with haptic feedback",
        description:
            "Wireless controller with low-latency connection, haptic feedback, and 40-hour battery life. Compatible with PC, mobile, and consoles.",
        price: 79.99,
        stock: 50,
        categoryName: "Gaming",
        tags: ["gaming", "controller", "wireless"],
        imageUrl:
            "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&q=80",
    },
    {
        name: "144Hz Gaming Monitor 27\"",
        shortDescription: "QHD resolution with 1ms response",
        description:
            "27-inch QHD gaming monitor with 144Hz refresh rate, 1ms response time, and AMD FreeSync. IPS panel with vivid colors.",
        price: 349.99,
        compareAtPrice: 449.99,
        stock: 15,
        categoryName: "Gaming",
        tags: ["gaming", "monitor", "144hz"],
        imageUrl:
            "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80",
    },
    {
        name: "VR Headset",
        shortDescription: "Standalone VR with 4K display",
        description:
            "All-in-one VR headset with 4K display, inside-out tracking, and hand tracking. No PC required.",
        price: 399.99,
        stock: 8,
        categoryName: "Gaming",
        tags: ["gaming", "vr", "headset"],
        imageUrl:
            "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80",
    },

    // ---------- CLOTHING (7) ----------
    {
        name: "Classic Cotton T-Shirt",
        shortDescription: "Soft, breathable everyday essential",
        description:
            "100% organic cotton t-shirt with a relaxed fit. Pre-shrunk, tagless, and available in multiple colors.",
        price: 24.99,
        compareAtPrice: 34.99,
        stock: 100,
        categoryName: "Clothing",
        tags: ["clothing", "tshirt", "cotton"],
        imageUrl:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        isFeatured: true,
    },
    {
        name: "Premium Hoodie",
        shortDescription: "Fleece-lined with adjustable hood",
        description:
            "Heavyweight fleece hoodie with kangaroo pocket, adjustable drawstring hood, and ribbed cuffs. Unisex fit.",
        price: 59.99,
        stock: 45,
        categoryName: "Clothing",
        tags: ["clothing", "hoodie", "fleece"],
        imageUrl:
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    },
    {
        name: "Vintage Denim Jacket",
        shortDescription: "Classic trucker style, stone-washed",
        description:
            "Timeless denim jacket with a stone-washed finish. Features button-front closure, chest pockets, and adjustable waist tabs.",
        price: 89.99,
        compareAtPrice: 119.99,
        stock: 20,
        categoryName: "Clothing",
        tags: ["clothing", "jacket", "denim"],
        imageUrl:
            "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
    },
    {
        name: "Athletic Running Shoes",
        shortDescription: "Lightweight with responsive cushioning",
        description:
            "Breathable mesh running shoes with responsive foam cushioning and durable rubber outsole. Ideal for daily runs.",
        price: 119.99,
        compareAtPrice: 149.99,
        stock: 55,
        categoryName: "Clothing",
        tags: ["clothing", "shoes", "running"],
        imageUrl:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    },
    {
        name: "Baseball Cap",
        shortDescription: "Adjustable with embroidered logo",
        description:
            "Classic 6-panel baseball cap with adjustable strap and moisture-wicking sweatband. One size fits most.",
        price: 19.99,
        stock: 75,
        categoryName: "Clothing",
        tags: ["clothing", "cap", "hat"],
        imageUrl:
            "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
    },
    {
        name: "Comfort Crew Socks (3-Pack)",
        shortDescription: "Cushioned with arch support",
        description:
            "Premium cotton-blend crew socks with cushioned footbed, arch support, and reinforced heel and toe.",
        price: 16.99,
        stock: 150,
        categoryName: "Clothing",
        tags: ["clothing", "socks"],
        imageUrl:
            "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80",
    },
    {
        name: "Performance Sports Leggings",
        shortDescription: "High-waist with moisture-wicking fabric",
        description:
            "High-waist performance leggings with four-way stretch, moisture-wicking fabric, and hidden waistband pocket. Squat-proof.",
        price: 49.99,
        compareAtPrice: 69.99,
        stock: 0, // out of stock example
        categoryName: "Clothing",
        tags: ["clothing", "leggings", "activewear"],
        imageUrl:
            "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
    },
];

// ==========================================
// Main seed function
// ==========================================
const seedProducts = async () => {
    try {
        // ---- 1. Connect ----
        await mongoose.connect(env.MONGO_URI);
        console.log("✅ Connected to MongoDB\n");

        // ---- 2. Find an admin user (required for createdBy) ----
        const admin = await User.findOne({ role: "admin" });
        if (!admin) {
            console.error(
                "❌ No admin user found. Run `npm run seed:admin` first."
            );
            process.exit(1);
        }
        console.log(`👤 Using admin: ${admin.email}\n`);

        // ---- 3. Delete existing products ----
        const deleteResult = await Product.deleteMany({});
        console.log(`🧹 Cleared ${deleteResult.deletedCount} existing products\n`);

        // ---- 4. Upsert categories (create if missing, preserve if exists) ----
        console.log("📁 Ensuring categories exist...");
        const categoryMap = {}; // name → ObjectId

        for (const def of CATEGORY_DEFS) {
            let cat = await Category.findOne({ name: def.name });

            if (cat) {
                console.log(`   ✓ ${def.name} (existing)`);
            } else {
                cat = await Category.create({
                    name: def.name,
                    description: def.description,
                    image: { url: def.imageUrl, publicId: "" },
                });
                console.log(`   + ${def.name} (created)`);
            }

            categoryMap[def.name] = cat._id;
        }
        console.log("");

        // ---- 5. Create products ----
        console.log("📦 Creating products...");
        let created = 0;

        for (const p of PRODUCTS) {
            const categoryId = categoryMap[p.categoryName];
            if (!categoryId) {
                console.warn(`   ⚠️  Skipping "${p.name}" — no category match`);
                continue;
            }

            await Product.create({
                name: p.name,
                shortDescription: p.shortDescription || "",
                description: p.description,
                price: p.price,
                compareAtPrice: p.compareAtPrice ?? null,
                currency: "USD",
                stock: p.stock,
                category: categoryId,
                tags: p.tags || [],
                images: p.imageUrl
                    ? [{ url: p.imageUrl, publicId: "" }]
                    : [],
                isActive: p.isActive ?? true,
                isFeatured: p.isFeatured ?? false,
                createdBy: admin._id,
            });

            created += 1;
        }
        console.log(`   ✅ ${created} products created\n`);

        // ---- 6. Summary ----
        const featured = await Product.countDocuments({ isFeatured: true });
        const inactive = await Product.countDocuments({ isActive: false });
        const outOfStock = await Product.countDocuments({ stock: 0 });

        console.log("========================================");
        console.log("📊 Seeding Summary");
        console.log("========================================");
        console.log(`   Products created:  ${created}`);
        console.log(`   Categories:        ${Object.keys(categoryMap).length}`);
        console.log(`   Featured:          ${featured}`);
        console.log(`   Inactive:          ${inactive}`);
        console.log(`   Out of stock:      ${outOfStock}`);
        console.log(`   Created by:        ${admin.email}`);
        console.log("========================================");
        console.log("🎉 Seeding complete!\n");

        // ---- 7. Cleanup ----
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error.message);
        console.error(error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedProducts();