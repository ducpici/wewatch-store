import {
    getAllUser,
    findById,
    deleteUser,
    createUser,
    updateUser,
    getUsersPaginated,
    countAllUsers,
    checkEmailExists,
    checkUsernameExists,
    search,
} from "./user.modal";
import { formatDate, formatDate2 } from "../../../utils/formatDate";

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Truy vấn dữ liệu người dùng với giới hạn & phân trang
        const users = await getUsersPaginated(limit, offset);
        const totalUsers = await countAllUsers();

        const parsedUsers = users.map((user) => ({
            ...user,
            state: user.state?.[0] === 1 ? "Hoạt động" : "Chặn",
            gender: user.gender === 1 ? "Nam" : "Nữ",
            dob: formatDate(user.dob),
        }));

        res.status(200).json({
            data: parsedUsers,
            pagination: {
                total: totalUsers,
                page,
                limit,
                totalPages: Math.ceil(totalUsers / limit),
            },
        });
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const findUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const parsedUsers = user.map((user) => ({
            ...user,
            state: user.state?.[0] === 1 ? true : false,
            dob: formatDate2(user.dob),
        }));

        res.status(200).json(parsedUsers);
    } catch (error) {
        console.error("Lỗi khi lấy user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const postAddUser = async (req, res) => {
    const data = req.body;
    try {
        const result = await createUser(data);
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Create user error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const putUpdateUser = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const result = await updateUser(id, data);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Update success" });
    } catch (error) {
        console.error("Lỗi khi cập nhật user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleleAUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteUser(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Delete success" });
    } catch (error) {
        console.error("Lỗi khi xóa user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const checkDuplicate = async (req, res) => {
    const { email, username, id_user } = req.query;
    const userId = parseInt(id_user);
    try {
        const emailResult = await checkEmailExists(email, userId);
        const usernameResult = await checkUsernameExists(username, userId);
        res.status(200).json({
            emailExists: emailResult.length > 0,
            usernameExists: usernameResult.length > 0,
        });
    } catch (error) {
        console.error("Lỗi", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const searchUsers = async (req, res) => {
    const { keyword } = req.query;

    try {
        const users = await search(keyword);
        const parsedUsers = users.map((user) => ({
            ...user,
            state: user.state?.[0] === 1 ? "Hoạt động" : "Chặn",
            gender: user.gender === 1 ? "Nam" : "Nữ",
            dob: formatDate(user.dob),
        }));
        res.status(200).json({ data: parsedUsers });
    } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

module.exports = {
    getUsers,
    findUserById,
    deleleAUser,
    postAddUser,
    putUpdateUser,
    checkDuplicate,
    searchUsers,
};
