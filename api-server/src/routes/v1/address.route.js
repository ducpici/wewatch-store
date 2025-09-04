import express from "express";
import {
    getAddressByUserId,
    getAddressById,
    putUpdateAddress,
    postAddAddress,
    deleteAddress,
    chooseDefault,
} from "../../api/v1/address/address.controller";
import authMiddleware from "../../api/v1/middlewares/auth";
const routes = express.Router();

routes.get("/address", authMiddleware, getAddressByUserId);
routes.get("/address/:idShip", getAddressById);
routes.put("/address/:idShip", authMiddleware, putUpdateAddress);
routes.put("/address/choose-default/:idShip", authMiddleware, chooseDefault);
routes.post("/address", authMiddleware, postAddAddress);
routes.delete("/address/:idShip", deleteAddress);

module.exports = routes;
