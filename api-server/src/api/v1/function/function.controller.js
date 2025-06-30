import {
    getDataPaginated,
    countItem,
    createData,
    updateData,
    getDataById,
    deleteData,
    searchData,
} from "./function.modal";

const getFunctions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        // Truy vấn dữ liệu
        const result = await getDataPaginated(limit, offset);
        const totalItem = await countItem();

        const parsedData = result.map((data) => ({
            id: data.id_function,
            name: data.name_function,
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
        console.error("Error getting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getFunctionsById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await getDataById(id);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Fail to get data" });
        }
        const parsedData = result.map((data) => ({
            id: data.id_function,
            name: data.name_function,
            description: data.description,
        }));
        res.status(200).json({ data: parsedData });
    } catch (error) {
        console.error("Error get data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const addFunction = async (req, res) => {
    const data = req.body;
    try {
        const result = await createData(data);
        if (result.affectedRows === 0 || !result.insertId) {
            return res.status(400).json({ message: "Fail create data" });
        }
        res.status(201).json({ message: "Create success" });
    } catch (error) {
        console.error("Error create data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const editFunction = async (req, res) => {
    const data = req.body;
    try {
        const result = await updateData(data);
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ message: "Data not found or no changes made" });
        }
        res.status(200).json({ message: "Update success" });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteFunction = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteData(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({ message: "Delete success" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const searchFunction = async (req, res) => {
    const { keyword } = req.query;

    try {
        const result = await searchData(keyword);
        const parsedData = result.map((data) => ({
            id: data.id_function,
            name: data.name_function,
            description: data.description,
        }));
        res.status(200).json({ data: parsedData });
    } catch (err) {
        console.error("Fail to search:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getFunctions,
    addFunction,
    editFunction,
    getFunctionsById,
    deleteFunction,
    searchFunction,
};
