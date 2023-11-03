import IconFont from '@/components/IconFont';
import SeeButton from '@/components/SeeButton';
import { DetailValueType } from '@/pages/AddQuestion/typeList';
import { Drawer } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import QuestionShow from '../questionShow';
import ChangeQuestionDetail from '../changeQuestion/index';
import DndComponentProvider, { DragDropCard } from '@/components/DndContainer';
import style from './index.less';
import { DownOutlined, SaveOutlined, UpOutlined } from '@ant-design/icons';

export interface userShowDrawer {
  question?: DetailValueType;
  visible: boolean;
  onClose?: () => void;
  onSave?: (value: DetailValueType) => void;
}
function QuestionShowChange({ question, visible, onClose, onSave }: userShowDrawer) {
  const [data, setData] = useState<DetailValueType>({} as DetailValueType);
  const [type, setType] = useState<boolean>(false);
  const ref = useRef<any>({});
  // const refGroup = useRef<any>();
  const [refGroup, setRefGroup] = useState({});
  const [groups, setGroups] = useState<DetailValueType[]>([]);
  const [exoandList, setExpandList] = useState<string[]>([]);
  const [count, setCount] = useState<number>(new Date().valueOf()); // count需要为唯一的值，每次setCount时赋一个新的时间戳
  const [editList, setEditList] = useState<string[]>([]);
  useEffect(() => {
    if (question) setData(question);
    if (question?.linkedQuestions) {
      setGroups(question?.linkedQuestions || []);
      const tempp = { ...refGroup };
      const temp = (question?.linkedQuestions || []).map((item) => {
        tempp[item.questionId] = React.createRef();
        return item.questionId;
      });
      setRefGroup({ ...tempp });
      setExpandList([...temp]);
    }
  }, [question]);

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
  const saveValue = () => {
    const temp = ref.current?.doSomeSave();
    temp.followUps = [...groups];
    temp.linkedQuestions = [...groups];
    if (onSave) onSave(temp);
    setType(!type);
    setEditList([]);
  };
  const showExpand = (id: string, flag?: boolean) => {
    if (flag && editList.includes(id)) {
      SaveEdit(id);
    }
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
      linkedQuestions: [],
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
  return (
    <>
      <Drawer
        placement="left"
        onClose={onClose}
        open={visible}
        className={style.drawerModal}
        getContainer={false}
        width={'60%'}
      >
        <div className={style.showChangePage}>
          <div className={style.importQuestion}>
            <div className={style.quesShow}>
              {!type ? (
                <QuestionShow question={data} type="import" />
              ) : (
                <ChangeQuestionDetail value={data} ref={ref} type="import" />
              )}
            </div>
            <div className={style.saveButton}>
              {!type && (
                <SeeButton type="link" onClick={() => setType(!type)}>
                  {' '}
                  <IconFont type="icon-edit-line" style={{ marginRight: 5 }} />
                  Edit Question
                </SeeButton>
              )}
              {type && (
                <SeeButton onClick={() => saveValue()} type="primary">
                  Save Changes
                </SeeButton>
              )}
            </div>
          </div>
          {groups && groups.length > 0 && (
            <div className={style.linkQuestionTable}>
              <div className={style.floow}>Follow-up Question</div>

              <DndComponentProvider>
                {(groups || []).map((item, index) => (
                  <DragDropCard
                    key={item.questionId + '-card'}
                    index={index}
                    item={item}
                    moveClassName={style.moveClassName}
                    moveCard={(dragIndex, hoverIndex) => {
                      if (groups && type) {
                        const dragCard = groups[dragIndex];
                        const backupList = [...groups];
                        backupList.splice(dragIndex, 1);
                        backupList.splice(hoverIndex, 0, dragCard);
                        setGroups(backupList);
                      }
                    }}
                  >
                    <div className={style.cardDndShow}>
                      <div className={style.linkCardShow}>
                        <div>
                          {exoandList.includes(item.questionId) ? (
                            <UpOutlined
                              onClick={() => showExpand(item.questionId, true)}
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
                        {type && (
                          <div className={style.rightButton}>
                            {!editList.includes(item.questionId) ? (
                              <span
                                onClick={() => addEdit(item.questionId)}
                                className={style.editButton}
                              >
                                <IconFont type="icon-edit-line" style={{ marginRight: 5 }} /> Edit
                              </span>
                            ) : (
                              <span
                                className={style.editButton}
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
                      <div className={style.linkShowDetail}>
                        <div hidden={!exoandList.includes(item.questionId)}>
                          {editList.includes(item.questionId) ? (
                            <ChangeQuestionDetail
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
          {type && (
            <SeeButton type="link" onClick={() => addLinkQues()}>
              {' '}
              Follow-up Question <IconFont type="icon-add-line" />{' '}
            </SeeButton>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default QuestionShowChange;
