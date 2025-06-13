import { connection } from "../../../config/database";

const getDataPaginated = async (limit, offset) => {
    const sql = `
        SELECT * FROM brands LIMIT ? OFFSET ?
    `;
    const values = [limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getDataById = async (id) => {
    const sql = `
        SELECT * FROM brands WHERE id_brand = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const countItem = async () => {
    const sql = `
        SELECT COUNT(*) AS total FROM brands;
    `;
    const [result] = await connection.execute(sql);
    return result[0].total;
};

const createData = async (data) => {
    const sql = `
        INSERT INTO brands (brand_name, description, email, phone_num, slug) values (?,?,?,?,?)
    `;
    const values = [
        data.name,
        data.description,
        data.email,
        data.phone_num,
        data.slug,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const updateData = async (data) => {
    const sql = `
        UPDATE brands SET brand_name = ?, description = ?, email = ?, phone_num = ?, slug = ? WHERE id_brand = ?
    `;
    const values = [
        data.name,
        data.description,
        data.email,
        data.phone_num,
        data.slug,
        data.id,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const deleteData = async (id) => {
    const sql = `
        DELETE FROM brands WHERE id_brand = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const searchData = async (keyword) => {
    const sql = `
            SELECT * FROM brands
            WHERE brand_name LIKE ? OR email LIKE ? OR phone_num LIKE ?
        `;

    const value = `%${keyword}%`;
    const values = [value, value, value];
    const [result] = await connection.execute(sql, values);
    return result;
};

const checkEmailExists = async (email, idToExclude = null) => {
    let sql = `SELECT id_brand FROM brands WHERE email = ?`;
    const values = [email];

    if (idToExclude) {
        sql += ` AND id_brand != ?`;
        values.push(idToExclude);
    }

    const [result] = await connection.execute(sql, values);
    return result;
};

module.exports = {
    getDataPaginated,
    countItem,
    createData,
    updateData,
    getDataById,
    deleteData,
    searchData,
    checkEmailExists,
};
