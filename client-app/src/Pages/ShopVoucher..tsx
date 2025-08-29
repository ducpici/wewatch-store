import React, { useState, useEffect } from "react";
import { Gift, ChevronRight, Check } from "lucide-react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { toast } from "react-toastify";
import axios from "../libs/axiosConfig";
import getVoucherStatus from "..//libs/getVoucherStatus";
import formatDate from "../libs/formatDate";

export default function ShopVoucher() {
    interface Voucher {
        id: number;
        code: string;
        description: string;
        quantity: number;
        used_count: number;
        discount_type: {
            code: number;
            text: string;
        };
        discount_value: bigint;
        start_date: string;
        end_date: string;
        create_at: Date;
        update_at: Date;
    }

    const [loading, setLoading] = useState(false);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [limitData, setLimitData] = useState(10);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Khuyến mãi" },
    ];

    const getStatusText = (code: number) => {
        switch (code) {
            case 1:
                return "Hoạt động";
            case 2:
                return "Hết hạn";
            case 3:
                return "Đã dùng hết";
            case 4:
                return "Chưa bắt đầu";
            default:
                return "Vô hiệu hóa";
        }
    };

    const handleUseVoucher = (id: any) => {
        setVouchers(
            vouchers.map((voucher) =>
                voucher.id === id ? { ...voucher, isUsed: true } : voucher
            )
        );
    };

    const handleViewDetails = (voucher: any) => {
        alert(
            `Chi tiết voucher:\nMã: ${voucher.code}\nGiá trị: ${voucher.value}\nHạn sử dụng: ${voucher.expiry}`
        );
    };
    const fetchAllVouchers = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const res = await axios.get(
                `/vouchers?page=${page}&limit=${limit}`
            );
            setVouchers(res.data.data);
            setLimitData(res.data.pagination.limit);
            setTotalPage(res.data.pagination.totalPages);
        } catch (err) {
            console.error("Lỗi khi tải danh sách:", err);
            toast.error("Lỗi khi tải danh sách");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllVouchers(page, limitData);
    }, [page, limitData]);

    return (
        <div className="max-w-6xl mx-auto">
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-xl text-center uppercase font-medium text-gray-800 mb-6">
                    Khuyến mãi cửa hàng
                </h1>

                <div className="grid gap-2 md:grid-cols-2">
                    {vouchers.map((voucher) => {
                        const start = formatDate(
                            voucher.start_date,
                            "dd-MM-yyyy",
                            "yyyy-MM-dd"
                        );
                        const end = formatDate(
                            voucher.end_date,
                            "dd-MM-yyyy",
                            "yyyy-MM-dd"
                        );
                        const statusCode = getVoucherStatus(
                            start,
                            end,
                            voucher.quantity,
                            voucher.used_count
                        );

                        return (
                            <div
                                key={voucher.id}
                                className={`bg-white rounded-lg shadow-sm border border-gray-400`}
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
                                            {voucher.description}
                                        </h3>

                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div className="flex items-center">
                                                <span className="text-gray-500 mr-2">
                                                    Mã voucher:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {voucher.code}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <span className="text-gray-500 mr-2">
                                                    Giá trị:
                                                </span>
                                                <span className="font-medium text-red-600">
                                                    {voucher.discount_type
                                                        .code === 1
                                                        ? `${voucher.discount_value}%`
                                                        : `${Number(
                                                              voucher.discount_value
                                                          ).toLocaleString(
                                                              "vi-VN"
                                                          )}₫`}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-gray-500 mr-2">
                                                    Ngày bắt đầu:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {voucher.start_date}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-gray-500 mr-2">
                                                    Ngày hết hạn:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {voucher.end_date}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-gray-500 mr-2">
                                                    Trạng thái:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {getStatusText(statusCode)}
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
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
