import "/public/styles/navbar.css";
import { useState, useEffect } from "react";
import axios from "../../../libs/axiosConfig";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type Brand = {
    id: number;
    name: string;
    description: string;
    email: string;
    phone_num: string;
    slug: string;
};

interface NavbarProps {
    isOpen?: boolean; // cho mobile toggle
    className?: string; // thêm class tuỳ chỉnh
    onItemClick?: () => void;
}

export default function Navbar({
    isOpen = true,
    className = "",
    onItemClick,
}: NavbarProps) {
    if (!isOpen) return null; // không render khi mobile đóng

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
        <nav
            className={`md:flex justify-center mb-6 sticky top-0 z-[50] ${className}`}
        >
            <ul className={`nav-list md:flex justify-center `}>
                <li className="nav-item">
                    <Link to="/" className="nav-link" onClick={onItemClick}>
                        <span>Trang chủ</span>
                    </Link>
                </li>
                <li className="nav-item relative">
                    <Accordion className="" type="single" collapsible>
                        <AccordionItem className="" value="item-1">
                            <AccordionTrigger className="nav-link">
                                <span>Thương hiệu</span>
                            </AccordionTrigger>
                            <AccordionContent className="md:absolute">
                                {/* Dropdown Menu*/}
                                <div className="dropdown-menu">
                                    <ul className="dropdown-list grid grid-cols-4 md:grid-cols-3 md:gap-2">
                                        {brands.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    to={`/thuong-hieu/${item.slug}`}
                                                    className="dropdown-item"
                                                    onClick={onItemClick}
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </li>
                <li className="nav-item">
                    <Link
                        to="/danh-muc/dong-ho-nam"
                        className="nav-link"
                        onClick={onItemClick}
                    >
                        <span>Nam</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        to="/danh-muc/dong-ho-nu"
                        className="nav-link"
                        onClick={onItemClick}
                    >
                        <span>Nữ</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        to="/danh-muc/dong-ho-cap-doi"
                        className="nav-link"
                        onClick={onItemClick}
                    >
                        <span>Cặp đôi</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        to="/lien-he"
                        className="nav-link"
                        onClick={onItemClick}
                    >
                        <span>Liên hệ</span>
                    </Link>
                </li>
                <li className="nav-item relative">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="nav-link">
                                <span className="">Trang khác</span>
                            </AccordionTrigger>
                            <AccordionContent className="md:absolute">
                                <div className="dropdown-menu">
                                    <ul className="dropdown-list">
                                        <li>
                                            <Link
                                                to="/gioi-thieu"
                                                className="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                                onClick={onItemClick}
                                            >
                                                Giới thiệu
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/khuyen-mai"
                                                className="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                                onClick={onItemClick}
                                            >
                                                Khuyến mãi
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </li>
            </ul>
        </nav>
    );
}
