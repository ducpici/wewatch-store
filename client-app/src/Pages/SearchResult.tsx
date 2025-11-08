import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/libs/axiosConfig";
import ProductList from "@/components/common/ProductList";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Product } from "@/types/product";

export default function SearchResult() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("keyword") || "";
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);

  const fetchSearchResults = async (keyword: any) => {
    try {
      const response = await axios.get(`/products/search?keyword=${keyword}`);
      console.log(response.data.data);
      setProducts(response.data.data);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
    }
  };
  return (
    <>
      <div className="products container md:max-w-6xl m-auto px-2">
        {loading ? (
          <div className="loading-spinner text-center py-8">
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <p>
              Hiển thị {products.length} kết quả cho "{query}"
            </p>
            <ProductList products={products} />
          </>
        ) : (
          <div className="h-dvh flex justify-center items-center text-center py-8">
            <div className="space-y-2">
              <p>Không có sản phẩm nào được tìm thấy.</p>
              <Link
                to="/"
                className="flex justify-center items-center p-3 border border-gray-500 rounded"
              >
                <ChevronLeft size={15} /> Quay về trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
