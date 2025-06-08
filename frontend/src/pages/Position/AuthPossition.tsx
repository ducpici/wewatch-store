import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { useParams } from "react-router";
import MultiSelect from "../../components/form/MultiSelect";
import axios from "../../lib/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function AuthorPosition() {
    const { id } = useParams();

    type Role = {
        id: BigInt;
        name: string;
        url: string;
        description: string;
    };

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
    const [roleData, setRoleData] = useState([]);
    // const [positionRole, setPositionRole] = useState([]);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Chức vụ", path: "/positions" },
        { label: "Phân quyền" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const getDataById = () => {
        if (!id) return;
        axios
            .get(`/positions/${id}`)
            .then((response) => {
                const data = response.data.data[0];
                setPositionData(data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    const getRoles = () => {
        axios
            .get(`/roles`)
            .then((response) => {
                const data = response.data.data;
                if (data) {
                    const roles = data.map((r: any) => ({
                        id: r.id.toString(),
                        name: r.name,
                    }));
                    setRoleData(roles);
                } else {
                    toast.error("Không tìm thấy");
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    const getPositionRolesById = () => {
        axios
            .get(`/position_role/${id}`)
            .then((response) => {
                const data = response.data.data;
                if (data) {
                    const roleIds = data.map((item: any) =>
                        item.role_id.toString()
                    );
                    setSelectedValues(roleIds);
                } else {
                    toast.error("Không tìm thấy");
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    const handleUpdate = async () => {
        if (!id) {
            toast.error("Chức vụ không xác định");
            return;
        }

        try {
            // Giả sử backend yêu cầu gửi mảng role_id trong body dưới key "role_ids"
            await axios.put(`/position_role/${id}`, {
                role_ids: selectedValues,
            });

            toast.success("Cập nhật quyền thành công");
            navigate("/positions");
        } catch (error) {
            console.error(error);
            toast.error("Cập nhật quyền thất bại");
        }
    };

    useEffect(() => {
        getPositionRolesById();
        getDataById();
        getRoles();
    }, [id]);

    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
                <ComponentCard title="Thông tin chức vụ">
                    <div>
                        <Label htmlFor="name">Tên chức vụ:</Label>
                        <Input
                            disabled
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
                        <MultiSelect
                            label="Quyền:"
                            options={roleData}
                            defaultSelected={selectedValues}
                            onChange={(values) => setSelectedValues(values)}
                        />
                    </div>
                </ComponentCard>
            </div>

            <div>
                <Button
                    className="mt-6"
                    size="sm"
                    variant="primary"
                    onClick={handleUpdate}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
