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
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getAddress = async (id) => {
    const sql = `SELECT
         id AS address_id,
         full_name,
         phone_num AS phone,
         province,
         district,
         street_address
       FROM shipping_address
       WHERE user_id = ? AND is_default = 1`;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getOrderItems = async (id) => {
    const sql = `SELECT
         od.id AS order_detail_id,
         od.product_id,
         p.modal_num AS product_model,
         p.price,
         od.quantity,
         (p.price * od.quantity) AS subtotal,
         pi.image_name AS product_image
       FROM order_details od
       JOIN products p ON od.product_id = p.id_product  
       LEFT JOIN product_images pi ON pi.product_id = p.id_product
       WHERE od.order_id = ?`;
    const values = [id];
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
};
