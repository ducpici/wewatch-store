import { connection } from "../../../config/database";

const getDataPaginated = async (limit, offset) => {
    const sql = `
        SELECT * FROM banners LIMIT ? OFFSET ?
    `;
    const values = [limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getDataById = async (id) => {
    const sql = `
        SELECT * FROM banners WHERE id_banner = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const countItem = async () => {
    const sql = `
        SELECT COUNT(*) AS total FROM banners;
    `;
    const [result] = await connection.execute(sql);
    return result[0].total;
};

const createData = async (data) => {
    const sql = `
        INSERT INTO banners (image_name, state) values (?,?)
    `;
    const values = [data.image_name, data.state];
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

    const sql = `UPDATE banners SET ${fields.join(", ")} WHERE id_banner = ?`;
    values.push(id);

    return connection.execute(sql, values);
};

const deleteData = async (id) => {
    const sql = `
        DELETE FROM banners WHERE id_banner = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const searchData = async (keyword) => {
    const sql = `
            SELECT * FROM banners
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
