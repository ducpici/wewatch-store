import { connection } from "../../../config/database";

const getUsersPaginated = async (limit, offset) => {
    const sql = `
        SELECT * FROM users LIMIT ? OFFSET ?
    `;
    const values = [limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const countAllUsers = async () => {
    const sql = `
        SELECT COUNT(*) AS total FROM users;
    `;
    const [result] = await connection.execute(sql);
    return result[0].total;
};

const getAllUser = async () => {
    const sql = `
        select * from users
    `;
    const [result] = await connection.execute(sql);
    return result;
};

const findById = async (id) => {
    const sql = `
        select * from users where id = ? 
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const createUser = async (data) => {
    const sql = `
        insert into users (name, dob, gender, email, address, phone_number, username, password, state) values (?,?,?,?,?,?,?,?,?)
    `;
    const values = [
        data.name,
        data.dob,
        data.gender,
        data.email,
        data.address,
        data.phone_number,
        data.username,
        data.password,
        data.state,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const updateUser = async (id, data) => {
    const sql = `
        UPDATE users
        SET name = ?, dob = ?, gender = ?, email = ?, address = ?, phone_number = ?, username = ?, password = ?, state = ?
        WHERE id = ?
    `;
    const values = [
        data.name,
        data.dob,
        data.gender,
        data.email,
        data.address,
        data.phone_number,
        data.username,
        data.password,
        data.state,
        id,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const deleteUser = async (id) => {
    const sql = `
        delete from users where id = ? 
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const checkEmailExists = async (email, userIdToExclude = null) => {
    let sql = `SELECT id FROM users WHERE email = ?`;
    const values = [email];

    if (userIdToExclude) {
        sql += ` AND id != ?`;
        values.push(userIdToExclude);
    }

    const [result] = await connection.execute(sql, values);
    return result;
};

const checkUsernameExists = async (username, userIdToExclude = null) => {
    let sql = `SELECT id FROM users WHERE username = ?`;
    const values = [username];

    if (userIdToExclude) {
        sql += ` AND id != ?`;
        values.push(userIdToExclude);
    }

    const [result] = await connection.execute(sql, values);
    return result;
};

const search = async (keyword) => {
    const sql = `
            SELECT * FROM users
            WHERE name LIKE ? OR email LIKE ? OR username LIKE ? OR address LIKE ? OR phone_number LIKE ?
        `;
    const values = [
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

module.exports = {
    getAllUser,
    findById,
    deleteUser,
    updateUser,
    createUser,
    getUsersPaginated,
    countAllUsers,
    checkEmailExists,
    checkUsernameExists,
    search,
};
