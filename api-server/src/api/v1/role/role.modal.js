import { connection } from "../../../config/database";

const getDataPaginated = async (limit, offset) => {
    const sql = `
        SELECT * FROM roles LIMIT ? OFFSET ?
    `;
    const values = [limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getDataById = async (id) => {
    const sql = `
        SELECT * FROM roles WHERE id_role = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const countItem = async () => {
    const sql = `
        SELECT COUNT(*) AS total FROM roles;
    `;
    const [result] = await connection.execute(sql);
    return result[0].total;
};

const createData = async (data) => {
    const sql = `
        INSERT INTO roles (role_name, url, description) values (?,?,?)
    `;
    const values = [data.name, data.url, data.description];
    const [result] = await connection.execute(sql, values);
    return result;
};

const updateData = async (data) => {
    const sql = `
        UPDATE roles SET role_name = ?, url = ?, description = ? WHERE id_role = ?
    `;
    const values = [data.name, data.url, data.description, data.id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const deleteData = async (id) => {
    const sql = `
        DELETE FROM roles WHERE id_role = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const searchData = async (keyword) => {
    const sql = `
            SELECT * FROM roles
            WHERE role_name LIKE ? OR url LIKE ?
        `;

    const value = `%${keyword}%`;
    const values = [value, value];
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
