import express from "express";
import {
    getAddressByUserId,
    getAddressById,
    putUpdateAddress,
    postAddAddress,
} from "../../api/v1/address/address.controller";
import authMiddleware from "../../api/v1/middlewares/auth";
const routes = express.Router();

routes.get("/address", authMiddleware, getAddressByUserId);
routes.get("/address/:idShip", getAddressById);
routes.put("/address/:idShip", putUpdateAddress);
routes.post("/address", authMiddleware, postAddAddress);

module.exports = routes;
