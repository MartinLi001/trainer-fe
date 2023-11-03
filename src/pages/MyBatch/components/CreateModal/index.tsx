import { Form, Input, InputNumber, Modal, Radio } from 'antd';

import SeeSelect from '@/components/SeeSelect';
import SeeButton from '@/components/SeeButton';

import { upperFirst } from 'lodash';

const { Option } = SeeSelect;
const { TextArea } = Input;

export interface CreateModal {
  loading: boolean;
  visible: boolean;
  onClose: () => void;
  onOk: (values: API.TaskType) => void;
}

const DeleteModal = ({ visible, loading, onClose, onOk }: CreateModal) => {
  const [form] = Form.useForm();

  return (
    <>
      <Modal
        title="Create Task"
        open={visible}
        width={600}
        onCancel={() => {
          form.resetFields();
          onClose();
        }}
        destroyOnClose
        afterClose={() => form.resetFields()}
        footer={[
          <SeeButton type="ghost" key="cancel" onClick={() => onClose()}>
            Cancel
          </SeeButton>,
          <SeeButton
            type="primary"
            key="save"
            loading={loading}
            onClick={() =>
              form
                .validateFields()
                .then((values) => {
                  onOk(values);
                })
                .catch((info) => {
                  console.log('Validate Failed:', info);
                })
            }
          >
            Save
          </SeeButton>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: '',
            name: '',
            description: '',
            day: 1,
            duration: 24,
            isOneOnOne: false,
          }}
        >
          <Form.Item
            name="type"
            label="Task type"
            rules={[{ required: true, message: 'Please Select The Task Type' }]}
          >
            <SeeSelect getPopupContainer={(e) => e.parentNode}>
              <Option value="lecture">Lecture</Option>
              <Option value="assignment">Assignment</Option>
              <Option value="project">Project</Option>
              <Option value="coding mock">Coding Mock</Option>
              <Option value="short answer mock">Short Answer Mock</Option>
            </SeeSelect>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={() => true}>
            {({ getFieldValue }) =>
              ['short answer mock'].includes(getFieldValue('type')) ? (
                <Form.Item name="isOneOnOne">
                  <Radio.Group>
                    <Radio value={false}>Group Mock</Radio>
                    <Radio value={true}>Individual Mock</Radio>
                  </Radio.Group>
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            name="name"
            label="Task Name"
            rules={[{ required: true, message: 'Please input the Task Name' }]}
          >
            <Input placeholder="Task Name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Task Description"
            rules={[
              {
                required: true,
                message: '',
              },
              () => ({
                validator(_, value) {
                  if (!value.replace(' ', '')) {
                    return Promise.reject(new Error('Please input the Task Description'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <TextArea rows={4} placeholder="Task Description" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Day"
            rules={[{ required: true, message: 'Please input The Day' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) =>
              ['project', 'assignment'].includes(getFieldValue('type')) ? (
                <>
                  <Form.Item
                    name="duration"
                    label={`${upperFirst(getFieldValue('type'))} Duration (hr)`}
                  >
                    <InputNumber min={1} />
                  </Form.Item>
                  <Form.Item hidden name="instruction" label="instruction" initialValue="">
                    <Input placeholder="instruction" />
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>
          <Form.Item noStyle>
            <Form.Item hidden shouldUpdate={() => true}>
              {({ getFieldValue }) =>
                ['lecture'].includes(getFieldValue('type')) ? (
                  <Form.Item hidden name="goal" label="goal" initialValue="">
                    <Input placeholder="goal" />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DeleteModal;
