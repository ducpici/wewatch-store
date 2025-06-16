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

    return { user };
}
