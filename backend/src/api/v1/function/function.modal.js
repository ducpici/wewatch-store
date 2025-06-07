import { connection } from "../../../config/database";

const getDataPaginated = async (limit, offset) => {
    const sql = `
        SELECT * FROM functions LIMIT ? OFFSET ?
    `;
    const values = [limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getDataById = async (id) => {
    const sql = `
        SELECT * FROM functions WHERE id_function = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const countItem = async () => {
    const sql = `
        SELECT COUNT(*) AS total FROM functions;
    `;
    const [result] = await connection.execute(sql);
    return result[0].total;
};

const createData = async (data) => {
    const sql = `
        INSERT INTO functions (name_function,description) values (?,?)
    `;
    const values = [data.name, data.description];
    const [result] = await connection.execute(sql, values);
    return result;
};

const updateData = async (data) => {
    const sql = `
        UPDATE functions SET name_function = ?, description = ? WHERE id_function = ?
    `;
    const values = [data.name, data.description, data.id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const deleteData = async (id) => {
    const sql = `
        DELETE FROM functions WHERE id_function = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const searchData = async (keyword) => {
    const sql = `
            SELECT * FROM functions
            WHERE name_function LIKE ?
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
