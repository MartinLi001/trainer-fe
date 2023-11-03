import classNames from 'classnames';
import SeeButton from '@/components/SeeButton';
import { SyncOutlined } from '@ant-design/icons';
import DescriptionItem from '@/pages/Task/ShortMock/GroupDetail/components/DescriptionItem';

import styles from './index.less';
import { questionType } from '@/pages/Task/ShortMock/typeList';
import { Tooltip } from 'antd';
import { getUserName } from '@/utils';

export default function SubmitedBlock({
  currentQuestion = {} as questionType,
  unsubmitTrainees = [],
  submitTrainees = [],
  activeTrainee = {},
  onRefresh = () => {},
  onChange = () => {},
}: {
  currentQuestion: questionType;
  unsubmitTrainees: any[];
  submitTrainees: any[];
  activeTrainee: any;
  onRefresh?: () => void;
  onChange?: (selectUser: any) => void;
}) {
  const renderTraineeItem = (trainees: any) =>
    trainees?.map((trainee: any) => (
      <Tooltip placement="top" title={getUserName(trainee, true)} key={trainee.userId}>
        <li
          className={classNames({
            [styles.graded]: currentQuestion?.results?.[trainee.userId]?.score !== undefined,
            [styles.selected]: trainee.userId === activeTrainee.userId,
          })}
          onClick={() => {
            onChange?.(trainee);
          }}
        >
          {getUserName(trainee, false, true)}
        </li>
      </Tooltip>
    ));

  return (
    <>
      <DescriptionItem
        title="Unsubmitted"
        content={
          <ul className={classNames(styles.radioContent, styles.Unsubmitted)}>
            {renderTraineeItem(unsubmitTrainees)}
          </ul>
        }
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
    </>
  );
}
