import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../libs/axiosConfig";
import ProductList from "../components/common/ProductList";

export default function SearchResult() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("keyword") || "";
    // const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    interface Product {
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
    }
    useEffect(() => {
        if (query) {
            fetchSearchResults(query);
        }
    }, [query]);

    const fetchSearchResults = async (keyword: any) => {
        try {
            const response = await axios.get(
                `/products/search?keyword=${keyword}`
            );
            console.log(response.data.data);
            setProducts(response.data.data);
        } catch (err) {
            console.error("Lỗi khi tìm kiếm:", err);
        }
    };
    return (
        <>
            <div className="products">
                {loading ? (
                    <div className="loading-spinner text-center py-8">
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        {" "}
                        <p>
                            Hiển thị {products.length} kết quả cho "{query}"{" "}
                        </p>
                        <ProductList products={products} />
                    </>
                ) : (
                    <div className="no-products text-center py-8">
                        <p>Không có sản phẩm nào được tìm thấy.</p>
                    </div>
                )}
            </div>
        </>
    );
}
