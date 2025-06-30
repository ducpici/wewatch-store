import {
    getDataByUserId,
    getDataById,
    updateData,
    createData,
    deleteData,
    setIsDefaultFalse,
} from "./address.modal";

const getAddressByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const { is_default } = req.query;

        let addresses = await getDataByUserId(userId);

        // Nếu có query is_default=1, lọc phía backend hoặc tại đây
        if (is_default === "1") {
            addresses = addresses.filter((addr) => addr.is_default === 1);
        }

        res.json({ data: addresses });
    } catch (error) {
        console.error("Get addresses error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getAddressById = async (req, res) => {
    try {
        const idShip = parseInt(req.params.idShip);
        const address = await getDataById(idShip);
        res.json({ data: address });
    } catch (error) {
        console.error("Get addresses error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const postAddAddress = async (req, res) => {
    try {
        console.log(req.body);
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
        const userId = req.user.id;
        await setIsDefaultFalse(userId);
        const data = req.body;
        const dataUpdate = {
            ...data,
            is_default: data.is_default ? 1 : 0,
        };

        const result = await updateData(dataUpdate);
        res.json({ message: "Cập nhật thành công" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const { idShip } = req.params;
        await deleteData(idShip);
        res.json({ message: "Xóa địa chỉ thành công" });
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
    deleteAddress,
};
