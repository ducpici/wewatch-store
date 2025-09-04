import { useEffect, useState } from "react";

export default function useSession() {
    const [user, setUser] = useState<{
        id?: number;
        username: string;
        name: string;
        email: string;
    } | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (err) {
                console.error("Lỗi parse user:", err);
                setUser(null);
            }
        }
    }, []);

    const updateSession = (newUser: {
        id?: number;
        username: string;
        name: string;
        email: string;
    }) => {
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser); // ✅ cập nhật ngay state => UI đổi liền
    };

    const clearSession = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return { user, updateSession, clearSession };
}
