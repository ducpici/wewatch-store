import express from "express";
const routes = express.Router();

import {
    getCart,
    postAddCart,
    putEditCart,
    applyVoucher,
} from "../../api/v1/cart/cart.controller";

routes.get("/cart/:userId", getCart);
routes.post("/cart", postAddCart);
routes.put("/cart/:userId", putEditCart);
routes.post("/cart/apply-voucher", applyVoucher);

module.exports = routes;
