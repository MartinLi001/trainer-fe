import { Button, Col, Form, Input, Row, Select, Space, Spin, message } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import CodeFileTypeShow from '@/components/codeFileShow';
import styles from './index.less';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { AuButton, AuInput, AuSelect } from '@aurora-ui-kit/core';

import LanguageChoose from './components/languageChooseTag';
import { dependencyType } from './type';
import PreviewModal from './components/PreviewModal';
import CodeList from '@/components/codeList';
import {
  getPreparations,
  getSolutionTemplate,
  getTestCaseParser,
  previewTemp,
  saveSolutionTemplate,
} from '@/services/coder';
import { TestCaseType } from '@/services/coder/type';
import TestCaseMockModal from './components/MockModal/EditOrCreate';
import IconFont from '@/components/IconFont';
import EmptyCode from '@/components/emptyCodeShow';
interface CorderType {
  questionId: string;
  onChange?: (value: boolean) => void;
}
export interface InputParam {
  index: number;
  parseType: number;
  name: string;
  functionName?: string;
  functionValue?: string;
  parseFunction?: functionType;
}
interface functionType {
  questionId: string;
  fileContent: string;
  fileName: string;
  id: number;
  language: string;
  type?: number;
}

const caseType = [
  // { name: 'Variable', value: 0 },
  { name: 'Parse', value: 1 },
  { name: 'Assignment', value: 2 },
];
const Language: React.FC<CorderType> = ({ questionId, onChange }: CorderType) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<string>('');
  const [PreviewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewData, setPreviewData] = useState<string>('');
  const [testInputList, setTestInputList] = useState<InputParam[]>([]);
  const [testOutputList, setTestOutputList] = useState<functionType[]>([]);

  const [assertFunctionShow, setAssertFunctionShow] = useState<functionType>({} as functionType);
  const [dependencyList, setDependencyList] = useState<dependencyType[]>([]);

  const [functionShow, setFunctionShow] = useState<functionType>({} as functionType);

  const [testCaseVisible, setTestCaseVisible] = useState<boolean>(false);
  const [testCaseData, setTestCaseData] = useState<TestCaseType>({} as TestCaseType);

  const [resultShow, setResuletShow] = useState<boolean>(false);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);

  const onFinish = (values: any) => {
    let submitdata = {
      questionId: questionId,
      language: language,
      output: resultShow,
      ...values,
    };
    setPreviewLoading(true);
    saveSolutionTemplate(submitdata)
      .then((res) => {
        if (onChange) onChange(false);
        message.success('save success');
        getSolutionTempData();
      })
      .finally(() => {
        setPreviewLoading(false);
      });

    console.log('Success:', values);
  };
  const getPreparationsList = () => {
    getPreparations(language).then((res) => {
      setDependencyList(res);
    });
  };
  const getTestCaseData = () => {
    getTestCaseParser(questionId, language).then((res) => {
      setTestInputList(res.inputParams);
      setTestOutputList(res.outputParams);
      if (res.assertFun) setAssertFunctionShow(res.assertFun);
    });
  };
  const getSolutionTempData = () => {
    setLoading(true);
    getPreparationsList();
    getSolutionTemplate(questionId, language)
      .then((res) => {
        setResuletShow(res.output);
        form.setFieldsValue(res);
        setLoading(false);
      })
      .then(() => {
        setLoading(false);
      });
    getTestCaseData();
  };
  useEffect(() => {
    if (language) {
      getSolutionTempData();
    }
  }, [language]);

  const renderTitle = (title: string | React.ReactNode, content: string | React.ReactNode) => {
    return (
      <div className={styles.renderTitle}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{content}</div>
      </div>
    );
  };

  const PreviewView = () => {
    form.validateFields().then((dataValue: any) => {
      let submitdata = {
        questionId: questionId,
        language: language,
        output: resultShow,
        ...dataValue,
      };
      setPreviewLoading(true);
      previewTemp(submitdata)
        .then((res: any) => {
          setPreviewModalVisible(true);
          setPreviewData(res.previewCode);
          setPreviewLoading(false);
        })
        .finally(() => {
          setPreviewLoading(false);
        });
    });
  };

  const onChangeAssertFunction = (value: string) => {
    let temp = { ...assertFunctionShow };
    temp.fileContent = value;
    setAssertFunctionShow(temp);
  };

  const mockTestCase = () => {
    let data = {
      questionId: questionId,
      language: language,
      inputParams: [
        // ...templateFormValue?.solutionTemplate?.inputParams,
        ...testInputList,
      ],
      outputParams: testOutputList,
      assertFun: assertFunctionShow,
      expect: '',
    };
    setTestCaseData({ ...data });
    setTestCaseVisible(true);
  };

  const functionShowChange = (data: functionType) => {
    if(!data.fileName){
      return
    }
    setFunctionShow(data);
  };
  const onChangefunctionShow = (value: string) => {
    if (functionShow.type && functionShow.type == 3) {
      let temp = testOutputList;
      temp.map((ite) => {
        if (ite.id == functionShow.id) {
          ite.fileContent = value;
        }
        return ite;
      });
      setTestOutputList([...temp]);
      return;
    } else if (functionShow.type && functionShow.type == 2) {
      let temp = testInputList;
      temp.map((ite) => {
        if (ite.parseFunction && ite.parseFunction.id == functionShow.id) {
          ite.parseFunction.fileContent = value;
        }
        return ite;
      });
      setTestInputList([...temp]);
    }
  };
  return (
    <Spin spinning={loading}>
      <LanguageChoose
        questionId={questionId}
        onChange={(e) => {
          setLanguage(e);
          setLoading(false);
        }}
      />
      {language ? (
        <div className={styles.languagePage}>
          <div className={styles.SolutionTemplate}>
            {renderTitle(
              'Solution Template',
              'Create a standard format that every new solution will start with by default.',
            )}
            <div className={styles.SolutionTemplateContent}>
              <Spin spinning={previewLoading}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  onFieldsChange={() => {
                    if (onChange) onChange(true);
                  }}
                >
                  <Form.Item name={'id'} hidden>
                    <Input />
                  </Form.Item>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>
                      <Form.List name="inputParams">
                        {/* {(inputParamsList || []).map((item) => {
                <Form.Item>1231</Form.Item>;
              })} */}
                        {(fields, { add, remove }) => (
                          <>
                            <div className={styles.formTitleDiv}>Input Parameters </div>
                            {fields.map((field, index) => (
                              <Row gutter={{ xs: 8, sm: 12, md: 12, lg: 12 }} align="middle">
                                {/* {renderTitleShow('Input', `index${index}`)} */}
                                <Col span={12}>
                                  <Form.Item {...field} name={[field.name, 'inputName']}>
                                    <Input addonBefore="Name" value={'Input'} disabled={true} />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'inputType']}
                                    rules={[
                                      { required: true, message: 'not empty' },
                                      {
                                        type: 'string',
                                        max: 40,
                                        message: 'The value cannot exceed 40 characters',
                                      },
                                    ]}
                                  >
                                    <Input addonBefore="Type" value={'Input'} />
                                  </Form.Item>
                                </Col>
                              </Row>
                            ))}
                          </>
                        )}
                      </Form.List>
                      <Form.Item label="Dependency Class" name="dependencyPreparationIds">
                        <Select
                          mode="multiple"
                          showArrow
                          allowClear
                          style={{ width: '60%' }}
                          placeholder="select dependency"
                          options={dependencyList.map((item) => ({
                            label: item.fileName,
                            value: item.id,
                          }))}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <div className={styles.formTitleDiv}>Output Parameters </div>
                      {resultShow && (
                        <Row gutter={{ xs: 8, sm: 12, md: 12, lg: 12 }} align="middle">
                          <Col span={12}>
                            <Form.Item>
                              <Input addonBefore="Name" disabled={true} value={'result'} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="outputType"
                              rules={[
                                { required: true, message: 'not empty' },
                                {
                                  type: 'string',
                                  max: 40,
                                  message: 'The value cannot exceed 40 characters',
                                },
                              ]}
                            >
                              <Input addonBefore="Type" />
                            </Form.Item>
                          </Col>
                        </Row>
                      )}
                    </Col>
                  </Row>
                  <div className={styles.SolutionTemplateCode}>
                    <CodeList language="java" addProps={{ questionId, language, type: 1 }} />
                  </div>
                  <div className={styles.listTile}>
                    <Space>
                      <AuButton type="outlined" onClick={() => PreviewView()}>
                        Preview
                      </AuButton>
                      <AuButton htmlType="submit">Save</AuButton>
                    </Space>
                  </div>
                </Form>
              </Spin>
            </div>
          </div>
          <div className={styles.SolutionTemplate}>
            {renderTitle(
              'Sample Solution',
              'Sample solutions will be used to validate test case parsers below; they can also be made available to trainees if needed.',
            )}
            {/* <div className={styles.SolutionTemplateContent}> */}
            <div className={styles.SolutionTemplateCode}>
              <CodeList
                changeNameFlag={false}
                language="java"
                addProps={{ questionId, language, type: 0 }}
                lastFileNumber={1}
              />
            </div>
            {/* </div> */}
          </div>
          <div className={styles.TestCaseParser}>
            {renderTitle(
              'Test Case Parser',
              'A parsing file is required for every Input & Output Parameters.',
            )}
            <div className={styles.SolutionTemplateContent}>
              <div>
                <Row gutter={26}>
                  <Col span={12}>
                    <div className={styles.inputList}>
                      <div className={styles.inputListTitle}>Input Parameters</div>
                      <div className={styles.InoutListShow}>
                        {testInputList.map((item, index) => {
                          if (item.parseType == 0) {
                            return (
                              <div className={styles.codelist} key={index}>
                                <Row gutter={{ xs: 8, sm: 12, md: 12, lg: 12 }} align="middle">
                                  <Col span={8}>
                                    <Input
                                      addonBefore="Input"
                                      value={`Input${index + 1}`}
                                      disabled={true}
                                    />
                                  </Col>
                                  <Col span={16}>
                                    <AuSelect
                                      value={item.parseType}
                                      disabled={true}
                                      options={[
                                        {
                                          value: 0,
                                          label: 'Variable',
                                        },
                                      ]}
                                      hideMessage
                                    ></AuSelect>
                                  </Col>
                                </Row>
                              </div>
                            );
                          } else {
                            return (
                              <div className={styles.codelist} key={index}>
                                <Row gutter={{ xs: 8, sm: 12, md: 12, lg: 12 }} align="middle">
                                  <Col span={8}>
                                    <Input
                                      addonBefore="Input"
                                      value={`Input${index + 1}`}
                                      disabled={true}
                                    />
                                  </Col>
                                  <Col span={7}>
                                    <AuSelect
                                      value={item.parseType}
                                      disabled={true}
                                      options={caseType?.map((item) => ({
                                        value: item.value,
                                        label: item.name,
                                      }))}
                                      hideMessage
                                    ></AuSelect>
                                  </Col>
                                  <Col span={7}>
                                    <AuInput
                                      hideMessage
                                      value={item.inputName}
                                      disabled={true}
                                    ></AuInput>
                                  </Col>
                                  <Col span={2}>
                                    <div
                                      className={styles.codeShowButton}
                                      onClick={() => functionShowChange(item.parseFunction)}
                                    >
                                      <ArrowRightOutlined />
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                    <div className={styles.outpu}>
                      <div className={styles.outpuShow}>Output Parameters</div>
                      <div className={styles.outPutCont}>
                        <Row gutter={{ xs: 8, sm: 12, md: 12, lg: 12 }}>
                          <Col span={20}>
                            <Input addonBefore="Output" value={`expect`} disabled={true} />
                          </Col>
                          <Col span={2}>
                            <div
                              className={styles.codeShowButton}
                              onClick={() => functionShowChange(testOutputList[0])}
                            >
                              <ArrowLeftOutlined />
                            </div>
                          </Col>
                          <Col span={2}>
                            <div
                              className={styles.codeShowButton}
                              onClick={() => functionShowChange(testOutputList[1])}
                            >
                              <ArrowRightOutlined />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.PaserCont}>
                      <span className={styles.Paser}>Input & Output Parser</span>
                      {functionShow.fileName ? (
                        <CodeFileTypeShow
                          data={functionShow}
                          onChange={(value) => {
                            onChangefunctionShow(value);
                          }}
                        />
                      ) : (
                        <EmptyCode type={2} />
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
              <div className={styles.AssertShow}>
                <span className={styles.AssertShowTitle}>
                  {renderTitle(
                    'Assert',
                    'Use asserting to ensure the value returned from Sample Solution matches the value of the expected output.',
                  )}
                </span>
                <div className={styles.assertCode}>
                  {assertFunctionShow.fileName && (
                    <CodeFileTypeShow
                      data={{ ...assertFunctionShow }}
                      onChange={onChangeAssertFunction}
                    />
                  )}
                </div>
              </div>
              <div className={styles.listTile}>
                <Space>
                  <AuButton onClick={() => mockTestCase()}>Validate</AuButton>
                  {/* <AuButton htmlType="submit">Save</AuButton> */}
                </Space>
              </div>
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div className={styles.emptyPage}>
            <IconFont type="icon-a-IconsJavascript" style={{ fontSize: 40 }} />
            <div className={styles.emptyTitle}>Select a Language to Start</div>
            <div className={styles.emptyPageContent}>
              Click “+” to add an language and configure its Solution Template and Test Case Parser.
              d
            </div>
          </div>
        )
      )}

      {PreviewModalVisible && (
        <PreviewModal
          visible={PreviewModalVisible}
          previewData={previewData}
          handleCancel={() => setPreviewModalVisible(false)}
        />
      )}
      {testCaseVisible && (
        <TestCaseMockModal
          open={testCaseVisible}
          data={testCaseData}
          onCancel={() => {
            setTestCaseData({} as TestCaseType);
            setTestCaseVisible(false);
          }}
        />
      )}
    </Spin>
  );
};

export default Language;
