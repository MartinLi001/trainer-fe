import SeeButton from '@/components/SeeButton';
import { ColumnHeightOutlined, FileDoneOutlined, ShrinkOutlined } from '@ant-design/icons';
import { useToggle } from 'ahooks';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import classNames from 'classnames';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import styles from './index.less';

function FixedWidget(
  { currentTrainee, onSave = () => {}, loading, saveButtonDisable, currentQueston }: any,
  ref: any,
) {
  const [state, { toggle }] = useToggle();
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
    if (currentTrainee) {
      form.setFieldsValue({
        content: currentTrainee?.comment?.content ?? '',
        score: isNaN(currentTrainee?.score ?? NaN) ? '' : currentTrainee.score?.toFixed(1) ?? '',
      });
    }
  }, [currentTrainee, currentQueston]);

  return (
    <div
      className={classNames(styles.fixedWidget, {
        [styles.collapsed]: !state,
        [styles.open]: state,
      })}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <FileDoneOutlined /> <span style={{ marginLeft: 10 }}>Grading{state ? ':' : ''}</span>
          {state && (
            <span style={{ color: '#2875D0', marginLeft: 5 }}>{currentTrainee?.firstName}</span>
          )}
        </div>
        <span className={styles.headerRight} onClick={toggle}>
          {!state ? <ColumnHeightOutlined /> : <ShrinkOutlined />}
        </span>
      </div>
      <div className={styles.content} style={{ display: state ? 'block' : 'none' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            onSave(values);
          }}
          autoComplete="off"
        >
          <Form.Item name="score" label="Score" rules={[{ required: true }]}>
            <InputNumber
              placeholder="scale 0-5"
              min={0}
              max={5}
              style={{ width: 160 }}
              step={0.1}
            />
          </Form.Item>
          <Form.Item
            name="content"
            label="Comment"
            rules={[
              {
                type: 'string',
                max: 1000,
              },
            ]}
          >
            <Input.TextArea
              placeholder="write any comment here"
              autoSize={{ minRows: 4, maxRows: 4 }}
            />
          </Form.Item>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <SeeButton
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={saveButtonDisable}
              >
                Save
              </SeeButton>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default forwardRef(FixedWidget);
