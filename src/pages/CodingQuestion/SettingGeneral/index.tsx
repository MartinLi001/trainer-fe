import React from 'react';
import EditCodingQuestion from '@/pages/CodingQuestion/AddQuestion/index';
import styles from './index.less';
import IconFont from '@/components/IconFont';
import { Modal, message } from 'antd';
import { removeQuesiton } from '@/services/question';
import { useHistory } from 'umi';

export default function SettingGeneral({ questionId }: { questionId: string }) {
  const history = useHistory();
  const deleteQuestion = (id: string) => {
    Modal.confirm({
      title: 'Delete Coding Puzzle',
      content: (
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, lineHeight: '26px', margin: '16px 0' }}>
            All data associated with this puzzle will be deleted as well.
          </p>
          <p>Please confirm before deleting a Coding puzzle entry as it is not reversible.</p>
        </div>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true, style: { borderRadius: 3 } },
      cancelButtonProps: { style: { borderRadius: 3 } },
      onOk() {
        return removeQuesiton({ questionId: id }).then(() => {
          //   getQuestionList(SearchList);
          message.success('delete Success!');
          history.push(`/coding`);
        });
      },
      icon: <IconFont type="icon-a-iconerror" style={{ color: '#F14D4F' }} />,
      width: 600,
      centered: true,
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.generalTitle}>General</div>
      <div className={styles.description}>
        Update a puzzle’s title, description and other basics.
      </div>

      <EditCodingQuestion idFromProp={questionId} />

      <div className={styles.deletePanel}>
        <IconFont
          type="icon-delete-bin-line"
          className={styles.icon}
          onClick={() => deleteQuestion(questionId)}
        />
        <span onClick={() => deleteQuestion(questionId)}>
          Delete This Puzzle - All associated data will be removed
        </span>
      </div>
    </div>
  );
}
