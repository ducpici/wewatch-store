import express from "express";
const routes = express.Router();

import {
    getCart,
    postAddCart,
    putEditCart,
    applyVoucher,
    checkProductAvailability,
    deleteCartUser,
} from "../../api/v1/cart/cart.controller";
import authMiddleware from "../../api/v1/middlewares/auth";

routes.get("/cart/:userId", getCart);
routes.post("/cart", postAddCart);
routes.put("/cart/:userId", putEditCart);
routes.post("/cart/apply-voucher", applyVoucher);
routes.post("/cart/check-availability", checkProductAvailability);
routes.delete("/cart/:userId", authMiddleware, deleteCartUser);

module.exports = routes;
