import { connection } from "../../../config/database";

// const getUsersPaginated = async (limit, offset) => {
//   const sql = `
//         SELECT * FROM users LIMIT ? OFFSET ?
//     `;
//   const values = [limit, offset];
//   const [result] = await connection.execute(sql, values);
//   return result;
// };

const getUsersPaginated = async ({
  limit,
  offset,
  orderBy,
  order,
  filters,
}) => {
  let sql = "SELECT * FROM users WHERE 1=1";
  const params = [];

  if (filters.name) {
    sql += " AND name LIKE ?";
    params.push(`%${filters.name}%`);
  }

  if (filters.gender) {
    sql += " AND gender = ?";
    params.push(`${filters.gender}`);
  }

  if (filters.email) {
    sql += " AND email LIKE ?";
    params.push(`%${filters.email}%`);
  }

  if (filters.state) {
    sql += " AND state = ?";
    params.push(`${filters.state}`);
  }

  if (filters.keyword) {
    sql += ` AND name LIKE ? 
      OR email LIKE ? 
      OR username LIKE ? 
      OR address LIKE ? 
      OR phone_number LIKE ?`;
    params.push(`%${filters.keyword}%`);
    params.push(`%${filters.keyword}%`);
    params.push(`%${filters.keyword}%`);
    params.push(`%${filters.keyword}%`);
    params.push(`%${filters.keyword}%`);
  }

  sql += ` ORDER BY ${orderBy} ${order}`;
  sql += " LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [result] = await connection.execute(sql, params);
  return result;
};

const countAllUsers = async () => {
  const sql = `
        SELECT COUNT(*) AS total FROM users;
    `;
  const [result] = await connection.execute(sql);
  return result[0].total;
};

const countUsersByFilters = async (filters) => {
  let sql = "SELECT COUNT(*) AS total FROM users WHERE 1=1";
  const params = [];

  if (filters.name) {
    sql += " AND name LIKE ?";
    params.push(`%${filters.name}%`);
  }

  if (filters.gender) {
    sql += " AND gender = ?";
    params.push(`${filters.gender}`);
  }

  if (filters.email) {
    sql += " AND email LIKE ?";
    params.push(`%${filters.email}%`);
  }

  if (filters.state) {
    sql += " AND state = ?";
    params.push(`${filters.state}`);
  }

  if (filters.keyword) {
    sql += ` AND name LIKE ? 
      OR email LIKE ? 
      OR username LIKE ? 
      OR address LIKE ? 
      OR phone_number LIKE ?`;
    params.push(`%${filters.keyword}%`);
    params.push(`%${filters.keyword}%`);
    params.push(`%${filters.keyword}%`);
    params.push(`%${filters.keyword}%`);
    params.push(`%${filters.keyword}%`);
  }

  const [result] = await connection.query(sql, params);
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

// const updateUser = async (id, data) => {
//     const sql = `
//         UPDATE users
//         SET name = ?, dob = ?, gender = ?, email = ?, address = ?, phone_number = ?, username = ?, password = ?, state = ?
//         WHERE id = ?
//     `;
//     const values = [
//         data.name,
//         data.dob,
//         data.gender,
//         data.email,
//         data.address,
//         data.phone_number,
//         data.username ?? null,
//         data.password ?? null,
//         data.state,
//         id,
//     ];
//     const [result] = await connection.execute(sql, values);
//     return result;
// };

const updateUser = async (id, data) => {
  let sql = `
    UPDATE users
    SET name = ?, dob = ?, gender = ?, email = ?, address = ?, phone_number = ?, state = ?
  `;

  const values = [
    data.name ?? null,
    data.dob ?? null,
    data.gender !== undefined ? Number(data.gender) : null,
    data.email ?? null,
    data.address ?? null,
    data.phone_number ?? null,
    data.state !== undefined ? (data.state ? 1 : 0) : null,
  ];

  if (data.username !== undefined) {
    sql += `, username = ?`;
    values.push(data.username);
  }

  if (data.password !== undefined) {
    sql += `, password = ?`;
    values.push(data.password);
  }

  sql += ` WHERE id = ?`;
  values.push(id);

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

// const search = async (keyword) => {
//   const sql = `
//             SELECT * FROM users
//             WHERE name LIKE ? OR email LIKE ? OR username LIKE ? OR address LIKE ? OR phone_number LIKE ?
//         `;
//   const values = [
//     `%${keyword}%`,
//     `%${keyword}%`,
//     `%${keyword}%`,
//     `%${keyword}%`,
//     `%${keyword}%`,
//   ];
//   const [result] = await connection.execute(sql, values);
//   return result;
// };

const search = async (keyword, limit, offset) => {
  const kw = `%${keyword}%`;

  const sql = `
    SELECT * FROM users
    WHERE name LIKE ? 
      OR email LIKE ? 
      OR username LIKE ? 
      OR address LIKE ? 
      OR phone_number LIKE ?
    LIMIT ? OFFSET ?
  `;

  const params = [kw, kw, kw, kw, kw, limit, offset];

  const [result] = await connection.execute(sql, params);
  return result;
};

const countSearch = async (keyword) => {
  const kw = `%${keyword}%`;
  const sql = `
            SELECT COUNT(*) as total FROM users
            WHERE name LIKE ? OR email LIKE ? OR username LIKE ? OR address LIKE ? OR phone_number LIKE ?
        `;
  const params = [kw, kw, kw, kw, kw];
  const [result] = await connection.execute(sql, params);
  return result[0].total;
};

module.exports = {
  getAllUser,
  findById,
  deleteUser,
  updateUser,
  createUser,
  getUsersPaginated,
  countAllUsers,
  countUsersByFilters,
  checkEmailExists,
  checkUsernameExists,
  search,
  countSearch,
};
