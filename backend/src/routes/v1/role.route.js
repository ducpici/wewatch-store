import express from "express";
const routes = express.Router();

import {
    getRoles,
    addRole,
    editRole,
    getRolesById,
    deleteRole,
    searchRole,
} from "../../api/v1/role/role.controller";

routes.get("/roles", getRoles);
routes.get("/roles/search", searchRole);
routes.get("/roles/:id", getRolesById);
routes.post("/roles", addRole);
routes.put("/roles/:id", editRole);
routes.delete("/roles/:id", deleteRole);

module.exports = routes;
