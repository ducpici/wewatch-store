import express from "express";
import configViewEngine from "./config/configViewEngine.js";
import cors from "cors";
import { checkConnection } from "./config/database.js";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

const app = express();
// Middleware cho JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);
checkConnection();

// app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use(express.static("./public/"));

const allowedOrigins = [
    "https://admin.wewatch.com:5173",
    "https://shop.wewatch.com:5174",
];

// app.use(
//     cors({
//         origin: function (origin, callback) {
//             if (!origin || allowedOrigins.includes(origin)) {
//                 callback(null, true);
//             } else {
//                 console.warn("Blocked CORS origin:", origin);
//                 callback(new Error("Not allowed by CORS"));
//             }
//         },
//         credentials: true, // Bắt buộc để gửi cookie
//     })
// );

// Session config
// const sessionShop = session({
//     name: "shop.sid",
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         secure: true, // Bắt buộc khi dùng HTTPS
//         sameSite: "none", // Cần cho cross-site
//         domain: ".wewatch.com", // Cho phép chia sẻ giữa subdomain
//         maxAge: 24 * 60 * 60 * 1000, // 1 ngày
//     },
// });

// const sessionAdmin = session({
//     name: "admin.sid",
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         secure: true,
//         sameSite: "none",
//         domain: ".wewatch.com",
//         maxAge: 24 * 60 * 60 * 1000,
//     },
// });

// // Middleware chọn session phù hợp
// app.use((req, res, next) => {
//     const origin = req.headers.origin || req.hostname;

//     if (
//         origin?.includes("shop.wewatch.com") ||
//         origin?.includes("localhost:5174")
//     ) {
//         sessionShop(req, res, next);
//     } else if (
//         origin?.includes("admin.wewatch.com") ||
//         origin?.includes("localhost:5173")
//     ) {
//         sessionAdmin(req, res, next);
//     } else {
//         console.warn("Unknown origin for session:", origin);
//         next();
//     }
// });

app.use(
    cors({
        origin: ["http://localhost:3001", "http://localhost:3002"],
        credentials: true,
    })
);

app.use(require("./routes"));

module.exports = app;
