import {
    getAllEmployee,
    findById,
    deleteEmployee,
    createEmployee,
    updateEmployee,
    getEmployeesPaginated,
    countAllEmployees,
    checkEmailExists,
    checkUsernameExists,
    search,
} from "./employee.modal";
import { formatDate, formatDate2 } from "../../../utils/formatDate";
import { hashPass } from "../../../utils/hashPass";
import { connection } from "../../../config/database";
import bcrypt from "bcrypt";

const getEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Truy vấn dữ liệu người dùng với giới hạn & phân trang
        const employees = await getEmployeesPaginated(limit, offset);
        const totalEmployees = await countAllEmployees();

        const parsedEmployees = employees.map((employee) => ({
            id: employee.id,
            name: employee.name,
            dob: formatDate(employee.dob),
            gender: employee.gender === 1 ? "Nam" : "Nữ",
            email: employee.email,
            address: employee.address,
            phone_number: employee.phone_number,
            username: employee.username,
            state: employee.state?.[0] === 1 ? "Hoạt động" : "Chặn",
            position: {
                id: employee.position_id || employee.id_position,
                name: employee.name_position,
                description: employee.description,
            },
        }));

        res.status(200).json({
            data: parsedEmployees,
            pagination: {
                total: totalEmployees,
                page,
                limit,
                totalPages: Math.ceil(totalEmployees / limit),
            },
        });
    } catch (error) {
        console.error("Error getting employees:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const findEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await findById(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        const parsedEmployees = employee.map((employee) => ({
            id: employee.id,
            name: employee.name,
            dob: formatDate2(employee.dob),
            gender: employee.gender === 1 ? 1 : 0,
            email: employee.email,
            address: employee.address,
            phone_number: employee.phone_number,
            position_id: employee.position_id,
            username: employee.username,
            password: employee.password,
            state: employee.state?.[0] === 1 ? true : false,
            // position: {
            //     id: employee.position_id || employee.id_position,
            //     name: employee.name_position,
            //     description: employee.description,
            // },
        }));

        res.status(200).json(parsedEmployees);
    } catch (error) {
        console.error("Lỗi khi lấy employee:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const postAddEmployee = async (req, res) => {
    const data = {
        ...req.body,
        password: await hashPass(req.body.password),
    };
    try {
        const result = await createEmployee(data);
        res.status(201).json({ message: "Employee created successfully" });
    } catch (err) {
        console.error("Create employee error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const putUpdateEmployee = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const result = await updateEmployee(id, data);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({ message: "Update success" });
    } catch (error) {
        console.error("Lỗi khi cập nhật employee:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleleEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteEmployee(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({ message: "Delete success" });
    } catch (error) {
        console.error("Lỗi khi xóa employee:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const checkDuplicate = async (req, res) => {
    const { email, username, id } = req.query;
    const employeeId = parseInt(id);
    try {
        const emailResult = await checkEmailExists(email, employeeId);
        const usernameResult = await checkUsernameExists(username, employeeId);
        res.status(200).json({
            emailExists: emailResult.length > 0,
            usernameExists: usernameResult.length > 0,
        });
    } catch (error) {
        console.error("Lỗi", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const searchEmployees = async (req, res) => {
    const { keyword } = req.query;

    try {
        const employees = await search(keyword);
        const parsedEmployees = employees.map((employee) => ({
            id: employee.id,
            name: employee.name,
            dob: formatDate(employee.dob),
            gender: employee.gender === 1 ? "Nam" : "Nữ",
            email: employee.email,
            address: employee.address,
            phone_number: employee.phone_number,
            username: employee.username,
            state: employee.state?.[0] === 1 ? "Hoạt động" : "Chặn",
            position: {
                id: employee.position_id || employee.id_position,
                name: employee.name_position,
                description: employee.description,
            },
        }));
        res.status(200).json({ data: parsedEmployees });
    } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const changePassword = async (req, res) => {
    console.log("change pass");
    try {
        const { id, old_pass, new_pass } = req.body;
        console.log(id, old_pass, new_pass);
        const [user] = await connection.execute(
            "SELECT password FROM employees WHERE id = ?",
            [id]
        );

        if (!user || user.length === 0) {
            return res
                .status(404)
                .json({ message: "Người dùng không tồn tại" });
        }

        const hashedPassword = user[0].password;

        const isMatch = await bcrypt.compare(old_pass, hashedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
        }

        const newHashed = await bcrypt.hash(new_pass, 10);
        await connection.execute(
            "UPDATE employees SET password = ? WHERE id = ?",
            [newHashed, id]
        );

        return res
            .status(200)
            .json({ message: "Cập nhật mật khẩu thành công" });
    } catch (error) {
        console.error("Lỗi khi cập nhật mật khẩu:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};

module.exports = {
    getEmployees,
    findEmployeeById,
    deleleEmployee,
    postAddEmployee,
    putUpdateEmployee,
    checkDuplicate,
    searchEmployees,
    changePassword,
};
