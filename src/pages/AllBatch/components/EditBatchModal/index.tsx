import { Form, Modal, Input, Radio, DatePicker, Checkbox, Alert } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import moment, { Moment } from 'moment';
import SeeSelect from '@/components/SeeSelect';
import type { RangePickerProps } from 'antd/es/date-picker';
import { useUpdateEffect } from 'ahooks';
import { WarningOutlined } from '@ant-design/icons';

const { Option } = SeeSelect;
interface FormProps {
  data: API.AllBatchType;
  errorData: any;
  open: boolean;
  loading?: boolean;
  templateData: API.AllBatchType[];
  onCreate: (values: API.AllBatchType) => void;
  onCancel: () => void;
}

const EditorBatchModal: React.FC<FormProps> = ({
  data,
  errorData,
  open,
  templateData = [],
  loading,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [ignoreValue, setIgnoreValue] = useState(false);

  const [showTimeError, setShowTimeError] = useState(false);
  const [errorDataState, setErrorDataState] = useState<any>();

  const isCreate = useMemo(() => !!!data.batchId, [data]);

  const [isTemplateState, setIsTemplate] = useState(false);

  useEffect(() => {
    if (Object.keys(data).length && data.batchId) {
      const temp = {
        ...data,
        startDate: moment(data.startDate, 'YYYY-MM-DD'),
      };
      setIsTemplate(data.isTemplate);
      form.setFieldsValue(temp);
      return;
    }
    form.resetFields();
  }, [data, form]);

  const title = useMemo(() => (data.batchId ? 'Edit Batch' : 'Create Batch'), [data]);

  // @ts-ignore
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < moment().startOf('day');
  };

  useUpdateEffect(() => {
    if (errorData) {
      setErrorDataState(errorData);
      setShowTimeError(true);
      form.validateFields(['startDate']);
    }
  }, [errorData]);

  const errorStatusConfig = useMemo(() => {
    const errorConfig = {
      validateStatus: 'error',
      help: (
        <div>
          <div>
            You have a batch in the same category starting on {errorDataState?.lastStartDate ?? ''}.
          </div>
          <div>
            which is within the cool down period ( {errorDataState?.coolDownPeriod ?? 'X'} days).
          </div>
          <div>Please ignore cool down period or choose a valid start date.</div>
        </div>
      ),
    };
    if (errorDataState && !showTimeError) {
      return {};
    }
    const showError = errorDataState && !ignoreValue;
    setShowTimeError(!!showError);
    form.validateFields(['startDate']);
    if (showError) {
      return errorConfig;
    }
    return {} as any;
  }, [ignoreValue, errorDataState, showTimeError]);

  const onValuesChange = ({
    startDate,
    isTemplate,
  }: {
    startDate: Moment;
    isTemplate: boolean;
  }) => {
    if (startDate && errorDataState) {
      setShowTimeError(false);
    }

    if (isTemplate != undefined) {
      setIsTemplate(isTemplate);
    }
  };

  const hasStart = useMemo(() => {
    const start = moment(data.startDate) < moment();
    return start;
  }, [data]);

  return (
    <div>
      {open && data.batchId && hasStart && (
        <Alert
          message="This batch has started, please be sure about your update"
          type="warning"
          showIcon
          closable
          icon={<WarningOutlined />}
          style={{
            minWidth: 100,
            height: 56,
            position: 'fixed',
            left: '50%',
            top: 20,
            zIndex: 1001,
            transform: 'translateX(-50%)',
          }}
        />
      )}

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
          setIsTemplate(false);
          form.resetFields();
        }}
        confirmLoading={loading}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              const result = {
                ...values,
                ignoreCoolDownPeriod: ignoreValue ?? undefined,
              };
              onCreate(result);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form form={form} layout="vertical" size="large" onValuesChange={onValuesChange}>
          <Form.Item
            name="name"
            label="Batch Name"
            rules={[{ required: true, message: 'Please input the Name of Batch' }]}
          >
            <Input placeholder="Batch Name" style={{ width: 440 }} />
          </Form.Item>

          {isCreate && (
            // <div>
            //   Type
            <Form.Item name="isTemplate" initialValue={false}>
              <Radio.Group style={{ marginLeft: 12 }}>
                <Radio value={false}>Default</Radio>
                <Radio value={true}>Template</Radio>
              </Radio.Group>
            </Form.Item>
            // </div>
          )}

          {!isTemplateState && (
            <Form.Item
              name="startDate"
              label="Batch Start Date"
              rules={[
                { required: true, message: 'Please select the Start Date' },
                () => ({
                  validator(_, value) {
                    if (value < moment().startOf('day') && _) {
                      return Promise.reject(
                        new Error(`Batch start date can't be null or before current date`),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
                () => ({
                  validator() {
                    if (showTimeError) {
                      return Promise.reject(
                        new Error('Invalid start date - within cool down period'),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              {/*  @ts-ignore */}
              <DatePicker
                style={{ width: 254 }}
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                placeholder="Choose start date"
                // onChange={(e) => setStartDate(e)}
              />
            </Form.Item>
          )}

          {isCreate && !isTemplateState && (
            <Form.Item name="batchId" label="Create From Template">
              <SeeSelect
                style={{ width: 440 }}
                defaultActiveFirstOption
                placeholder="Template Choices"
              >
                <Option value="" key="-1">
                  None
                </Option>
                {templateData.length > 0 &&
                  templateData.map((batch: API.AllBatchType) => (
                    <Option value={batch.batchId} key={batch.batchId}>
                      {batch.name}
                    </Option>
                  ))}
              </SeeSelect>
            </Form.Item>
          )}

          {errorDataState && (
            <Form.Item
              initialValue={false}
              name="ignoreCoolDownPeriod"
              label=""
              {...errorStatusConfig}
            >
              <Checkbox checked={ignoreValue} onChange={(e) => setIgnoreValue(e.target.checked)}>
                Ignore cool down period
              </Checkbox>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default EditorBatchModal;
