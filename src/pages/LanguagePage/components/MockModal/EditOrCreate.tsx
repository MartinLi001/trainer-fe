import { Form, Input, Modal, Spin } from 'antd';
import React, { useEffect, useMemo } from 'react';
import styles from './index.less';

interface CollectionCreateFormProps {
  data: TestCaseParser;
  assertFun: OutputParam;
  open: boolean;
  onCancel: () => void;
}

// import { checkAnswer, testCaseMock } from '@/services/Demo';
// import { TestCaseType } from '@/services/Demo/type';
const runShowList = {
  100: <IconFont type="icon-check-circle" style={{ color: '#8FCE28' }} />,
  110: <IconFont type="icon-a-iconwarning" style={{ color: '#FFAB00' }} />,
  120: <IconFont type="icon-a-iconerror" style={{ color: '#DE350B' }} />,
  130: <IconFont type="icon-check-circle" style={{ color: '#DE350B' }} />,
};
import { AuInput, AuSelect } from '@aurora-ui-kit/core';
import { useRequest } from 'ahooks';
import {
  OutputParam,
  SolutionType,
  TestCaseParser,
  validateResultType,
} from '@/services/coder/type';
import CommonModal from '@/components/CommonModal';
import { getCodeFile, getTestCaseData, validataTestCase } from '@/services/coder';
import IconFont from '@/components/IconFont';
import { WarningOutlined } from '@ant-design/icons';

export default function TestCaseMockModal({ data, open, onCancel }: CollectionCreateFormProps) {
  const [form] = Form.useForm();
  const [sampleSolutionList, setSampleSolutionList] = React.useState<SolutionType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [resultShow, setResultShow] = React.useState<boolean>(false);
  // const [result, setResult] = React.useState<validateResultType>({} as validateResultType);
  useEffect(() => {
    getCodeFile(data.questionId, data.language, 0).then((res) => {
      setSampleSolutionList(res);
    });
    const { inputParams } = data;
    if (open && inputParams?.length) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [open, data]);

  const runTestCase = () => {
    form.validateFields().then((value) => {
      let submitData = {
        language: data.language,
        questionId: data.questionId,
        testCase: {
          inputs: value.inputParams,
          ...value,
        },
        sampleSolutionId: value.sampleSolutionId,
      };
      setLoading(true);
      validataTestCase(submitData).then((res) => {
        run(res.submissionId);
        setResultShow(true);
      });
    });
  };

  const {
    data: result,
    run,
    cancel,
  } = useRequest(getTestCaseData, {
    pollingInterval: 1000,
    pollingWhenHidden: false,
    pollingErrorRetryCount: 3,
    manual: true,
    onSuccess(res) {
      if (res.state != 'pending') {
        cancel();
        setLoading(false);
      }
    },
  });

  const renderRun = () => {
    return (
      <Spin spinning={loading}>
        <div className={styles.resultShow}>
          {result?.statusCode == 100 && (
            <div className={styles.runAccpetShow}>{runShowList[100]} Validation Success</div>
          )}
          {result?.statusCode == 110 && (
            <div className={styles.runWrongShow}>
              {runShowList[110]}Rejected
              <div className={styles.Rejected}>
                Actual Output
                <p>{result.results[0].result}</p>
              </div>
            </div>
          )}
          {(result?.statusCode == 120 || result?.statusCode == 130) && (
            <div className={styles.runErrorShow}>
              {runShowList[120]}Error Title
              <div className={styles.Error}>
                {result.statusCode == 120 ? result.compileError : result.runtimeError}
              </div>
            </div>
          )}
        </div>
      </Spin>
    );
  };

  return (
    <CommonModal
      open={open}
      title="Parser Validation"
      okText={'Test Run'}
      onCancel={onCancel}
      width={600}
      okButtonProps={{ loading: loading }}
      onOk={() => {
        runTestCase();
      }}
    >
      <div className={styles.formSHow}>
        <Spin spinning={false}>
          <Form
            form={form}
            layout="vertical"
            name="form"
            initialValues={{ inputs: [], expect: '' }}
          >
            <div className={styles.inputTitle}>Input</div>
            {data?.inputParams?.length
              ? data?.inputParams?.map((input, i) => {
                  if (input.parseType == 1 || input.parseType == 2) {
                    return (
                      <>
                        <Form.Item
                          key={input.inputName}
                          name={['inputParams', i, 'content']}
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
                          <Input addonBefore={input.inputName} />
                        </Form.Item>
                        <Form.Item
                          key={input.id + `${i}-parseType`}
                          name={['inputParams', i, 'parseType']}
                          hidden
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          key={input.id + `${i}-inputName`}
                          name={['inputParams', i, 'inputName']}
                          hidden
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          key={input.id + `${i}-id`}
                          name={['inputParams', i, 'id']}
                          hidden
                        >
                          <Input />
                        </Form.Item>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <Form.Item
                          key={input.inputName}
                          name={['inputParams', i, 'content']}
                          // noStyle={!input.inputName}
                          rules={[
                            { required: true, message: 'not empty' },
                            {
                              type: 'string',
                              max: 40,
                              message: 'The value cannot exceed 40 characters',
                            },
                          ]}
                        >
                          <AuInput hideMessage/>
                        </Form.Item>
                        <Form.Item
                          key={input.id + `${i}-parseType`}
                          name={['inputParams', i, 'parseType']}
                          hidden
                        >
                          <AuInput />
                        </Form.Item>
                        <Form.Item
                          key={input.id + `${i}-inputName`}
                          name={['inputParams', i, 'inputName']}
                          hidden
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          key={input.id + `${i}-id`}
                          name={['inputParams', i, 'id']}
                          hidden
                        >
                          <AuInput />
                        </Form.Item>
                      </>
                    );
                  }
                })
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
              <Input addonBefore="expect" />
            </Form.Item>
            <div className={styles.SolutionTitle}>Select Sample Solution</div>

            <Form.Item
              name="sampleSolutionId"
              rules={[{ required: true, message: 'please choose one' }]}
            >
              <AuSelect
                options={sampleSolutionList?.map((item) => ({
                  value: item.id,
                  label: item.fileName,
                }))}
                hideMessage
                placeholder="select a sample solution"
              ></AuSelect>
            </Form.Item>
          </Form>
          {resultShow && renderRun()}
        </Spin>
      </div>
    </CommonModal>
  );
}
