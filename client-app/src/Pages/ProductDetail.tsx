import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "../libs/axiosConfig";
import { toast } from "react-toastify";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import useSession from "../hooks/useSession";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import SameProduct from "../components/common/SameProduct";
import ProductReviews from "../components/common/ProductReviews";
type Product = {
    id: number;
    modal_num: string;
    name: string;
    brand: {
        id: number;
        name: string;
        slug: string;
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
    functions: {
        id: number;
        name: string;
    }[];
};

export default function ProductDetail() {
    const navigate = useNavigate();
    const { user } = useAuth();
    // const { user } = useSession();
    const { slug } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [activeTab, setActiveTab] = useState("description");
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Sản phẩm" },
    ];
    const getProductBySlug = async () => {
        try {
            let res = await axios.get(`/san-pham/${slug}`);

            console.log(res.data);
            setProduct(res.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách:", err);
            toast.error("Lỗi khi tải danh sách");
        } finally {
        }
    };

    const handleAddToCart = async (id: number) => {
        if (!user) {
            toast.warning("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
            setTimeout(() => {
                navigate("/signin", { state: { from: location.pathname } });
            }, 1500);
            return;
        }
        if (product?.quantity === 0) {
            toast.error("Sản phẩm đã tạm hết hàng");
            return;
        }
        try {
            const res = await axios.post(`/cart`, {
                userId: user?.id,
                productId: id,
                quantity: 1,
            });
            console.log(res);
            toast.success(res.data.message);
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            toast.error("Không thể thêm vào giỏ hàng");
        }
    };

    useEffect(() => {
        getProductBySlug();
    }, [slug]);
    if (!product) return <div>Đang tải sản phẩm...</div>;
    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            {/* <nav className="text-sm text-gray-500 mb-2 uppercase">
                Trang chủ / Sản phẩm
            </nav> */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                <div className="">
                    <div className="mainImg relative flex">
                        {/* <SlArrowLeft className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer text-2xl" /> */}
                        <img
                            src={`https://admin.wewatch.com:4090${product.image}`}
                            alt="Black Link Watch"
                            className="w-full rounded-lg"
                        />
                        {/* <SlArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-2xl" /> */}
                    </div>

                    {/* <div className="flex justify-center mt-4 space-x-2">
                        <img
                            src="/images/watch-1.png"
                            alt="thumb1"
                            className="w-16 h-16 rounded border"
                        />
                        <img
                            src="/images/watch-2.png"
                            alt="thumb2"
                            className="w-16 h-16 rounded border opacity-50"
                        />
                        <img
                            src="/images/watch-3.png"
                            alt="thumb3"
                            className="w-16 h-16 rounded border opacity-50"
                        />
                        <img
                            src="/images/watch-4.png"
                            alt="thumb4"
                            className="w-16 h-16 rounded border opacity-50"
                        />
                    </div> */}
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="text-2xl font-semibold text-red-600 mt-2">
                        {product.price.toLocaleString("vi-VN")} <span>₫</span>
                    </p>

                    {/* Quantity and Add to Cart */}
                    <div className="flex items-center mt-4 space-x-2">
                        <button
                            className="mt-4 w-full bg-amber-800 text-white px-6 py-3 rounded cursor-pointer"
                            onClick={() => handleAddToCart(product.id)}
                        >
                            THÊM VÀO GIỎ HÀNG
                        </button>
                    </div>

                    {/* Benefits */}
                    <ul className="mt-6 space-y-3 text-large">
                        <li>🚚 MIỄN PHÍ VẬN CHUYỂN</li>
                        <li>🛠️ BẢO HÀNH 10 NĂM DO LỖI NHÀ SẢN XUẤT</li>
                        <li>✅ CAM KẾT 100% CHÍNH HÃNG</li>
                    </ul>
                </div>
            </div>{" "}
            {/* Tabs */}
            <div className="mt-10">
                <div className="flex text-sm font-medium">
                    <button
                        className={`pb-2 mr-6 border-b-2 cursor-pointer ${
                            activeTab === "description"
                                ? "border-black text-black"
                                : "text-gray-500 border-transparent"
                        }`}
                        onClick={() => setActiveTab("description")}
                    >
                        MÔ TẢ
                    </button>
                    <button
                        className={`pb-2 mr-6 border-b-2 cursor-pointer ${
                            activeTab === "review"
                                ? "border-black text-black"
                                : "text-gray-500 border-transparent"
                        }`}
                        onClick={() => setActiveTab("review")}
                    >
                        ĐÁNH GIÁ
                    </button>
                </div>
                <div>
                    {activeTab === "review" && (
                        <div>
                            <ProductReviews id_product={product.id} />
                        </div>
                    )}
                    {activeTab === "description" && (
                        <table className="mt-4 w[800px] text-sm text-left">
                            <tbody>
                                <tr className="">
                                    <td className="p-2 w-1/3">Thương hiệu:</td>
                                    <td className="p-2">
                                        {product.brand.name}
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="p-2">Số hiệu sản phẩm:</td>
                                    <td className="p-2">{product.modal_num}</td>
                                </tr>
                                <tr className="">
                                    <td className="p-2">Xuất xứ:</td>
                                    <td className="p-2">{product.origin}</td>
                                </tr>
                                <tr className="">
                                    <td className="p-2">Chất liệu mặt kính:</td>
                                    <td className="p-2">
                                        {product.crystal_material}
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="p-2">Máy:</td>
                                    <td className="p-2">
                                        {product.movement_type}
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="p-2">Đường kính mặt số:</td>
                                    <td className="p-2">
                                        {product.dial_diameter}
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="p-2">Bề dày thân:</td>
                                    <td className="p-2">
                                        {product.case_thickness}
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="p-2">Chất liệu dây đeo:</td>
                                    <td className="p-2">
                                        {product.strap_material}
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="p-2">Khả năng chịu nước</td>
                                    <td className="p-2">
                                        {product.water_resistance} ATM
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="p-2">Chức năng:</td>
                                    <td className="p-2">
                                        {product?.functions
                                            ?.map((item) => item.name)
                                            .join(", ")}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <SameProduct title="Sản phẩm liên quan" slug={product.brand.slug} />
        </>
    );
}
