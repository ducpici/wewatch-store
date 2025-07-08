import React, { useState } from "react";
import { Gift, ChevronRight, Check } from "lucide-react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

export default function UserVoucher() {
    interface Voucher {
        id: number;
        code: string;
        description: string;
        discount_type: {
            code: number;
            text: string;
        };
        discount_value: bigint;
        start_date: string;
        end_date: string;
    }
    const [vouchers, setVouchers] = useState([
        {
            id: 1,
            title: "Ưu đãi chào mừng khách hàng mới",
            code: "VQPG6K4",
            value: "50.000 đ",
            expiry: "20-12-2026",
            isUsed: false,
        },
        {
            id: 2,
            title: "Giảm giá 30% cho đơn hàng đầu tiên",
            code: "FIRST30",
            value: "30%",
            expiry: "15-08-2025",
            isUsed: false,
        },
        {
            id: 3,
            title: "Miễn phí vận chuyển",
            code: "FREESHIP",
            value: "Free",
            expiry: "31-12-2025",
            isUsed: true,
        },
        {
            id: 4,
            title: "Ưu đãi sinh nhật đặc biệt",
            code: "BIRTHDAY",
            value: "100.000 đ",
            expiry: "10-09-2025",
            isUsed: false,
        },
    ]);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Khuyến mãi của tôi" },
    ];

    const handleUseVoucher = (id) => {
        setVouchers(
            vouchers.map((voucher) =>
                voucher.id === id ? { ...voucher, isUsed: true } : voucher
            )
        );
    };

    const handleViewDetails = (voucher) => {
        alert(
            `Chi tiết voucher:\nMã: ${voucher.code}\nGiá trị: ${voucher.value}\nHạn sử dụng: ${voucher.expiry}`
        );
    };

    return (
        <div className="max-w-6xl mx-auto">
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-xl font-medium text-gray-800 mb-6">
                    Voucher của tôi
                </h1>

                <div className="grid gap-2 md:grid-cols-2">
                    {vouchers.map((voucher) => (
                        <div
                            key={voucher.id}
                            className={`bg-white rounded-lg shadow-sm border border-gray-400 ${
                                voucher.isUsed ? "opacity-60" : ""
                            }`}
                        >
                            <div className="flex items-center p-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 mr-4">
                                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                                        <Gift className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                                        {voucher.title}
                                    </h3>

                                    <div className="space-y-1 text-xs text-gray-600">
                                        <div className="flex items-center">
                                            <span className="w-16 text-gray-500">
                                                Mã voucher:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {voucher.code}
                                            </span>
                                        </div>

                                        <div className="flex items-center">
                                            <span className="w-16 text-gray-500">
                                                Giá trị:
                                            </span>
                                            <span className="font-medium text-red-600">
                                                {voucher.value}
                                            </span>
                                        </div>

                                        <div className="flex items-center">
                                            <span className="w-16 text-gray-500">
                                                Hạn sử dụng đến:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {voucher.expiry}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex-shrink-0 flex items-center space-x-2">
                                    <button
                                        onClick={() =>
                                            handleViewDetails(voucher)
                                        }
                                        className="flex items-center px-3 py-1.5 text-xs text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                    >
                                        <ChevronRight className="w-3 h-3 mr-1" />
                                        Chi tiết
                                    </button>

                                    {voucher.isUsed ? (
                                        <div className="flex items-center px-3 py-1.5 text-xs text-green-600 bg-green-50 rounded-md">
                                            <Check className="w-3 h-3 mr-1" />
                                            Đã dùng
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handleUseVoucher(voucher.id)
                                            }
                                            className="px-3 py-1.5 text-xs text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Sử dụng
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {vouchers.length === 0 && (
                    <div className="text-center py-12">
                        s
                        <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Bạn chưa có voucher nào</p>
                    </div>
                )}
            </div>
        </div>
    );
}
