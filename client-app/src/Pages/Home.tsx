import { useEffect, useState } from "react";
import FeatureProduct from "@/components/common/FeatureProduct";
import axios from "@/libs/axiosConfig";
import { toast } from "react-toastify";
import Banner from "@/components/Banner/Banner";

export default function Home() {
  const [categories, setCategories] = useState([]);

  const getCaregories = async () => {
    try {
      const res = await axios.get(`/categories`);
      setCategories(res.data.data);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách");
    } finally {
    }
  };

  useEffect(() => {
    getCaregories();
  }, []);

  return (
    <>
      <Banner />
      <div className="container md:max-w-6xl px-2 m-auto">
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
