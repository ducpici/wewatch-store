import {
    getCustomerCount,
    getProductCount,
    getOrderCount,
    getTotalRevenue,
} from "./metrics.modal";
import { connection } from "../../../config/database";

import dayjs from "dayjs";

const getEcommerceMetrics = async (req, res) => {
    try {
        const [customers, products, orders, revenue] = await Promise.all([
            getCustomerCount(),
            getProductCount(),
            getOrderCount(),
            getTotalRevenue(),
        ]);

        res.status(200).json({
            success: true,
            data: {
                customers,
                products,
                orders,
                revenue,
            },
        });
    } catch (error) {
        console.error("Lỗi lấy metrics:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getMonthlySales = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || dayjs().year();

        const [rows] = await connection.query(
            `
            SELECT 
                MONTH(created_at) AS month,
                COUNT(*) AS order_count,
                SUM(total_price) AS total_sales
            FROM orders
            WHERE YEAR(created_at) = ? AND state = 3
            GROUP BY MONTH(created_at)
            ORDER BY month ASC
        `,
            [year]
        );

        const salesData = Array(12).fill(0);

        rows.forEach((row) => {
            const monthIndex = Number(row.month) - 1;
            if (monthIndex >= 0 && monthIndex < 12) {
                salesData[monthIndex] = Number(row.order_count) || 0;
            }
        });

        return res.status(200).json({ year, data: salesData });
    } catch (error) {
        console.error("Error fetching monthly sales:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getMonthlyStats = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || dayjs().year();

        const [rows] = await connection.query(
            `
            SELECT 
                MONTH(created_at) AS month,
                COUNT(*) AS order_count,
                SUM(total_price) AS total_revenue
            FROM orders
            WHERE YEAR(created_at) = ? AND state = 3
            GROUP BY MONTH(created_at)
            ORDER BY month ASC
            `,
            [year]
        );

        const data = Array.from({ length: 12 }, (_, i) => {
            const match = rows.find((r) => r.month === i + 1);
            return {
                month: i + 1,
                order_count: match?.order_count || 0,
                total_revenue: match?.total_revenue || 0,
            };
        });

        res.status(200).json({ year, data });
    } catch (err) {
        console.error("Error in getMonthlyStats:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAvailableOrderYears = async (req, res) => {
    try {
        const [rows] = await connection.query(`
            SELECT DISTINCT YEAR(created_at) AS year
            FROM orders
            ORDER BY year DESC
        `);

        const years = rows.map((row) => row.year);
        res.status(200).json({ status: true, data: years });
    } catch (error) {
        console.error("Error fetching years:", error);
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    getEcommerceMetrics,
    getMonthlySales,
    getMonthlyStats,
    getAvailableOrderYears,
};
