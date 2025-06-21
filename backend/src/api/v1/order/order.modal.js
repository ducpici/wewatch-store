import { connection } from "../../../config/database";

const getData = async (limit, offset) => {
    const sql = `
            SELECT 
         o.id AS order_id,
         o.user_id,
         u.name AS user_name,
         u.email AS user_email,
         o.total_price,
         o.state AS order_state_code,
         o.payment_method AS payment_method_code,
         o.created_at,
         o.updated_at
       FROM orders o
       JOIN users u ON o.user_id = u.id
 ORDER BY o.created_at DESC
 LIMIT ? OFFSET ?
    `;
    const values = [limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const countAllData = async () => {
    const sql = `
        SELECT COUNT(*) AS total FROM orders;
    `;
    const [result] = await connection.execute(sql);
    return result[0].total;
};

const countOrderByUser = async (userId) => {
    const sql = `
        SELECT COUNT(*) AS total FROM orders WHERE user_id = ?;
    `;
    const value = [userId];
    const [result] = await connection.execute(sql, value);
    return result[0].total;
};

const findById = async (id) => {
    const sql = `
            SELECT 
                o.id,
                o.user_id,
                u.name AS user_name,
                o.total_price,
                o.state,
                o.payment_method,
                o.created_at,
                o.updated_at
            FROM orders o
            JOIN users u ON o.user_id = u.id
            where o.id = ? 
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const updateData = async (state, id) => {
    const sql = `
            UPDATE
                orders
            SET state = ?
            where id = ? 
    `;
    const values = [state, id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getDataOrderDetail = async (id) => {
    const sql = `
            SELECT
                p.id_product,
                p.modal_num,
                p.price, 
                b.id_brand,
                b.brand_name,
                c.id_category,
                c.category_name
            FROM orders o
            JOIN order_details od ON o.id = od.order_id
            JOIN products p ON p.id_product = od. product_id
            JOIN brands b ON p.brand_id = b.id_brand
            JOIN categories c ON p.category_id = c.id_category
            where o.id = ? 
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getOrder = async (id) => {
    const sql = `SELECT * FROM orders o WHERE o.id = ?`;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getOrderByUser = async (userId, limit, offset) => {
    const sql = `SELECT          o.id AS order_id,
         o.user_id,
         o.total_price,
         o.state AS order_state_code,
         o.payment_method AS payment_method_code,
         o.created_at,
         o.updated_at
       FROM orders o WHERE o.user_id = ? LIMIT ? OFFSET ?`;
    const values = [userId, limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getAddress = async (id) => {
    const sql = `SELECT
         id AS address_id,
         full_name,
         phone_num,
         city,
         district,
         ward,
         detail
       FROM shipping_address sa JOIN users u ON u.id = sa.user_id
       WHERE u.id = ? AND is_default = 1`;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result[0];
};

const getOrderItems = async (id) => {
    const sql = `SELECT
         od.id AS order_detail_id,
         od.product_id,
         p.modal_num,
         p.price,
         p.brand_id,
         p.category_id,
         p.dial_diameter,
         p.crystal_material,
         p.slug,
         b.id_brand,
         b.brand_name,
         c.id_category,
         c.category_name,
         od.quantity,
         p.image
       FROM order_details od
       JOIN products p ON od.product_id = p.id_product  
       JOIN brands b ON b.id_brand = p.brand_id
       JOIN categories c ON c.id_category = p.category_id
       WHERE od.order_id = ?`;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getUser = async (id) => {
    const sql = `
        SELECT u.id, u.name, u.phone_number, u.email, u.address FROM users u WHERE id = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result[0];
};

const getIdUserByOrderId = async (orderId) => {
    const sql = `
        SELECT user_id FROM orders WHERE id = ?
    `;
    const values = [orderId];
    const [result] = await connection.execute(sql, values);
    return result[0].user_id;
};

const createOrder = async (data) => {
    const sql = `
        INSERT INTO orders (user_id, total_price, state, payment_method, created_at) VALUES (?,?,?,?,?)
    `;
    const values = [
        data.userId,
        data.total,
        data.state,
        data.payment,
        data.createdAt,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const createOrderDetail = async (data) => {
    const sql = `
        INSERT INTO order_details (order_id, product_id, quantity) VALUES (?,?,?)
    `;
    const values = [data.order_id, data.product_id, data.quantity];
    const [result] = await connection.execute(sql, values);
    return result;
};

const searchData = async (keyword) => {
    const sql = `SELECT 
         o.id AS order_id,
         o.user_id,
         u.name AS user_name,
         u.email AS user_email,
         o.total_price,
         o.state AS order_state_code,
         o.payment_method AS payment_method_code,
         o.created_at,
         o.updated_at
       FROM orders o
       JOIN users u ON o.user_id = u.id WHERE o.id LIKE ? OR u.name LIKE ?`;
    const values = [`%${keyword}%`, `%${keyword}%`];
    const [result] = await connection.execute(sql, values);
    return result;
};
module.exports = {
    getData,
    countAllData,
    findById,
    updateData,
    getOrder,
    getDataOrderDetail,
    getOrderItems,
    getAddress,
    getUser,
    getIdUserByOrderId,
    createOrder,
    createOrderDetail,
    getOrderByUser,
    countOrderByUser,
    searchData,
};
