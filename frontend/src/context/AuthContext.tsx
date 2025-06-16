import { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: number;
    username: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (err) {
                console.error("Lỗi parse user:", err);
                localStorage.removeItem("user");
            }
        }
    }, []);

    const login = (user: User, token: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

// import { createContext, useContext, useEffect, useState } from "react";

// interface User {
//     id: number;
//     username: string;
//     name: string;
//     email: string;
// }

// interface AuthContextType {
//     user: User | null;
//     loading: boolean;
//     login: (user: User, token: string) => void;
//     logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const token = localStorage.getItem("token");

//         if (token) {
//             fetch("/me", {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             })
//                 .then((res) => {
//                     if (!res.ok) throw new Error("Token không hợp lệ");
//                     return res.json();
//                 })
//                 .then((data: User) => {
//                     setUser(data);
//                 })
//                 .catch((err) => {
//                     console.error("Xác thực thất bại:", err);
//                     localStorage.removeItem("token");
//                     localStorage.removeItem("user");
//                     setUser(null);
//                 })
//                 .finally(() => {
//                     setLoading(false);
//                 });
//         } else {
//             setLoading(false);
//         }
//     }, []);

//     const login = (user: User, token: string) => {
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//         setUser(user);
//     };

//     const logout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider value={{ user, loading, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = (): AuthContextType => {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error("useAuth must be used within AuthProvider");
//     return context;
// };
