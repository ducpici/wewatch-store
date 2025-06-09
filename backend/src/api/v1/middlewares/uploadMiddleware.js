// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Kiểm tra và tạo thư mục nếu chưa tồn tại
// const ensureDir = (dirPath) => {
//     if (!fs.existsSync(dirPath)) {
//         fs.mkdirSync(dirPath, { recursive: true });
//     }
// };

// // Cấu hình multer
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const type = req.body.type; // 'avatar' hoặc 'product'
//         let subfolder = "banners";

//         if (type === "avatar") subfolder = "avatars";
//         else if (type === "product") subfolder = "products";

//         const fullPath = path.join("public", "uploads", subfolder);
//         ensureDir(fullPath);
//         cb(null, fullPath);
//     },

//     filename: function (req, file, cb) {
//         const ext = path.extname(file.originalname);
//         const filename = `${Date.now()}-${Math.round(
//             Math.random() * 1e4
//         )}${ext}`;
//         cb(null, filename);
//     },
// });

// // Filter chỉ cho phép ảnh
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Chỉ cho phép upload ảnh JPG, PNG"), false);
//     }
// };

// const upload = multer({ storage, fileFilter });

// export default upload;

import multer from "multer";
import path from "path";
import fs from "fs";

// Hàm đảm bảo thư mục tồn tại
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Các loại ảnh hợp lệ
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

/**
 * Middleware upload, lưu vào subfolder theo type
 * @param {"avatars"|"products"|"banners"|"others"} folderName
 */
export function uploadTo(folderName = "others") {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const subfolder = folderName.toLowerCase();
            const fullPath = path.join("public", "uploads", subfolder);
            ensureDir(fullPath);
            cb(null, fullPath);
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            const filename = `${Date.now()}-${Math.round(
                Math.random() * 1e4
            )}${ext}`;
            cb(null, filename);
        },
    });

    const fileFilter = (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Chỉ cho phép upload ảnh JPG, JPEG, PNG"), false);
        }
    };

    return multer({ storage, fileFilter });
}
