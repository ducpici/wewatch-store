// import { Link, Navigate } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/libs/axiosConfig";
import { toast } from "react-toastify";
import ProductCard from "@/components/common/ProductCard";
import { Product } from "@/types/product";
const BASE_URL = import.meta.env.VITE_BASE_URL;

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
      <h2 className="my-5 text-center uppercase font-semibold text-lg md:text-2xl">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-10 lg:grid-cols-3 lg:gap-10">
        {products.slice(0, 6).map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
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
