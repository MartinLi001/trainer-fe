import classNames from 'classnames';
import styles from './index.less';
import { attendantsType } from '@/pages/Task/mock/typeList';

interface PropsType {
  data: any;
  activeKey: string;
  activeTrainee: any;
  onChange: (id: string) => void;
  trainees?: attendantsType[];
}

export default function QuestionListBlock({
  data,
  activeKey,
  activeTrainee,
  onChange,
  trainees,
}: PropsType) {
  if (!data) return null;
  return (
    <div className={styles.questionRadioBox}>
      <ul className={styles.questionRadioContent}>
        <li>Question</li>
        {data?.questionOrders?.map((id: string, index: number) => {
          // const currentResult = data.questions[id].results ?? {};
          // const hasGrade = Object.keys(currentResult).some(
          //   (answerTraineeId: any) => currentResult[answerTraineeId].score !== undefined,
          // );

          // bug-406
          const results = data.questions[id].results;
          let hasGrade = false;
          if (trainees) {
            // 若传入了trainees，则是short answer mock的某一组，此时检查该组中的所有学员是否打分
            hasGrade = Object.values(results || {}).some((item: any) => {
              if (trainees?.some((trainee) => item.userId === trainee.userId))
                return item.score !== undefined;
              else return false;
            });
          } else {
            // 若没有trainees，则需要传入activeTrainee，此时为coding mock，检查当前选中学员是否打过分
            hasGrade = results?.[activeTrainee?.userId]?.score !== undefined;
          }
          return (
            <li
              key={id}
              className={classNames({
                [styles.graded]: hasGrade,
                [styles.selected]: id === activeKey,
              })}
              onClick={() => onChange(id)}
            >
              {index + 1}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
