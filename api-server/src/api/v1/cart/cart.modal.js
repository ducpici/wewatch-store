import { connection } from "../../../config/database";

const getUserCart = async (userId) => {
    const sql = `
    SELECT 
        c.id_cart,
        c.quantity,
        p.id_product,
        p.modal_num,
        p.crystal_material,
        p.movement_type,
        p.dial_diameter,
        p.case_thickness,
        p.strap_material,
        p.water_resistance,
        p.price,
        p.image,
        p.slug,
        b.id_brand,
        b.brand_name,
        cat.id_category,
        cat.category_name
    FROM carts c
    JOIN products p ON c.product_id = p.id_product
    JOIN brands b ON p.brand_id = b.id_brand
    JOIN categories cat ON p.category_id = cat.id_category
    WHERE c.user_id = ?
    `;
    const values = [userId];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getProductIdsByUser = async (userId) => {
    const sql = `SELECT product_id FROM carts WHERE user_id = ?`;
    const [rows] = await connection.execute(sql, [userId]);
    return rows.map((row) => row.product_id);
};

const checkProductExist = async (userId, productId) => {
    const sql = `SELECT * FROM carts WHERE user_id = ? AND product_id = ?`;
    const values = [userId, productId];
    const [result] = await connection.execute(sql, values);
    return result;
};

const updateCartItem = async (quantity, userId, productId) => {
    const sql = `UPDATE carts set quantity = ? WHERE user_id = ? AND product_id = ?`;
    const values = [quantity, userId, productId];
    const [result] = await connection.execute(sql, values);
    return result;
};

const deleteCartItems = async (userId, productIds) => {
    const placeholders = productIds.map(() => "?").join(",");
    const sql = `
        DELETE FROM carts WHERE user_id = ? AND product_id IN (${placeholders})
    `;
    return connection.execute(sql, [userId, ...productIds]);
};

const getVoucherByCode = async (code) => {
    const [rows] = await connection.query(
        "SELECT * FROM vouchers WHERE code = ?",
        [code]
    );
    return rows[0] || null;
};

module.exports = {
    getUserCart,
    checkProductExist,
    updateCartItem,
    deleteCartItems,
    getProductIdsByUser,
    getVoucherByCode,
};
