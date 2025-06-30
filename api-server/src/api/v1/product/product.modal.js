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

const countProductByCategory = async (slug) => {
    const sql = `
        select COUNT(*) AS total from products p JOIN categories c ON p.category_id = c.id_category WHERE c.slug = ? and p.state = 1
    `;
    const value = [slug];
    const [result] = await connection.execute(sql, value);
    return result[0].total;
};

const countProductByBrand = async (slug) => {
    const sql = `
        select COUNT(*) AS total from products p JOIN brands b ON p.brand_id = b.id_brand WHERE b.slug = ? AND p.state = 1
    `;
    const value = [slug];
    const [result] = await connection.execute(sql, value);
    return result[0].total;
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
            where p.id_product = ? 
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const findProductBySlug = async (slug) => {
    const sql = `
        SELECT 
        *,b.slug as brand_slug
        FROM products p
        JOIN categories c ON p.category_id = c.id_category
        JOIN brands b ON p.brand_id = b.id_brand
        JOIN product_function pf ON p.id_product = pf.product_id 
        JOIN functions f ON f.id_function = pf.function_id
        WHERE p.slug = ? AND p.state = 1
    `;
    const values = [slug];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getDataByCategory = async (slug, limit, offset) => {
    const sql = `
        SELECT 
            p.*, 
            b.*, 
            c.*, 
            p.slug AS product_slug, 
            b.slug AS brand_slug, 
            c.slug AS category_slug
        FROM products p 
        JOIN brands b ON p.brand_id = b.id_brand
        JOIN categories c ON p.category_id = c.id_category
        WHERE c.slug = ?
        AND p.state = 1
        LIMIT ? OFFSET ?
    `;
    const values = [slug, limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getDataByBrand = async (slug, limit, offset) => {
    const sql = `
        SELECT 
            p.*, 
            b.*, 
            c.*, 
            p.slug AS product_slug, 
            b.slug AS brand_slug, 
            c.slug AS category_slug
        FROM products p 
        JOIN brands b ON p.brand_id = b.id_brand
        JOIN categories c ON p.category_id = c.id_category
        WHERE b.slug = ?
        AND p.state = 1
        LIMIT ? OFFSET ?
    `;
    const values = [slug, limit, offset];
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
        insert into products (modal_num, brand_id, origin, crystal_material, movement_type, dial_diameter, case_thickness, strap_material, water_resistance, category_id, quantity, price, state, image, slug) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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
        data.slug,
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
    p.slug AS product_slug,
    p.image,
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

const getProductReviews = async (productId) => {
    const sql = `SELECT r.comment, r.created_at, r.rating, u.name FROM products p JOIN reviews r ON r.product_id = p.id_product JOIN users u ON r.user_id = u.id WHERE p.id_product = ?`;
    const value = [productId];
    const [result] = await connection.execute(sql, value);
    return result;
};

const addReview = async (productId, userId, rating, comment, createdAt) => {
    const sql = `INSERT INTO reviews (product_id, user_id, rating, comment, created_at) VALUES (?,?,?,?,?)`;
    const values = [productId, userId, rating, comment, createdAt];
    const [result] = await connection.execute(sql, values);
    console.log(result);
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
    getDataByBrand,
    countProductByCategory,
    countProductByBrand,
    findProductBySlug,
    getProductReviews,
    addReview,
};
