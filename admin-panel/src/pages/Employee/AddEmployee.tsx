import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Form } from "antd";
import { Employee } from "@/types/Employee";
import EmployeeForm from "@/components/employees/EmloyeeForm";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHook";
import { addEmployee } from "@/redux/slices/employeeSlice";

export default function AddEmployee() {
  const dispatch = useAppDispatch();
  const { loading, message, error } = useAppSelector((state) => state.employee);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Nhân viên", path: "/employees" },
    { label: "Thêm mới" },
  ];

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate("/employees");
    }
  }, [message, navigate]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCreateEmployee = async (values: Employee) => {
    const payload = {
      ...values,
      dob:
        typeof values.dob === "string"
          ? values.dob
          : values.dob.format("YYYY-MM-DD"),
    };
    dispatch(addEmployee(payload));
  };

  return (
    <>
      <PageBreadcrumb items={breadcrumbItems} />
      <EmployeeForm
        form={form}
        loading={loading}
        onSubmit={handleCreateEmployee}
        initialValues={{ gender: 1, state: true }}
      />
    </>
  );
}
