// utils/hashPass.js
import bcrypt from "bcrypt";

const saltRounds = 10;

/**
 * Hash mật khẩu với bcrypt
 * @param {string} plainPassword - Mật khẩu chưa mã hóa
 * @returns {Promise<string>} - Mật khẩu đã được mã hóa (hash)
 */
async function hashPass(plainPassword) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(plainPassword, salt);
        return hash;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

module.exports = { hashPass };
