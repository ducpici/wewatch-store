import express from "express";
import { uploadTo } from "../../api/v1/middlewares/uploadMiddleware";
const routes = express.Router();

import {
    getBanners,
    addBanner,
    editBanner,
    getBannersById,
    deleteBanner,
    searchBanner,
} from "../../api/v1/banner/banner.controller";

routes.get("/banners", getBanners);
routes.get("/banners/search", searchBanner);
routes.get("/banners/:id", getBannersById);
routes.post("/banners", uploadTo("banners").single("file"), addBanner);
// routes.post("/banners/authorization/:id");
routes.put("/banners/:id", uploadTo("banners").single("file"), editBanner);
routes.delete("/banners/:id", deleteBanner);

module.exports = routes;
