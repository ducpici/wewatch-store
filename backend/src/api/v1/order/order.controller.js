import {
    getData,
    countAllData,
    findById,
    updateData,
    getDataOrderDetail,
    getOrder,
    getOrderItems,
    getUser,
    getIdUserByOrderId,
    getAddress,
    createOrder,
    createOrderDetail,
} from "./order.modal";
import { formatDate } from "../../../utils/formatDate";
import { connection } from "../../../config/database";

const orderStateMap = {
    0: "Chờ xác nhận",
    1: "Đã xác nhận",
    2: "Đang giao hàng",
    3: "Hoàn thành",
    4: "Trả hàng",
    5: "Đã hủy",
};

const paymentMethodMap = {
    0: "COD",
    1: "Chuyển khoản",
};

const getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const result = await getData(limit, offset);
        const totalData = await countAllData();

        const orders = result.map((order) => {
            const order_state_name =
                orderStateMap[order.order_state_code] || "Không rõ trạng thái";

            const payment_method_name =
                paymentMethodMap[order.payment_method_code] ||
                "Không rõ phương thức";

            return {
                ...order,
                order_state_name,
                payment_method_name,
                created_at_text: formatDate(order.created_at),
            };
        });

        res.status(200).json({
            orders,
            pagination: {
                total: totalData,
                page,
                limit,
                totalPages: Math.ceil(totalData / limit),
            },
        });
    } catch (error) {
        console.error("Error getting orders:", error);
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
        const order_state_name =
            orderStateMap[orderData.order_state_code] || "Không rõ trạng thái";

        const payment_method_name =
            paymentMethodMap[orderData.payment_method_code] ||
            "Không rõ phương thức";

        const order = {
            ...orderData,
            order_state_name: order_state_name,
            payment_method_name: payment_method_name,
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
        const { orderId } = req.params;
        const order = await getOrder(orderId);
        const items = await getOrderItems(orderId);
        const idUser = await getIdUserByOrderId(orderId);
        const address = await getAddress(idUser);

        const user = await getUser(idUser);

        if (!order || order.length === 0) {
            return res
                .status(404)
                .json({ status: false, message: "Order not found" });
        }

        const orderData = order[0];

        // Lấy mã trạng thái đơn
        const stateCode = orderData.order_state_code || orderData.state || 0;
        const paymentMethodCode = orderData.payment_method || 0;

        delete orderData.user_id;
        delete orderData.state;
        delete orderData.payment_method; // nếu bạn gộp lại rồi

        // Format lại items
        const formattedItems = items.map((item) => {
            const rawName = `${item.brand_name} - ${item.modal_num} - ${item.crystal_material} - ${item.movement_type} - Mặt số ${item.dial_diameter} mm`;
            return {
                id: item.product_id,
                name: rawName,
                modal_num: item.modal_num,
                quantity: item.quantity,
                price: item.price,
                brand: {
                    id: item.brand_id,
                    name: item.brand_name,
                    description: item.brand_description,
                },
                category: {
                    id: item.category_id,
                    name: item.category_name,
                    description: item.category_description,
                },
            };
        });

        const orderDetail = {
            ...orderData,
            user,
            address,
            items: formattedItems,
            payment_method: {
                code: paymentMethodCode,
                text: paymentMethodMap[paymentMethodCode],
            },
            order_state: {
                code: stateCode,
                text: orderStateMap[stateCode] || "Không xác định",
            },
        };

        res.status(200).json(orderDetail);
    } catch (error) {
        console.error("Error getting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const postAddOrder = async (req, res) => {
    try {
        const createdAt = new Date().toISOString().slice(0, 10);
        const userId = req.user.id;
        const payload = req.body;
        const data = {
            ...payload,
            createdAt,
            userId,
            state: 0,
        };
        const orderResult = await createOrder(data);

        const orderId = orderResult.insertId;
        const items = data.items;

        for (const item of items) {
            const data = {
                product_id: item.id,
                order_id: orderId,
                quantity: item.quantity,
            };
            console.log(data);
            await createOrderDetail(data);

            // Trừ số lượng sản phẩm
            await connection.execute(
                `UPDATE products SET quantity = quantity - ? WHERE id_product = ? AND quantity >= ?`,
                [item.quantity, item.id, item.quantity]
            );
        }

        res.json({ message: "Đặt hàng thành công" });
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
    postAddOrder,
    // postAddOrder,
    // putUpdateOrder,
    // deleleOrder,
    // searchOrders,
};
