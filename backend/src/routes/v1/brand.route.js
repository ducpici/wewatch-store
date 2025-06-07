import express from "express";
const routes = express.Router();

import {
    getBrands,
    addBrand,
    editBrand,
    getBrandsById,
    deleteBrand,
    searchBrand,
    checkDuplicate,
} from "../../api/v1/brand/brand.controller";

routes.get("/brands/search", searchBrand);
routes.get("/brands/check", checkDuplicate);
routes.get("/brands", getBrands);
routes.get("/brands/:id", getBrandsById);
routes.post("/brands", addBrand);
routes.put("/brands/:id", editBrand);
routes.delete("/brands/:id", deleteBrand);

module.exports = routes;
