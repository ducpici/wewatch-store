import express from "express";
const routes = express.Router();

import {
    getFunctions,
    addFunction,
    editFunction,
    getFunctionsById,
    deleteFunction,
    searchFunction,
} from "../../api/v1/function/function.controller";

routes.get("/functions/search", searchFunction);
routes.get("/functions", getFunctions);
routes.get("/functions/:id", getFunctionsById);
routes.post("/functions", addFunction);
routes.put("/functions/:id", editFunction);
routes.delete("/functions/:id", deleteFunction);

module.exports = routes;
