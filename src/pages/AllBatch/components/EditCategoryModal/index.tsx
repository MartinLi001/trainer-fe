import { Form, Modal, Input, InputNumber } from 'antd';
import { useEffect, useMemo } from 'react';

interface FormProps {
  data: API.CategoryType;
  open: boolean;
  loading?: boolean;
  onCreate: (values: API.CategoryType) => void;
  onCancel: () => void;
}

const CategoryModal: React.FC<FormProps> = ({ data, open, loading, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (Object.keys(data).length) {
      form.setFieldsValue(data);
      return;
    }
    form.resetFields();
  }, [data]);

  const title = useMemo(
    () => (data.batchCategoryId ? 'Edit Batch Category' : 'Create Batch Category'),
    [data],
  );

  return (
    <Modal
      open={open}
      width={600}
      title={title}
      okText="Save"
      destroyOnClose
      cancelText="Cancel"
      onCancel={() => {
        onCancel();
      }}
      afterClose={() => {
        form.resetFields();
      }}
      confirmLoading={loading}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form form={form} layout="vertical" size="large">
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: 'Please input the Name of Category' }]}
        >
          <Input placeholder="Batch Category Name" />
        </Form.Item>
        <Form.Item
          name="coolDownPeriod"
          label="Batch Cooldown Period"
          rules={[{ required: true, message: 'Please input the Cool down Period' }]}
        >
          <InputNumber min={1} addonAfter="days" placeholder="Batch Cool Down Period" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
