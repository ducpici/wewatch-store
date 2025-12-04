import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/User";
import { Form } from "antd";
import dayjs from "dayjs";
import UserForm from "@/components/users/UserForm";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHook";
import { getUserById, updateUser } from "@/redux/slices/userSlice";
export default function UpdateUser() {
  const dispatch = useAppDispatch();
  const { message, error, loading, editUser } = useAppSelector(
    (state) => state.user
  );
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    dispatch(getUserById(Number(id)));
  }, [id, dispatch]);

  useEffect(() => {
    if (editUser) {
      form.setFieldsValue({
        ...editUser,
        dob: editUser.dob ? dayjs(editUser.dob) : null,
        gender: Number(editUser.gender),
        state: editUser.state === true,
      });
    }
  }, [editUser, form]);
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

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Khách hàng", path: "/users" },
    { label: "Cập nhật thông tin" },
  ];

  const handleUpdateUser = async (values: User) => {
    const payload = {
      ...values,
      dob:
        typeof values.dob === "string"
          ? values.dob
          : values.dob.format("YYYY-MM-DD"),
    };
    dispatch(updateUser(payload));
  };

  return (
    <>
      <PageBreadcrumb items={breadcrumbItems} />
      <UserForm form={form} onSubmit={handleUpdateUser} loading={loading} />
    </>
  );
}
