// import { Link, Navigate } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "@/libs/axiosConfig";
import { toast } from "react-toastify";
import { NextArrow, PrevArrow } from "@/components/ui/arrow";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Product, RelatedProduct } from "@/types/product";
import useIsMobile from "@/hooks/useIsMobile";
import "@/styles/slider.css";
import ProductCard from "./ProductCard";

export default function RelatedProductList({ title, slug }: RelatedProduct) {
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const getProduct = async () => {
    try {
      let res = await axios.get(`/thuong-hieu/${slug}`);
      setProducts(res.data.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
      toast.error("Lỗi khi tải danh sách");
    } finally {
    }
  };

  useEffect(() => {
    getProduct();
  }, [slug]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 400,
    cssEase: "linear",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    swipe: true,
    draggable: true,
    touchMove: true,
    autoplay: false,
    pauseOnHover: true,
    pauseOnFocus: true,
    beforeChange: () => setIsDragging(true),
    afterChange: () => setIsDragging(false),
    slidesToShow: isMobile ? 2 : 5,
    slidesToScroll: isMobile ? 2 : 2,
    responsive: [
      {
        breakpoint: 1600, // desktop
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1200, // tablet & mobile
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768, // mobile nhỏ
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  // 🧠 Theo dõi khi người dùng kéo bằng chuột hoặc cảm ứng
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const point = "touches" in e ? e.touches[0] : e;
    startX.current = point.clientX;
    startY.current = point.clientY;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const point = "touches" in e ? e.touches[0] : e;
    const dx = Math.abs(point.clientX - startX.current);
    const dy = Math.abs(point.clientY - startY.current);
    if (dx > 5 || dy > 5) setIsDragging(true); // 👈 nếu kéo >5px → đang drag
  };

  const handleMouseUp = () => {
    setTimeout(() => setIsDragging(false), 50); // reset nhẹ sau khi thả
  };
  return (
    <section className="CategoryProductSection overflow-x-hidden">
      <h2 className="my-5 text-center uppercase font-semibold text-lg md:text-2xl">
        {title}
      </h2>
      <Slider {...settings}>
        {products.map((product) => {
          return (
            <div
              className="product"
              key={product.id}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              <ProductCard product={product} />
            </div>
          );
        })}
      </Slider>
    </section>
  );
}
