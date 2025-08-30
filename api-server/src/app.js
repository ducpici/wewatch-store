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

app.use(express.static("./public/"));

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(require("./routes"));

module.exports = app;
