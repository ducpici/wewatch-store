import express from "express";
const routes = express.Router();
import { uploadTo } from "../../api/v1/middlewares/uploadMiddleware";
import {
    getProducts,
    addProduct,
    editProduct,
    getProductById,
    deleteProduct,
    searchProduct,
    getProductFunction,
    checkDuplicate,
    getProductByCategory,
    getProductByBrandName,
} from "../../api/v1/product/product.controller";

routes.get("/products", getProducts);
routes.get("/products/check", checkDuplicate);
routes.get("/products/search", searchProduct);
routes.get("/products/:id", getProductById);
routes.get("/product_function/:id", getProductFunction);
routes.post("/products", uploadTo("products").single("file"), addProduct);
routes.put("/products/:id", uploadTo("products").single("file"), editProduct);
routes.delete("/products/:id", deleteProduct);

//api user side
routes.get("/categories/:categoryId/products", getProductByCategory);
routes.get("/brand/:brandName", getProductByBrandName);

module.exports = routes;
