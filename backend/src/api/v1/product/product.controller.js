import {
    getAllData,
    findById,
    deleteData,
    updateData,
    createData,
    getDataPaginated,
    countAllData,
    checkModalNumExists,
    search,
    createProductFunction,
    findProductFunction,
    deleteProductFunction,
    getDataByCategory,
    getDataByBrand,
    countProductByCategory,
    countProductByBrand,
    findProductBySlug,
} from "./product.modal";
import slugify from "../../../utils/toSlug";
const path = require("path");
const fs = require("fs");
import { connection } from "../../../config/database";
import { formatDate, formatDate2 } from "../../../utils/formatDate";
import { hashPass } from "../../../utils/hashPass";

const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Truy vấn dữ liệu người dùng với giới hạn & phân trang
        const result = await getDataPaginated(limit, offset);
        const totalProducts = await countAllData();

        const parsedProducts = result.map((data) => ({
            id: data.id_product,
            modal_num: data.modal_num,
            brand: {
                id: data.id_brand,
                name: data.brand_name,
            },
            origin: data.origin,
            crystal_material: data.crystal_material,
            movement_type: data.movement_type,
            dial_diameter: data.dial_diameter + "mm",
            case_thickness: data.case_thickness + "mm",
            strap_material: data.strap_material,
            water_resistance: data.water_resistance,
            category: {
                id: data.id_category,
                name: data.category_name,
            },
            quantity: data.quantity,
            price: data.price,
            state: data.state?.[0] === 1 ? "Hoạt động" : "Vô hiệu hóa",
        }));

        res.status(200).json({
            data: parsedProducts,
            pagination: {
                total: totalProducts,
                page,
                limit,
                totalPages: Math.ceil(totalProducts / limit),
            },
        });
    } catch (error) {
        console.error("Error getting:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// const getProductById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const result = await findById(id);

//         if (!result) {
//             return res.status(404).json({ message: "Product not found" });
//         }
//         const parsedProducts = result.map((data) => ({
//             id: data.id_product,
//             modal_num: data.modal_num,
//             product_name: data.product_name,
//             brand_id: data.brand_id,
//             origin: data.origin,
//             crystal_material: data.crystal_material,
//             movement_type: data.movement_type,
//             dial_diameter: data.dial_diameter,
//             case_thickness: data.case_thickness,
//             strap_material: data.strap_material,
//             water_resistance: data.water_resistance,
//             category_id: data.category_id,
//             quantity: data.quantity,
//             price: data.price,
//             state: data.state?.[0] === 1 ? true : false,
//             image: data.image,
//         }));

//         res.status(200).json(parsedProducts);
//     } catch (error) {
//         console.error("Fail to get data:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await findById(id);

        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }
        const first = result[0];
        const functions = result.map((item) => ({
            id: item.id_function,
            name: item.name_function,
        }));

        // const rawName = `${first.brand_name} ${first.modal_num} ${first.crystal_material} ${first.movement_type}`;

        const parsedProduct = {
            id: first.id_product,
            modal_num: first.modal_num,
            // name: rawName,
            brand: {
                id: first.id_brand,
                name: first.brand_name,
            },
            origin: first.origin,
            crystal_material: first.crystal_material,
            movement_type: first.movement_type,
            dial_diameter: first.dial_diameter,
            case_thickness: first.case_thickness,
            strap_material: first.strap_material,
            water_resistance: first.water_resistance,
            category: {
                id: first.id_category,
                name: first.category_name,
            },
            quantity: first.quantity,
            price: first.price,
            state: first.state?.[0],
            image: first.image,
            functions, // gán mảng functions
        };

        res.status(200).json(parsedProduct);
    } catch (error) {
        console.error("Fail to get data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getProductBySlug = async (req, res) => {
    const { slug } = req.params;
    console.log(slug);
    try {
        const result = await findProductBySlug(slug);

        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log(result);

        const functions = result.map((item) => ({
            id: item.id_function,
            name: item.name_function,
        }));
        const parsedProducts = result.map((data) => {
            const rawName = `${data.brand_name} - ${data.modal_num} - ${data.crystal_material} - ${data.movement_type} - Mặt số ${data.dial_diameter} mm`;
            return {
                id: data.id_product,
                modal_num: data.modal_num,
                name: rawName,
                brand: {
                    id: data.id_brand,
                    name: data.brand_name,
                    slug: data.brand_slug,
                },
                origin: data.origin,
                crystal_material: data.crystal_material,
                movement_type: data.movement_type,
                dial_diameter: data.dial_diameter + " " + "mm",
                case_thickness: data.case_thickness + " " + "mm",
                strap_material: data.strap_material,
                water_resistance: data.water_resistance,
                category: {
                    id: data.id_category,
                    name: data.category_name,
                    slug: data.category_slug,
                },
                quantity: data.quantity,
                price: data.price,
                image: data.image,
                slug: data.product_slug,
                state: data.state?.[0] === 1 ? "Hoạt động" : "Vô hiệu hóa",
                functions,
            };
        });

        res.status(200).json(parsedProducts[0]);
    } catch (error) {
        console.error("Lỗi khi lấy employee:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const addProduct = async (req, res) => {
    const data = req.body;
    const file = req.file;
    const imagePath = `/uploads/products/${file.filename}`;
    const rawName = `${data.modal_num} ${data.crystal_material} ${data.movement_type} ${data.dial_diameter} mm`;
    const dataCreate = {
        modal_num: data.modal_num,
        product_name: data.product_name,
        brand_id: parseInt(data.brand_id),
        origin: data.origin,
        crystal_material: data.crystal_material,
        movement_type: data.movement_type,
        dial_diameter: parseFloat(data.dial_diameter),
        case_thickness: parseFloat(data.case_thickness),
        strap_material: data.strap_material,
        water_resistance: parseFloat(data.water_resistance),
        category_id: parseInt(data.category_id),
        quantity: parseInt(data.quantity),
        price: parseInt(data.price),
        image: imagePath,
        state: data.state == "true" ? 1 : 0,
        slug: slugify(rawName),
    };

    const functionsId = data.functions;
    try {
        const result = await createData(dataCreate);
        const product_id = result.insertId;
        await createProductFunction(product_id, functionsId);
        res.status(201).json({ message: "Created successfully" });
    } catch (err) {
        console.error("Create error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const editProduct = async (req, res) => {
    const { id } = req.params;
    const { functions, ...restData } = req.body;

    const file = req.file;
    const rawName = `${restData.modal_num} ${restData.crystal_material} ${restData.movement_type} ${restData.dial_diameter} mm`;

    const dataToUpdate = {
        ...restData,
        state: restData.state == "true" ? 1 : 0,
        slug: slugify(rawName),
    };
    try {
        const product = await findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (file) {
            const oldImage = product[0].image;

            if (oldImage) {
                const oldImagePath = path.join(
                    process.cwd(),
                    "public",
                    oldImage
                );

                // Cập nhật đường dẫn ảnh mới
                dataToUpdate.image = "/uploads/products/" + file.filename;

                // Xóa ảnh cũ nếu có
                fs.unlink(oldImagePath, (err) => {
                    if (err && err.code !== "ENOENT") {
                        console.error("Không thể xóa ảnh cũ:", err);
                    }
                });
            }

            console.log(id);
            console.log(dataToUpdate);
            // return;
        }

        const result = await updateData(id, dataToUpdate);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            await deleteProductFunction(id);
            await createProductFunction(id, functions);

            await conn.commit();
            res.status(200).json({ message: "Success" });
        } catch (err) {
            await conn.rollback();
            console.error(err);
            res.status(500).json({ message: "Error" });
        } finally {
            conn.release();
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateProductFunction = async (req, res) => {
    const { id } = req.params;
    const { function_ids } = req.body;

    if (!role_ids || !Array.isArray(function_ids)) {
        return res.status(400).json({ message: "Fail" });
    }

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        await deleteProductFunction(id);
        await createProductFunction(id, function_ids);

        await conn.commit();
        res.status(200).json({ message: "Success" });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ message: "Error" });
    } finally {
        conn.release();
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteData(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({ message: "Delete success" });
    } catch (error) {
        console.error("Lỗi khi xóa:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const checkDuplicate = async (req, res) => {
    const { modal_num, id } = req.query;
    try {
        const checkResult = await checkModalNumExists(modal_num, id);
        res.status(200).json({
            modalNumExists: checkResult.length > 0,
        });
    } catch (error) {
        console.error("Lỗi", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const searchProduct = async (req, res) => {
    const { keyword } = req.query;

    try {
        const result = await search(keyword);
        const parsedProducts = result.map((data) => ({
            id: data.id_product,
            modal_num: data.modal_num,
            product_name: data.product_name,
            brand: {
                id: data.id_brand,
                name: data.brand_name,
            },
            origin: data.origin,
            crystal_material: data.crystal_material,
            movement_type: data.movement_type,
            dial_diameter: data.dial_diameter,
            case_thickness: data.case_thickness,
            strap_material: data.strap_material,
            water_resistance: data.water_resistance,
            category: {
                id: data.id_category,
                name: data.category_name,
            },
            quantity: data.quantity,
            price: data.price,
            state: data.state?.[0] === 1 ? "Hoạt động" : "Vô hiệu hóa",
        }));
        res.status(200).json({ data: parsedProducts });
    } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const getProductFunction = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await findProductFunction(id);

        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }

        const data = result.map((item) => {
            return item.function_id.toString();
        });

        res.status(200).json(data);
    } catch (error) {
        console.error("Lỗi khi lấy employee:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getProductByCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const totalProducts = await countProductByCategory(slug);
        if (totalProducts < limit) {
            limit = totalProducts;
        }
        const offset = (page - 1) * limit;
        const result = await getDataByCategory(slug, limit, offset);

        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }

        const parsedProducts = result.map((data) => {
            const rawName = `${data.brand_name} - ${data.modal_num} - ${data.crystal_material} - ${data.movement_type} - Mặt số ${data.dial_diameter} mm`;
            return {
                id: data.id_product,
                modal_num: data.modal_num,
                name: rawName,
                brand: {
                    id: data.id_brand,
                    name: data.brand_name,
                },
                origin: data.origin,
                crystal_material: data.crystal_material,
                movement_type: data.movement_type,
                dial_diameter: data.dial_diameter + " " + "mm",
                case_thickness: data.case_thickness + " " + "mm",
                strap_material: data.strap_material,
                water_resistance: data.water_resistance,
                category: {
                    id: data.id_category,
                    name: data.category_name,
                    slug: data.slug,
                },
                quantity: data.quantity,
                price: data.price,
                image: data.image,
                state: data.state?.[0] === 1 ? "Hoạt động" : "Vô hiệu hóa",
                slug: data.slug,
            };
        });

        res.status(200).json({
            data: parsedProducts,
            pagination: {
                total: totalProducts,
                page,
                limit,
                totalPages: Math.ceil(totalProducts / limit),
            },
        });
    } catch (error) {
        console.error("Lỗi khi lấy:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getProductByBrand = async (req, res) => {
    const { slug } = req.params;
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const totalProducts = await countProductByBrand(slug);
        if (totalProducts < limit) {
            limit = totalProducts;
        }
        const offset = (page - 1) * limit;
        const result = await getDataByBrand(slug, limit, offset);

        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }
        const parsedProducts = result.map((data) => {
            const rawName = `${data.brand_name} - ${data.modal_num} - ${data.crystal_material} - ${data.movement_type} - Mặt số ${data.dial_diameter} mm`;
            return {
                id: data.id_product,
                modal_num: data.modal_num,
                name: rawName,
                brand: {
                    id: data.id_brand,
                    name: data.brand_name,
                    slug: data.brand_slug,
                },
                origin: data.origin,
                crystal_material: data.crystal_material,
                movement_type: data.movement_type,
                dial_diameter: data.dial_diameter + " " + "mm",
                case_thickness: data.case_thickness + " " + "mm",
                strap_material: data.strap_material,
                water_resistance: data.water_resistance,
                category: {
                    id: data.id_category,
                    name: data.category_name,
                    slug: data.category_slug,
                },
                quantity: data.quantity,
                price: data.price,
                image: data.image,
                slug: data.product_slug,
                state: data.state?.[0] === 1 ? "Hoạt động" : "Vô hiệu hóa",
            };
        });

        res.status(200).json({
            data: parsedProducts,
            pagination: {
                total: totalProducts,
                page,
                limit,
                totalPages: Math.ceil(totalProducts / limit),
            },
        });
    } catch (error) {
        console.error("Lỗi khi lấy:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    addProduct,
    editProduct,
    checkDuplicate,
    searchProduct,
    getProductFunction,
    updateProductFunction,
    getProductByCategory,
    getProductByBrand,
    getProductBySlug,
};
