const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order.
 * @param {number} amount - Amount in paise (INR × 100)
 * @param {string} currency - e.g. "INR"
 * @param {string} receipt - Unique order reference (e.g. MongoDB order _id)
 * @returns {Promise<object>} Razorpay order object
 */
const createOrder = async (amount, currency = "INR", receipt) => {
    const options = {
        amount: Math.round(amount * 100), // paise
        currency,
        receipt,
        payment_capture: 1, // auto-capture
    };
    return await razorpay.orders.create(options);
};

/**
 * Verify a Razorpay payment signature.
 * Call this after the client sends back razorpay_payment_id,
 * razorpay_order_id, and razorpay_signature.
 *
 * @param {string} razorpayOrderId
 * @param {string} razorpayPaymentId
 * @param {string} razorpaySignature
 * @returns {boolean} true if signature is valid
 */
const verifySignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");
    return expectedSignature === razorpaySignature;
};

/**
 * Fetch details of a specific Razorpay payment.
 * @param {string} paymentId
 * @returns {Promise<object>}
 */
const fetchPayment = async (paymentId) => {
    return await razorpay.payments.fetch(paymentId);
};

module.exports = { razorpay, createOrder, verifySignature, fetchPayment };