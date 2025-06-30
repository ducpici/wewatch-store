import { connection } from "../../../config/database";

const getDataPaginated = async (limit, offset) => {
    const sql = `
        SELECT * FROM vouchers LIMIT ? OFFSET ?
    `;
    const values = [limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const getDataById = async (id) => {
    const sql = `
        SELECT * FROM vouchers WHERE id_voucher = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const countItem = async () => {
    const sql = `
        SELECT COUNT(*) AS total FROM vouchers;
    `;
    const [result] = await connection.execute(sql);
    return result[0].total;
};

const createData = async (data) => {
    const sql = `
        INSERT INTO vouchers (code, discount_type, discount_value, description, quantity, used_count, start_date, end_date) values (?,?,?,?,?,?,?,?)
    `;
    const values = [
        data.code,
        data.discount_type,
        data.discount_value,
        data.description,
        data.quantity,
        data.used_count,
        data.start_date,
        data.end_date,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const updateData = async (data, id) => {
    const sql = `
        UPDATE vouchers SET code = ?, discount_type = ?, discount_value = ?, description = ?, quantity = ?, used_count = ?, start_date = ? , end_date = ? WHERE id_voucher = ?
    `;
    const values = [
        data.code,
        data.discount_type,
        data.discount_value,
        data.description,
        data.quantity,
        data.used_count,
        data.start_date,
        data.end_date,
        id,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const deleteData = async (id) => {
    const sql = `
        DELETE FROM vouchers WHERE id_voucher = ?
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const searchData = async (keyword) => {
    const sql = `
            SELECT * FROM vouchers
            WHERE code LIKE ? OR description LIKE ? OR discount_value LIKE ? OR status LIKE ?
        `;

    const value = `%${keyword}%`;
    const values = [value, value, value, value];
    const [result] = await connection.execute(sql, values);
    return result;
};

const checkCodeExists = async (code, idToExclude = null) => {
    let sql = `SELECT id_voucher FROM vouchers WHERE code = ?`;
    const values = [code];

    if (idToExclude) {
        sql += ` AND id_voucher != ?`;
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
    checkCodeExists,
};
