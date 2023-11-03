import CommonModal from '@/components/CommonModal';
import { addQuestionTestCase, updateQuestionTestCase } from '@/services/coding';
import React, { useEffect, useMemo, useState } from 'react';
import { Form } from 'antd';
import type { TestCaseInputType, TestCaseListType } from '../typeList';
import TestCaseForm from './TestCaseForm';
import { useRequest } from 'ahooks';

interface TestCaseModalI {
  open: boolean;
  onCancel: () => void;
  questionId: string;
  parser: any;
  testCase?: Partial<TestCaseListType>;
  afterOk: () => void;
}
export default function EditTestCaseModal(props: TestCaseModalI) {
  const { open, onCancel, testCase, questionId, afterOk, parser } = props;
  const [form] = Form.useForm();
  const [okLoading, setOkLoading] = useState(false);

  const type = useMemo(() => {
    if (testCase?.inputs?.length) {
      return 'Edit';
    } else {
      return 'Create';
    }
  }, [testCase?.inputs?.length]);

  const data = useMemo(() => {
    if (testCase?.inputs?.length) return testCase;
    else return { expect: '', inputs: parser as unknown as TestCaseInputType[] };
  }, [parser, testCase]);

  useEffect(() => {
    if (open && data?.inputs?.length) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [open, data, form]);

  function onOk() {
    setOkLoading(true);
    form
      .validateFields()
      .then(async (values) => {
        switch (type) {
          case 'Create':
            await addQuestionTestCase({ ...values, questionId });
            break;
          case 'Edit':
            await updateQuestionTestCase({ ...data, ...values });
          default:
            break;
        }
        afterOk();
        onCancel();
      })
      ?.finally(() => {
        setOkLoading(false);
      });
  }

  return (
    <CommonModal
      open={open}
      onCancel={onCancel}
      centered
      title={`${type} Test Case`}
      closable={false}
      okButtonProps={{ loading: okLoading }}
      onOk={onOk}
    >
      <TestCaseForm form={form} data={data || {}} />
    </CommonModal>
  );
}
