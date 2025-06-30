import {
    getDataPaginated,
    countItem,
    createData,
    updateData,
    getDataById,
    deleteData,
    searchData,
} from "./position_role.modal";
import { connection } from "../../../config/database";

const getPositionRolesById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await getDataById(id);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Fail to get position" });
        }
        const parsedData = result.map((data) => ({
            ...data,
            id: data.role_id,
        }));
        res.status(200).json({ data: parsedData });
    } catch (error) {
        console.error("Error get positions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateRolesOfPosition = async (req, res) => {
    const { id } = req.params;
    const { role_ids } = req.body;

    if (!role_ids || !Array.isArray(role_ids)) {
        return res.status(400).json({ message: "role_ids phải là mảng" });
    }

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        await deleteData(id);
        await createData(id, role_ids);

        await conn.commit();
        res.status(200).json({ message: "Cập nhật quyền thành công" });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    } finally {
        conn.release();
    }
};

module.exports = {
    getPositionRolesById,
    updateRolesOfPosition,
};
