import { Button, Col, Form, Input, Row, Space, Spin, message } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { AuButton, AuInput, AuSelect } from '@aurora-ui-kit/core';
import DndComponentProvider, { DragDropCard } from '@/components/DndContainer';
import { cloneDeep } from 'lodash';
import OutPutList from './components/outPutLit';

import { getCoderSpec, saveCodeerSpec } from '@/services/coder';
import IconFont from '@/components/IconFont';
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
}
const caseType = [
  // { name: 'Variable', value: 0 },
  { name: 'Parse', value: 1 },
  { name: 'Assignment', value: 2 },
];

const Configuration: React.FC<CorderType> = ({ questionId, onChange }: CorderType) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const inputParamsList = Form.useWatch('inputParams', form);
  const out = Form.useWatch('output', form);
  const [configuraData, setConfiguraData] = useState();

  const [outputParams, setOutputParams] = useState([]);

  useEffect(() => {
    let tempEdit = form.getFieldValue('inputSpecs');
    let tempOut = out ? [{ value: 0, label: 'result' }] : [];
    (inputParamsList || []).map((ite, ind) => {
      tempOut.push({
        value: ind + 1,
        label: ite.inputName,
      });
    });
    let a = tempOut.find((ite) => ite.value === form.getFieldValue('outputFrom'));
    console.log('%cindex.tsx line:48 a', 'color: #007acc;', a);
    if (!a) {
      form.setFieldValue('outputFrom', null);
    }
    setOutputParams(tempOut);
    let temp = [
      ...(inputParamsList || []),
      ...(tempEdit || []).filter((ite) => ite.parseType == 0),
    ];

    temp.map((item) => {
      tempEdit.map((ite) => {
        if (ite.sbId == item.sbId) {
          item.parseType = ite.parseType;
        }
      });
      return item;
    });
    form.setFieldValue('inputSpecs', temp);
  }, [inputParamsList, out]);

  const getCoderValue = () => {
    setLoading(true);
    getCoderSpec(questionId)
      .then((res) => {
        let temp = { ...res };
        temp.inputSpecs.map((ite) => {
          ite.sbId = ite.id;
          return ite;
        });
        temp.inputParams = temp.inputSpecs.filter((ite) => ite.parseType != 0);
        temp.inputSpecs = temp.inputSpecs.filter((ite) => ite.parseType == 0);
        form.setFieldsValue(temp);
        setConfiguraData(temp);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getCoderValue();
  }, []);

  const onFinish = (values: any) => {
    if (values.inputParams.length == 0) {
      message.error('Input Params at least one');
      return;
    }
    let submitdata = {
      questionId,
      ...values,
    };
    saveCodeerSpec(submitdata).then((res) => {
      message.success('save success');
      if (onChange) onChange(false);
      form.resetFields();
      getCoderValue();
    });
    // let submitdata = {
    //   questionId: questionId,
    //   language: '',
    //   solutionTemplate: values,
    // };

    console.log('Success:', values);
  };

  const renderTitle = (title: string | React.ReactNode, content: string | React.ReactNode) => {
    return (
      <div className={styles.renderTitle}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{content}</div>
      </div>
    );
  };
  return (
    <Spin spinning={loading}>
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
        <div className={styles.Corder}>
          {renderTitle(
            'Argument Template',
            'An argument template defines utility classes that will be used in a program’s test case parser.',
          )}
          <div className={styles.Argument}>
            <Form.Item
              label="Function Name"
              name="functionName"
              rules={[{ required: true, message: 'Please input your functionName!' }]}
            >
              <AuInput hideMessage style={{ width: '50%' }} />
            </Form.Item>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={12}>
                {' '}
                <DndComponentProvider>
                  <Form.List name="inputParams">
                    {(fields, { add, remove }) => (
                      <>
                        <div className={styles.formTitleDiv}>Input Parameters</div>
                        {fields.map((field, index) => (
                          <DragDropCard
                            key={index + '-card'}
                            index={index}
                            item={field}
                            moveClassName={styles.moveClassName}
                            moveCard={(dragIndex, hoverIndex) => {
                              let group = form.getFieldValue('inputParams');
                              const dragCard = group[dragIndex];
                              const backupList = cloneDeep(group);
                              backupList.splice(dragIndex, 1);
                              backupList.splice(hoverIndex, 0, dragCard);
                              form.setFieldValue('inputParams', backupList);
                            }}
                          >
                            <Space key={field.key} align="center" className={styles.cardDndShow}>
                              <Form.Item>
                                <IconFont type="icon-a-Iconsdrag" style={{ cursor: 'move' }} />
                              </Form.Item>
                              <Form.Item
                                {...field}
                                name={[field.name, 'inputName']}
                                rules={[
                                  // {
                                  //   required: true,
                                  //   message: 'not empty',
                                  // },
                                  {
                                    validator: (_, value) =>
                                      /^[_a-zA-Z][0-9a-zA-Z_$]*/.test(value)
                                        ? Promise.resolve()
                                        : Promise.reject(new Error('The variable name is invalid')),
                                  },
                                ]}
                                // initialValue={100}
                              >
                                <Input addonBefore="Name" />
                              </Form.Item>

                              <Form.Item>
                                <span
                                  onClick={() => remove(field.name)}
                                  className={styles.formListIcon}
                                >
                                  <CloseOutlined style={{ cursor: 'pointer' }} />
                                </span>
                              </Form.Item>
                            </Space>
                          </DragDropCard>
                        ))}
                        <AuButton
                          onClick={() => add({ parseType: 1, sbId: JSON.stringify(Date.now()) })}
                          type="link"
                          className={styles.formInputAddButton}
                        >
                          <PlusOutlined /> Add
                        </AuButton>
                      </>
                    )}
                  </Form.List>
                </DndComponentProvider>
              </Col>
              <Col span={12}>
                <Form.Item label="Output Parameters" name="output">
                  <OutPutList />
                </Form.Item>
              </Col>
            </Row>
            {/* <Form.Item>
              <div className={styles.listTile}>
                <AuButton htmlType="submit">Save</AuButton>
              </div>
            </Form.Item> */}
          </div>
        </div>
        <div className={styles.CorderTestCase}>
          {renderTitle(
            'Test Case Parser Template',
            'A parsing template decides how our product will interpret test cases.',
          )}
          <div className={styles.TestCase}>
            <Form.List name="inputSpecs">
              {/* {(inputParamsList || []).map((item) => {
                <Form.Item>1231</Form.Item>;
              })} */}
              {(fields, { add, remove }) => (
                <>
                  <div className={styles.formTitleDiv}>Input Parameters</div>
                  {fields.map((field, index) => (
                    <Row
                      gutter={{ xs: 8, sm: 12, md: 12, lg: 12 }}
                      align="middle"
                      className={styles.testInputList}
                    >
                      {/* {renderTitleShow('Input', `index${index}`)} */}
                      <Col span={10}>
                        <Form.Item>
                          <Input addonBefore="Input" value={`Input${index + 1}`} disabled={true} />
                        </Form.Item>
                      </Col>

                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) => {
                          prevValues.inputSpecs !== curValues.inputSpecs;
                        }}
                      >
                        {(prevValues) => {
                          const parseType = prevValues.getFieldValue('inputSpecs')[index].parseType;
                          if (parseType == 0) {
                            return (
                              <>
                                <Col span={12}>
                                  <Form.Item {...field} name={[field.name, 'parseType']}>
                                    <AuSelect
                                      options={[
                                        {
                                          value: 0,
                                          label: 'Variable',
                                        },
                                      ]}
                                      hideMessage
                                      // value={item.parseType}
                                      // style={{ width: '150px' }}
                                      // onChange={(e) => onChangeInputCase({ ...item, parseType: e }, index)}
                                    ></AuSelect>
                                  </Form.Item>
                                </Col>
                                <Col span={2}>
                                  <Form.Item>
                                    <CloseOutlined
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => remove(field.name)}
                                    />
                                  </Form.Item>
                                </Col>
                              </>
                            );
                          } else {
                            return (
                              <>
                                <Col span={6}>
                                  <Form.Item {...field} name={[field.name, 'parseType']}>
                                    <AuSelect
                                      options={caseType?.map((item) => ({
                                        value: item.value,
                                        label: item.name,
                                      }))}
                                      hideMessage
                                    ></AuSelect>
                                  </Form.Item>
                                </Col>

                                <Col span={6}>
                                  <Form.Item {...field} name={[field.name, 'inputName']}>
                                    <AuInput hideMessage disabled></AuInput>
                                  </Form.Item>
                                </Col>
                              </>
                            );
                          }
                        }}
                      </Form.Item>
                    </Row>
                  ))}
                  <AuButton
                    onClick={() => add({ parseType: 0, sbId: JSON.stringify(Date.now()) })}
                    type="link"
                    className={styles.formInputAddButton}
                  >
                    <PlusOutlined /> Add
                  </AuButton>
                </>
              )}
            </Form.List>
            <div className={styles.outPutChoose}>
              <Form.Item
                label="Output Parameters"
                name="outputFrom"
                rules={[{ required: true, message: 'Please choose your Output!' }]}
              >
                <AuSelect
                  options={outputParams?.map((item, index) => ({
                    value: item.value,
                    label: item.label,
                  }))}
                  hideMessage
                  // value={item.parseType}
                  style={{ width: '480px' }}
                  // onChange={(e) => onChangeInputCase({ ...item, parseType: e }, index)}
                ></AuSelect>
              </Form.Item>
            </div>
            <div className={styles.listTile}>
              <AuButton htmlType="submit">Save</AuButton>
            </div>
          </div>
        </div>
        <div style={{ padding: 24 }}></div>
      </Form>
    </Spin>
  );
};

// export default Question;

export default Configuration;
