import SeeButton from '@/components/SeeButton';

import { DatePicker } from 'antd';

import IconFont from '@/components/IconFont';
// import type { DatePickerProps } from 'antd/es/date-picker';

import { mockGroupsType } from '@/pages/Task/mock/typeList';

import styles from './index.less';
import { date2desc } from '@/utils';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { ClockCircleOutlined } from '@ant-design/icons';

export default function SetTimeBlock({
  mockGroup,
  loading = false,
  onSave = () => {},
}: {
  mockGroup: mockGroupsType;
  loading?: boolean;
  onSave: (time: string) => void;
}) {
  const [startTime, setStartTime] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // const onOk = (value: DatePickerProps['value']) => {
  // console.log('onOk: ', moment(new Date(value as any)).format('YYYY-MM-DDThh:mm:ss'));
  // setStartTime(moment(value).format());
  // };

  const onChange = (_: any, b: string) => {
    setStartTime(b.replace(' ', 'T'));
  };

  useEffect(() => {
    setIsEdit(false);
    setStartTime('');

    return () => {
      setIsEdit(false);
    };
  }, [mockGroup]);

  if (mockGroup?.startTime && !isEdit) {
    return (
      <>
        <div className={styles.timeLabel}>
          <span>Starts at</span>
          <span className={styles.timeValue}>{date2desc(mockGroup?.startTime)}</span>
        </div>
        <span
          className={styles.icon}
          onClick={() => {
            setIsEdit(true);
            setStartTime(mockGroup.startTime as string);
          }}
        >
          <IconFont style={{ fontSize: 18 }} type="icon-edit-line" />
        </span>
      </>
    );
  } else {
    if (!isEdit) {
      return (
        <div className={styles.noTime} onClick={() => setIsEdit(true)}>
          <ClockCircleOutlined /> add a start time
        </div>
      );
    }
    return (
      <>
        {/* @ts-ignore */}
        <DatePicker
          showTime
          use12Hours
          onChange={onChange}
          value={(startTime ? moment(startTime) : '') as any}
        />
        <SeeButton
          style={{ marginLeft: 10 }}
          type="primary"
          loading={loading}
          onClick={() => {
            onSave(startTime);
          }}
          disabled={!startTime}
        >
          Save
        </SeeButton>
        <SeeButton
          style={{ marginLeft: 10 }}
          onClick={() => {
            setStartTime(mockGroup?.startTime as string);
            setIsEdit(false);
          }}
        >
          Cancel
        </SeeButton>
      </>
    );
  }
}
