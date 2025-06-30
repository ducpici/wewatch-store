import {
    getDataPaginated,
    countItem,
    createData,
    updateData,
    getDataById,
    deleteData,
    searchData,
} from "./position.modal";

const getPositions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Truy vấn dữ liệu người dùng với giới hạn & phân trang
        const positions = await getDataPaginated(limit, offset);
        const totalItem = await countItem();

        const parsedData = positions.map((data) => ({
            id: data.id_position,
            name: data.name_position,
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
        const parsedData = result.map((position) => ({
            id: position.id_position,
            name: position.name_position,
            description: position.description,
        }));
        res.status(200).json({ data: parsedData });
    } catch (error) {
        console.error("Error get positions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const addPosition = async (req, res) => {
    const data = req.body;
    try {
        const result = await createData(data);
        if (result.affectedRows === 0 || !result.insertId) {
            return res.status(400).json({ message: "Fail create position" });
        }
        res.status(201).json({ message: "Create success" });
    } catch (error) {
        console.error("Error create positions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const editPosition = async (req, res) => {
    const data = req.body;
    try {
        const result = await updateData(data);
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ message: "Position not found or no changes made" });
        }
        res.status(200).json({ message: "Update success" });
    } catch (error) {
        console.error("Error updating positions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deletePosition = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteData(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Position not found" });
        }
        res.status(200).json({ message: "Delete success" });
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
