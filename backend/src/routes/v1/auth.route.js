import express from "express";
import { connection } from "../../config/database";
const routes = express.Router();
import bcrypt from "bcrypt";
import { hashPass } from "../../utils/hashPass";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import authMiddleware from "../../api/v1/middlewares/auth";

routes.post("/login", async (req, res) => {
    const { username, password, type } = req.body;
    console.log("Đăng nhập:", username, password, type);

    const tableName = type === "user" ? "users" : "employees";

    const [rows] = await connection.execute(
        `SELECT * FROM ${tableName} WHERE username = ?`,
        [username]
    );

    if (!rows || rows.length === 0) {
        return res.status(401).json({ message: "Tên đăng nhập không tồn tại" });
    }

    const account = rows[0];

    try {
        const match = await bcrypt.compare(password, account.password);

        if (!match) {
            console.log("Sai mật khẩu");
            return res.status(401).json({ message: "Sai mật khẩu" });
        }

        const token = jwt.sign(
            {
                id: account.id,
                username: account.username,
                type: type,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: account.id,
                username: account.username,
                name: account.name,
                email: account.email,
            },
        });
    } catch (err) {
        console.error("Lỗi khi so sánh mật khẩu:", err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
});

routes.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Đăng ký:", username, password);

        const [checkUser] = await connection.execute(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (checkUser.length > 0) {
            return res
                .status(409)
                .json({ message: "Tên đăng nhập đã tồn tại" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await hashPass(password);

        // Thêm người dùng mới
        await connection.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashedPassword]
        );

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (err) {
        console.error("Lỗi khi đăng ký:", err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
});

routes.get("/me", authMiddleware, async (req, res) => {
    const { username, type } = req.user;

    const tableName = type === "user" ? "users" : "employees";

    try {
        const [rows] = await connection.execute(
            `SELECT id, username, name, email FROM ${tableName} WHERE username = ?`,
            [username]
        );

        if (!rows || rows.length === 0) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng" });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
});

module.exports = routes;
