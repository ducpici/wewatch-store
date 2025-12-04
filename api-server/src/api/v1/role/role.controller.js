import {
  getDataPaginated,
  countItem,
  createData,
  updateData,
  getDataById,
  deleteData,
  searchData,
  getAllRoles,
} from "./role.modal";

function mapRole(data) {
  return {
    id: data.id_role,
    name: data.role_name,
    url: data.url,
    description: data.description,
  };
}

const getRoles = async (req, res) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const totalItem = await countItem();
    // Không có page/limit -> trả full list
    if (!page || !limit) {
      const data = await getAllRoles();
      return res.status(200).json({
        message: "success",
        data: data.map(mapRole),
        pagination: {
          total: totalItem,
        },
      });
    }

    // Truy vấn dữ liệu người dùng với giới hạn & phân trang
    const offset = (page - 1) * limit;
    const positions = await getDataPaginated(limit, offset);

    const parsedData = positions.map((data) => ({
      id: data.id_role,
      name: data.role_name,
      url: data.url,
      description: data.description,
    }));

    res.status(200).json({
      data: parsedData,
      pagination: {
        total: totalItem,
        page,
        limit,
        totalPages: Math.ceil(totalItem / limit),
      },
    });
  } catch (error) {
    console.error("Error getting:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRolesById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getDataById(id);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Role not found" });
    }
    const parsedData = result.map((data) => ({
      id: data.id_role,
      name: data.role_name,
      url: data.url,
      description: data.description,
    }));
    res.status(200).json({ data: parsedData[0], message: "success" });
  } catch (error) {
    console.error("Error get:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addRole = async (req, res) => {
  const data = req.body;
  try {
    const result = await createData(data);
    if (result.affectedRows === 0 || !result.insertId) {
      return res.status(400).json({ message: "Fail create" });
    }
    res.status(201).json({ message: "Create success" });
  } catch (error) {
    console.error("Error create:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editRole = async (req, res) => {
  const data = req.body;
  try {
    const result = await updateData(data);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Role not found or no changes made" });
    }
    res.status(200).json({ message: "Update success" });
  } catch (error) {
    console.error("Error updating:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteData(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json({ message: "Delete success" });
  } catch (error) {
    console.error("Error deleting:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchRole = async (req, res) => {
  const { keyword } = req.query;

  try {
    const result = await searchData(keyword);
    const parsedData = result.map((data) => ({
      id: data.id_role,
      name: data.role_name,
      url: data.url,
      description: data.description,
    }));
    res.status(200).json({ data: parsedData });
  } catch (err) {
    console.error("Fail to search:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getRoles,
  addRole,
  editRole,
  getRolesById,
  deleteRole,
  searchRole,
};
