import { connection } from "../../../config/database";

const getDataPaginated = async (limit, offset) => {
    const sql = `
        SELECT 
    p.id_product,
    p.modal_num,
    p.origin,
    p.crystal_material,
    p.movement_type,
    p.dial_diameter,
    p.case_thickness,
    p.strap_material,
    p.water_resistance,
    p.quantity,
    p.price,
    p.state,
    b.id_brand,
    b.brand_name,
    c.id_category,
    c.category_name
FROM products p
JOIN brands b ON p.brand_id = b.id_brand
JOIN categories c ON p.category_id = c.id_category 
 LIMIT ? OFFSET ?
    `;
    const values = [limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const countAllData = async () => {
    const sql = `
        SELECT COUNT(*) AS total FROM products;
    `;
    const [result] = await connection.execute(sql);
    return result[0].total;
};

const getAllData = async () => {
    const sql = `
        select * from products
    `;
    const [result] = await connection.execute(sql);
    return result;
};

// const findById = async (id) => {
//     const sql = `
//         SELECT * FROM products where id_product = ?
//     `;
//     const values = [id];
//     const [result] = await connection.execute(sql, values);
//     return result;
// };

const findById = async (id) => {
    const sql = `
            SELECT 
                *
            FROM products p
            JOIN brands b ON p.brand_id = b.id_brand
            JOIN categories c ON p.category_id = c.id_category
            JOIN product_function fs ON fs.product_id = p.id_product
            JOIN functions f ON f.id_function = fs.function_id
            where id_product = ? 
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getDataByCategory = async (id) => {
    const sql = `
        SELECT 
    p.id_product,
    p.modal_num,
    p.origin,
    p.crystal_material,
    p.movement_type,
    p.dial_diameter,
    p.case_thickness,
    p.strap_material,
    p.water_resistance,
    p.quantity,
    p.price,
    p.image,
    p.state,
    b.id_brand,
    b.brand_name,
    c.id_category,
    c.category_name
FROM products p
JOIN brands b ON p.brand_id = b.id_brand
JOIN categories c ON p.category_id = c.id_category 
WHERE id_category = ? AND p.state = 1
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getDataByBrandName = async (brandName) => {
    const sql = `
            SELECT 
                *
            FROM products p
            JOIN brands b ON p.brand_id = b.id_brand
            JOIN categories c ON p.category_id = c.id_category
            JOIN product_function fs ON fs.product_id = p.id_product
            JOIN functions f ON f.id_function = fs.function_id
            where b.brand_name = ? 
    `;
    const values = [brandName];
    const [result] = await connection.execute(sql, values);
    return result;
};

const findProductFunction = async (id) => {
    const sql = `
        SELECT * FROM product_function where product_id = ? 
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const createData = async (data) => {
    const sql = `
        insert into products (modal_num, brand_id, origin, crystal_material, movement_type, dial_diameter, case_thickness, strap_material, water_resistance, category_id, quantity, price, state, image) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    const values = [
        data.modal_num,
        data.brand_id,
        data.origin,
        data.crystal_material,
        data.movement_type,
        data.dial_diameter,
        data.case_thickness,
        data.strap_material,
        data.water_resistance,
        data.category_id,
        data.quantity,
        data.price,
        data.state,
        data.image,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const updateData = async (id, data) => {
    const fields = [];
    const values = [];

    for (const key in data) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
    }

    const sql = `UPDATE products SET ${fields.join(", ")} WHERE id_product = ?`;
    values.push(id);
    const [result] = await connection.execute(sql, values);
    return result;
};

const deleteData = async (id) => {
    const sql = `
        delete from products where id_product = ? 
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const checkModalNumExists = async (modal_num, idToExclude = null) => {
    let sql = `SELECT id_product FROM products WHERE modal_num = ?`;
    const values = [modal_num];

    if (idToExclude) {
        sql += ` AND id_product != ?`;
        values.push(idToExclude);
    }

    const [result] = await connection.execute(sql, values);
    return result;
};

const search = async (keyword) => {
    const sql = `
        SELECT 
    p.id_product,
    p.modal_num,
    p.origin,
    p.crystal_material,
    p.movement_type,
    p.dial_diameter,
    p.case_thickness,
    p.strap_material,
    p.water_resistance,
    p.quantity,
    p.price,
    p.state,
    b.id_brand,
    b.brand_name,
    c.id_category,
    c.category_name
FROM products p
JOIN brands b ON p.brand_id = b.id_brand
JOIN categories c ON p.category_id = c.id_category
        WHERE 
            p.modal_num LIKE ?
            OR p.origin LIKE ?
            OR p.crystal_material LIKE ?
            OR p.movement_type LIKE ?
            OR b.brand_name LIKE ?
            OR c.category_name LIKE ?
            OR p.state LIKE ?
    `;
    const values = [
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const createProductFunction = async (productId, functionId) => {
    const values = functionId.map((functionId) => [productId, functionId]);
    await connection.query(
        "INSERT INTO product_function (product_id, function_id) VALUES ?",
        [values]
    );
};

// const createProductFunction = async (productId, functionId) => {

// }

const deleteProductFunction = async (productId) => {
    const sql = `
        delete from product_function where product_id = ? 
    `;
    const values = [productId];
    const [result] = await connection.execute(sql, values);
    return result;
};

module.exports = {
    getAllData,
    findById,
    deleteData,
    updateData,
    createData,
    getDataPaginated,
    countAllData,
    checkModalNumExists,
    search,
    createProductFunction,
    findProductFunction,
    deleteProductFunction,
    getDataByCategory,
    getDataByBrandName,
};
