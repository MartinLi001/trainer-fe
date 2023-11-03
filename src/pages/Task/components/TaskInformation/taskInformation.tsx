import React from 'react';
import { date2desc } from '@/utils';
import styles from './taskInformation.less';

/** 不想显示哪一条信息，就放到这个数组里，目前只有enableLateSubmission */
type HiddenInfoType = 'enableLateSubmission' | '';
interface Props {
  data: any;
  hiddenInfo?: HiddenInfoType[];
}
export default function TaskInformation({ data = {}, hiddenInfo = [] }: Props) {
  const renderTag = (title: string, value?: string, dom?: React.ReactElement) => {
    if (!title || !value) return;
    return (
      <div className={styles.textBlock}>
        <div className={styles.title}> {title}</div>
        {dom ? dom : <div className={styles.value}>{value}</div>}
      </div>
    );
  };
  const renderLine = (
    title: string,
    value: string | number,
    backColor?: string,
    color?: string,
  ) => {
    if (!title || !value) return;
    return (
      <div className={styles.textLine}>
        <div className={styles.title}> {title}</div>
        <div
          className={styles.value}
          style={{ backgroundColor: backColor || '#FFF', color: color }}
        >
          {value}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.information}>
      {renderTag(data.type + ' Title', data.name)}
      {renderLine('Day', data.priority, '#F3FAFF', '#1D355E')}
      {renderLine('Start Date', date2desc(data.startDateTime), '#F3FAFF', '#1D355E')}
      {!!data.endDateTime &&
        renderLine('End Date', date2desc(data.endDateTime), '#F3FAFF', '#1D355E')}
      {renderTag('Description', data.description)}
      {renderTag('Instruction', data.instruction)}
      {renderTag(
        'Meeting Link',
        data.meetingLink,
        <a
          href={
            data.meetingLink?.indexOf('http') > -1 ? data.meetingLink : 'http://' + data.meetingLink
          }
          target="_blank"
          rel="noreferrer"
        >
          {data.meetingLink}
        </a>,
      )}
      {!hiddenInfo.includes('enableLateSubmission') &&
        (data.enableLateSubmission
          ? renderLine('Late Submission', 'Enabled', '#F4FBEA', '#76AC1E')
          : renderLine('Late Submission', 'Disabled', '#EBECF0', '#1D355E'))}
    </div>
  );
}
