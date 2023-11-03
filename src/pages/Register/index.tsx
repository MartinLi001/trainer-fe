import React, { useRef, useState } from 'react';
import moment from 'moment';
import { history, useModel } from 'umi';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Steps, Form, Input, Button, Row, Col, DatePicker, Space, Select, message } from 'antd';

import type { SelectOption } from './interface';
import type { RegisterAddresses, RegisterUserInfo } from '@/services/user/interface';

import { StepEnum } from './interface';
import event from './assets/event.png';
import PageHeader from '@/components/PageHeader';
import { stateOption } from './common/stateOption';
import { PhoneInput } from '@/components/PhoneInput';
import ProfileUpload from './components/ProfileUpload';

import { createUserInfo } from '@/services/user';

import styles from './index.less';

const { Step } = Steps;

const wrap = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const ref = useRef<any>();
  const { updateLocalUserInfo } = useModel('useUser');
  const userInfo = JSON.parse(localStorage.userInfo ?? '{}');

  const [currentStep, setCurrentStep] = useState<StepEnum>(StepEnum.Proflie);
  const [loading, setLoading] = useState<boolean>(false);

  const next = async () => {
    try {
      if (currentStep === StepEnum.Proflie) {
        await form.validateFields(['email']);
        setCurrentStep(currentStep + 1);
      } else if (currentStep === StepEnum.BasicInfo) {
        await form.validateFields(['firstname', 'lastname', 'phone', 'dateOfBirth']);
        setCurrentStep(currentStep + 1);
      } else if (currentStep === StepEnum.Address) {
        await form.validateFields();
        const values = form.getFieldsValue() as RegisterUserInfo;
        const addr = values?.addresses;
        // 不传apt就报错
        addr.forEach((item: RegisterAddresses) => {
          item.apt = '';
        });
        try {
          setLoading(true);
          Promise.all([
            ref.current?.handleUpload(),
            createUserInfo({
              userId: userInfo?.userId,
              email: values?.email,
              firstName: values?.firstName,
              lastName: values?.lastName,
              middleName: values?.middleName,
              preferredName: values?.preferredName,
              dateOfBirth: moment(values?.dateOfBirth).format('YYYY-MM-DD'),
              phone: values?.phone,
              addresses: addr,
            }),
          ])
            .then(async () => {
              updateLocalUserInfo();
              setLoading(false);
              history.push('/summary');
              message.success('registion success');
            })
            .catch((e) => {
              setLoading(false);
              message.error(`${e}`);
            });
        } catch (error) {
          setLoading(false);
          message.error(`${error}`);
        }
      }
    } catch (error) {
      message.error(`Verification failed.`);
    }
  };

  const back = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <PageHeader title={['registration']} />
      <div className={styles.content}>
        <Steps current={currentStep} className={styles.step} size="small">
          <Step title="Profile" />
          <Step title="Basic Info" />
          <Step title="Address" />
        </Steps>
        <Form
          name="basic"
          colon={false}
          initialValues={{ remember: true }}
          autoComplete="off"
          form={form}
          style={{ width: 740 }}
          layout="vertical"
        >
          <Form.Item
            hidden={currentStep !== StepEnum.Proflie}
            label="Email"
            name="email"
            {...wrap}
            style={{ width: 295 }}
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              { required: true, message: 'Please input your Email!' },
              {
                validator: (_, value: string) => {
                  if (value && value.indexOf('.edu') !== -1) {
                    return Promise.reject('No edu allowed');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item hidden={currentStep !== StepEnum.Proflie} label="Profile Picture" {...wrap}>
            <ProfileUpload ref={ref} />
          </Form.Item>
          <Row hidden={currentStep !== StepEnum.BasicInfo}>
            <Col span={8}>
              <Form.Item
                name="firstName"
                label="Firstname"
                initialValue={userInfo?.firstName}
                {...wrap}
                className={styles.formItem}
                rules={[{ required: true, message: 'Please input your Firstname!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="lastName"
                label="Lastname"
                initialValue={userInfo?.lastName}
                className={styles.formItem}
                {...wrap}
                rules={[{ required: true, message: 'Please input your Lastname!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="middleName" label="MiddleName" className={styles.formItem} {...wrap}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row hidden={currentStep !== StepEnum.BasicInfo}>
            <Col span={8}>
              <Form.Item
                name="preferredName"
                label="Preferred Name"
                {...wrap}
                className={styles.formItem}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dateOfBirth"
                label="Birthday"
                className={styles.formItem}
                {...wrap}
                rules={[{ required: true, message: 'Please input your Birthday!' }]}
              >
                <DatePicker placeholder="" />
              </Form.Item>
            </Col>
          </Row>

          <Row hidden={currentStep !== StepEnum.BasicInfo}>
            <Col span={8}>
              <Form.Item
                name="phone"
                label="Phone"
                {...wrap}
                className={styles.formItem}
                rules={[
                  { required: true, message: 'Please input your Phone!' },
                  {
                    type: 'string',
                    max: 12,
                    min: 12,
                    message: 'The format should be: XXX-XXX-XXXX',
                  },
                ]}
              >
                <PhoneInput />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            hidden={currentStep !== StepEnum.BasicInfo}
            label="Required Fields"
            required={true}
          />

          {currentStep === StepEnum.Address && (
            <Form.List name="addresses" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Row>
                        <Col span={16}>
                          <Form.Item
                            {...restField}
                            label="Address Line 1"
                            {...wrap}
                            style={{ width: 482 }}
                            name={[name, 'addressLine1']}
                            rules={[
                              {
                                required: true,
                                message: 'Missing Address Line 1',
                              },
                            ]}
                          >
                            <Input placeholder="Address Line 1" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            {...wrap}
                            initialValue=""
                            label="Address Line 2"
                            name={[name, 'addressLine2']}
                            style={{ width: 240 }}
                          >
                            <Input placeholder="Address Line 2" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            label="City"
                            name={[name, 'city']}
                            style={{ width: 240 }}
                            {...wrap}
                            initialValue=""
                          >
                            <Input placeholder="City" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            label="State"
                            name={[name, 'state']}
                            style={{ width: 147 }}
                            {...wrap}
                            rules={[{ required: true, message: 'Missing State' }]}
                          >
                            <Select placeholder="State" showSearch>
                              {stateOption.map((item: SelectOption) => {
                                return <Select.Option key={item.value}>{item.label}</Select.Option>;
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            label="Zip"
                            name={[name, 'zipcode']}
                            style={{ width: 147 }}
                            {...wrap}
                            rules={[{ required: true, message: 'Missing Zip' }]}
                          >
                            <Input placeholder="Zip" />
                          </Form.Item>
                        </Col>
                        {fields.length !== 1 && (
                          <Col span={4}>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Col>
                        )}
                      </Row>
                    </Space>
                  ))}
                  {fields.length > 0 && fields.length < 3 && (
                    <Form.Item style={{ width: 200 }}>
                      <Button type="default" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Another Address
                      </Button>
                    </Form.Item>
                  )}
                </>
              )}
            </Form.List>
          )}
          <Form.Item
            hidden={currentStep !== StepEnum.Address}
            label="Required Fields"
            required={true}
          />
        </Form>
        <div className={styles.bottom}>
          {currentStep > 0 && (
            <Button type="primary" className={styles.backButton} onClick={back}>
              Back
            </Button>
          )}
          {currentStep >= 0 && (
            <Button type="primary" className={styles.nextButton} onClick={next} loading={loading}>
              {currentStep === StepEnum.Address ? 'Finish' : 'Next'}
            </Button>
          )}
          <img src={event} className={styles.picture} />
        </div>
      </div>
    </>
  );
};

export default Register;
