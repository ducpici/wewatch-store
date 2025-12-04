import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Form } from "antd";
import { User } from "@/types/User";
import UserForm from "@/components/users/UserForm";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHook";
import { addUser } from "@/redux/slices/userSlice";

export default function AddUser() {
  const dispatch = useAppDispatch();
  const { loading, message, error } = useAppSelector((state) => state.user);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Khách hàng", path: "/users" },
    { label: "Thêm mới" },
  ];

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate("/users");
    }
  }, [message, navigate]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCreateUser = async (values: User) => {
    const payload = {
      ...values,
      dob:
        typeof values.dob === "string"
          ? values.dob
          : values.dob.format("YYYY-MM-DD"),
    };
    dispatch(addUser(payload));
  };

  return (
    <>
      <PageBreadcrumb items={breadcrumbItems} />
      <UserForm
        form={form}
        loading={loading}
        onSubmit={handleCreateUser}
        initialValues={{ gender: 1, state: true }}
      />
    </>
  );
}
