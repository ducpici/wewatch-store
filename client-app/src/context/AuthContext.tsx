import { createContext, useContext, useEffect, useState } from "react";
import axios from "../libs/axiosConfig";
import { toast } from "react-toastify";

interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    type: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const verify = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const res = await axios.get("/me");
                setUser(res.data);
            } catch (err) {
                console.error("Lỗi khi xác thực:", err);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            }
        } else {
            toast.error("Chưa đăng nhập");
        }

        setLoading(false);
    };
    useEffect(() => {
        verify();
    }, []);

    const login = async (user: User, token: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        await verify();
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {loading ? <div>Đang xác thực...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
