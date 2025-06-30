import express from "express";
const routes = express.Router();

import {
    getCart,
    postAddCart,
    putEditCart,
    applyVoucher,
    checkProductAvailability,
} from "../../api/v1/cart/cart.controller";

routes.get("/cart/:userId", getCart);
routes.post("/cart", postAddCart);
routes.put("/cart/:userId", putEditCart);
routes.post("/cart/apply-voucher", applyVoucher);
routes.post("/cart/check-availability", checkProductAvailability);

module.exports = routes;
