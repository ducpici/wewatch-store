import {
    getDataPaginated,
    countItem,
    createData,
    updateData,
    getDataById,
    deleteData,
    searchData,
    setStateFalse,
} from "./banner.modal";
const path = require("path");
const fs = require("fs");

const getBanners = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = page && limit ? (page - 1) * limit : null;

        const filterState = req.query.state ? parseInt(req.query.state) : null;

        // Truy vấn dữ liệu người dùng với giới hạn & phân trang
        const result = await getDataPaginated(limit, offset, filterState);
        const totalItem = await countItem(filterState);

        const parsedData = result.map((data) => ({
            id_banner: data.id_banner,
            image_name: data.image_name,
            state: data.state?.[0] === 1 ? "Hoạt động" : "Vô hiệu hóa",
        }));

        // res.status(200).json({
        //     data: parsedData,
        //     pagination: {
        //         total: totalItem,
        //         page,
        //         limit,
        //         totalPages: Math.ceil(totalItem / limit),
        //     },
        // });
        // Chỉ trả pagination nếu có page/limit
        const response = { data: parsedData };

        // Chỉ trả pagination nếu có page/limit
        if (page && limit) {
            response.pagination = {
                total: totalItem,
                page,
                limit,
                totalPages: Math.ceil(totalItem / limit),
            };
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error getting:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getBannersById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await getDataById(id);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Fail to get" });
        }
        const parsedData = result.map((data) => ({
            id_banner: data.id_banner,
            image_name: data.image_name,
            state: data.state?.[0] === 1 ? true : false,
        }));
        res.status(200).json({ data: parsedData });
    } catch (error) {
        console.error("Error get:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const addBanner = async (req, res) => {
    const state = req.body.state === "1" ? 1 : 0;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Ảnh banner là bắt buộc" });
    }

    const imagePath = `/uploads/banners/${file.filename}`;

    const newData = {
        state,
        image_name: imagePath,
    };

    console.log(newData);

    try {
        if (state === 1) {
            await setStateFalse();
        }
        const result = await createData(newData);
        if (result.affectedRows === 0 || !result.insertId) {
            return res.status(400).json({ message: "Fail create" });
        }
        res.status(201).json({ message: "Create success" });
    } catch (error) {
        console.error("Error create:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const editBanner = async (req, res) => {
    const id = req.params.id;
    const state = req.body.state === "1" ? 1 : 0;
    const file = req.file;

    try {
        const dataToUpdate = {
            state,
        };
        const banner = await getDataById(id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        if (file) {
            const oldImagePath = path.join(
                process.cwd(),
                "public",
                banner[0].image_name
            );

            // Cập nhật đường dẫn ảnh mới
            dataToUpdate.image_name = "/uploads/banners/" + file.filename;

            // Xóa ảnh cũ
            fs.unlink(oldImagePath, (err) => {
                if (err && err.code !== "ENOENT") {
                    console.error("Không thể xóa ảnh cũ:", err);
                }
            });
        }
        if (state === 1) {
            await setStateFalse();
        }
        const result = await updateData(id, dataToUpdate);
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ message: "Banner not found or no changes made" });
        }
        res.status(200).json({ message: "Update success" });
    } catch (error) {
        console.error("Error updating positions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteBanner = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Lấy banner từ DB để biết ảnh nào đang được dùng
        const banner = await getDataById(id);
        console.log(banner);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        const imagePath = path.join(
            process.cwd(),
            "public",
            banner[0].image_name
        );

        console.log(imagePath);
        // 2. Xóa khỏi DB
        const result = await deleteData(id);
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ message: "Banner not found or already deleted" });
        }

        // 3. Xóa file khỏi ổ cứng (nếu tồn tại)
        fs.unlink(imagePath, (err) => {
            if (err && err.code !== "ENOENT") {
                console.error("Error deleting image file:", err);
            }
        });

        res.status(200).json({ message: "Delete success" });
    } catch (error) {
        console.error("Error deleting banner:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const searchBanner = async (req, res) => {
    const { keyword } = req.query;

    try {
        const result = await searchData(keyword);
        const parsedData = result.map((data) => ({
            id_banner: data.id_banner,
            image_name: data.image_name,
            state: data.state?.[0] === 1 ? true : false,
        }));
        res.status(200).json({ data: parsedData });
    } catch (err) {
        console.error("Fail to search:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getActiveBanner = async (req, res) => {
    try {
        const banners = await db.query(`
            SELECT * FROM banners 
            WHERE state = 1 
            ORDER BY created_at DESC
        `);
        return res.status(200).json({ data: banners });
    } catch (error) {
        console.error("Error fetching banners:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getBanners,
    addBanner,
    editBanner,
    getBannersById,
    deleteBanner,
    searchBanner,
    getActiveBanner,
};
