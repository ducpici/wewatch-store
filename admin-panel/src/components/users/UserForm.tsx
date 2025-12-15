import { Form, Card, Button, Input, DatePicker, Radio, Switch } from 'antd';
import type { FormInstance } from 'antd';
import type { User } from '@/types/User';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

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
  const { t, i18n } = useTranslation(['user', 'common', 'validation']);
  useEffect(() => {
    form.validateFields().catch(() => {});
  }, [i18n.language]);
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
        <Card title={t('user:title.personal')} className="space-y-2">
          <Form.Item label="Id:" name="id" hidden>
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label={t('user:field.name')}
            name="name"
            rules={[
              {
                required: true,
                message: t('validation:dataEntry', {
                  field: t('user:field.name').toLowerCase(),
                }),
              },
            ]}
          >
            <Input type="text" autoFocus />
          </Form.Item>
          <Form.Item
            label={t('user:field.dob')}
            name="dob"
            rules={[
              {
                required: true,
                message: t('validation:dataChoose', {
                  field: t('user:field.dob').toLowerCase(),
                }),
              },
            ]}
          >
            <DatePicker placeholder={t('user:field.dob')} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            label={t('user:field.gender')}
            layout="horizontal"
            name="gender"
            initialValue={1}
          >
            <Radio.Group>
              <Radio value={1}> {t('user:gender.male')} </Radio>
              <Radio value={0}> {t('user:gender.female')} </Radio>
            </Radio.Group>
          </Form.Item>
        </Card>
        <Card title={t('user:title.contact')}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: t('validation:dataEntry', {
                  field: 'email',
                }),
              },
              { type: 'email', message: t('validation:email') },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label={t('user:field.phone')}
            name="phone_number"
            rules={[
              {
                required: true,
                message: t('validation:dataEntry', {
                  field: t('user:field.phone').toLowerCase(),
                }),
              },
              {
                pattern: /^[0-9]{9,11}$/,
                message: t('validation:phone'),
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label={t('user:field.address')}
            name="address"
            rules={[
              {
                required: true,
                message: t('validation:dataEntry', {
                  field: t('user:field.address').toLowerCase(),
                }),
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
        </Card>
        <Card title={t('user:title.account')}>
          <Form.Item
            label={t('user:field.username')}
            name="username"
            rules={[
              {
                required: true,
                message: t('validation:dataEntry', {
                  field: t('user:field.username').toLowerCase(),
                }),
              },
              {
                pattern: /^[a-z0-9]+$/,
                message: t('validation:username'),
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label={t('user:field.password')}
            name="password"
            rules={[
              {
                required: true,
                message: t('validation:dataEntry', {
                  field: t('user:field.password').toLowerCase(),
                }),
              },
              { min: 6, message: 'Mật khẩu phải từ đủ 6 ký tự' },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            label={t('common:status')}
            layout="horizontal"
            className="flex items-center"
            name="state"
            initialValue={true}
          >
            <Switch
              checkedChildren={t('common:active')}
              unCheckedChildren={t('common:inactive')}
            />
          </Form.Item>
        </Card>
      </div>
      <Form.Item label={null}>
        <div className="flex justify-center mt-6">
          <Button type="primary" htmlType="submit" loading={loading}>
            {t('common:save')}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
