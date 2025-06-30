import { connection } from "../../../config/database";

const getDataPaginated = async (limit, offset) => {
    const sql = `
        SELECT * FROM positions LIMIT ? OFFSET ?
    `;
    const values = [limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getDataById = async (id) => {
    const sql = `
        SELECT * FROM positions WHERE id_position = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const countItem = async () => {
    const sql = `
        SELECT COUNT(*) AS total FROM positions;
    `;
    const [result] = await connection.execute(sql);
    return result[0].total;
};

const createData = async (data) => {
    const sql = `
        INSERT INTO positions (name_position, description) values (?,?)
    `;
    const values = [data.name, data.description];
    const [result] = await connection.execute(sql, values);
    return result;
};

const updateData = async (data) => {
    const sql = `
        UPDATE positions SET name_position = ?, description = ? WHERE id_position = ?
    `;
    const values = [data.name, data.description, data.id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const deleteData = async (id) => {
    const sql = `
        DELETE FROM positions WHERE id_position = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const searchData = async (keyword) => {
    const sql = `
            SELECT * FROM positions
            WHERE name_position LIKE ?
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
