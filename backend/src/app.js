import express from "express";
import configViewEngine from "./config/configViewEngine.js";
import cors from "cors";
import path from "path";
import { checkConnection } from "./config/database.js";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use(express.static("./public/"));

// app.use(
//     cors({
//         origin: "*",
//     })
// );

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// Middleware để parse JSON
app.use(express.json());

// ⚙️ Session setups
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET, // nên lưu ở biến môi trường
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             httpOnly: true,
//             secure: false, // ✅ để true nếu dùng HTTPS
//             maxAge: 1000 * 60 * 60 * 24, // 1 ngày
//         },
//     })
// );
app.use(
    session({
        name: "appA.sid", // hoặc "appB.sid" nếu muốn tách biệt theo frontend
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax", // hoặc "none" nếu bạn dùng HTTPS khác port
            maxAge: 24 * 60 * 60 * 1000, // 1 ngày
        },
    })
);

// Middleware để parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);
checkConnection();

app.use(require("./routes"));

module.exports = app;
