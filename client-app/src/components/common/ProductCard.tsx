import { Link } from "react-router";
import { Product } from "@/types/product";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="product" key={product.id}>
      <div className="box-image">
        <Link to={`/san-pham/${product.slug}`}>
          <img
            className="w-30 md:w-60"
            src={`${BASE_URL}${product.image}`}
            alt="ảnh"
          />
        </Link>
      </div>
      <div className="box-text">
        <Tooltip>
          <TooltipTrigger>
            <div className="title-wrapper h[63px] overflow-hidden w-full">
              <p className="text-center line-clamp-2">{product.name}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>{product.name}</TooltipContent>
        </Tooltip>
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
