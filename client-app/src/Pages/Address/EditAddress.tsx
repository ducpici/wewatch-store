import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Trash2 } from "lucide-react";
import axios from "../../libs/axiosConfig";
import { toast } from "react-toastify";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddressForm, { addressSchema } from "@/components/address/AddressForm";
import { z } from "zod";

const breadcrumbItems = [
  { label: "Trang chủ", path: "/" },
  { label: "Cập nhật địa chỉ nhận hàng" },
];
const EditAddress = () => {
  const { state } = useLocation();
  const idShip = state?.idShip;
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<
    Partial<z.infer<typeof addressSchema>>
  >({});

  const handleSave = async (values: any) => {
    console.log("values update: ", values);
    try {
      const res = await axios.put(`/address/${values.id_ship}`, values);
      console.log(res.data);
      toast.success(res.data.message);
      navigate(-1);
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
      toast.error("Thất bại");
    }
  };

  const handleDeleteAddr = async (values: any) => {
    try {
      const res = await axios.delete(`/address/${values.id_ship}`);
      toast.success(res.data.message);
      navigate(-1);
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
      toast.error("Thất bại");
    }
  };

  const fetchAddress = async () => {
    try {
      const res = await axios.get(`/address/${idShip}`);
      const data = res.data.data;
      const normalizedData = {
        ...data,
        is_default: Boolean(data.is_default),
      };
      setDefaultValues(normalizedData);
    } catch (error) {
      console.error("Lỗi khi fetch địa chỉ:", error);
    }
  };

  useEffect(() => {
    if (idShip) {
      fetchAddress();
    }
  }, [idShip]);

  return (
    <div className="max-w-md mx-auto h-svh px-2 bg-white">
      <PageBreadcrumb items={breadcrumbItems} />
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <IoIosArrowBack
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-sm md:text-lg font-semibold">Chỉnh sửa địa chỉ</h1>
        <Trash2
          size={16}
          className="cursor-pointer"
          onClick={handleDeleteAddr}
        />
      </div>
      <AddressForm
        defaultValues={defaultValues}
        onSubmit={handleSave}
        submitLabel="Cập nhật"
      />
    </div>
  );
};

export default EditAddress;
