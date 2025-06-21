import {
    getUserCart,
    checkProductExist,
    updateCartItem,
    deleteCartItems,
    getProductIdsByUser,
    getVoucherByCode,
} from "./cart.modal";
import { connection } from "../../../config/database";

const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await getUserCart(userId);

        const parsedData = result.map((data) => {
            const rawName = `${data.brand_name} - ${data.modal_num} - ${data.crystal_material} - ${data.movement_type} - Mặt số ${data.dial_diameter} mm`;
            return {
                id: data.id_product,
                name: rawName,
                modal_num: data.modal_num,
                quantity: data.quantity,
                price: data.price,
                image: data.image,
            };
        });

        res.json({ carts: parsedData });
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi lấy giỏ hàng" });
    }
};

const postAddCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const exist = await checkProductExist(userId, productId);

        if (exist.length > 0) {
            await connection.query(
                "UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
                [quantity, userId, productId]
            );
        } else {
            await connection.query(
                "INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)",
                [userId, productId, quantity]
            );
        }

        res.json({ message: "Sản phẩm đã được thêm vào giỏ hàng" });
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi thêm giỏ hàng" });
    }
};

const putEditCart = async (req, res) => {
    const { userId } = req.params;
    const newCartItems = req.body;

    const oldProductIds = await getProductIdsByUser(userId);
    const newProductIds = newCartItems.map((item) => item.id);

    const toDelete = oldProductIds.filter((id) => !newProductIds.includes(id));
    if (toDelete.length > 0) {
        await deleteCartItems(userId, toDelete);
    }

    for (const item of newCartItems) {
        await updateCartItem(item.quantity, userId, item.id); // item.id là product_id
    }

    res.json({ message: "Cart updated successfully" });
};

const applyVoucher = async (req, res) => {
    try {
        const { voucherCode, cartTotal } = req.body;

        if (!voucherCode)
            return res
                .status(400)
                .json({ message: "Vui lòng nhập mã giảm giá" });
        // Lấy voucher
        const voucher = await getVoucherByCode(voucherCode.trim());

        if (!voucher)
            return res
                .status(404)
                .json({ message: "Mã giảm giá không tồn tại" });

        const now = new Date();
        const startDate = new Date(voucher.start_date);
        const endDate = new Date(voucher.end_date);

        // So sánh chỉ theo ngày (bỏ qua giờ phút giây)
        const nowDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
        const startOnlyDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
        );
        const endOnlyDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
        );

        if (nowDate < startOnlyDate) {
            return res
                .status(400)
                .json({ message: "Mã giảm giá chưa bắt đầu hoạt động" });
        }

        if (nowDate > endOnlyDate) {
            return res.status(400).json({ message: "Mã giảm giá đã hết hạn" });
        }

        // Tính giảm giá
        let discount = 0;
        if (voucher.discount_type === 1) {
            discount = (cartTotal * voucher.discount_value) / 100;
        } else if (voucher.discount_type === 2) {
            discount = voucher.discount_value;
        }

        const finalTotal = cartTotal - discount;

        return res.status(200).json({
            message: "Áp dụng mã giảm giá thành công",
            discount,
            total: finalTotal,
            originalTotal: cartTotal,
            voucher: {
                code: voucher.code,
                type: voucher.discount_type,
                value: voucher.discount_value,
            },
        });
    } catch (err) {
        console.error("Lỗi áp dụng voucher:", err);
        return res.status(500).json({ message: "Đã xảy ra lỗi server" });
    }
};

const checkProductAvailability = async (req, res) => {
    try {
        const items = req.body;
        const results = [];

        for (const item of items) {
            const [rows] = await connection.query(
                "SELECT quantity, modal_num FROM products WHERE id_product = ?",
                [item.id]
            );

            if (!rows[0]) {
                results.push({
                    id: item.id,
                    ok: false,
                    message: "Sản phẩm không tồn tại",
                });
            } else if (rows[0].quantity < item.quantity) {
                results.push({
                    id: item.id,
                    modal_num: rows[0].modal_num,
                    ok: false,
                    message: `Sản phẩm mã ${rows[0].modal_num} chỉ còn ${rows[0].quantity} sản phẩm`,
                });
            } else {
                results.push({
                    id: item.id,
                    modal_num: rows[0].modal_num,
                    ok: true,
                });
            }
        }

        const allOk = results.every((item) => item.ok);
        res.json({ success: allOk, results });
    } catch (err) {
        console.error("Lỗi kiểm tra sản phẩm:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
module.exports = {
    getCart,
    postAddCart,
    putEditCart,
    applyVoucher,
    checkProductAvailability,
};
