import express from "express";
const routes = express.Router();

import {
    getCategories,
    addCategory,
    editCategory,
    getCategoriesById,
    deleteCategory,
    searchCategory,
} from "../../api/v1/category/category.controller";

routes.get("/categories/search", searchCategory);
routes.get("/categories", getCategories);
routes.get("/categories/:id", getCategoriesById);
routes.post("/categories", addCategory);
routes.put("/categories/:id", editCategory);
routes.delete("/categories/:id", deleteCategory);

module.exports = routes;
