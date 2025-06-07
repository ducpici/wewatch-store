import { getDataPaginated, countItem } from "./position.modal";

const getPositions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Truy vấn dữ liệu người dùng với giới hạn & phân trang
        const positions = await getDataPaginated(limit, offset);
        const totalItem = await countItem();

        const parsedData = positions.map((position) => ({
            id: position.id_position,
            name: position.name_position,
            description: position.description,
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

module.exports = {
    getPositions,
};
