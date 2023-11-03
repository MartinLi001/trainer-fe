import type { FormInstance } from 'antd';
import { Form, Input } from 'antd';
import React, { useCallback, useMemo } from 'react';
import type { TestCaseInputType, TestCaseListType } from '../typeList';
import styles from './TestCaseForm.less';

interface TestCaseFormParams {
  data: Partial<TestCaseListType>;
  form: FormInstance<any>;
}
export default function TestCaseForm(params: TestCaseFormParams) {
  const { data, form } = params;
  const inputAddonBefore = (input: TestCaseInputType) => {
    return input.parseType == 1 || input.parseType == 2;
  };
  return (
    <Form
      size="large"
      form={form}
      layout="vertical"
      name="form"
      initialValues={{ inputs: [], expect: '' }}
      requiredMark={false}
      className={styles.wrapper}
    >
      <div className={styles.inputTitle}>Input</div>
      {data?.inputs?.length
        ? data?.inputs?.map((input, i) => (
            <>
              <Form.Item
                key={input.inputName}
                name={['inputs', i, 'content']}
                noStyle={!input.inputName}
                rules={[
                  { required: true, message: 'not empty' },
                  {
                    type: 'string',
                    max: 40,
                    message: 'The value cannot exceed 40 characters',
                  },
                ]}
              >
                <Input prefix={inputAddonBefore(input) ? input.inputName : ''} />
              </Form.Item>
              <Form.Item key={input.id + `${i}-parseType`} name={['inputs', i, 'parseType']} hidden>
                <Input />
              </Form.Item>
              <Form.Item key={input.id + `${i}-inputName`} name={['inputs', i, 'inputName']} hidden>
                <Input />
              </Form.Item>
              <Form.Item key={input.id + `${i}-id`} name={['inputs', i, 'id']} hidden>
                <Input />
              </Form.Item>
            </>
          ))
        : ''}
      <div className={styles.outPutTitle}>Output</div>
      <Form.Item
        name="expect"
        rules={[
          { required: true, message: 'not empty' },
          {
            type: 'string',
            max: 40,
            message: 'The value cannot exceed 40 characters',
          },
        ]}
      >
        <Input prefix="expect" />
      </Form.Item>
    </Form>
  );
}
