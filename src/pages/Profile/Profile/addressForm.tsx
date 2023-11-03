import { useEffect } from 'react';
import { Form, Input, Modal, Radio } from 'antd';
import { RegisterAddresses } from '@/services/user/interface';
import SeeButton from '@/components/SeeButton';

interface CollectionCreateFormProps {
  data: RegisterAddresses;
  visible: boolean;
  isEdit?: boolean;
  onlyOne: boolean;
  onUpdate: (values: RegisterAddresses) => void;
  onCancel: () => void;
  onDelete: (values: RegisterAddresses) => void;
  onCreate: (values: RegisterAddresses) => void;
  loading?: boolean;
}

const AddressForm = ({
  visible,
  data,
  isEdit,
  onlyOne,
  loading,
  onCreate,
  onUpdate,
  onCancel,
  onDelete,
}: CollectionCreateFormProps) => {
  const [form] = Form.useForm();

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  const smallLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 8 },
  };

  useEffect(() => {
    if (visible && data) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [visible]);

  const submit = (isCreate: boolean | undefined) => {
    form
      .validateFields()
      .then(async (values: any) => {
        if (isCreate) {
          onCreate(values);
          return;
        }
        onUpdate(values);
      })
      .catch((info: Error) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      forceRender
      width={600}
      open={visible}
      title={isEdit ? 'Edit Address' : 'Create Address'}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={[
        isEdit ? (
          <SeeButton key="back" loading={loading} onClick={() => submit(false)}>
            Save
          </SeeButton>
        ) : (
          <SeeButton
            key="back"
            onClick={() => {
              form.resetFields();
              onCancel();
            }}
          >
            Cancel
          </SeeButton>
        ),
        isEdit ? (
          onlyOne ? (
            ''
          ) : (
            <SeeButton
              key="submit"
              type="primary"
              loading={loading}
              onClick={() => {
                onDelete(form.getFieldsValue());
              }}
            >
              Delete
            </SeeButton>
          )
        ) : (
          <SeeButton key="submit" type="primary" loading={loading} onClick={() => submit(true)}>
            Create
          </SeeButton>
        ),
      ]}
    >
      <Form form={form} {...layout} name="abc">
        <Form.Item
          name="addressLine1"
          label="Address Line 1"
          rules={[{ required: true, message: 'Address Line 1 is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="addressLine2" label="Address Line 2">
          <Input />
        </Form.Item>

        <Form.Item
          name="state"
          label="State"
          {...smallLayout}
          rules={[{ required: true, message: 'State is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="city"
          label="City"
          {...smallLayout}
          rules={[{ required: true, message: 'City is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="zipcode"
          label="Zipcode"
          {...smallLayout}
          rules={[{ required: true, message: 'Zipcode is required' }]}
        >
          <Input />
        </Form.Item>

        {isEdit && (
          <Form.Item hidden name="addressId" label="AddressId" initialValue="" {...smallLayout}>
            <Input />
          </Form.Item>
        )}

        <Form.Item hidden name="apt" label="apt" initialValue="" {...smallLayout}>
          <Input />
        </Form.Item>

        <Form.Item hidden name="isPrimaryAddress" label="isPrimaryAddress" {...smallLayout}>
          <Radio.Group>
            <Radio value={true}>true</Radio>
            <Radio value={false}>false</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddressForm;
