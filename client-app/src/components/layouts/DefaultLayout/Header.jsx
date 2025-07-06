import { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";
import { Link } from "react-router";
import useSession from "../../../hooks/useSession";
import axios from "../../../libs/axiosConfig";

export default function Header() {
    const navigate = useNavigate();
    const { user } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [value, setValue] = useState("");

    const handleSearch = async (keyword) => {
        navigate(`/tim-kiem?keyword=${encodeURIComponent(keyword)}`);
    };

    return (
        <header className="px-4 md:max-w-6xl m-auto">
            <div className="grid grid-cols-3">
                <div className="flex items-center float-left">
                    <span className="font-bold hidden md:block">
                        Hotline: 0350395372
                    </span>
                    <svg
                        className="text-gray-700 md:hidden cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#1f1f1f"
                    >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    </svg>
                </div>

                <div id="logo" className="flex justify-center">
                    <Link to="">
                        <img
                            className="w-20 md:w-30"
                            src="../../public/images/mylogo.png"
                            alt="logo"
                        />
                    </Link>
                </div>
                <div className="flex items-center justify-end">
                    <ul className="flex items-center">
                        <li className="hover:text-gray-900">
                            {user ? (
                                <div className="relative mx-2 hidden md:block">
                                    <span
                                        onClick={() =>
                                            setDropdownOpen(!dropdownOpen)
                                        }
                                        className="font-semibold cursor-pointer hover:text-black"
                                    >
                                        {user.name ? user.name : user.username}
                                    </span>

                                    {dropdownOpen && (
                                        <ul className="absolute left-0 mt-2 w-48 bg-gray-200 border border-gray-300 rounded shadow-lg z-100">
                                            <li className="cursor-pointer">
                                                <Link
                                                    to="/thong-tin-ca-nhan"
                                                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() =>
                                                        setDropdownOpen(false)
                                                    }
                                                >
                                                    Thông tin cá nhân
                                                </Link>
                                            </li>
                                            <li className="cursor-pointer">
                                                <Link
                                                    to="/don-hang"
                                                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() =>
                                                        setDropdownOpen(false)
                                                    }
                                                >
                                                    Đơn hàng của tôi
                                                </Link>
                                            </li>
                                            <li className="cursor-pointer">
                                                <button
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => {
                                                        localStorage.removeItem(
                                                            "token"
                                                        );
                                                        localStorage.removeItem(
                                                            "user"
                                                        );
                                                        window.location.href =
                                                            "/";
                                                    }}
                                                >
                                                    Đăng xuất
                                                </button>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/signin"
                                    className="mx-2 hidden md:block"
                                >
                                    Đăng nhập
                                </Link>
                            )}
                        </li>
                        <li className=" hover:text-gray-900">
                            <Link to="/gio-hang" className="flex items-center">
                                <span className="hidden md:block">
                                    Giỏ hàng
                                </span>
                                <svg
                                    className="ml-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 0 24 24"
                                    width="24px"
                                    fill="#1f1f1f"
                                >
                                    <path d="M0 0h24v24H0V0z" fill="none" />
                                    <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full md:w-200 py-2 mb-2 flex bg-gray-200">
                    <svg
                        className="mx-2"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#1f1f1f"
                    >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    <input
                        className="outline-none w-full placeholder:text-gray-500 placeholder:italic"
                        type="text"
                        placeholder="Tìm kiếm sản phẩm hoặc thương hiệu..."
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && value.trim()) {
                                // Gọi API hoặc chuyển trang
                                handleSearch(value.trim());
                            }
                        }}
                    />
                </div>
            </div>
            <Navbar />
        </header>
    );
}
