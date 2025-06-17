import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Thiếu token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(decoded);

        next();
    } catch (err) {
        console.error("Lỗi xác thực JWT:", err.message);
        return res.status(403).json({ message: "Token không hợp lệ" });
    }
}

module.exports = authMiddleware;
