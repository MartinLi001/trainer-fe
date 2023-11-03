import { DetailValueType } from '@/pages/AddQuestion/typeList';
import { Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import QuestionShow from '../questionShow';
import style from './index.less';

export interface userShowDrawer {
  question?: DetailValueType;
  visible: boolean;
  onClose?: () => void;
  onSave?: (value: DetailValueType) => void;
}
function DetailShow({ question, visible, onClose }: userShowDrawer) {
  const [data, setData] = useState<DetailValueType>({} as DetailValueType);
  const [groups, setGroups] = useState<DetailValueType[]>();

  useEffect(() => {
    if (question) setData(question);
    console.log('%cindex.tsx line:20 question', 'color: #007acc;', question);
    if (question?.linkedQuestions) {
      setGroups(question?.linkedQuestions || []);
    } else {
      setGroups([]);
    }
  }, [question]);

  return (
    <>
      <Drawer
        placement="right"
        onClose={onClose}
        open={visible}
        className={style.detailShow}
        width={'40%'}
      >
        <div className={style.showChangePage}>
          <div className={style.importQuestion}>
            <div className={style.quesShow}>
              <QuestionShow question={data} type="import" />
            </div>
          </div>
          {groups && groups.length > 0 && (
            <div className={style.linkQuestionTable}>
              <div className={style.floow}>Follow-up Question</div>
              {(groups || []).map((ite) => {
                return (
                  <div key={ite.questionId}>
                    {ite.questionId && <QuestionShow question={ite} type="link" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default DetailShow;
