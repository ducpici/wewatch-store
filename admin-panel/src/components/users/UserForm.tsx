import { Form, Card, Button, Input, DatePicker, Radio, Switch } from "antd";
import type { FormInstance } from "antd";
import type { User } from "@/types/User";

interface UserFormProps {
  form: FormInstance<User>;
  onSubmit: (values: User) => void;
  loading?: boolean;
  initialValues?: Partial<User>;
}

export default function UserForm({
  form,
  onSubmit,
  loading,
  initialValues,
}: UserFormProps) {
  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onFinish={onSubmit}
      initialValues={initialValues}
      disabled={loading}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card title="Thông tin cá nhân" className="space-y-2">
          <Form.Item label="Id:" name="id" hidden>
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Họ tên:"
            name="name"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input type="text" autoFocus />
          </Form.Item>
          <Form.Item
            label="Ngày sinh:"
            name="dob"
            rules={[
              { required: true, message: "Please select date of birth!" },
            ]}
          >
            <DatePicker placeholder="Chọn ngày sinh" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            label="Giới tính:"
            layout="horizontal"
            name="gender"
            initialValue={1}
          >
            <Radio.Group>
              <Radio value={1}> Nam </Radio>
              <Radio value={0}> Nữ </Radio>
            </Radio.Group>
          </Form.Item>
        </Card>
        <Card title="Thông tin liên hệ">
          <Form.Item
            label="Email:"
            name="email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại:"
            name="phone_number"
            rules={[
              { required: true, message: "Please input phone number!" },
              {
                pattern: /^[0-9]{9,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ:"
            name="address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input type="text" />
          </Form.Item>
        </Card>
        <Card title="Tài khoản">
          <Form.Item
            label="Tên đăng nhập:"
            name="username"
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu:"
            name="password"
            rules={[
              { required: true, message: "Please input password!" },
              { min: 6, message: "Mật khẩu phải từ đủ 6 ký tự" },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            label="Tình trạng:"
            layout="horizontal"
            className="flex items-center"
            name="state"
            initialValue={true}
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Chặn" />
          </Form.Item>
        </Card>
      </div>
      <Form.Item label={null}>
        <div className="flex justify-center mt-6">
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
