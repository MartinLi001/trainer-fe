import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Table } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import CardTitle from '@/components/CardTitle';
import { CopyOutlined } from '@ant-design/icons';
import SeeButton from '@/components/SeeButton';
import styles from './index.less';
import { attendantsType } from '@/pages/Task/mock/typeList';

function GradeFormAvalible({ dataSource, onSave, loading, disabled }: any) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      table: dataSource,
    });
  }, [dataSource]);

  // const onChange = (index: number, e: CheckboxChangeEvent) => {
  //   dataSource[index].isBonus = e.target.checked;
  //   form.setFieldsValue({
  //     table: dataSource,
  //   });
  // };

  const columns = [
    {
      key: '1',
      title: 'Name',
      width: 120,
      dataIndex: 'firstname',
      render: (text: string) => <span style={{ fontWeight: 500, color: '#0E1E25' }}>{text}</span>,
    },
    {
      key: '2',
      title: 'Bonus',
      width: 50,
      dataIndex: 'isBonus',
      render: (isBonus: boolean, record: any, index: number) => {
        return (
          <Form.Item name={['table', index, 'isBonus']}>
            <Checkbox
              style={{ marginLeft: 10 }}
              checked={isBonus}
              // onChange={(e) => onChange(index, e)}
            />
          </Form.Item>
        );
      },
    },
    {
      key: '3',
      title: 'Score',
      width: 50,
      dataIndex: 'score',
      render: (score: number, record: any, index: number) => {
        return (
          <Form.Item
            name={['table', index, 'score']}
            rules={[
              {
                required: !record.isBonus,
                message: '',
              },
            ]}
          >
            <InputNumber min={0} max={5} size="large" style={{ width: 60 }} step={0.1} />
          </Form.Item>
        );
      },
    },
    {
      key: '4',
      title: 'Comment',
      dataIndex: 'comment',
      render: (score: number, record: any, index: number) => {
        return (
          <Form.Item name={['table', index, 'comment', 'content']}>
            <Input size="large" />
          </Form.Item>
        );
      },
    },
  ];

  return (
    <Col flex="1 1 600px">
      <CardTitle title="Grading" iconFont={<CopyOutlined />} />
      <div className={styles.gradingCardBox}>
        <Form form={form} onFinish={onSave} className={styles.form}>
          <Form.Item name="table" valuePropName="dataSource">
            <Table
              bordered={false}
              columns={columns}
              pagination={false}
              loading={!dataSource}
              rowKey={(record) => record.userId}
              className={styles.rowClassName}
            />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'right', paddingRight: 16 }}>
              <Button htmlType="submit" disabled={disabled} type="primary" loading={loading}>
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Col>
  );
}

const GradeFormUnAvalible = forwardRef(
  (
    {
      loading = false,
      results,
      selectUser,
      disabled = false,
      onSave = () => {},
    }: {
      loading: boolean;
      disabled?: boolean;
      selectUser: any;
      results: Record<string, attendantsType>;
      onSave: (values: { userResult: attendantsType; selectUser: any }) => void;
    },
    ref: any,
  ) => {
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => {
      return {
        async getFieldsValue() {
          try {
            const values = await form.getFieldsValue();
            return values;
          } catch (errorInfo) {
            return;
          }
        },
      };
    });

    useEffect(() => {
      if (Object.keys(selectUser).length && Object.keys(results).length) {
        const userResult = results[selectUser?.userId];
        form.setFieldsValue({
          score: isNaN(userResult?.score ?? NaN) ? '' : userResult?.score?.toFixed(1) ?? '',
          content: userResult?.comment?.content ?? '',
        });
        return;
      }
      form.resetFields();
    }, [selectUser, results]);

    const onFinish = (result: any) => {
      const userResult = results[selectUser?.userId];
      onSave({
        selectUser,
        userResult: {
          ...(userResult ?? selectUser ?? {}),
          score: result.score,
          comment: result?.content
            ? {
                ...(userResult?.comment ?? {}),
                content: result.content,
              }
            : undefined,
        },
      });
    };

    return (
      <Col flex="0 0 400px">
        <CardTitle
          title={
            <div style={{ whiteSpace: 'nowrap' }}>
              {`Grading: `}
              <span style={{ color: '#2875D0' }}>
                {selectUser?.firstName} {selectUser?.lastName}
              </span>
            </div>
          }
          iconFont={<CopyOutlined />}
        />
        <div className={styles.gradingCardBox}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Score" required name="score">
              <InputNumber
                placeholder="scale 0-5"
                min={0}
                max={5}
                className={styles.scoreInput}
                step={0.1}
              />
            </Form.Item>
            <Form.Item label="Comment" name="content">
              <Input.TextArea rows={6} placeholder="write any comment here" />
            </Form.Item>
            {/* <Form.Item label="Score" hidden name={['userResult']}>
            <Input placeholder="Object" />
          </Form.Item> */}
            <Form.Item>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <SeeButton type="primary" disabled={disabled} htmlType="submit" loading={loading}>
                    Save
                  </SeeButton>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </Col>
    );
  },
);

export { GradeFormAvalible, GradeFormUnAvalible };
