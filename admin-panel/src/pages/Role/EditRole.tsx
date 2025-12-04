import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { Input, Form } from "antd";
import { Role } from "@/types/Role";
import UseForm, { FieldConfig } from "@/components/common/UseForm";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHook";
import { getRoleById, updateRole } from "@/redux/slices/roleSlice";

export default function EditRole() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { editRole, message, error } = useAppSelector((state) => state.role);
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Quyền", path: "/roles" },
    { label: "Chỉnh sửa" },
  ];
  const [form] = Form.useForm();
  const fields: FieldConfig[] = [
    {
      group: "Thông tin quyền",
      label: "Tên quyền:",
      name: "name",
      component: <Input autoFocus />,
      rules: [{ required: true, message: "Vui lòng nhập tên quyền" }],
    },
    {
      group: "Thông tin quyền",
      label: "URL:",
      name: "url",
      component: <Input />,
      rules: [{ required: true, message: "Vui lòng nhập url" }],
    },
    {
      group: "Thông tin quyền",
      label: "Mô tả:",
      name: "description",
      component: <Input />,
    },
  ];

  const handleUpdateRole = async (values: Role) => {
    dispatch(updateRole({ data: values, id: Number(id) }));
  };

  useEffect(() => {
    if (!id) return;
    dispatch(getRoleById(Number(id)));
  }, [id, dispatch]);

  useEffect(() => {
    if (editRole) form.setFieldsValue(editRole);
  }, [editRole, form]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate("/roles");
    }
  }, [message, navigate]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <PageBreadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 md:grid-cols-2">
        <UseForm form={form} onSubmit={handleUpdateRole} fields={fields} />
      </div>
    </>
  );
}
