import express from "express";
const routes = express.Router();

import { getPositions } from "../../api/v1/position/position.controller";

routes.get("/positions", getPositions);

module.exports = routes;
