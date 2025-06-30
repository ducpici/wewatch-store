import {
    getDataPaginated,
    countItem,
    createData,
    updateData,
    getDataById,
    deleteData,
    searchData,
} from "./role.modal";

const getRoles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Truy vấn dữ liệu người dùng với giới hạn & phân trang
        const positions = await getDataPaginated(limit, offset);
        const totalItem = await countItem();

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
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Fail to get" });
        }
        const parsedData = result.map((data) => ({
            id: data.id_role,
            name: data.role_name,
            url: data.url,
            description: data.description,
        }));
        res.status(200).json({ data: parsedData });
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
