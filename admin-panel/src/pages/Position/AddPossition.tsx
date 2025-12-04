import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Input, Form, Select } from "antd";
import UseForm, { FieldConfig } from "@/components/common/UseForm";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHook";
import { addPosition, clearMessage } from "@/redux/slices/positionSlice";
import { Position } from "@/types/Position";
import type { SelectProps } from "antd";
import { getAllRole } from "@/redux/slices/roleSlice";

const breadcrumbItems = [
  { label: "Trang chủ", path: "/" },
  { label: "Chức vụ", path: "/positions" },
  { label: "Thêm mới" },
];

export default function AddPosition() {
  const dispatch = useAppDispatch();
  const { message, error } = useAppSelector((state) => state.position);
  const { list } = useAppSelector((state) => state.role);
  const [roleOptions, setRoleOptions] = useState<SelectProps["options"]>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const fields: FieldConfig[] = [
    {
      group: "Thông tin chức vụ",
      label: "Tên chức vụ:",
      name: "name",
      component: <Input autoFocus />,
      rules: [{ required: true, message: "Vui lòng nhập tên chức vụ" }],
    },
    {
      group: "Thông tin chức vụ",
      label: "Quyền:",
      name: "roles",
      component: (
        <Select
          placeholder="Please select"
          mode="multiple"
          options={roleOptions}
          allowClear
          showSearch
          optionFilterProp="label"
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        />
      ),
      // rules: [{ required: true, message: "Vui lòng chọn quyền" }],
    },
    {
      group: "Thông tin chức vụ",
      label: "Mô tả:",
      name: "description",
      component: <Input />,
    },
  ];
  const handleCreatePosition = async (values: Position) => {
    const payload = {
      ...values,
      description: values.description == undefined ? "" : values.description,
      roles: values.roles == undefined ? [] : values.roles,
    };
    dispatch(addPosition(payload));
  };

  useEffect(() => {
    dispatch(getAllRole());
  }, [dispatch]);

  useEffect(() => {
    if (list) {
      setRoleOptions(
        list.map((i) => ({
          label: i.name,
          value: i.id,
        }))
      );
    }
  }, [list]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
      navigate("/positions");
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessage());
    }
  }, [message, error, dispatch, navigate]);

  return (
    <>
      <PageBreadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <UseForm form={form} onSubmit={handleCreatePosition} fields={fields} />
      </div>
    </>
  );
}
