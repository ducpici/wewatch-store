export default function toSlug(str: string): string {
    return str
        .toLowerCase()
        .normalize("NFD") // tách dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, "") // xóa dấu
        .replace(/đ/g, "d") // chuyển đ -> d
        .replace(/[^a-z0-9\s-]/g, "") // xóa ký tự đặc biệt
        .trim()
        .replace(/\s+/g, "-"); // thay khoảng trắng bằng -
}
