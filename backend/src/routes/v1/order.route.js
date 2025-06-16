import express from "express";
const routes = express.Router();

import {
    getOrders,
    getOrderById,
    getOrderDetail,
    // postAddOrder,
    putUpdateOrder,
    // deleleOrder,
    // searchOrders,
} from "../../api/v1/order/order.controller";

routes.get("/orders", getOrders);
// routes.get("/orders/search", searchOrders);
routes.get("/orders/:id", getOrderById);
// routes.post("/orders", postAddOrder);
routes.put("/orders/:id", putUpdateOrder);
// routes.delete("/orders/:id", deleleOrder);

routes.get("/orders/detail/:id", getOrderDetail);

module.exports = routes;
