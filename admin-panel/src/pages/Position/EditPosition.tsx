import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { useParams } from "react-router";
import TextArea from "../../components/form/input/TextArea";
import axios from "../../lib/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function EditPosition() {
    const { id } = useParams();

    type Position = {
        id: BigInt;
        name: string;
        description: string;
    };
    const initPosition: Position = {
        id: BigInt(0),
        name: "",
        description: "",
    };

    const [positionData, setPositionData] = useState<Position>(initPosition);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Chức vụ", path: "/positions" },
        { label: "Cập nhật" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const getDataById = () => {
        if (!id) return;
        axios
            .get(`/positions/${id}`)
            .then((response) => {
                const data = response.data.data[0];
                setPositionData(data);
                // if (data) {
                //     setPositionData(data);
                // } else {
                //     toast.error("Không tìm thấy chức vụ!");
                // }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    const handleUpdatePosition = async () => {
        if (!positionData.name || !positionData.description) {
            toast.error("Các trường không được để trống!");
            return;
        }
        try {
            await axios.put(`/positions/${positionData.id}`, positionData);
            toast.success("Cập nhật thành công!");
            navigate("/positions");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Cập nhật thất bại.");
        }
    };

    useEffect(() => {
        getDataById();
    }, [id]);

    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ComponentCard title="Thông tin chức vụ">
                    <div>
                        <Label htmlFor="name">Tên chức vụ:</Label>
                        <Input
                            type="text"
                            id="name"
                            value={positionData.name}
                            onChange={(e) =>
                                setPositionData({
                                    ...positionData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Mô tả:</Label>
                        <TextArea
                            rows={6}
                            value={positionData.description}
                            onChange={(e) =>
                                setPositionData({
                                    ...positionData,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                </ComponentCard>
            </div>
            <div>
                <Button
                    className="mt-6"
                    size="sm"
                    variant="primary"
                    onClick={handleUpdatePosition}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
