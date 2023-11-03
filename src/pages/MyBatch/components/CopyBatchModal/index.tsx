import { Form, Modal } from 'antd';

import SeeSelect from '@/components/SeeSelect';
import SeeButton from '@/components/SeeButton';

import { getBatchesByCategoryId } from '@/services/batch';
import { useEffect, useState } from 'react';

const { Option } = SeeSelect;

export interface CreateModal {
  loading: boolean;
  visible: boolean;
  categoryId: string;
  currentBatchId: string;
  onClose: () => void;
  onOk: (values: { originalBatchId: string }) => void;
}

const CopyBatchModal = ({
  loading,
  visible,
  onClose,
  onOk,
  categoryId,
  currentBatchId,
}: CreateModal) => {
  const [form] = Form.useForm();

  const [batchList, setBatchList] = useState<API.AllBatchType[]>([]);

  const getBatchListFun = () => {
    Promise.all([
      // getBatchesByCategoryId({ categoryId, isTemplate: true }),
      getBatchesByCategoryId({ categoryId, isTemplate: false }),
    ])
      .then((data: API.AllBatchType[][]) => {
        // console.log(data.flat(), '====data');
        setBatchList(data.flat().filter((item) => item.batchId !== currentBatchId));
      })
      .finally(() => {});
  };

  useEffect(() => {
    if (visible && categoryId && currentBatchId) getBatchListFun();
  }, [visible, categoryId, currentBatchId]);

  return (
    <>
      <Modal
        title="Copy from Batch"
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
            Confirm
          </SeeButton>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="originalBatchId"
            label="Select a Batch"
            rules={[{ required: true, message: 'Please Select a Batch' }]}
          >
            <SeeSelect getPopupContainer={(e) => e.parentNode} placeholder="Batch Name">
              {batchList.map((batch) => {
                return <Option value={batch.batchId}>{batch.name}</Option>;
              })}
            </SeeSelect>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CopyBatchModal;
