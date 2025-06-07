import { connection } from "../../../config/database";

const getDataPaginated = async (limit, offset) => {
    const sql = `
        SELECT * FROM positions LIMIT ? OFFSET ?
    `;
    const values = [limit, offset];
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

module.exports = {
    getDataPaginated,
    countItem,
};
