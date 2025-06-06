import express from "express";
import configViewEngine from "./config/configViewEngine";
import cors from "cors";
import { checkConnection } from "./config/database";

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
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
