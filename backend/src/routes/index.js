import express from "express";
const routes = express.Router();

routes.use("/api/v1", require("./v1/user.route"));

module.exports = routes;
