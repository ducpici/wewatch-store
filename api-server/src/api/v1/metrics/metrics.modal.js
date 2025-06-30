import { connection } from "../../../config/database";
const getCustomerCount = async () => {
    const [rows] = await connection.query(
        "SELECT COUNT(*) AS total FROM users"
    );
    return rows[0].total;
};

const getProductCount = async () => {
    const [rows] = await connection.query(
        "SELECT COUNT(*) AS total FROM products"
    );
    return rows[0].total;
};

const getOrderCount = async () => {
    const [rows] = await connection.query(
        "SELECT COUNT(*) AS total FROM orders"
    );
    return rows[0].total;
};

const getTotalRevenue = async () => {
    const [rows] = await connection.query(
        "SELECT SUM(total_price) AS revenue FROM orders WHERE state = 3"
    );
    return rows[0].revenue || 0;
};

module.exports = {
    getCustomerCount,
    getProductCount,
    getOrderCount,
    getTotalRevenue,
};
