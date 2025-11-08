import React, { useState, useEffect } from "react";
import axios from "../../libs/axiosConfig";
import Slider from "react-slick";
import { toast } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./banner.css";

type Banner = {
  id_banner: number;
  image_name: string;
  state: string;
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Banner = () => {
  const [banners, setBanners] = useState<Banner[] | null>(null);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  useEffect(() => {
    getBanner();
  }, []);
  const getBanner = async () => {
    try {
      const res = await axios.get(`/banners?state=1`);
      const bannerData = res.data.data;
      if (bannerData) {
        setBanners(bannerData);
      }
    } catch (err) {
      toast.error("Lỗi khi tải banner");
    }
  };

  return (
    <div className="banner w-full overflow-x-hidden">
      {!banners ? (
        "trong"
      ) : (
        <Slider {...settings}>
          {banners.map((item) => (
            <div
              key={item.id_banner}
              className="relative w-full h-[200px] md:h-[500px] lg:h-[720px]"
            >
              <img
                src={`${BASE_URL}${item.image_name}`}
                alt="Banner quảng cáo"
                className="w-full h-full object-fill rounded"
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Banner;
