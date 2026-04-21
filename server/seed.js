/**
 * AMIANCE Database Seeder
 * Run: node server/seed.js
 * Seeds: admin user + 6 products
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./server/.env" });

const User = require("./server/models/User");
const Product = require("./server/models/Product");

const PRODUCTS = [
    {
        name: "Oversized Utility Tee",
        description: "Premium 100% GOTS-certified organic cotton. Dropped shoulders, relaxed unisex fit. Double-stitched seams for longevity. Pre-washed for instant softness. Made in Portugal under fair-wage conditions.",
        price: 2499,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        category: "tops",
        tag: "Drop 01",
        badge: "BESTSELLER",
        colorHex: "#386641",
        stock: 150,
        featured: true,
    },
    {
        name: "Phantom Fleece Hoodie",
        description: "Double-layered 380gsm fleece. Kangaroo pocket, adjustable drawstring hood. Brushed interior for warmth without bulk. Drop-shoulder silhouette for that oversized street edge.",
        price: 3999,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        category: "tops",
        tag: "Drop 02",
        badge: "NEW",
        colorHex: "#6a994e",
        stock: 80,
        featured: false,
    },
    {
        name: "Aged Denim Jacket",
        description: "12oz Japanese selvedge denim, enzyme-washed for a naturally worn character. Raw hem, contrast stitching, and a boxy structured fit. Each piece ages uniquely — truly unrepeatable.",
        price: 6499,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
        category: "outerwear",
        tag: "Drop 03",
        badge: "LIMITED",
        colorHex: "#a7c957",
        stock: 25,
        featured: false,
    },
    {
        name: "Cargo Wide-Leg Pant",
        description: "6-pocket utility design in heavy-duty cotton twill. Adjustable waistband, drawstring ankles, and a wide-leg silhouette built for movement. Wear it up or wear it down.",
        price: 4999,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
        category: "bottoms",
        tag: "Drop 04",
        badge: "NEW",
        colorHex: "#386641",
        stock: 60,
        featured: false,
    },
    {
        name: "Structured Coach Jacket",
        description: "Lightweight ripstop nylon shell with a clean minimal aesthetic. Snap-button closure, inside chest pocket, and a boxy silhouette. The perfect transitional layer.",
        price: 7999,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        category: "outerwear",
        tag: "Drop 05",
        badge: "SOLD OUT",
        colorHex: "#6a994e",
        stock: 0,
        featured: false,
    },
    {
        name: "Graphic Tee Vol.2",
        description: "Screen-printed with water-based inks on a 200gsm organic cotton base. The print won't crack or fade. A statement piece for those who let the clothes do the talking.",
        price: 2999,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
        category: "tops",
        tag: "Drop 06",
        badge: null,
        colorHex: "#a7c957",
        stock: 120,
        featured: false,
    },
];

const ADMIN_USER = {
    name: "AMIANCE Admin",
    email: "admin@amiance.co",
    password: "Admin@2026",
    role: "admin",
    isVerified: true,
};

const DEMO_USER = {
    name: "Alex Monroe",
    email: "user@amiance.co",
    password: "User@2026",
    role: "user",
    isVerified: true,
    phone: "+91 98765 43210",
};

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({ role: { $in: ["admin"] } });
        console.log("🗑  Cleared existing admin + products");

        // Create admin
        const admin = await User.create(ADMIN_USER);
        console.log(`👤 Admin created: ${admin.email}`);

        // Create demo user (only if doesn't exist)
        try {
            const demo = await User.create(DEMO_USER);
            console.log(`👤 Demo user created: ${demo.email}`);
        } catch {
            console.log("ℹ️  Demo user already exists, skipping");
        }

        // Seed products
        const products = await Product.insertMany(PRODUCTS);
        console.log(`📦 ${products.length} products seeded:`);
        products.forEach(p => console.log(`   • ${p.name} — ₹${p.price.toLocaleString("en-IN")}`));

        console.log("\n🚀 Seed complete!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`Admin login: admin@amiance.co / Admin@2026`);
        console.log(`Demo login:  user@amiance.co / User@2026`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        process.exit(0);
    } catch (err) {
        console.error("❌ Seed error:", err);
        process.exit(1);
    }
}

seed();