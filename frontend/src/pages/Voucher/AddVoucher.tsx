import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import DatePicker from "../../components/form/date-picker";

import Button from "../../components/ui/button/Button";

import Select from "../../components/form/Select";
import axios from "../../lib/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import formatDate from "../../lib/formatDate";
import getVoucherStatus from "../../lib/getVoucherStatus";
import { useEffect } from "react";

export default function AddVoucher() {
    const initialVoucher: Voucher = {
        code: "",
        description: "",
        quantity: "",
        used_count: 0,
        discount_type: "1",
        discount_value: "",
        start_date: "",
        end_date: "",
    };

    type Voucher = {
        code: string;
        description: string;
        quantity: string;
        used_count: number;
        discount_type: string;
        discount_value: string;
        start_date: string;
        end_date: string;
    };

    const [voucherData, setVoucherData] = useState<Voucher>(initialVoucher);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Ưu đãi", path: "/vouchers" },
        { label: "Thêm mới" }, // Không có path => là trang hiện tại
    ];

    const discountTypeMap = [
        {
            id: 1,
            name: "Theo phần trăm",
        },
        {
            id: 2,
            name: "Theo số tiền",
        },
    ];

    const navigate = useNavigate();

    const handleCreateVoucher = async () => {
        if (!voucherData.code) {
            toast.error("Các trường không được để trống!");
            return;
        }
        try {
            const startDate = formatDate(
                voucherData.start_date,
                "dd-MM-yyyy",
                "yyyy-MM-dd"
            );

            const endDate = formatDate(
                voucherData.end_date,
                "dd-MM-yyyy",
                "yyyy-MM-dd"
            );

            // So sánh ngày (chuyển về Date để so sánh logic)
            if (new Date(endDate) < new Date(startDate)) {
                toast.error("Ngày kết thúc không được nhỏ hơn ngày bắt đầu");
                return;
            }

            const cleanData = {
                ...voucherData,
                discount_type: parseInt(voucherData.discount_type),
                discount_value: parseInt(voucherData.discount_value),
                quantity: parseInt(voucherData.quantity),
                used_count: Number(voucherData.used_count),
                start_date: startDate,
                end_date: endDate,
            };

            const { code } = voucherData;
            const { data } = await axios.get("/vouchers/check", {
                params: {
                    code,
                },
            });

            if (data.codeExists) {
                toast.error("Mã code đã được sử dụng!");
                return;
            }

            await axios.post(`/vouchers`, cleanData);
            toast.success("Thêm thành công!");
            navigate("/vouchers");
        } catch (error) {
            console.error("Lỗi khi thêm:", error);
            toast.error("Thêm thất bại.");
        }
    };

    const handleSelectDiscountTypeChange = (value: string) => {
        setVoucherData({
            ...voucherData,
            discount_type: value,
        });
    };
    // useEffect(() => {
    //     if (
    //         voucherData.start_date &&
    //         voucherData.end_date &&
    //         voucherData.quantity
    //     ) {
    //         const start = formatDate(
    //             voucherData.start_date,
    //             "dd-MM-yyyy",
    //             "yyyy-MM-dd"
    //         );
    //         const end = formatDate(
    //             voucherData.end_date,
    //             "dd-MM-yyyy",
    //             "yyyy-MM-dd"
    //         );

    //         const status = getVoucherStatus(
    //             start,
    //             end,
    //             parseInt(voucherData.quantity),
    //             voucherData.used_count
    //         );

    //         setVoucherData((prev) => ({
    //             ...prev,
    //             status,
    //         }));
    //     }
    // }, [
    //     voucherData.start_date,
    //     voucherData.end_date,
    //     voucherData.quantity,
    //     voucherData.used_count,
    // ]);

    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ComponentCard title="Thông tin ưu đãi">
                    <div>
                        <Label htmlFor="code">Mã code:</Label>
                        <Input
                            type="text"
                            id="code"
                            onChange={(e) =>
                                setVoucherData({
                                    ...voucherData,
                                    code: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label>Loại ưu đãi:</Label>
                        <Select
                            placeholder="Lựa chọn loại ưu đãi"
                            options={discountTypeMap}
                            onChange={handleSelectDiscountTypeChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="discount_value">Giá trị giảm:</Label>
                        <Input
                            type="number"
                            id="discount_value"
                            onChange={(e) =>
                                setVoucherData({
                                    ...voucherData,
                                    discount_value: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="desc">Mô tả:</Label>
                        <Input
                            type="text"
                            id="desc"
                            onChange={(e) =>
                                setVoucherData({
                                    ...voucherData,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="quantity">Số lượng:</Label>
                        <Input
                            type="number"
                            id="quantity"
                            onChange={(e) =>
                                setVoucherData({
                                    ...voucherData,
                                    quantity: e.target.value,
                                })
                            }
                        />
                    </div>
                </ComponentCard>
                <ComponentCard title="Thông tin ngày áp dụng">
                    <div>
                        <DatePicker
                            id="start_date"
                            label="Ngày bắt đầu:"
                            placeholder="Nhập ngày bắt đầu"
                            onChange={(dates, currentDateString) => {
                                setVoucherData({
                                    ...voucherData,
                                    start_date: currentDateString,
                                });
                            }}
                        />
                    </div>
                    <div>
                        <DatePicker
                            id="end_date"
                            label="Ngày hết hạn:"
                            placeholder="Nhập ngày hết hạn"
                            onChange={(dates, currentDateString) => {
                                setVoucherData({
                                    ...voucherData,
                                    end_date: currentDateString,
                                });
                            }}
                        />
                    </div>
                </ComponentCard>
            </div>
            <div>
                <Button
                    className="mt-6"
                    size="sm"
                    variant="primary"
                    onClick={handleCreateVoucher}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
