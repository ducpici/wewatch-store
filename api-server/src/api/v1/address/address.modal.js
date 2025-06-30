import { connection } from "../../../config/database";

const getDataByUserId = async (userId) => {
    const sql = `SELECT * FROM shipping_address WHERE user_id = ?`;
    const value = [userId];
    const [result] = await connection.execute(sql, value);
    return result;
};

const getDataById = async (idShip) => {
    const sql = `SELECT * FROM shipping_address WHERE id_ship = ?`;
    const value = [idShip];
    const [result] = await connection.execute(sql, value);
    return result[0];
};

const createData = async (data) => {
    const sql = `INSERT INTO shipping_address (user_id,full_name, phone_num, city, district, ward, detail, is_default) VALUES (?,?,?,?,?,?,?,?)`;
    const values = [
        data.user_id,
        data.full_name,
        data.phone_num,
        data.city,
        data.district,
        data.ward,
        data.detail,
        data.is_default,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const updateData = async (data) => {
    const sql = `UPDATE shipping_address SET full_name = ?, phone_num = ?, city = ?, district = ?, ward = ?, detail = ?, is_default = ? WHERE id_ship = ?`;
    const values = [
        data.full_name,
        data.phone_num,
        data.city,
        data.district,
        data.ward,
        data.detail,
        data.is_default,
        data.id_ship,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const deleteData = async (idShip) => {
    const sql = `DELETE FROM shipping_address WHERE id_ship = ?`;
    const value = [idShip];
    const [result] = await connection.execute(sql, value);
    return result;
};

const setIsDefaultFalse = async (userId) => {
    const sql = "UPDATE shipping_address SET is_default = 0 WHERE user_id = ?";
    const value = [userId];
    const [result] = await connection.execute(sql, value);
    return result;
};

module.exports = {
    getDataByUserId,
    getDataById,
    updateData,
    createData,
    deleteData,
    setIsDefaultFalse,
};
