import {
  getDataPaginated,
  getPositionsPaginated,
  getRolesByPositions,
  countItem,
  createData,
  updateData,
  getDataById,
  deleteData,
  searchData,
} from "./position.modal";
import {
  createPRData,
  updatePRData,
  deletePRData,
} from "../position_role/position_role.modal";
import { connection } from "../../../config/database";
const colors = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
];

function getColorById(id) {
  return colors[id % colors.length]; // cứ vòng lại khi hết màu
}

const getPositions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const totalItem = await countItem();
    const totalPages = Math.ceil(totalItem / limit);
    const currentPage = page > totalPages ? totalPages : page;
    const offset = (page - 1) * limit;
    const positions = await getPositionsPaginated(limit, offset);
    const positionIds = positions.map((p) => p.id_position);
    const roles = await getRolesByPositions(positionIds);

    const roleMap = new Map();
    roles.forEach((r) => {
      if (!roleMap.has(r.position_id)) roleMap.set(r.position_id, []);
      roleMap.get(r.position_id).push({
        id: r.id_role,
        name: r.role_name,
        url: r.url,
        description: r.description,
        color: getColorById(r.id_role),
      });
    });

    const parsedData = positions.map((p) => ({
      id: p.id_position,
      name: p.name_position,
      description: p.description,
      roles: roleMap.get(p.id_position) || [],
    }));

    res.status(200).json({
      data: parsedData,
      pagination: {
        total: totalItem,
        page,
        limit,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error getting positions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPositionsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getDataById(id);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Fail to get position" });
    }
    const roles = await getRolesByPositions(id);
    const roleMap = new Map();
    roles.forEach((r) => {
      if (!roleMap.has(r.position_id)) roleMap.set(r.position_id, []);
      roleMap.get(r.position_id).push({
        id: r.id_role,
        name: r.role_name,
        url: r.url,
        description: r.description,
      });
    });

    const parsedData = result.map((p) => ({
      id: p.id_position,
      name: p.name_position,
      description: p.description,
      roles: roleMap.get(p.id_position) || [],
    }));
    res.status(200).json({ message: "success", data: parsedData[0] });
  } catch (error) {
    console.error("Error get positions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addPosition = async (req, res) => {
  const data = req.body;
  const role_ids = data.roles;
  try {
    const result = await createData(data);
    if (result.affectedRows === 0 || !result.insertId) {
      return res.status(400).json({ message: "Fail create position" });
    }
    await createPRData(result.insertId, role_ids);
    res.status(201).json({ message: "Tạo thành công" });
  } catch (error) {
    console.error("Error create positions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editPosition = async (req, res) => {
  const { id, roles: role_ids, ...positionData } = req.body;

  if (!role_ids || !Array.isArray(role_ids)) {
    return res.status(400).json({ message: "role_ids phải là mảng" });
  }

  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    // Xóa role cũ + thêm role mới
    await deletePRData(id, conn); // đảm bảo deletePRData nhận connection
    await createPRData(id, role_ids, conn); // đảm bảo createPRData nhận connection

    // Cập nhật thông tin position
    const result = await updateData({ id, ...positionData }, conn);
    if (result.affectedRows === 0) {
      await conn.rollback();
      return res
        .status(404)
        .json({ message: "Position không tồn tại hoặc không có thay đổi" });
    }

    await conn.commit();
    return res.status(200).json({ message: "Cập nhật thành công" });
  } catch (err) {
    await conn.rollback();
    console.error("Error editing position:", err);
    return res.status(500).json({ message: "Lỗi server" });
  } finally {
    conn.release();
  }
};

const deletePosition = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteData(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Position not found" });
    }
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    console.error("Error deleting position:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchPosition = async (req, res) => {
  const { keyword } = req.query;

  try {
    const result = await searchData(keyword);
    const parsedData = result.map((data) => ({
      id: data.id_position,
      name: data.name_position,
      description: data.description,
    }));
    res.status(200).json({ data: parsedData });
  } catch (err) {
    console.error("Fail to search:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getPositions,
  addPosition,
  editPosition,
  getPositionsById,
  deletePosition,
  searchPosition,
};
