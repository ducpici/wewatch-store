import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import axios from "@/libs/axiosConfig";
import { toast } from "react-toastify";
import * as z from "zod";
import AddressForm, { addressSchema } from "@/components/address/AddressForm";

const breadcrumbItems = [
  { label: "Trang chủ", path: "/" },
  { label: "Thêm địa chỉ nhận hàng" },
];

const AddAddress = () => {
  const [defaultValues, setDefaultValues] = useState<
    Partial<z.infer<typeof addressSchema>>
  >({});
  const navigate = useNavigate();
  const handleSave = async (values: z.infer<typeof addressSchema>) => {
    try {
      const res = await axios.post(`/address`, values);
      toast.success(res.data.message);
      navigate(-1);
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      toast.error("Thất bại");
    }
  };

  useEffect(() => {
    setDefaultValues({
      full_name: "",
      phone_num: "",
      city: "",
      district: "",
      ward: "",
      detail: "",
      is_default: false,
    });
  }, []);

  return (
    <div className="max-w-md mx-auto h-svh px-2 bg-white">
      <PageBreadcrumb items={breadcrumbItems} />
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <IoIosArrowBack
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-sm md:text-lg font-semibold">Thêm địa chỉ</h1>
        <LuPlus />
      </div>
      <AddressForm
        defaultValues={defaultValues}
        onSubmit={handleSave}
        submitLabel="Lưu"
      />
    </div>
  );
};

export default AddAddress;
