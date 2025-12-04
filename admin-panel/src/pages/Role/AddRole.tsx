import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect } from "react";
import { Input, Form } from "antd";
import UseForm, { FieldConfig } from "@/components/common/UseForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHook";
import { addRole } from "@/redux/slices/roleSlice";
import { Role } from "@/types/Role";

export default function AddRole() {
  const dispatch = useAppDispatch();
  const { message, error } = useAppSelector((state) => state.role);
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Quyền", path: "/roles" },
    { label: "Thêm mới" },
  ];
  const navigate = useNavigate();
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

  const handleCreateRole = (values: Role) => {
    const payload = {
      ...values,
      description: values.description == undefined ? "" : values.description,
    };
    dispatch(addRole(payload));
  };

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
        <UseForm form={form} onSubmit={handleCreateRole} fields={fields} />
      </div>
    </>
  );
}
