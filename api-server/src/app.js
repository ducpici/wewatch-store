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

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: true, // production phải HTTPS
            sameSite: "none", // cross-site cookie
            domain: ".westore.site", // nếu muốn chia sẻ giữa subdomain
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

app.use(express.static("./public/"));
app.use(require("./routes"));

module.exports = app;
