export const isValidEmail = (email: string): boolean => {
    const regex = /^[a-z0-9](?!.*\.\.)[a-z0-9.]{4,}[a-z0-9]@gmail\.com$/;
    return regex.test(email.trim());
};
