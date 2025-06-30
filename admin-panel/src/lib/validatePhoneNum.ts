export function isValidPhoneNum(phone: string): boolean {
    const regex = /^(03|09)\d{8}$/;
    return regex.test(phone);
}
