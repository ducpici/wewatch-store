import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import axios from "../../libs/axiosConfig";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import { toast } from "react-toastify";
import useSession from "../../hooks/useSession";
import { useNavigate } from "react-router";

interface Review {
    id: number;
    name: string;
    avatar: string;
    created_at: string;
    platform: string;
    rating: number;
    comment: string;
}

interface StarRatingProps {
    rating: number;
}

interface ReviewsApiResponse {
    overallRating: number;
    totalReviews: number;
    reviews: Review[];
}

interface ProductReviewsProps {
    id_product: number;
    onWriteReview?: () => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
    id_product,
    onWriteReview,
}) => {
    const { user } = useSession();
    const navigate = useNavigate();
    const [reviewData, setReviewData] = useState<ReviewsApiResponse | null>(
        null
    );
    const [userRating, setUserRating] = useState<number>(0);
    const [userComment, setUserComment] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // API call function
    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get(`/products/${id_product}/reviews`);

            setReviewData(res.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch reviews"
            );
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch reviews when component mounts or id_product changes
    useEffect(() => {
        if (id_product) {
            fetchReviews();
        }
    }, [id_product]);
    // Default data for demo purposes
    const defaultReviews: Review[] = [
        {
            id: 1,
            name: "Meqiz",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            created_at: "6 hours ago",
            platform: "Google",
            rating: 5,
            comment: "elegancko",
        },
        {
            id: 2,
            name: "고동욱",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            created_at: "8 hours ago",
            platform: "Google",
            rating: 5,
            comment: "경치 너무 좋아요~~~",
        },
        {
            id: 3,
            name: "Gabriela Mendes toledo",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
            created_at: "9 hours ago",
            platform: "Google",
            rating: 5,
            comment:
                "Experiência maravilhosa, muita informação legal, bastante interativo",
        },
        {
            id: 4,
            name: "Mohammed Siddiq",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
            created_at: "11 hours ago",
            platform: "Google",
            rating: 5,
            comment:
                "An amazing place. Offers a stunning panoramic view of Los Angeles, and telescopes provide a closer look at the city's details from above. The exhibition is filled with cool visualizations of astronomical concepts.",
        },
    ];

    const displayReviews = reviewData?.reviews || defaultReviews;
    const overallRating = reviewData?.overallRating || 4.8;
    const totalReviews = reviewData?.totalReviews || 41354;
    const { isOpen, openModal, closeModal } = useModal();
    const handleOpenModalReview = () => {
        if (!user) {
            toast.warning("Vui lòng đăng nhập trước khi đánh giá");
            // navigate("/signin");
            return;
        }
        openModal();
    };
    const handleReview = async () => {
        if (userRating === 0) {
            toast.info("Vui lòng chọn số sao trước khi gửi đánh giá.");
            return;
        }
        if (userComment == "") {
            toast.info("Vui lòng viết nhận xét.");
        }
        try {
            const res = await axios.post(`/products/${id_product}/reviews`, {
                rating: userRating,
                comment: userComment,
                productId: id_product,
            });
            toast.info(res.data.message);
            closeModal();
            fetchReviews();
        } catch (error) {}
    };
    function CompactStarRating({
        rating,
        onChange,
    }: {
        rating: number;
        onChange: (value: number) => void;
    }) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Đánh giá:</span>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                        <button
                            key={starIndex}
                            onClick={() => onChange(starIndex)}
                            className="transition-all duration-200 hover:scale-110"
                        >
                            <Star
                                size={20}
                                className={`transition-colors duration-200 ${
                                    starIndex <= rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300 hover:text-yellow-300"
                                }`}
                            />
                        </button>
                    ))}
                </div>
                {rating > 0 && (
                    <span className="text-sm text-gray-700">({rating}/5)</span>
                )}
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white">
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                        <div className="h-12 w-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-6">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white">
                <div className="text-center py-8">
                    <div className="text-red-500 mb-4">
                        <svg
                            className="mx-auto h-16 w-16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Error loading reviews
                    </h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={fetchReviews}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                    <Star
                        key={index}
                        className={`w-4 h-4 ${
                            index < rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Đánh giá chung
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold text-gray-900">
                            {reviewData?.overallRating}
                        </span>
                        <div className="flex items-center gap-2">
                            <StarRating
                                rating={reviewData?.overallRating || 5}
                            />
                            <span className="text-gray-500 text-sm">
                                ({reviewData?.totalReviews})
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    onClick={handleOpenModalReview}
                >
                    Viết đánh giá
                </button>
            </div>

            {/* Reviews */}
            <div className="space-y-6">
                {displayReviews.map((review: Review) => (
                    <div key={review.id} className="flex gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {review.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Review Content */}
                        <div className="flex-1">
                            {/* Name and Time */}
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                    {review.name}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm text-gray-500">
                                    {review.created_at}
                                </span>
                                <span className="text-sm text-blue-600 font-medium">
                                    {review.platform}
                                </span>
                            </div>

                            {/* Rating */}
                            <div className="mb-3">
                                <StarRating rating={review.rating} />
                            </div>

                            {/* Comment */}
                            <p className="text-gray-700 leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[500px] m-4"
            >
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Viết đánh giá
                        </h4>
                    </div>
                    <div className="custom-scrollbar h-[200px] overflow-y-auto px-2 pb-3">
                        <div className="mt-2 mb-2">
                            <CompactStarRating
                                rating={userRating}
                                onChange={setUserRating}
                            />
                        </div>
                        <div>
                            <TextArea
                                value={userComment}
                                onChange={(e) => setUserComment(e.target.value)}
                                placeholder="Viết nhận xét của bạn tại đây..."
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button
                            className="cursor-pointer"
                            size="sm"
                            variant="outline"
                            onClick={closeModal}
                        >
                            Đóng
                        </Button>
                        <Button
                            className="bg-blue-500 cursor-pointer"
                            size="sm"
                            onClick={handleReview}
                        >
                            Đánh giá
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProductReviews;
