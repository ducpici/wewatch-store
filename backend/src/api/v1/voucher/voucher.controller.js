import {
    getDataPaginated,
    countItem,
    createData,
    updateData,
    getDataById,
    deleteData,
    searchData,
    checkCodeExists,
} from "./voucher.modal";
import { formatDate, formatDate2 } from "../../../utils/formatDate";

const stateMap = {
    0: "Vô hiệu hóa",
    1: "Hoạt động",
    2: "Hết hạn",
    3: "Đã dùng hết",
    4: "Chưa bắt đầu",
};

const discountTypeMap = {
    1: "Theo phần trăm",
    2: "Theo số tiền",
};

const getVouchers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Truy vấn dữ liệu người dùng với giới hạn & phân trang
        const result = await getDataPaginated(limit, offset);
        const totalItem = await countItem();

        const parsedData = result.map((data) => ({
            ...data,
            id: data.id_voucher,
            start_date: formatDate(data.start_date),
            end_date: formatDate(data.end_date),
            discount_type:
                discountTypeMap[data.discount_type] || "Không xác định",
            status: stateMap[data.status] || "Không xác định",
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

const getVouchersById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await getDataById(id);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Voucher not found" });
        }

        const parsedData = result.map((data) => ({
            ...data,
            id: data.id_voucher,
            start_date: formatDate(data.start_date),
            end_date: formatDate(data.end_date),
            // discount_type:
            //     discountTypeMap[data.discount_type] || "Không xác định",
            // status: stateMap[data.status] || "Không xác định",
        }));

        return res.status(200).json({ data: parsedData });
    } catch (error) {
        console.error("Error getting voucher by id:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const addVoucher = async (req, res) => {
    const data = req.body;
    try {
        const result = await createData(data);
        if (result.affectedRows === 0 || !result.insertId) {
            return res.status(400).json({ message: "Fail to create" });
        }
        res.status(201).json({ message: "Create success" });
    } catch (error) {
        console.error("Error create:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const editVoucher = async (req, res) => {
    const data = req.body;
    const idVoucher = data.id_voucher;
    try {
        const result = await updateData(data, idVoucher);
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ message: "Voucher not found or no changes made" });
        }
        res.status(200).json({ message: "Update success" });
    } catch (error) {
        console.error("Error updating:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteVoucher = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteData(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Voucher not found" });
        }
        res.status(200).json({ message: "Delete success" });
    } catch (error) {
        console.error("Error deleting:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const searchVoucher = async (req, res) => {
    const { keyword } = req.query;

    try {
        const result = await searchData(keyword);
        const parsedData = result.map((data) => ({
            ...data,
            id: data.id_voucher,
            start_date: formatDate(data.start_date),
            end_date: formatDate(data.end_date),
            discount_type:
                discountTypeMap[data.discount_type] || "Không xác định",
            status: stateMap[data.status] || "Không xác định",
        }));
        res.status(200).json({ data: parsedData });
    } catch (err) {
        console.error("Fail to search:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const checkDuplicate = async (req, res) => {
    const { code, id } = req.query;
    const voucherId = parseInt(id);
    try {
        const result = await checkCodeExists(code, voucherId);
        res.status(200).json({
            codeExists: result.length > 0,
        });
    } catch (error) {
        console.error("Lỗi", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getVouchers,
    addVoucher,
    editVoucher,
    getVouchersById,
    deleteVoucher,
    searchVoucher,
    checkDuplicate,
};
