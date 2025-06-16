import express from "express";
const routes = express.Router();

routes.use("/api/v1", require("./v1/user.route"));
routes.use("/api/v1", require("./v1/employee.route"));
routes.use("/api/v1", require("./v1/position.route"));
routes.use("/api/v1", require("./v1/position_role.route"));
routes.use("/api/v1", require("./v1/brand.route"));
routes.use("/api/v1", require("./v1/category.route"));
routes.use("/api/v1", require("./v1/function.route"));
routes.use("/api/v1", require("./v1/role.route"));
routes.use("/api/v1", require("./v1/voucher.route"));
routes.use("/api/v1", require("./v1/banner.route"));
routes.use("/api/v1", require("./v1/product.route"));
routes.use("/api/v1", require("./v1/order.route"));
routes.use("/api/v1", require("./v1/auth.route"));

module.exports = routes;
