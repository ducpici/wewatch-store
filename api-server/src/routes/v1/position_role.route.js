import express from "express";
const routes = express.Router();

import {
    getPositionRolesById,
    updateRolesOfPosition,
} from "../../api/v1/position_role/position_role.controller";

routes.get("/position_role/:id", getPositionRolesById);
routes.put("/position_role/:id", updateRolesOfPosition);

module.exports = routes;
