import express from "express";
import configViewEngine from "./config/configViewEngine.js";
import cors from "cors";
import path from "path";
import { checkConnection } from "./config/database.js";

const app = express();

// app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use(express.static("./public/"));

app.use(
    cors({
        origin: "*",
    })
);
// Middleware để parse JSON
app.use(express.json());

// Middleware để parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);
checkConnection();

app.use(require("./routes"));

module.exports = app;
