import React, { useEffect, useRef, useState } from 'react';
import SeeButton from '@/components/SeeButton';
import { Drawer } from 'antd';
import { CloseOutlined, DownOutlined, SaveOutlined, UpOutlined } from '@ant-design/icons';
import styles from './QuestionDrawer.less';
import { saveAndDeleteQuestions } from '@/services/question';
import IconFont from '@/components/IconFont';
import QuestionShow from '../addQuestion/components/questionShow';
import type { DetailValueType } from '@/pages/AddQuestion/typeList';
import ChangeQuestion from '../addQuestion/components/changeQuestion';
import DndComponentProvider, { DragDropCard } from '@/components/DndContainer';
import { cloneDeep } from 'lodash';

interface Props {
  open: boolean;
  onClose: () => void;
  isBatchTrainer: boolean;
  drawerQuestion: any;
  afterSave: (temp: any) => void;
  batchId: string;
  taskId: string;
  questionOrders: string[];
}
export default function QuestionDrawer(props: Props) {
  const {
    open,
    onClose,
    isBatchTrainer,
    drawerQuestion,
    afterSave,
    batchId,
    taskId,
    questionOrders,
  } = props;
  const [changeQuestionValueLoading, setChangeQuestionValueLoading] = useState(false); // question抽屉中编辑按钮的loading状态
  const [changeQuestionFlag, setChangeQuestionFlag] = useState(false); // 抽屉中，是否正在编辑question
  const [groups, setGroups] = useState<DetailValueType[]>([]);
  const [exoandList, setExpandList] = useState<string[]>([]);
  const [editList, setEditList] = useState<string[]>([]);
  const [count, setCount] = useState<number>(new Date().valueOf());
  const changeQuestionRef = useRef<any>({});
  // const refGroup = useRef<any>();
  const [refGroup, setRefGroup] = useState({});

  useEffect(() => {
    if (drawerQuestion?.followUps) {
      setGroups(drawerQuestion?.followUps || []);
      const tempp = { ...refGroup };
      const temp = (drawerQuestion?.followUps || []).map((item: any) => {
        tempp[item.questionId] = React.createRef();
        return item.questionId;
      });
      setRefGroup({ ...tempp });
      setExpandList([...temp]);
    } else {
      setGroups([]);
    }
  }, [drawerQuestion]);

  function changeQuestionValue() {
    const temp = changeQuestionRef.current?.doSomeSave();
    const formatedGroup = cloneDeep(groups);
    formatedGroup.forEach((item) => {
      if (item.resources) {
        item.resources = Object.keys(item.resources).map((id) => item.resources?.[id]);
      }
    });
    const question: any = {
      questionId: temp.questionId,
      weight: temp.weight,
      name: temp.name,
      description: temp.description,
      sampleAnswer: temp.sampleAnswer,
      followUps: formatedGroup,
      acceptUserAnswer: temp.acceptUserAnswer,
    };
    if (temp.resources) {
      question.resources = Object.keys(temp.resources).map((id) => temp.resources?.[id]);
    }
    // if (temp.results)
    //   temp.results = Object.keys(temp.results).map((id) => {
    //     const result = temp.results?.[id];
    //     const payloadComment = temp.results?.[id]?.comment;
    //     if (payloadComment) {
    //       payloadComment.firstname = undefined;
    //       payloadComment.lastname = undefined;
    //       payloadComment.firstName = undefined;
    //       payloadComment.lastName = undefined;
    //       payloadComment.preferredName = undefined;
    //     }
    //     const payloadResult = {
    //       userId: result.userId,
    //       questionId: temp.questionId,
    //       score: result.score,
    //       isBonus: result.isBonus,
    //       comment: payloadComment,
    //       answer: result.userAnswer,
    //       schema: result.schema,
    //       specificData: result.specificData,
    //     };
    //     return payloadResult;
    //   });

    setChangeQuestionValueLoading(true);
    saveAndDeleteQuestions({
      batchId,
      taskId,
      questions: [question],
      questionOrders,
      removedQuestionIds: [],
    })
      .then(() => {
        setChangeQuestionFlag(false);
        setEditList([]);
        afterSave?.(question);
      })
      .finally(() => setChangeQuestionValueLoading(false));
  }

  const showExpand = (id: string) => {
    let temp = [...exoandList];
    if (!exoandList.includes(id)) {
      temp.push(id);
    } else {
      temp = temp.filter((ite) => {
        return ite != id;
      });
    }
    setExpandList([...temp]);
  };
  const addEdit = (id: string) => {
    const temp = [...editList];
    temp.push(id);
    setEditList([...temp]);
  };
  const SaveEdit = (id: string) => {
    let temp = [...editList];
    temp = temp.filter((ite) => {
      return ite != id;
    });
    setEditList([...temp]);
    const value = refGroup[id].current?.doSomeSave();
    let tempB = [...groups];
    tempB = tempB.map((ite) => {
      if (ite.questionId == id) {
        return value;
      } else {
        return ite;
      }
    });
    setGroups([...tempB]);
  };
  const deleteLinkQues = (id: string) => {
    if (groups) {
      let temp = [...groups];
      temp = temp.filter((ite) => {
        return ite.questionId != id;
      });
      setGroups([...temp]);
    }
  };
  const addLinkQues = () => {
    const temp = [...groups];
    temp.push({
      questionId: JSON.stringify(count),
      name: 'Newly Added Question',
      description: {
        renderedContent: '',
        linkedResourceIds: [],
      },
      sampleAnswer: {
        renderedContent: '',
        linkedResourceIds: [],
      },
      followUps: [],
    });
    const tempp = { ...refGroup };
    tempp[JSON.stringify(count)] = React.createRef();
    setRefGroup({ ...tempp });
    const exoand = [...exoandList];
    exoand.push(JSON.stringify(count));
    setExpandList([...exoand]);
    setCount(new Date().valueOf());
    setGroups([...temp]);
    const timmer = setTimeout(() => {
      document.querySelectorAll('.ant-drawer-body')[0].scrollTop = 10000;
      clearTimeout(timmer);
    }, 0);
  };

  const drawerClose = () => {
    onClose?.();
    setChangeQuestionFlag(false);
    setGroups(drawerQuestion?.followUps || []);
    setEditList([]);
  };

  return (
    <Drawer
      open={open}
      // mask={false}
      onClose={drawerClose}
      width={625}
      closable={false}
      destroyOnClose
      bodyStyle={{ backgroundColor: changeQuestionFlag ? '#fff' : '#F8F9FC' }}
      className={styles.drawerWrap}
    >
      <div className={styles.drawerHeader}>
        <CloseOutlined onClick={drawerClose} className={styles.close} />
      </div>
      {changeQuestionFlag ? (
        <SeeButton
          onClick={() => changeQuestionValue()}
          type="primary"
          className={styles.saveChanges}
          loading={changeQuestionValueLoading}
        >
          Save Changes
        </SeeButton>
      ) : (
        <SeeButton
          type="link"
          onClick={() => setChangeQuestionFlag(true)}
          hidden={
            !isBatchTrainer ||
            Object.values(drawerQuestion?.results || {})?.some((trainee: any) => trainee.userAnswer)
          } // 若不是此batch教师则不能编辑, 若学生已提交则不能编辑
          className={styles.editQuestion}
        >
          <IconFont type="icon-edit-line" />
          Edit Question
        </SeeButton>
      )}
      {changeQuestionFlag ? (
        <ChangeQuestion
          value={drawerQuestion as unknown as DetailValueType}
          type={'import'}
          ref={changeQuestionRef}
        />
      ) : (
        <QuestionShow question={drawerQuestion as unknown as DetailValueType} type={'import'} />
      )}
      {groups && groups.length > 0 && (
        <div className={styles.linkQuestionTable}>
          <div className={styles.floow}>Follow-up Question</div>

          <DndComponentProvider>
            {groups.map((item, index) => (
              <DragDropCard
                key={item.questionId + '-card'}
                index={index}
                item={item}
                moveCard={(dragIndex, hoverIndex) => {
                  if (groups && changeQuestionFlag) {
                    const dragCard = groups[dragIndex];
                    const backupList = [...groups];
                    backupList.splice(dragIndex, 1);
                    backupList.splice(hoverIndex, 0, dragCard);
                    setGroups(backupList);
                  }
                }}
                moveClassName={styles.cardMoving}
              >
                <div className={styles.cardDndShow}>
                  <div className={styles.linkCardShow}>
                    <div>
                      {exoandList.includes(item.questionId) ? (
                        <UpOutlined
                          onClick={() => showExpand(item.questionId)}
                          style={{ marginRight: 12 }}
                        />
                      ) : (
                        <DownOutlined
                          onClick={() => showExpand(item.questionId)}
                          style={{ marginRight: 12 }}
                        />
                      )}
                      <span>{item.name}</span>
                    </div>
                    {changeQuestionFlag && (
                      <div className={styles.rightButton}>
                        {!editList.includes(item.questionId) ? (
                          <span
                            onClick={() => addEdit(item.questionId)}
                            className={styles.editButton}
                          >
                            <IconFont type="icon-edit-line" style={{ marginRight: 5 }} /> Edit
                          </span>
                        ) : (
                          <span
                            className={styles.editButton}
                            onClick={() => SaveEdit(item.questionId)}
                          >
                            <SaveOutlined style={{ marginRight: 5 }} />
                            Save{' '}
                          </span>
                        )}
                        <span onClick={() => deleteLinkQues(item.questionId)}>
                          <IconFont type="icon-delete-bin-line" style={{ marginRight: 5 }} />
                          Remove
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={styles.linkShowDetail}>
                    <div hidden={!exoandList.includes(item.questionId)}>
                      {editList.includes(item.questionId) ? (
                        <ChangeQuestion
                          value={item}
                          type="link"
                          ref={refGroup[item.questionId]}
                          key={item.questionId}
                        />
                      ) : (
                        <QuestionShow question={item} type="link" key={item.questionId} />
                      )}
                    </div>
                  </div>
                </div>
              </DragDropCard>
            ))}
          </DndComponentProvider>
        </div>
      )}
      {changeQuestionFlag && (
        <SeeButton type="link" onClick={() => addLinkQues()}>
          {' '}
          Follow-up Question <IconFont type="icon-add-line" />{' '}
        </SeeButton>
      )}
    </Drawer>
  );
}
