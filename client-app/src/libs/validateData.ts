export function isValidUsername(username: string) {
    const pattern = /^[a-z0-9]{5,20}$/; // từ 5 đến 20 ký tự, chỉ a-z và 0-9
    return pattern.test(username);
}
export function isValidPassword(password: string): boolean {
    // Không chứa dấu cách và ít nhất 6 ký tự
    const pattern = /^(?!.*\s).{6,}$/;
    return pattern.test(password);
}
