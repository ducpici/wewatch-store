import express from "express";
import { connection } from "../../config/database";
const routes = express.Router();
import bcrypt from "bcrypt";
import { hashPass } from "../../utils/hashPass";
const sessions = {};

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
        // Lưu session
        req.session.user = {
            id: account.id,
            name: account.name,
            dob: account.dob,
            gender: account.gender,
            email: account.email,
            address: account.address,
            phone_number: account.phone_number,
        };

        res.json({ message: "Đăng nhập thành công!" });
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

routes.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Lỗi khi hủy session:", err);
            return res.status(500).json({ message: "Đăng xuất thất bại" });
        }

        res.clearCookie("connect.sid"); // tên cookie mặc định của express-session
        res.json({ message: "Đăng xuất thành công" });
    });
});

routes.get("/session", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "No session" });
    }

    return res.json(req.session.user);
});

module.exports = routes;
