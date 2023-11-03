import React, { useMemo, useState } from 'react';
import styles from './index.less';
import type { questionType } from '../../mock/typeList';
import SeeButton from '@/components/SeeButton';
import IconFont from '@/components/IconFont';
import DndComponentProvider, { DragDropCard } from '@/components/DndContainer';
import { PauseOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { Modal } from 'antd';
import { saveAndDeleteQuestions } from '@/services/question';
import { history, useDispatch, useLocation, useSelector } from 'umi';
import { cloneDeep } from 'lodash';
import QuestionDrawer from './QuestionDrawer';

// interface Props {
//   data?: any;
//   questionOrders: string[];
//   questions: Record<string, questionType>;
//   batchId: string;
//   taskId: string;
// }
export default function QuestionList() {
  const { pathname } = useLocation();
  // const {
  //   data,
  //   questionOrders = [],
  //   // questionOrders: rawQuestionOrders = [],
  //   questions,
  //   // questions: rawQuestions,
  //   batchId,
  //   taskId,
  // } = props;
  const {
    Batch,
    Mock: {
      data,
      data: { questionOrders = [], questions, batchId, taskId },
    },
  } = useSelector((state) => state) as any;
  const isBatchTrainer = useMemo(
    () => Batch?.data?.trainers?.some((i: any) => i.userId === localStorage.userId),
    [Batch],
  );
  const [questionEditting, setquestionEditting] = useState(false); // 是否正在编辑
  // const [questionOrders, setQuestionOrders] = useState<string[]>(rawQuestionOrders);
  const [deletedMap, setDeletedMap] = useState<Record<string, boolean>>({}); // 要删除的列表-object
  const [orderMemory, setOrderMemory] = useState<string[]>([]); // edit之前的questions顺序。
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerQuestion, setDrawerQuestion] = useState<questionType>(); // 抽屉中要显示的question
  const [deletedModalVisible, setDeletedModalVisible] = useState(false);
  // const [questions, setQuestions] = useState(rawQuestions);
  const [dragItem, setDragItem] = useState<{ id?: string; index?: number }>({}); // 正在拖动的item
  const [updateQuestionsLoading, setUpdateQuestionsLoading] = useState(false); // 排序或删除按钮的loading状态
  const dispatch = useDispatch();
  /**要删除的列表-array */
  const removedQuestionIds = useMemo(
    () => Object.keys(deletedMap).filter((i) => deletedMap[i]),
    [deletedMap],
  );

  function updateSourceData(key: string, newData: any) {
    const backup = cloneDeep(data);
    backup[key] = newData;
    dispatch({ type: 'Mock/updateData', payload: backup });
  }

  function onSave() {
    const newOrder = questionOrders.filter((i: string) => !deletedMap[i]);
    setUpdateQuestionsLoading(true);
    saveAndDeleteQuestions({
      batchId,
      taskId,
      // questions: [],
      questionOrders: newOrder,
      removedQuestionIds,
    })
      .then(() => {
        setquestionEditting(false);
        // setQuestionOrders(newOrder);
        setDeletedModalVisible(false);
        updateSourceData('questionOrders', newOrder);
        setDeletedMap({});
      })
      .finally(() => setUpdateQuestionsLoading(false));
  }

  /** 渲染操作questions列表的按钮 - edit add */
  const renderOptionBtn = () => {
    const deletedNumber = removedQuestionIds.length;
    return questionEditting ? (
      <div className={styles.optionButtonBox}>
        <SeeButton
          onClick={() => {
            setquestionEditting(false);
            setDeletedMap({}); // 取消编辑时，清空删除列表deletedMap
            // setQuestionOrders(orderMemory); // 取消编辑时，恢复成用户排序之前的顺序
            updateSourceData('questionOrders', orderMemory); // 取消编辑时，恢复成用户排序之前的顺序
          }}
        >
          cancel
        </SeeButton>
        <SeeButton
          type={deletedNumber ? 'danger' : 'primary'}
          onClick={() => (deletedNumber ? setDeletedModalVisible(true) : onSave())}
          loading={updateQuestionsLoading}
        >
          {`Save${deletedNumber ? ' & Delete' : ''}`}
        </SeeButton>
        {!!deletedNumber && <span className={styles.deletedTips}>{deletedNumber} Selected</span>}
      </div>
    ) : (
      <div className={styles.optionButtonBox}>
        {questionOrders.length > 0 && (
          <SeeButton
            icon={<IconFont type="icon-edit-line" />}
            onClick={() => {
              setquestionEditting(true);
              setOrderMemory(questionOrders); // 编辑之前先存一下修改前的顺序
            }}
            disabled={!isBatchTrainer}
          >
            Edit Questions
          </SeeButton>
        )}
        <SeeButton
          icon={<IconFont type="icon-add-line" />}
          onClick={() => {
            const temp = JSON.parse(localStorage.getItem('pageHeaderItems') ?? '[]');
            localStorage.setItem(
              'pageHeaderItems',
              JSON.stringify([
                ...temp,
                {
                  name: data?.name,
                  href: pathname,
                },
              ]),
            );
            const isMybatch = pathname.startsWith('/myBatch');
            history.push(`${isMybatch ? '/myBatch' : '/Category/Batches'}/Mock/Short/addQuestion`);
          }}
          disabled={!isBatchTrainer}
        >
          Add Questions
        </SeeButton>
      </div>
    );
  };

  /**渲染每道题题目的预览
   * @param{string} id
   * @param{boolean} ignoreHighlightDeleted - 是否用于显示删除列表，为true时不会出现代表删除的高亮背景，按钮icon固定显示为删除图标
   */
  const renderCardContent = (id: string, ignoreHighlightDeleted?: boolean) => {
    const edittingBtn = (
      <IconFont
        type={
          !ignoreHighlightDeleted && deletedMap[id] ? 'icon-refresh-line' : 'icon-delete-bin-line'
        }
        className={styles.button}
        onClick={(e: any) => {
          const backup = cloneDeep(deletedMap);
          backup[id] = !deletedMap[id];
          setDeletedMap(backup);
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
      />
    );
    return (
      <div
        key={id + 'question'}
        className={classNames(styles.questionCard, {
          [styles.deleted]: !ignoreHighlightDeleted && deletedMap[id],
          [styles.dragging]: dragItem.id === id,
        })}
      >
        <PauseOutlined rotate={90} className={styles.dragIcon} />
        {questions?.[id]?.name}
        {questionEditting && edittingBtn}
      </div>
    );
  };

  /**渲染questions列表 */
  const renderCardList = () => {
    const half = ~~(questionOrders.length / 2 + 0.5);
    const list1 = [...questionOrders];
    const list2 = list1.splice(half);
    const card = (id: string, index: number) => {
      return questionEditting ? (
        <DragDropCard
          index={index}
          item={{ id }}
          moveCard={changeOrder}
          key={id + '-draggable'}
          moveClassName={styles.moveClassName}
          dragEnd={() => setDragItem({})}
          onClick={() => {
            setDrawerVisible(true);
            setDrawerQuestion(questions?.[id]);
          }}
        >
          {renderCardContent(id)}
        </DragDropCard>
      ) : (
        <div
          key={id + 'fixed'}
          onClick={() => {
            setDrawerVisible(true);
            setDrawerQuestion(questions?.[id]);
          }}
        >
          {renderCardContent(id)}
        </div>
      );
    };
    return (
      <div className={classNames(styles.questionList, { [styles.vertical]: drawerVisible })}>
        <DndComponentProvider>
          <div className={styles.listHalf}>
            {questionOrders.length > 0 && <div className={styles.order}>Question 1-{half}</div>}
            {list1.map((id: string, index: number) => card(id, index))}
          </div>
          {questionOrders.length > 1 && (
            <div className={styles.listHalf}>
              <div className={styles.order}>
                Question {half + 1}-{questionOrders.length}
              </div>
              {list2.map((id: string, index: number) => card(id, index + half))}
            </div>
          )}
        </DndComponentProvider>
      </div>
    );
  };

  /**拖拽改变顺序的方法 */
  function changeOrder(dragIndex: number, hoverIndex: number, item: { id: string }) {
    const backup = [...questionOrders];
    const dragCard = questionOrders[dragIndex];
    backup.splice(dragIndex, 1);
    backup.splice(hoverIndex, 0, dragCard);
    // setQuestionOrders(backup);
    updateSourceData('questionOrders', backup);
    setDragItem(item);
  }

  return (
    <div className={styles.wrapper}>
      {renderOptionBtn()}
      {questionEditting && (
        <div className={styles.tips}>Select to delete or drag to rearrange the sequence</div>
      )}
      {renderCardList()}
      <QuestionDrawer
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        isBatchTrainer={isBatchTrainer}
        drawerQuestion={drawerQuestion}
        afterSave={(temp: any) => {
          const backup = cloneDeep(questions);
          backup[temp.questionId] = temp;
          updateSourceData('questions', backup);
          setDrawerQuestion(backup[temp.questionId]);
        }}
        batchId={batchId}
        taskId={taskId}
        questionOrders={questionOrders}
      />
      <Modal
        getContainer={false}
        title="These questions will be deleted"
        open={deletedModalVisible}
        onCancel={() => setDeletedModalVisible(false)}
        footer={false}
        className={styles.deletedModal}
        width={600}
      >
        <div className={styles.question}>
          {removedQuestionIds.map((id) => renderCardContent(id, true))}
        </div>
        <div className={styles.footer}>
          <SeeButton type="ghost" onClick={() => setDeletedModalVisible(false)}>
            cancel
          </SeeButton>
          <SeeButton
            type="danger"
            onClick={onSave}
            loading={updateQuestionsLoading}
            // disabled={!removedQuestionIds?.length}
          >
            Delete
          </SeeButton>
        </div>
      </Modal>
    </div>
  );
}
