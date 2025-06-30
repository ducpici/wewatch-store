export default function slugify(text) {
    return text
        .toLowerCase()
        .normalize("NFD") // tách dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, "") // xóa dấu
        .replace(/đ/g, "d") // chuyển đ -> d
        .replace(/\./g, "-") // thay dấu chấm thành gạch ngang
        .replace(/[^a-z0-9\s-]/g, "") // xóa ký tự đặc biệt
        .trim()
        .replace(/\s+/g, "-"); // thay khoảng trắng thành gạch ngang
}
