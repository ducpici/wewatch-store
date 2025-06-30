import express from "express";
import {
    getEcommerceMetrics,
    getMonthlySales,
    getMonthlyStats,
} from "../../api/v1/metrics/metrics.controller";

const router = express.Router();

router.get("/metrics", getEcommerceMetrics);
router.get("/reports/monthly-sales", getMonthlySales);
router.get("/reports/monthly-statistics", getMonthlyStats);

module.exports = router;
