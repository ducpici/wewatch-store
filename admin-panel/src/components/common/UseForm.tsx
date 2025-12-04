import { Form, Card, Button, FormInstance } from "antd";
import React from "react";

export interface FieldConfig {
  group?: string;
  label: string;
  name: string;
  component: React.ReactNode;
  rules?: any[];
  hidden?: boolean;
}

interface UseFormProps<T> {
  form: FormInstance<T>;
  onSubmit: (values: T) => void;
  fields: FieldConfig[];
  loading?: boolean;
  initialValues?: Partial<T>;
}
export default function UseForm<T>({
  form,
  onSubmit,
  fields,
  loading,
  initialValues,
}: UseFormProps<T>) {
  // gom nhóm theo group
  const groups = fields.reduce((acc, field) => {
    const group = field.group || "_default";
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {} as Record<string, FieldConfig[]>);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={initialValues}
      disabled={loading}
      autoComplete="off"
    >
      {Object.entries(groups).map(([groupName, groupFields]) => (
        <Card
          key={groupName}
          title={groupName !== "_default" ? groupName : undefined}
          className="mb-4"
        >
          {groupFields.map((field) =>
            field.name ? (
              <Form.Item
                key={field.name}
                label={field.label}
                name={field.name}
                rules={field.rules}
                hidden={field.hidden}
              >
                {field.component}
              </Form.Item>
            ) : (
              field.component // fallback nếu field chỉ là custom component
            )
          )}
        </Card>
      ))}

      <Form.Item>
        <div className="flex justify-center mt-4">
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
