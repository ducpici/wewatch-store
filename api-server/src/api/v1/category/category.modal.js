import { connection } from "../../../config/database";

const getDataPaginated = async (limit, offset) => {
    const sql = `
        SELECT * FROM categories LIMIT ? OFFSET ?
    `;
    const values = [limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getDataById = async (id) => {
    const sql = `
        SELECT * FROM categories WHERE id_category = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const countItem = async () => {
    const sql = `
        SELECT COUNT(*) AS total FROM categories;
    `;
    const [result] = await connection.execute(sql);
    return result[0].total;
};

const createData = async (data) => {
    const sql = `
        INSERT INTO categories (category_name, description, slug) values (?,?,?)
    `;
    const values = [data.name, data.description, data.slug];
    const [result] = await connection.execute(sql, values);
    return result;
};

const updateData = async (data) => {
    const sql = `
        UPDATE categories SET category_name = ?, description = ?, slug = ? WHERE id_category = ?
    `;
    const values = [data.name, data.description, data.slug, data.id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const deleteData = async (id) => {
    const sql = `
        DELETE FROM categories WHERE id_category = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const searchData = async (keyword) => {
    const sql = `
            SELECT * FROM categories
            WHERE category_name LIKE ?
        `;

    const value = `%${keyword}%`;
    const values = [value];
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
};
