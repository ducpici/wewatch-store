import { connection } from "../../../config/database";

const getDataById = async (id) => {
  const sql = `
        SELECT * FROM position_roles WHERE position_id = ?
    `;
  const values = [id];
  const [result] = await connection.execute(sql, values);
  return result;
};

const createPRData = async (positionId, roleIds) => {
  if (roleIds.length === 0) return;

  const values = roleIds.map((roleId) => [positionId, roleId]);
  await connection.query(
    "INSERT INTO position_roles (position_id, role_id) VALUES ?",
    [values]
  );
};

const updatePRData = async (data) => {
  const sql = `
        UPDATE positions SET name_position = ?, description = ? WHERE id_position = ?
    `;
  const values = [data.name, data.description, data.id];
  const [result] = await connection.execute(sql, values);
  return result;
};

const deletePRData = async (id) => {
  const result = await connection.execute(
    "DELETE FROM position_roles WHERE position_id = ?",
    [id]
  );
  return result;
};

module.exports = {
  createPRData,
  updatePRData,
  getDataById,
  deletePRData,
};
