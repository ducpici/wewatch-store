import express from "express";
const routes = express.Router();

import {
    getPositions,
    addPosition,
    editPosition,
    getPositionsById,
    deletePosition,
    searchPosition,
} from "../../api/v1/position/position.controller";

routes.get("/positions", getPositions);
routes.get("/positions/search", searchPosition);
routes.get("/positions/:id", getPositionsById);
routes.post("/positions", addPosition);
// routes.post("/positions/authorization/:id");
routes.put("/positions/:id", editPosition);
routes.delete("/positions/:id", deletePosition);

module.exports = routes;
