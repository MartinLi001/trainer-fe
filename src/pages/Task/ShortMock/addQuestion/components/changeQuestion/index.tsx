import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import style from './index.less';
import { Form, Input, InputNumber } from 'antd';
import Quill from '@/components/Quill';
import { DetailValueType } from '@/pages/AddQuestion/typeList';
import _ from 'lodash';

interface changeType {
  value: DetailValueType;
  type: string;
}

function ChangeQuestionDetail({ value, type }: changeType, ref: any) {
  const [form] = Form.useForm();
  const QuillRef = useRef<any>();
  const QuillRefanswer = useRef<any>();

  useEffect(() => {
    console.log('%cindex.tsx line:20 value', 'color: #007acc;', value);
    const temp = { name: value.name, weight: value.weight };
    form.setFieldsValue(temp);
    if (value?.sampleAnswer && value?.sampleAnswer.renderedContent) {
      QuillRefanswer.current.setContent(value?.sampleAnswer.renderedContent || '');
    }
    if (value?.description && value?.description.renderedContent) {
      QuillRef.current.setContent(value?.description.renderedContent || '');
    }
  }, [value]);

  useImperativeHandle(
    ref,
    () => ({
      doSomeSave() {
        const values = form.getFieldsValue();
        const temp = _.cloneDeep(value);
        // const temp = { ...value };
        temp.name = values.name;
        temp.description.renderedContent = values.description || '';
        temp.sampleAnswer.renderedContent = values.sampleAnswer || '';
        temp.weight = values.weight || 1;
        return temp;
      },
    }),
    [],
  );

  return (
    <>
      <div className={style.ChangeQuestionDetail}>
        <Form
          name="basic"
          form={form}
          initialValues={{ remember: true }}
          layout="vertical"
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Question Title"
            name="name"
            rules={[{ required: true, message: 'Please input your Question Title!' }]}
          >
            <Input placeholder="Question Title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            // rules={[{ required: true, message: 'Please input your Description!' }]}
          >
            <Quill
              ref={QuillRef}
              style={{
                backgroundColor: '#fff',
                height: type == 'link' ? '200' : '260',
              }}
              id={value?.questionId || '1'}
            />
          </Form.Item>

          <Form.Item
            label="sampleAnswer"
            name="sampleAnswer"
            // rules={[{ required: true, message: 'Please input your sampleAnswer!' }]}
          >
            <Quill
              ref={QuillRefanswer}
              style={{
                backgroundColor: '#fff',
                height: type == 'link' ? '200' : '260',
              }}
              id={value?.questionId || '1'}
            />
          </Form.Item>
          {type != 'link' && (
            <Form.Item
              label="Weight"
              name="weight"
              // rules={[{ required: true, message: 'Please input your Description!' }]}
            >
              <InputNumber max={2} min={0} />
            </Form.Item>
          )}
        </Form>
      </div>
    </>
  );
}

export default forwardRef(ChangeQuestionDetail);
