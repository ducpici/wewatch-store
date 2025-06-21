import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import axios from "../../lib/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import formatDate from "../../lib/formatDate";
import getVoucherStatus from "../../lib/getVoucherStatus";

export default function EditVoucher() {
    const { id } = useParams();

    const initialVoucher: Voucher = {
        id: BigInt(0),
        code: "",
        description: "",
        quantity: "",
        used_count: 0,
        discount_type: "",
        discount_value: "",
        start_date: "",
        end_date: "",
    };

    type Voucher = {
        id: bigint;
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

    const getDataById = () => {
        if (!id) return;
        axios
            .get(`/vouchers/${id}`)
            .then((response) => {
                const data = response.data.data[0];
                if (data) {
                    setVoucherData(data);
                } else {
                    toast.error("Không tìm thấy!");
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

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

            const { code, id } = voucherData;
            const { data } = await axios.get("/vouchers/check", {
                params: {
                    code,
                    id,
                },
            });

            if (data.codeExists) {
                toast.error("Mã code đã được sử dụng!");
                return;
            }
            await axios.put(`/vouchers/${id}`, cleanData);
            toast.success("Cập nhật thành công!");
            navigate("/vouchers");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Thêm thất bại.");
        }
    };

    const handleSelectDiscountTypeChange = (value: string) => {
        setVoucherData({
            ...voucherData,
            discount_type: value,
        });
    };

    useEffect(() => {
        getDataById();
    }, [id]);
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
                            value={voucherData.code}
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
                            value={voucherData.discount_type}
                            onChange={handleSelectDiscountTypeChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="discount_value">Giá trị giảm:</Label>
                        <Input
                            type="text"
                            id="discount_value"
                            value={voucherData.discount_value}
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
                            value={voucherData.description}
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
                            type="text"
                            id="quantity"
                            value={voucherData.quantity}
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
                            defaultDate={voucherData.start_date}
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
                            defaultDate={voucherData.end_date}
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
