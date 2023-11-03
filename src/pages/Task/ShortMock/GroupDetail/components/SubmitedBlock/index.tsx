import { useRef, forwardRef, useImperativeHandle } from 'react';
import { Col, Row, Tooltip } from 'antd';

import DescriptionItem from '../DescriptionItem';
import CodeMirror from '@/components/CodeMirror';

import styles from './index.less';
import classNames from 'classnames';
import { useUpdateEffect } from 'ahooks';
import { attendantsType } from '@/pages/Task/mock/typeList';
import SeeButton from '@/components/SeeButton';
import { GradeFormUnAvalible } from '../GradeTableBlock';
import { SyncOutlined } from '@ant-design/icons';
import { getUserName } from '@/utils';

const languageList = {
  Java: 'text/x-java',
  JavaScript: 'javascript',
  SQL: 'text/x-sql',
  Python: 'text/x-python',
  CSharp: 'text/x-csharp',
  Swift: 'text/x-swift',
  Kotlin: 'text/x-csrc',
};

function SubmitedBlock(
  {
    disabled,
    loading = false,
    unsubmitTrainees = [],
    submitTrainees = [],
    results = {},
    selectUser = {},
    setSelectUser = () => {},
    onSave = () => {},
    onRefresh = () => {},
  }: {
    disabled: boolean;
    loading: boolean;
    unsubmitTrainees: any[];
    submitTrainees: any[];
    results: Record<string, attendantsType>;
    onRefresh?: () => void;
    selectUser: any;
    setSelectUser: (trainee: any) => void;
    onSave: (values: { userResult: attendantsType; selectUser: any }) => void;
  },
  ref: any,
) {
  const GradeFormUnAvalibleRef = useRef<any>();
  const codeRef = useRef<any>();
  // const [selectUser, setSelectUser] = useState<any>({});

  // useEffect(() => {
  // setSelectUser(submitTrainees[0] ?? unsubmitTrainees[0]);
  // }, [submitTrainees]);

  useImperativeHandle(ref, () => ({
    saveGrading,
  }));

  useUpdateEffect(() => {
    if (submitTrainees.length && Object.keys(selectUser).length && Object.keys(results).length) {
      const userResult = results[selectUser?.userId];
      const { language = '', content = '' } = userResult?.userAnswer ?? {};
      codeRef.current?.setOption(languageList[language]);
      codeRef.current?.setValue(content);
      return;
    }
    codeRef.current?.setValue('');
  }, [selectUser, results]);

  async function saveGrading() {
    const values = await GradeFormUnAvalibleRef.current?.getFieldsValue();
    const {
      score,
      comment = {
        content: '',
      },
    } = results?.[selectUser.userId] || {};
    if (
      values &&
      !isNaN(+values.score) &&
      values.score !== '' &&
      values.score !== null &&
      (Number(score) !== Number(values.score) || comment.content !== values.content) &&
      !disabled
    ) {
      const userResult = results[selectUser?.userId];
      onSave({
        selectUser,
        userResult: {
          ...(userResult ?? selectUser ?? {}),
          score: values.score,
          comment: values?.content
            ? {
                ...(userResult?.comment ?? {}),
                content: values.content,
              }
            : undefined,
        },
      });
    }
  }

  const onChangeTrainee = (trainee: any) => {
    saveGrading();
    setSelectUser(trainee);
  };

  const renderTraineeItem = (trainees: any) =>
    trainees?.map((trainee: any) => (
      <Tooltip placement="top" title={getUserName(trainee, true)}>
        <li
          key={trainee.userId}
          className={classNames({
            [styles.graded]: results?.[trainee.userId]?.score !== undefined,
            [styles.selected]: trainee.userId === selectUser.userId,
          })}
          onClick={() => onChangeTrainee(trainee)}
        >
          {getUserName(trainee, false, true)}
        </li>
      </Tooltip>
    ));

  return (
    <>
      <DescriptionItem
        title="Unsubmitted"
        content={<ul className={styles.radioContent}>{renderTraineeItem(unsubmitTrainees)}</ul>}
      />

      <DescriptionItem
        title={
          <>
            Submitted
            <SeeButton
              onClick={onRefresh}
              type="primary"
              style={{ width: 24, height: 26, marginLeft: 10 }}
              icon={<SyncOutlined style={{ fontSize: 12 }} />}
            />
          </>
        }
        content={<ul className={styles.radioContent}>{renderTraineeItem(submitTrainees)}</ul>}
      />

      <Row gutter={[36, 10]} wrap={false} style={{ marginBottom: 24 }}>
        <Col flex="1 1 600px">
          <div style={{ marginTop: 10 }}>
            <CodeMirror ref={codeRef} height={400} options={{ readOnly: true }} />
          </div>
        </Col>
        <GradeFormUnAvalible
          disabled={disabled}
          loading={loading}
          onSave={onSave}
          selectUser={selectUser}
          results={results}
          ref={GradeFormUnAvalibleRef}
        />
      </Row>
    </>
  );
}

export default forwardRef(SubmitedBlock);
