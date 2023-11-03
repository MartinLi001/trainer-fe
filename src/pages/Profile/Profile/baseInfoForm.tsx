import { useEffect } from 'react';
import { Form, Input, Modal, Row, Col, DatePicker, Select } from 'antd';
import { PhoneInput } from '@/components/PhoneInput';
import styles from './index.less';

import { RegisterUserInfo } from '@/services/user/interface';
import moment from 'moment';

const { Option } = Select;
interface CollectionCreateFormProps {
  data: RegisterUserInfo;
  visible: boolean;
  loading?: boolean;
  onSave: (values: RegisterUserInfo, callback: () => void) => void;
  onCancel: () => void;
}

const BaseInfoForm = ({ visible, data, loading, onSave, onCancel }: CollectionCreateFormProps) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (visible && data) {
      const tempData = {
        ...data,
        dateOfBirth: moment(data.dateOfBirth),
      };
      form.setFieldsValue(tempData);
    } else {
      form.resetFields();
    }
  }, [visible]);

  const submit = () => {
    form
      .validateFields()
      .then(async (values: any) => {
        onSave(
          {
            ...values,
            dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
          },
          () => form.resetFields(),
        );
      })
      .catch((info: Error) => {
        console.log('Validate Failed:', info);
      });
  };

  const smallLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 12 },
  };

  return (
    <Modal
      forceRender
      className={styles.modal}
      width={600}
      open={visible}
      title={'Edit Info'}
      okText="Save"
      confirmLoading={loading}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => submit()}
    >
      <Form form={form}>
        <Row>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              {...smallLayout}
              rules={[{ required: true, message: 'First Name is required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="middleName" label="Middle Name" {...smallLayout}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              {...smallLayout}
              rules={[{ required: true, message: 'Last Name is required' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="preferredName" label="Preferred Name" {...smallLayout}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              {...smallLayout}
              rules={[{ required: true, message: 'Gender is required' }]}
            >
              <Select>
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dateOfBirth" label="Date Of Birth" {...smallLayout}>
              {/* @ts-ignore */}
              <DatePicker
                style={{ width: '100%' }}
                format={(value) => value.format('YYYY-MM-DD')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              name="email"
              label="Email"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 18 }}
              rules={[{ required: true, type: 'email', message: 'Email is required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              name="phone"
              label="Phone"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 18 }}
              rules={[
                { required: true, message: 'Phone is required' },
                {
                  validator: (_, value) =>
                    /^\d{3}-\d{3}-\d{4}$/g.test(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error('The format should be: 123-123-1234')),
                },
              ]}
            >
              {/* <Input addonBefore="(+1)" style={{ width: '100%' }} /> */}
              <PhoneInput />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BaseInfoForm;
