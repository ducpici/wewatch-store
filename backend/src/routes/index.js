import express from "express";
const routes = express.Router();

routes.use("/api/v1", require("./v1/user.route"));
routes.use("/api/v1", require("./v1/employee.route"));
routes.use("/api/v1", require("./v1/position.route"));
routes.use("/api/v1", require("./v1/brand.route"));
routes.use("/api/v1", require("./v1/category.route"));
routes.use("/api/v1", require("./v1/function.route"));
routes.use("/api/v1", require("./v1/role.route"));

module.exports = routes;
