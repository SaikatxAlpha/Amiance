/**
 * validators.js — Shared input-validation helpers for AMIANCE API routes.
 *
 * Each validator returns { valid: boolean, message?: string }.
 * Use them in route handlers before hitting the database.
 */

/* ── Email ─────────────────────────────────────────────── */
const isValidEmail = (email) => {
    if (typeof email !== "string" || !email.trim()) {
        return { valid: false, message: "Email is required" };
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.trim())) {
        return { valid: false, message: "Please provide a valid email address" };
    }
    return { valid: true };
};

/* ── Password ──────────────────────────────────────────── */
const isValidPassword = (password, { minLength = 6, requireUppercase = false, requireNumber = false } = {}) => {
    if (typeof password !== "string" || !password) {
        return { valid: false, message: "Password is required" };
    }
    if (password.length < minLength) {
        return { valid: false, message: `Password must be at least ${minLength} characters` };
    }
    if (requireUppercase && !/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (requireNumber && !/[0-9]/.test(password)) {
        return { valid: false, message: "Password must contain at least one number" };
    }
    return { valid: true };
};

/* ── Name ──────────────────────────────────────────────── */
const isValidName = (name, { minLength = 2, maxLength = 60 } = {}) => {
    if (typeof name !== "string" || !name.trim()) {
        return { valid: false, message: "Name is required" };
    }
    const trimmed = name.trim();
    if (trimmed.length < minLength) {
        return { valid: false, message: `Name must be at least ${minLength} characters` };
    }
    if (trimmed.length > maxLength) {
        return { valid: false, message: `Name must be at most ${maxLength} characters` };
    }
    return { valid: true };
};

/* ── Phone (India) ─────────────────────────────────────── */
const isValidPhone = (phone) => {
    if (!phone) return { valid: true }; // optional field
    const cleaned = phone.replace(/[\s\-().+]/g, "");
    // Allow 10-digit Indian numbers with optional +91 prefix
    if (!/^(91)?[6-9]\d{9}$/.test(cleaned)) {
        return { valid: false, message: "Please provide a valid Indian phone number" };
    }
    return { valid: true };
};

/* ── Price ─────────────────────────────────────────────── */
const isValidPrice = (price) => {
    const num = Number(price);
    if (isNaN(num) || num < 0) {
        return { valid: false, message: "Price must be a non-negative number" };
    }
    return { valid: true };
};

/* ── MongoDB ObjectId ──────────────────────────────────── */
const isValidObjectId = (id) => {
    if (typeof id !== "string" || !/^[a-fA-F0-9]{24}$/.test(id)) {
        return { valid: false, message: "Invalid ID format" };
    }
    return { valid: true };
};

/* ── Coupon code ───────────────────────────────────────── */
const isValidCouponCode = (code) => {
    if (typeof code !== "string" || !code.trim()) {
        return { valid: false, message: "Coupon code is required" };
    }
    if (code.trim().length < 3 || code.trim().length > 20) {
        return { valid: false, message: "Coupon code must be 3–20 characters" };
    }
    if (!/^[A-Za-z0-9_\-]+$/.test(code.trim())) {
        return { valid: false, message: "Coupon code may only contain letters, numbers, hyphens, or underscores" };
    }
    return { valid: true };
};

/* ── PIN code (India) ──────────────────────────────────── */
const isValidPincode = (pin) => {
    if (!pin) return { valid: false, message: "PIN code is required" };
    if (!/^\d{6}$/.test(String(pin).trim())) {
        return { valid: false, message: "PIN code must be a 6-digit number" };
    }
    return { valid: true };
};

/* ── Shipping address ──────────────────────────────────── */
const isValidShippingAddress = (addr) => {
    if (!addr || typeof addr !== "object") {
        return { valid: false, message: "Shipping address is required" };
    }
    const required = ["name", "address", "city", "country"];
    for (const field of required) {
        if (!addr[field] || !String(addr[field]).trim()) {
            return { valid: false, message: `Shipping address field '${field}' is required` };
        }
    }
    return { valid: true };
};

/* ── Product fields ────────────────────────────────────── */
const isValidProduct = (body) => {
    const { name, description, price, category, image } = body;
    if (!name || !String(name).trim()) return { valid: false, message: "Product name is required" };
    if (!description || !String(description).trim()) return { valid: false, message: "Description is required" };

    const priceCheck = isValidPrice(price);
    if (!priceCheck.valid) return priceCheck;

    const VALID_CATEGORIES = ["tops", "bottoms", "outerwear", "accessories"];
    if (!category || !VALID_CATEGORIES.includes(category.toLowerCase())) {
        return { valid: false, message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}` };
    }

    if (!image || !String(image).trim()) return { valid: false, message: "Product image URL is required" };

    return { valid: true };
};

/* ── Review fields ─────────────────────────────────────── */
const isValidReview = (body) => {
    const { rating, comment } = body;
    const num = Number(rating);
    if (!rating || isNaN(num) || num < 1 || num > 5) {
        return { valid: false, message: "Rating must be a number between 1 and 5" };
    }
    if (!comment || !String(comment).trim()) {
        return { valid: false, message: "Review comment is required" };
    }
    if (String(comment).trim().length < 10) {
        return { valid: false, message: "Review comment must be at least 10 characters" };
    }
    return { valid: true };
};

/**
 * Express middleware factory — runs a validator and returns 400 on failure.
 * Usage: router.post("/", validateBody(isValidProduct), handler)
 *
 * @param {Function} validatorFn - A function (body) => { valid, message }
 */
const validateBody = (validatorFn) => (req, res, next) => {
    const result = validatorFn(req.body);
    if (!result.valid) {
        return res.status(400).json({ success: false, message: result.message });
    }
    next();
};

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidPhone,
    isValidPrice,
    isValidObjectId,
    isValidCouponCode,
    isValidPincode,
    isValidShippingAddress,
    isValidProduct,
    isValidReview,
    validateBody,
};