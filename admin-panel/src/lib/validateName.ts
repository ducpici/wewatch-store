export function isValidName(name: string): boolean {
    const trimmedName = name.trim();

    // Kiểm tra độ dài tối thiểu 10 ký tự
    if (trimmedName.length < 10) return false;

    // Regex chỉ cho phép chữ cái (có dấu) và khoảng trắng
    const nameRegex = /^[A-Za-zÀ-ỹà-ỹ\s]+$/u;

    return nameRegex.test(trimmedName);
}
