const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * Delete a file from Cloudinary by its public_id.
 * @param {string} publicId - The Cloudinary public_id of the asset
 * @returns {Promise<object>} Cloudinary deletion result
 */
const deleteFile = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (err) {
        console.error("Cloudinary delete error:", err);
        throw err;
    }
};

/**
 * Extract the public_id from a Cloudinary URL.
 * e.g. "https://res.cloudinary.com/demo/image/upload/v123/amiance/products/abc.jpg"
 *   → "amiance/products/abc"
 * @param {string} url
 * @returns {string|null}
 */
const extractPublicId = (url) => {
    if (!url || !url.includes("cloudinary.com")) return null;
    try {
        const parts = url.split("/upload/");
        const afterUpload = parts[1]; // e.g. "v1234567890/amiance/products/abc.jpg"
        // Strip version segment if present
        const withoutVersion = afterUpload.replace(/^v\d+\//, "");
        // Strip file extension
        return withoutVersion.replace(/\.[^/.]+$/, "");
    } catch {
        return null;
    }
};

module.exports = { cloudinary, deleteFile, extractPublicId };