import express from "express";
import {
    getEcommerceMetrics,
    getMonthlySales,
    getMonthlyStats,
    getAvailableOrderYears,
} from "../../api/v1/metrics/metrics.controller";

const router = express.Router();

router.get("/metrics", getEcommerceMetrics);
router.get("/reports/monthly-sales", getMonthlySales);
router.get("/reports/monthly-statistics", getMonthlyStats);
router.get("/reports/order-years", getAvailableOrderYears);

module.exports = router;
