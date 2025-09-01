// Header.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import useSession from "../../../hooks/useSession";
import {
    User,
    Package,
    LogOut,
    LogIn,
    ShoppingCart,
    Menu,
    X,
    Search,
} from "lucide-react";
import { toast } from "react-toastify";

export default function Header() {
    const navigate = useNavigate();
    const { user, clearSession } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [value, setValue] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSearch = (keyword: string) => {
        navigate(`/tim-kiem?keyword=${encodeURIComponent(keyword)}`);
        setMenuOpen(false);
    };
    // Khóa scroll khi mở mobile menu
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);
    return (
        <header className="px-3 md:max-w-6xl m-auto">
            {/* Top header */}
            <div className="grid grid-cols-3 items-center">
                <div className="flex items-center">
                    <span className="font-bold hidden md:block">
                        Hotline: 0350395372
                    </span>
                    {/* Hamburger mobile */}
                    <div className="md:hidden cursor-pointer">
                        {menuOpen ? (
                            <X onClick={() => setMenuOpen(false)} />
                        ) : (
                            <Menu onClick={() => setMenuOpen(true)} />
                        )}
                    </div>
                </div>

                {/* Logo */}
                <div id="logo" className="flex justify-center">
                    <Link to="/">
                        <img
                            className="w-20 md:w-30"
                            src="/images/mylogo.png"
                            alt="logo"
                        />
                    </Link>
                </div>

                {/* User / Cart */}
                <div className="flex items-center justify-end">
                    <ul className="flex items-center relative">
                        <li>
                            <div className="mx-2">
                                <div
                                    className="user flex items-center font-semibold cursor-pointer hover:text-black"
                                    onClick={() =>
                                        setDropdownOpen(!dropdownOpen)
                                    }
                                >
                                    <User />
                                </div>

                                {dropdownOpen && (
                                    <div className="userDropdown absolute right-0 left-auto md:left-0 md:right-auto bg-white rounded shadow-lg border border-gray-300 min-w-max mt-2 z-10">
                                        {/* Mũi tên */}
                                        {/* <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 md:left-2 md:transform-none w-4 h-4 rotate-45 bg-gray-200 border-l border-t border-gray-300 rounded-tl-sm z-10" /> */}
                                        <ul className="">
                                            {user ? (
                                                <>
                                                    <li>
                                                        <Link
                                                            to="/thong-tin-ca-nhan"
                                                            className="px-4 py-2 hover:bg-gray-100 flex items-center"
                                                            onClick={() =>
                                                                setDropdownOpen(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            <User className="mr-1 text-gray-500" />{" "}
                                                            Thông tin cá nhân
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            to="/don-hang"
                                                            className="px-4 py-2 hover:bg-gray-100 flex items-center"
                                                            onClick={() =>
                                                                setDropdownOpen(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            <Package className="mr-1 text-gray-500" />{" "}
                                                            Đơn hàng của tôi
                                                        </Link>
                                                    </li>
                                                    <li className="border-t border-gray-300">
                                                        <Link
                                                            to="/"
                                                            className="px-4 py-2 hover:bg-gray-100 flex items-center text-red-500"
                                                            onClick={() => {
                                                                clearSession();
                                                                setDropdownOpen(
                                                                    false
                                                                );
                                                                toast.success(
                                                                    "Đăng xuất thành công"
                                                                );
                                                            }}
                                                        >
                                                            <LogOut className="mr-1 text-red-500" />{" "}
                                                            Đăng xuất
                                                        </Link>
                                                    </li>
                                                </>
                                            ) : (
                                                <li className="">
                                                    <Link
                                                        to="/signin"
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <LogIn className="mr-1 text-blue-500" />
                                                        Đăng nhập/Đăng ký
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                                {/* Overlay để đóng dropdown khi click bên ngoài */}
                                {dropdownOpen && (
                                    <div
                                        className="fixed inset-0 z-5"
                                        onClick={() => setDropdownOpen(false)}
                                    ></div>
                                )}
                            </div>
                        </li>
                        <li>
                            <Link
                                to="/gio-hang"
                                className="flex items-center font-semibold hover:text-black ml-2"
                            >
                                <ShoppingCart />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Search box */}
            <div className="flex justify-center">
                <div className="w-full md:w-200 py-2 px-4 mb-2 flex bg-gray-200">
                    <input
                        className="outline-none w-full placeholder:text-gray-500 placeholder:italic"
                        type="text"
                        placeholder="Tìm kiếm sản phẩm hoặc thương hiệu..."
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && value.trim())
                                handleSearch(value.trim());
                        }}
                    />
                    <Search />
                </div>
            </div>

            {/* Desktop Navbar */}
            <div className="hidden md:block">
                <Navbar />
            </div>

            {/* Mobile menu overlay */}
            {menuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/30 z-40 md:hidden"
                        onClick={() => setMenuOpen(false)}
                    ></div>

                    {/* Menu */}
                    <div
                        className="fixed left-0 right-0 bottom-0 bg-white z-50 md:hidden overflow-y-auto"
                        style={{ top: "80px" }}
                    >
                        <Navbar
                            isOpen={true}
                            onItemClick={() => setMenuOpen(false)}
                        />
                    </div>
                </>
            )}
        </header>
    );
}
