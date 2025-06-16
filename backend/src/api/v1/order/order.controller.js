import {
    getData,
    countAllData,
    findById,
    updateData,
    getDataOrderDetail,
    getOrder,
    getOrderItems,
} from "./order.modal";
import { formatDate } from "../../../utils/formatDate";

// const orderStateMap = {
//     0: "Chờ xác nhận",
//     1: "Đã xác nhận",
//     2: "Đang giao hàng",
//     3: "Hoàn thành",
//     4: "Đã hủy",
// };

const orderStateMap = [
    { id: 0, name: "Chờ xác nhận" },
    { id: 1, name: "Đã xác nhận" },
    { id: 2, name: "Đang giao hàng" },
    { id: 3, name: "Hoàn thành" },
    { id: 4, name: "Trả hàng" },
    { id: 4, name: "Đã hủy" },
];

// const paymentMethodMap = {
//     0: "COD",
//     1: "Chuyển khoản",
//     2: "Ví điện tử",
// };

const paymentMethodMap = [
    { id: 0, name: "COD" },
    { id: 1, name: "Chuyển khoản" },
];

const getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const result = await getData(limit, offset);
        const totalData = await countAllData();

        const orders = result.map((order) => {
            const order_state_name =
                orderStateMap.find(
                    (state) => state.id === order.order_state_code
                )?.name || "Không rõ trạng thái";

            const payment_method_name =
                paymentMethodMap.find(
                    (pm) => pm.id === order.payment_method_code
                )?.name || "Không rõ phương thức";

            return {
                ...order,
                order_state_name,
                created_at_text: formatDate(order.created_at),
                payment_method_name,
            };
        });
        res.status(200).json({
            orders: orders,
            pagination: {
                total: totalData,
                page,
                limit,
                totalPages: Math.ceil(totalData / limit),
            },
        });
    } catch (error) {
        console.error("Error getting:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await getOrder(id);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        const orderData = result[0];
        // Map state code to name
        const orderStateName =
            orderStateMap.find(
                (state) => state.id === orderData.order_state_code
            )?.name || "Không rõ trạng thái";

        const paymentMethodName =
            paymentMethodMap.find(
                (state) => state.id === orderData.payment_method_code
            )?.name || "Không rõ trạng thái";

        const order = {
            ...result[0],
            order_state_name: orderStateName,
            payment_method_name: paymentMethodName,
        };
        return res.status(200).json(order);
    } catch (error) {
        console.error("Error getting:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const putUpdateOrder = async (req, res) => {
    try {
        const { state, id } = req.body;
        console.log(state, id);

        const result = await updateData(state, id);

        console.log(result);

        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ status: false, message: "Order not found" });
        }

        res.status(200).json({ status: true, message: "Update success" });
    } catch (error) {
        console.error("Error updating:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getOrderDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await getOrder(id);
        const items = await getOrderItems(id);

        if (!order || order.length === 0) {
            return res
                .status(404)
                .json({ status: false, message: "Order not found" });
        }

        const orderData = order[0];
        // Map state code to name
        const orderStateName =
            orderStateMap.find(
                (state) => state.id === orderData.order_state_code
            )?.name || "Không rõ trạng thái";

        const orderDetail = {
            ...order[0],
            order_state_name: orderStateName,
            items,
        };

        res.status(200).json({
            status: true,
            message: "",
            orderDetail: orderDetail,
        });
    } catch (error) {
        console.error("Error getting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    putUpdateOrder,
    getOrderDetail,
    // postAddOrder,
    // putUpdateOrder,
    // deleleOrder,
    // searchOrders,
};
