// import { Link, Navigate } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../libs/axiosConfig";
import { toast } from "react-toastify";
import toSlug from "../../libs/formatSlug";

type Product = {
    id: number;
    modal_num: string;
    brand: {
        id: number;
        name: string;
        description: string;
    };
    origin: string;
    crystal_material: string;
    movement_type: string;
    dial_diameter: string;
    case_thickness: string;
    strap_material: string;
    water_resistance: string;
    category: {
        id: number;
        name: string;
        description: string;
        slug: string;
    };
    quantity: number;
    price: number;
    image: string;
    slug: string;
    state: string;
};

type FeatureProductProps = {
    title?: string;
    categoryId: number;
    slug: string;
};

export default function FeatureProduct({
    title,
    categoryId,
    slug,
}: FeatureProductProps) {
    const [products, setProducts] = useState<Product[]>([]);

    const navigate = useNavigate();
    const getProductByCategory = async () => {
        try {
            let res = await axios.get(`/danh-muc/${slug}`);
            setProducts(res.data.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách:", err);
            toast.error("Lỗi khi tải danh sách");
        } finally {
        }
    };
    useEffect(() => {
        getProductByCategory();
    }, [categoryId]);
    return (
        <section className="CategoryProductSection">
            <h2 className="my-5 text-center uppercase font-semibold text-2xl">
                {title}
            </h2>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-10 lg:grid-cols-5 lg:gap-10">
                {products.slice(0, 5).map((product) => {
                    const nameProduct =
                        product.brand.name +
                        " " +
                        product.modal_num +
                        " " +
                        product.crystal_material +
                        " " +
                        product.movement_type +
                        " " +
                        "Mặt số " +
                        product.dial_diameter +
                        " " +
                        "Chống nước " +
                        product.water_resistance +
                        "ATM";

                    return (
                        <div className="product" key={product.id}>
                            <div className="box-image">
                                <Link to={`/san-pham/${product.slug}`}>
                                    <img
                                        className="w-60"
                                        src={`https://admin.wewatch.com:4090${product.image}`}
                                        alt="ảnh"
                                    />
                                </Link>
                            </div>
                            <div className="box-text">
                                <div className="title-wrapper h[60px] overflow-hidden w-full">
                                    <p className="text-center line-clamp-3">
                                        {nameProduct}
                                    </p>
                                </div>
                                <div className="price-wrapper">
                                    <span className="font-semibold">
                                        {product.price.toLocaleString("vi-VN")}{" "}
                                        <span>₫</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-center py-4 items-center">
                <button
                    onClick={() => navigate(`/danh-muc/${slug}`)}
                    className="p-2 uppercase font-semibol bg-black text-white cursor-pointer"
                >
                    Xem tất cả sản phẩm
                </button>
            </div>
        </section>
    );
}
