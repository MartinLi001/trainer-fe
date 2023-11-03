import { useState } from 'react';
import { Form, Input, message } from 'antd';
import CardTitle from '@/components/CardTitle';
import Button from '@/components/SeeButton';
import IconFont from '@/components/IconFont';
import { resetPassWord } from '@/services/auth';
import styles from './index.less';

export default function Password() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const onFinish = (values: API.PasswordReset) => {
    setLoading(true);
    resetPassWord(values)
      .then(() => {
        message.success('Password updated successfully');
        form.resetFields();
      })
      .catch((err: Error) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className={styles.passwordWrap}>
      <CardTitle iconFont={<IconFont type="icon-key-line" />} title="Password Change" />
      <div className={styles.psdForm}>
        <Form
          form={form}
          name="passwordchange"
          initialValues={{
            residence: ['zhejiang', 'hangzhou', 'xihu'],
            prefix: '86',
          }}
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="oldPassword"
            label="Old Password"
            rules={[
              {
                required: true,
                message: 'Old password is required',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              {
                required: true,
                message: 'New password is required',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && getFieldValue('oldPassword') === value) {
                    return Promise.reject(
                      new Error('New password should not be the same as the old one'),
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmNewPassword"
            label="Confirm New Password"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your password',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && getFieldValue('newPassword') !== value) {
                    return Promise.reject(new Error('Password does not match'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <div
              style={{
                width: '100%',
                marginTop: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <Button type="link" href={process.env.FORGET_PSD_URL}>
                I Forget My Password
              </Button>
              <Button htmlType="submit" loading={loading}>
                Update Password
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
