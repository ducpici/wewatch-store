import { useEffect, useState } from "react";
import axios from "../lib/axiosConfig";

export interface User {
    id: number;
    name: string;
    dob: string;
    gender: string;
    email: string;
    address: string;
    phone_number: string;
}

export default function useSession() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await axios.get<User>("/session");
                setUser(res.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    return { user, loading };
}
