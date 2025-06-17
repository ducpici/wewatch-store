import {
    getDataByUserId,
    getDataById,
    updateData,
    createData,
} from "./address.modal";

const getAddressByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await getDataByUserId(userId);
        res.json({ data: addresses });
    } catch (error) {
        console.error("Get addresses error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const getAddressById = async (req, res) => {
    console.log("Thực hiện tìm");
    try {
        const idShip = req.query.idShip;
        console.log("IDĐ", idShip);
        const address = await getDataById(idShip);
        console.log(address);
    } catch (error) {
        console.error("Get addresses error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const postAddAddress = async (req, res) => {
    try {
        const data = req.body;
        const dataCreate = {
            ...data,
            user_id: req.user.id,
            is_default: data.is_default ? 1 : 0,
        };
        console.log(dataCreate);
        const result = await createData(dataCreate);
        res.json({ message: "Thêm thành công" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const putUpdateAddress = async (req, res) => {
    try {
        const data = req.body;
        const dataUpdate = {
            ...data,
            is_default: data.is_default ? 1 : 0,
        };
        console.log(data);
        const result = await updateData(dataUpdate);
        res.json({ message: "Cập nhật thành công" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getAddressByUserId,
    getAddressById,
    putUpdateAddress,
    postAddAddress,
};
