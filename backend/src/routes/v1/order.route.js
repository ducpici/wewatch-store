import express from "express";
const routes = express.Router();
import authMiddleware from "../../api/v1/middlewares/auth";
import {
    getOrders,
    getOrderById,
    getOrderDetail,
    // postAddOrder,
    putUpdateOrder,
    postAddOrder,
    // deleleOrder,
    // searchOrders,
} from "../../api/v1/order/order.controller";

routes.get("/orders", getOrders);
// routes.get("/orders/search", searchOrders);
routes.get("/orders/:id", getOrderById);
// routes.post("/orders", postAddOrder);
routes.put("/orders/:id", putUpdateOrder);
// routes.delete("/orders/:id", deleleOrder);

routes.post("/orders", authMiddleware, postAddOrder);

routes.get("/orders/detail/:orderId", getOrderDetail);

module.exports = routes;
