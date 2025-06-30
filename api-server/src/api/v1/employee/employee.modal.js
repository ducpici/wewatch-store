import { connection } from "../../../config/database";

const getEmployeesPaginated = async (limit, offset) => {
    const sql = `
        SELECT * FROM employees, positions where employees.position_id = positions.id_position LIMIT ? OFFSET ?
    `;
    const values = [limit, offset];
    const [result] = await connection.execute(sql, values);
    return result;
};

const countAllEmployees = async () => {
    const sql = `
        SELECT COUNT(*) AS total FROM employees;
    `;
    const [result] = await connection.execute(sql);
    return result[0].total;
};

const getAllEmployee = async () => {
    const sql = `
        select * from employees
    `;
    const [result] = await connection.execute(sql);
    return result;
};

const findById = async (id) => {
    const sql = `
        SELECT * FROM employees where id = ? 
    `;
    //     const sql = `
    //     SELECT * FROM employees, positions where employees.position_id = positions.id_position and id = ?
    // `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const createEmployee = async (data) => {
    const sql = `
        insert into employees (name, dob, gender, email, address, phone_number, position_id, username, password, state) values (?,?,?,?,?,?,?,?,?,?)
    `;
    const values = [
        data.name,
        data.dob,
        data.gender,
        data.email,
        data.address,
        data.phone_number,
        data.position_id,
        data.username,
        data.password,
        data.state,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const updateEmployee = async (id, data) => {
    const sql = `
        UPDATE employees
        SET name = ?, dob = ?, gender = ?, email = ?, address = ?, phone_number = ?, position_id=?, username = ?, password = ?, state = ?
        WHERE id = ?
    `;
    const values = [
        data.name,
        data.dob,
        data.gender,
        data.email,
        data.address,
        data.phone_number,
        data.position_id,
        data.username,
        data.password,
        data.state,
        id,
    ];
    const [result] = await connection.execute(sql, values);
    return result;
};

const deleteEmployee = async (id) => {
    const sql = `
        delete from employees where id = ? 
    `;
    const values = [id];
    const [result] = await connection.execute(sql, values);
    return result;
};

const checkEmailExists = async (email, userIdToExclude = null) => {
    let sql = `SELECT id FROM employees WHERE email = ?`;
    const values = [email];

    if (userIdToExclude) {
        sql += ` AND id != ?`;
        values.push(userIdToExclude);
    }

    const [result] = await connection.execute(sql, values);
    return result;
};

const checkUsernameExists = async (username, userIdToExclude = null) => {
    let sql = `SELECT id FROM employees WHERE username = ?`;
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
        SELECT employees.*, positions.name_position, positions.description 
        FROM employees
        JOIN positions ON employees.position_id = positions.id_position
        WHERE 
            employees.name LIKE ?
            OR employees.email LIKE ?
            OR employees.username LIKE ?
            OR employees.address LIKE ?
            OR employees.phone_number LIKE ?
            OR positions.name_position LIKE ?
    `;
    const values = [
        `%${keyword}%`,
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
    getAllEmployee,
    findById,
    deleteEmployee,
    updateEmployee,
    createEmployee,
    getEmployeesPaginated,
    countAllEmployees,
    checkEmailExists,
    checkUsernameExists,
    search,
};
