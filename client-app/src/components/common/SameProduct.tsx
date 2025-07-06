// import { Link, Navigate } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../libs/axiosConfig";
import { toast } from "react-toastify";
import toSlug from "../../libs/formatSlug";

type Product = {
    id: number;
    modal_num: string;
    name: string;
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

type SameProduct = {
    title?: string;
    slug: string;
};

export default function SameProduct({ title, slug }: SameProduct) {
    const [products, setProducts] = useState<Product[]>([]);

    const navigate = useNavigate();
    const getProduct = async () => {
        try {
            let res = await axios.get(`/thuong-hieu/${slug}`);
            console.log(res);
            setProducts(res.data.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách:", err);
            toast.error("Lỗi khi tải danh sách");
        } finally {
        }
    };
    useEffect(() => {
        getProduct();
    }, []);
    return (
        <section className="CategoryProductSection">
            <h2 className="my-5 text-center uppercase font-semibold text-xl">
                {title}
            </h2>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-10 lg:grid-cols-5 lg:gap-10">
                {products.slice(0, 5).map((product) => {
                    return (
                        <div className="product" key={product.id}>
                            <Link to={`/san-pham/${product.slug}`}>
                                <div className="box-image">
                                    <img
                                        className="w-60"
                                        src={`https://admin.wewatch.com:4090${product.image}`}
                                        alt="ảnh"
                                    />
                                </div>
                                <div className="box-text">
                                    <div className="title-wrapper h[60px] overflow-hidden w-full">
                                        <p className="text-center line-clamp-3">
                                            {product.name}
                                        </p>
                                    </div>
                                    <div className="price-wrapper">
                                        <span className="font-semibold">
                                            {product.price.toLocaleString(
                                                "vi-VN"
                                            )}{" "}
                                            <span>₫</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
