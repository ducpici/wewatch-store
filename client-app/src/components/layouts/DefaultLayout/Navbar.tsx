import "/public/styles/navbar.css";
import { useState, useEffect } from "react";
import axios from "../../../libs/axiosConfig";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Navbar() {
    type Brand = {
        id: number;
        name: string;
        description: string;
        email: string;
        phone_num: string;
        slug: string;
    };
    const [brands, setBrands] = useState<Brand[]>([]);
    const getBrands = async () => {
        try {
            const res = await axios.get(`/brands`);
            setBrands(res.data.data);
        } catch (err) {
            toast.error("Lỗi khi tải danh sách");
        }
    };

    useEffect(() => {
        getBrands();
    }, []);
    return (
        <nav className="hidden md:flex justify-center mb-6 sticky top-0 z-[50]">
            <ul className="nav-list flex justify-center">
                <li className="nav-item group relative">
                    <Link to="/" className="nav-link">
                        <span>Trang chủ</span>
                    </Link>
                </li>
                <li className="nav-item relative">
                    <Link to="" className="nav-link flex items-center">
                        <span>Thương hiệu</span>
                        <svg
                            className="w-4 h-4 ml-1 inline-block transition-transform"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Link>
                    {/* Dropdown Menu*/}
                    <div className="dropdown-menu border border-gray-300">
                        <ul className="py-2">
                            {brands.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={`/thuong-hieu/${item.slug}`}
                                        className="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </li>
                <li className="nav-item">
                    <Link to="/danh-muc/dong-ho-nam" className="nav-link">
                        <span>Nam</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/danh-muc/dong-ho-nu" className="nav-link">
                        <span>Nữ</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/danh-muc/dong-ho-cap-doi" className="nav-link">
                        <span>Cặp đôi</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/lien-he" className="nav-link">
                        <span>Liên hệ</span>
                    </Link>
                </li>
                <li className="nav-item relative">
                    <Link to="" className="nav-link flex items-center">
                        <span>Trang khác</span>
                        <svg
                            className="w-4 h-4 ml-1 inline-block transition-transform"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Link>
                    <div className="dropdown-menu border border-gray-300">
                        <ul className="py-2">
                            <li>
                                <Link
                                    to="/gioi-thieu"
                                    className="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                >
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/khuyen-mai"
                                    className="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                >
                                    Khuyến mãi
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </nav>
    );
}
