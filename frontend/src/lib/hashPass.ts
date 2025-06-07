import bcrypt from "bcrypt";
const saltRounds = 10;

/**
 * Hash mật khẩu đầu vào.
 * @param {string} plainPassword - Mật khẩu chưa mã hóa
 * @returns {Promise<string>} - Mật khẩu đã mã hóa (hash)
 */
export async function hashPass(plainPassword: string): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(plainPassword, salt);
        return hash;
    } catch (error) {
        throw new Error("Hashing password failed");
    }
}
