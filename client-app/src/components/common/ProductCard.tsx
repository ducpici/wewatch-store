import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Link } from "react-router";

type Product = {
    id: number;
    modal_num: string;
    name: string;
    brand: {
        id: number;
        name: string;
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
    };
    quantity: number;
    price: number;
    image: string;
    state: string;
    slug: string;
    functions: {
        id: number;
        name: string;
    }[];
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    return (
        <div className="product" key={product.id}>
            <div className="box-image">
                <Link to={`/san-pham/${product.slug}`}>
                    <img
                        className="w-60 h-60"
                        src={`https://admin.wewatch.com:4090${product.image}`}
                        alt="ảnh"
                    />
                </Link>
            </div>
            <div className="box-text">
                <div className="title-wrapper h[63px] overflow-hidden w-full">
                    <p className="text-center line-clamp-3">{product.name}</p>
                </div>
                <div className="price-wrapper">
                    <span className="font-semibold">
                        {product.price.toLocaleString("vi-VN")} <span>₫</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
