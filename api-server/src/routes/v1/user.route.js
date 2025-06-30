import express from "express";
const routes = express.Router();

import {
    getUsers,
    findUserById,
    postAddUser,
    putUpdateUser,
    deleleAUser,
    checkDuplicate,
    searchUsers,
    changePassword,
} from "../../api/v1/user/user.controller";

routes.get("/users", getUsers);
routes.get("/users/check", checkDuplicate);
routes.get("/users/search", searchUsers);
routes.get("/users/:id", findUserById);

routes.post("/users", postAddUser);
routes.put("/users/change-password", changePassword);
routes.put("/users/:id", putUpdateUser);

routes.delete("/users/:id", deleleAUser);

module.exports = routes;
