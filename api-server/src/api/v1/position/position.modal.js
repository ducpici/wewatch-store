import { connection } from "../../../config/database";

// const getDataPaginated = async (limit, offset) => {
//     const sql = `
//         SELECT * FROM positions LIMIT ? OFFSET ?
//     `;
//     const values = [limit, offset];
//     const [result] = await connection.execute(sql, values);
//     return result;
// };
const getDataPaginated = async (limit, offset) => {
  const sql = `
        SELECT 
    p.id_position,
    p.name_position,
    p.description AS position_description,

    r.id_role,
    r.role_name,
    r.url,
    r.description AS role_description

FROM positions p
LEFT JOIN position_roles pr 
       ON p.id_position = pr.position_id
LEFT JOIN roles r 
       ON pr.role_id = r.id_role LIMIT ? OFFSET ?
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

const getPositionsPaginated = async (limit, offset) => {
  const sql = `
    SELECT id_position, name_position, description
    FROM positions
    ORDER BY id_position
    LIMIT ? OFFSET ?;
  `;
  const [rows] = await connection.execute(sql, [limit, offset]);
  return rows;
};

const getRolesByPositions = async (positionIds) => {
  if (!positionIds.length) return [];
  const sql = `
    SELECT pr.position_id, r.id_role, r.role_name, r.url, r.description
    FROM position_roles pr
    JOIN roles r ON pr.role_id = r.id_role
    WHERE pr.position_id IN (?)
  `;
  const [rows] = await connection.query(sql, [positionIds]);
  return rows;
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
  getPositionsPaginated,
  getRolesByPositions,
  countItem,
  createData,
  updateData,
  getDataById,
  deleteData,
  searchData,
};
