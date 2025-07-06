import { useEffect, useState } from "react";
import FeatureProduct from "../components/common/FeatureProduct";
import axios from "../libs/axiosConfig";
import { toast } from "react-toastify";

type Banner = {
    id_banner: number;
    image_name: string;
    state: string;
};

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [banner, setBanner] = useState<Banner | null>(null);

    const getCaregories = async () => {
        try {
            const res = await axios.get(`/categories`);
            setCategories(res.data.data);
        } catch (err) {
            toast.error("Lỗi khi tải danh sách");
        } finally {
        }
    };

    const getBanner = async () => {
        try {
            const res = await axios.get(`/banners?state=1`);
            const bannerData = res.data.data?.[0];
            if (bannerData) {
                setBanner(bannerData);
            }
        } catch (err) {
            toast.error("Lỗi khi tải banner");
        }
    };

    useEffect(() => {
        getCaregories();
        getBanner();
    }, []);

    return (
        <>
            <div className="banner">
                {/* <img
                    src="https://admin.wewatch.com:4090//uploads/banners/1749434474040-6250.jpg"
                    alt=""
                /> */}
                {banner && (
                    <img
                        src={`https://admin.wewatch.com:4090${banner.image_name}`}
                        alt="Banner quảng cáo"
                        className="w-full object-cover rounded"
                    />
                )}
            </div>
            <div className="container md:max-w-6xl m-auto">
                {categories.map((category: any) => {
                    return (
                        <FeatureProduct
                            key={category.id}
                            title={category.name}
                            categoryId={category.id}
                            slug={category.slug}
                        />
                    );
                })}
            </div>
        </>
    );
}
