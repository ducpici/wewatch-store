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
    getProductByBrand,
    getProductBySlug,
    getReviewsByIdProduct,
    postAddReview,
    getProductFilters,
} from "../../api/v1/product/product.controller";

import authMiddleware from "../../api/v1/middlewares/auth";

routes.get("/products", getProducts);
routes.get("/products/check", checkDuplicate);
routes.get("/products/search", searchProduct);
routes.get("/products/filters", getProductFilters);
routes.get("/products/:id/reviews", getReviewsByIdProduct);
routes.post("/products/:id/reviews", authMiddleware, postAddReview);
routes.get("/products/:id", getProductById);
routes.get("/product_function/:id", getProductFunction);
routes.post("/products", uploadTo("products").single("file"), addProduct);
routes.put("/products/:id", uploadTo("products").single("file"), editProduct);
routes.delete("/products/:id", deleteProduct);

//api user side

routes.get("/danh-muc/:slug", getProductByCategory);
routes.get("/thuong-hieu/:slug", getProductByBrand);
routes.get("/san-pham/:slug", getProductBySlug);

module.exports = routes;
