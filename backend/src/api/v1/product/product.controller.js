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
    getProductReviews,
    addReview,
} from "./product.modal";
import slugify from "../../../utils/toSlug";
const path = require("path");
const fs = require("fs");
import { connection } from "../../../config/database";
import { formatDateTime } from "../../../utils/formatDate";
import { hashPass } from "../../../utils/hashPass";
import { format } from "date-fns";

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
    try {
        const { id } = req.params;
        console.log(id);
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
    try {
        const result = await findProductBySlug(slug);

        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }

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
    console.log("Functions received:", functions);
    console.log(restData);
    const file = req.file;
    const rawName = `${restData.modal_num} ${restData.crystal_material} ${restData.movement_type} ${restData.dial_diameter} mm`;
    const normalizeState = (val) => {
        if (val === true || val === "true" || val === 1 || val === "1")
            return 1;
        return 0;
    };

    const dataToUpdate = {
        ...restData,
        state: normalizeState(restData.state),
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

// const getProductByCategory = async (req, res) => {
//     try {
//         const { slug } = req.params;
//         let page = parseInt(req.query.page) || 1;
//         let limit = parseInt(req.query.limit) || 12;
//         const totalProducts = await countProductByCategory(slug);
//         if (totalProducts < limit) {
//             limit = totalProducts;
//         }
//         const offset = (page - 1) * limit;
//         const result = await getDataByCategory(slug, limit, offset);

//         if (!result) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         const parsedProducts = result.map((data) => {
//             const rawName = `${data.brand_name} - ${data.modal_num} - ${data.crystal_material} - ${data.movement_type} - Mặt số ${data.dial_diameter} mm`;
//             return {
//                 id: data.id_product,
//                 modal_num: data.modal_num,
//                 name: rawName,
//                 brand: {
//                     id: data.id_brand,
//                     name: data.brand_name,
//                     slug: data.brand_slug,
//                 },
//                 origin: data.origin,
//                 crystal_material: data.crystal_material,
//                 movement_type: data.movement_type,
//                 dial_diameter: data.dial_diameter + " " + "mm",
//                 case_thickness: data.case_thickness + " " + "mm",
//                 strap_material: data.strap_material,
//                 water_resistance: data.water_resistance,
//                 category: {
//                     id: data.id_category,
//                     name: data.category_name,
//                     description: data.description,
//                     slug: data.category_slug,
//                 },
//                 quantity: data.quantity,
//                 price: data.price,
//                 image: data.image,
//                 state: data.state?.[0] === 1 ? "Hoạt động" : "Vô hiệu hóa",
//                 slug: data.product_slug,
//             };
//         });

//         res.status(200).json({
//             data: parsedProducts,
//             pagination: {
//                 total: totalProducts,
//                 page,
//                 limit,
//                 totalPages: Math.ceil(totalProducts / limit),
//             },
//         });
//     } catch (error) {
//         console.error("Lỗi khi lấy:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// const getProductByBrand = async (req, res) => {
//     const { slug } = req.params;
//     try {
//         let page = parseInt(req.query.page) || 1;
//         let limit = parseInt(req.query.limit) || 12;

//         const totalProducts = await countProductByBrand(slug);
//         if (totalProducts <= limit) {
//             limit = totalProducts;
//         }
//         const offset = (page - 1) * limit;
//         const result = await getDataByBrand(slug, limit, offset);

//         if (!result) {
//             return res.status(404).json({ message: "Product not found" });
//         }
//         const parsedProducts = result.map((data) => {
//             const rawName = `${data.brand_name} - ${data.modal_num} - ${data.crystal_material} - ${data.movement_type} - Mặt số ${data.dial_diameter} mm`;
//             return {
//                 id: data.id_product,
//                 modal_num: data.modal_num,
//                 name: rawName,
//                 brand: {
//                     id: data.id_brand,
//                     name: data.brand_name,
//                     slug: data.brand_slug,
//                     description: data.description,
//                 },
//                 origin: data.origin,
//                 crystal_material: data.crystal_material,
//                 movement_type: data.movement_type,
//                 dial_diameter: data.dial_diameter + " " + "mm",
//                 case_thickness: data.case_thickness + " " + "mm",
//                 strap_material: data.strap_material,
//                 water_resistance: data.water_resistance,
//                 category: {
//                     id: data.id_category,
//                     name: data.category_name,
//                     slug: data.category_slug,
//                 },
//                 quantity: data.quantity,
//                 price: data.price,
//                 image: data.image,
//                 slug: data.product_slug,
//                 state: data.state?.[0] === 1 ? "Hoạt động" : "Vô hiệu hóa",
//             };
//         });

//         res.status(200).json({
//             data: parsedProducts,
//             pagination: {
//                 total: totalProducts,
//                 page,
//                 limit,
//                 totalPages: Math.ceil(totalProducts / limit),
//             },
//         });
//     } catch (error) {
//         console.error("Lỗi khi lấy:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

const getProductByCategory = async (req, res) => {
    const { slug } = req.params;
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 12;

        console.log(req.query);
        // Lấy các filter parameters
        const filters = {
            movement_type: req.query.movement_type,
            strap_material: req.query.strap_material,
            crystal_material: req.query.crystal_material,
            brand_name: req.query.brand_name,
            min_price: req.query.min_price
                ? parseInt(req.query.min_price)
                : null,
            max_price: req.query.max_price
                ? parseInt(req.query.max_price)
                : null,
            sort: req.query.sort,
        };

        // Xóa các filter có giá trị null/undefined
        Object.keys(filters).forEach((key) => {
            if (
                filters[key] === null ||
                filters[key] === undefined ||
                filters[key] === ""
            ) {
                delete filters[key];
            }
        });

        // Đếm tổng số sản phẩm với filters
        const totalProducts = await countProductByCategoryWithFilters(
            slug,
            filters
        );

        if (totalProducts === 0) {
            return res.status(200).json({
                data: [],
                pagination: {
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                },
            });
        }

        if (totalProducts <= limit) {
            limit = totalProducts;
        }

        const offset = (page - 1) * limit;

        // Lấy dữ liệu với filters
        const result = await getDataByCategoryWithFilters(
            slug,
            limit,
            offset,
            filters
        );

        if (!result || result.length === 0) {
            return res.status(200).json({
                data: [],
                pagination: {
                    total: totalProducts,
                    page,
                    limit,
                    totalPages: Math.ceil(totalProducts / limit),
                },
            });
        }

        const parsedProducts = result[0].map((data) => {
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
                    description: data.description,
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
            filters: filters, // Trả về filters đã áp dụng (optional)
        });
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo thương hiệu:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const countProductByCategoryWithFilters = async (slug, filters) => {
    // Ví dụ SQL với filters
    let query = `
        SELECT COUNT(DISTINCT p.id_product) as total
        FROM products p
        JOIN brands b ON p.brand_id = b.id_brand
        JOIN categories c ON c.id_category = p.category_id
        WHERE c.slug = ? AND p.state = 1
    `;

    let params = [slug];

    // Thêm các điều kiện filter
    if (filters.movement_type) {
        query += ` AND p.movement_type = ?`;
        params.push(filters.movement_type);
    }

    if (filters.strap_material) {
        query += ` AND p.strap_material = ?`;
        params.push(filters.strap_material);
    }

    if (filters.crystal_material) {
        query += ` AND p.crystal_material = ?`;
        params.push(filters.crystal_material);
    }

    if (filters.brand_name) {
        query += ` AND b.brand_name = ?`;
        params.push(filters.brand_name);
    }

    if (filters.min_price) {
        query += ` AND p.price >= ?`;
        params.push(filters.min_price);
    }

    if (filters.max_price) {
        query += ` AND p.price <= ?`;
        params.push(filters.max_price);
    }

    // Thực hiện query (tùy thuộc vào ORM/database library bạn dùng)
    const result = await connection.execute(query, params);
    return result[0][0].total;
};

const getDataByCategoryWithFilters = async (slug, limit, offset, filters) => {
    let query = `
        SELECT DISTINCT
            p.*, 
            b.*, 
            c.*, 
            p.slug AS product_slug, 
            b.slug AS brand_slug, 
            c.slug AS category_slug
        FROM products p 
        JOIN brands b ON p.brand_id = b.id_brand
        JOIN categories c ON p.category_id = c.id_category
        WHERE c.slug = ?
        AND p.state = 1
    `;

    let params = [slug];

    // Thêm các điều kiện filter (giống như countProductByBrandWithFilters)
    if (filters.movement_type) {
        query += ` AND p.movement_type = ?`;
        params.push(filters.movement_type);
    }

    if (filters.strap_material) {
        query += ` AND p.strap_material = ?`;
        params.push(filters.strap_material);
    }

    if (filters.crystal_material) {
        query += ` AND p.crystal_material = ?`;
        params.push(filters.crystal_material);
    }

    if (filters.brand_name) {
        query += ` AND b.brand_name = ?`;
        params.push(filters.brand_name);
    }

    if (filters.min_price) {
        query += ` AND p.price >= ?`;
        params.push(filters.min_price);
    }

    if (filters.max_price) {
        query += ` AND p.price <= ?`;
        params.push(filters.max_price);
    }

    // Thêm ORDER BY dựa trên sort
    if (filters.sort) {
        switch (filters.sort) {
            case "price_asc":
                query += ` ORDER BY p.price ASC`;
                break;
            case "price_desc":
                query += ` ORDER BY p.price DESC`;
                break;
        }
    }

    // Thêm LIMIT và OFFSET
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    // Thực hiện query
    const result = await connection.query(query, params);
    return result;
};

const getProductByBrand = async (req, res) => {
    const { slug } = req.params;
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 12;

        console.log(req.query);
        // Lấy các filter parameters
        const filters = {
            movement_type: req.query.movement_type,
            strap_material: req.query.strap_material,
            crystal_material: req.query.crystal_material,
            category_name: req.query.category_name,
            min_price: req.query.min_price
                ? parseInt(req.query.min_price)
                : null,
            max_price: req.query.max_price
                ? parseInt(req.query.max_price)
                : null,
            sort: req.query.sort,
        };

        // Xóa các filter có giá trị null/undefined
        Object.keys(filters).forEach((key) => {
            if (
                filters[key] === null ||
                filters[key] === undefined ||
                filters[key] === ""
            ) {
                delete filters[key];
            }
        });

        // Đếm tổng số sản phẩm với filters
        const totalProducts = await countProductByBrandWithFilters(
            slug,
            filters
        );

        if (totalProducts === 0) {
            return res.status(200).json({
                data: [],
                pagination: {
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                },
            });
        }

        if (totalProducts <= limit) {
            limit = totalProducts;
        }

        const offset = (page - 1) * limit;

        // Lấy dữ liệu với filters
        const result = await getDataByBrandWithFilters(
            slug,
            limit,
            offset,
            filters
        );

        if (!result || result.length === 0) {
            return res.status(200).json({
                data: [],
                pagination: {
                    total: totalProducts,
                    page,
                    limit,
                    totalPages: Math.ceil(totalProducts / limit),
                },
            });
        }

        const parsedProducts = result[0].map((data) => {
            const rawName = `${data.brand_name} - ${data.modal_num} - ${data.crystal_material} - ${data.movement_type} - Mặt số ${data.dial_diameter} mm`;
            return {
                id: data.id_product,
                modal_num: data.modal_num,
                name: rawName,
                brand: {
                    id: data.id_brand,
                    name: data.brand_name,
                    slug: data.brand_slug,
                    description: data.description,
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
            filters: filters, // Trả về filters đã áp dụng (optional)
        });
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo thương hiệu:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//Hàm đếm sản phẩm với filters (cần implement)
const countProductByBrandWithFilters = async (slug, filters) => {
    // Ví dụ SQL với filters
    let query = `
        SELECT COUNT(DISTINCT p.id_product) as total
        FROM products p
        JOIN brands b ON p.brand_id = b.id_brand
        JOIN categories c ON c.id_category = p.category_id
        WHERE b.slug = ? AND p.state = 1
    `;

    let params = [slug];

    // Thêm các điều kiện filter
    if (filters.movement_type) {
        query += ` AND p.movement_type = ?`;
        params.push(filters.movement_type);
    }

    if (filters.strap_material) {
        query += ` AND p.strap_material = ?`;
        params.push(filters.strap_material);
    }

    if (filters.crystal_material) {
        query += ` AND p.crystal_material = ?`;
        params.push(filters.crystal_material);
    }

    if (filters.category_name) {
        // Giả sử có cột gender hoặc category
        query += ` AND c.category_name = ?`;
        params.push(filters.category_name);
    }

    if (filters.min_price) {
        query += ` AND p.price >= ?`;
        params.push(filters.min_price);
    }

    if (filters.max_price) {
        query += ` AND p.price <= ?`;
        params.push(filters.max_price);
    }

    // Thực hiện query (tùy thuộc vào ORM/database library bạn dùng)
    const result = await connection.execute(query, params);
    return result[0][0].total;
};

// Hàm lấy dữ liệu với filters (cần implement)
const getDataByBrandWithFilters = async (slug, limit, offset, filters) => {
    let query = `
        SELECT DISTINCT
            p.*, 
            b.*, 
            c.*, 
            p.slug AS product_slug, 
            b.slug AS brand_slug, 
            c.slug AS category_slug
        FROM products p 
        JOIN brands b ON p.brand_id = b.id_brand
        JOIN categories c ON p.category_id = c.id_category
        WHERE b.slug = ?
        AND p.state = 1
    `;

    let params = [slug];

    // Thêm các điều kiện filter (giống như countProductByBrandWithFilters)
    if (filters.movement_type) {
        query += ` AND p.movement_type = ?`;
        params.push(filters.movement_type);
    }

    if (filters.strap_material) {
        query += ` AND p.strap_material = ?`;
        params.push(filters.strap_material);
    }

    if (filters.crystal_material) {
        query += ` AND p.crystal_material = ?`;
        params.push(filters.crystal_material);
    }

    if (filters.category_name) {
        query += ` AND c.category_name = ?`;
        params.push(filters.category_name);
    }

    if (filters.min_price) {
        query += ` AND p.price >= ?`;
        params.push(filters.min_price);
    }

    if (filters.max_price) {
        query += ` AND p.price <= ?`;
        params.push(filters.max_price);
    }

    // Thêm ORDER BY dựa trên sort
    if (filters.sort) {
        switch (filters.sort) {
            case "price_asc":
                query += ` ORDER BY p.price ASC`;
                break;
            case "price_desc":
                query += ` ORDER BY p.price DESC`;
                break;
        }
    }

    // Thêm LIMIT và OFFSET
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    // Thực hiện query
    const result = await connection.query(query, params);
    return result;
};

const getReviewsByIdProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const reviews = await getProductReviews(productId);

        const calculateOverallRating = (reviews) => {
            if (!reviews || reviews.length === 0) {
                return 0;
            }

            const totalRating = reviews.reduce(
                (sum, review) => sum + review.rating,
                0
            );
            const average = totalRating / reviews.length;

            // Làm tròn đến 1 chữ số thập phân
            return Math.round(average * 10) / 10;
        };
        res.json({
            overallRating: calculateOverallRating(reviews),
            totalReviews: reviews.length,
            reviews: reviews.map((review) => ({
                id: review.id,
                name: review.name,
                created_at: formatDateTime(review.created_at),
                rating: review.rating,
                comment: review.comment,
            })),
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};

const postAddReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        const userId = req.user.id;
        const createdAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        const result = await addReview(
            productId,
            userId,
            rating,
            comment,
            createdAt
        );
        res.status(201).json({
            message: "Đánh giá thành công",
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};

const getProductFilters = async (req, res) => {
    const [categories] = await connection.execute(
        "SELECT DISTINCT category_name FROM categories"
    );
    const [movementTypes] = await connection.execute(
        "SELECT DISTINCT movement_type FROM products"
    );
    const [crystalMaterials] = await connection.execute(
        "SELECT DISTINCT crystal_material FROM products"
    );
    const [strapMaterials] = await connection.execute(
        "SELECT DISTINCT strap_material FROM products"
    );
    const [brands] = await connection.execute(
        "SELECT DISTINCT brand_name FROM brands"
    );
    res.json({
        category_name: categories.map((item) => item.category_name),
        brand_name: brands.map((item) => item.brand_name),
        movement_type: movementTypes.map((item) => item.movement_type),
        crystal_material: crystalMaterials.map((item) => item.crystal_material),
        strap_material: strapMaterials.map((item) => item.strap_material),
    });
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
    getReviewsByIdProduct,
    postAddReview,
    getProductFilters,
};
