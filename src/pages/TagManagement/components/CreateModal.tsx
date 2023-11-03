import CommonModal from '@/components/CommonModal';
import SectionMessage from '@/components/SectionMessage';
import { createClient, createTag, createTopic } from '@/services/question';
import { Form, Input } from 'antd';
import React, { useMemo, useState } from 'react';

interface CreateModalI extends TagManagementI.ModalDataI {
  onCancel: () => void;
}
export default function CreateModal({ open, type, onCancel, afterCreate, list }: CreateModalI) {
  const [okLoading, setOkLoading] = useState(false);
  const listDictionary = useMemo(() => {
    const dic = new Map();
    list?.forEach((item) => {
      dic.set(item.name.toLocaleLowerCase(), true);
    });
    return dic;
  }, [list]);
  const [form] = Form.useForm();
  const api = useMemo(() => {
    switch (type) {
      case 'topic':
        return createTopic;
        break;
      case 'tag':
        return createTag;
      case 'client':
        return createClient;

      default:
        return () => null;
        break;
    }
  }, [type]);
  function onOk() {
    form.validateFields().then(() => {
      setOkLoading(true);
      const name = form.getFieldValue(type);
      return api({ name })
        ?.then((res) => {
          afterCreate?.(res);
          onCancel();
        })
        .catch(() => {
          SectionMessage({
            type: 'error',
            title: 'Couldn’t create the tag',
            description:
              "We're having some trouble creating the tag. Refresh the page and try again.",
            descriptionExtra: (
              <a style={{ fontSize: 14 }} onClick={() => window.location.reload()}>
                Refresh
              </a>
            ),
          });
        })
        ?.finally(() => {
          setOkLoading(false);
        });
    });
  }
  return (
    <CommonModal
      centered
      open={open}
      title={<span style={{ textTransform: 'capitalize' }}>{`Create New ${type}`}</span>}
      onCancel={onCancel}
      okText="Create"
      okButtonProps={{ loading: okLoading }}
      onOk={onOk}
      afterClose={() => form.resetFields()}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={<span style={{ textTransform: 'capitalize' }}>{type} Name</span>}
          name={type}
          initialValue={''}
          rules={[
            { required: true },
            { min: 3, message: 'must be at least 3 characters' },
            { max: 32, message: 'must be at most 32 characters' },
            {
              validator: (_, value) =>
                listDictionary.has(value.toLocaleLowerCase())
                  ? Promise.reject(new Error(`${value} already exists.`))
                  : Promise.resolve(),
            },
          ]}
        >
          <Input
            placeholder={`Please check duplication before creating a new ${type}`}
            style={{ height: 40 }}
          />
        </Form.Item>
      </Form>
    </CommonModal>
  );
}
