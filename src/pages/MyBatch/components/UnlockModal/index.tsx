import { Form, Modal, DatePicker } from 'antd';

import SeeButton from '@/components/SeeButton';
import moment from 'moment';

export interface CreateModal {
  loading: boolean;
  visible: boolean;
  onClose: () => void;
  onOk: (values: API.TaskType) => void;
}

const format = 'hh:mm:ss A YYYY/MM/DD';

const UnlockModal = ({ visible, loading, onClose, onOk }: CreateModal) => {
  const [form] = Form.useForm();
  // @ts-ignore
  const disabledStartDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < moment().startOf('day');
  };

  return (
    <>
      <Modal
        title="Unlock Task"
        open={visible}
        width={466}
        onCancel={() => {
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
                  const tempValue = {
                    ...values,
                    startDateTime: moment(values.startDateTime).format(),
                  };

                  onOk(tempValue);
                })
                .catch((info) => {
                  console.log('Validate Failed:', info);
                })
            }
          >
            Unlock
          </SeeButton>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="startDateTime"
            label="Task Start Time"
            rules={[{ required: true, message: 'Please select the Start Date' }]}
          >
            {/*  @ts-ignore */}
            <DatePicker
              showTime
              style={{ width: 254 }}
              format={format}
              disabledDate={disabledStartDate}
              placeholder="Choose start time"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UnlockModal;
