import express from "express";
const routes = express.Router();

routes.use("/api/v1", require("./v1/user.route"));
routes.use("/api/v1", require("./v1/employee.route"));
routes.use("/api/v1", require("./v1/position.route"));

module.exports = routes;
