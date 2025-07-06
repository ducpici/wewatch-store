interface ProductIntroBannerProps {
    title: string;
    subtitle: string;
    imageUrl: string;
    description: string;
}

const ProductIntroBanner = ({
    title,
    subtitle,
    imageUrl,
    description,
}: ProductIntroBannerProps) => {
    return (
        <div className="rounded overflow-hidden bg-white">
            {/* Tiêu đề phụ */}
            <div className="text-center text-gray-700 font-semibold text-sm">
                {subtitle}
            </div>

            {/* Ảnh chính */}
            {/* <div className="mt-2">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full object-cover rounded"
                />
            </div> */}

            {/* Mô tả dưới */}
            <p className="text-gray-600 text-sm italic mt-2 pb-4 text-justify">
                {description}
            </p>
        </div>
    );
};

export default ProductIntroBanner;
