import React, { useEffect, useState } from 'react';
import style from './index.less';
import { history, useLocation } from 'umi';
import type { PeopleType } from './typeList';
import ListPeople from './components/ListItem';
import DeleteModal from './components/deleteModal';
import { getUserList, deleteTrainee, deleteTrainer } from '@/services/people';
import SeeButton from '@/components/SeeButton';
import DrawerShow from './components/drawerShow';
import { message, Spin } from 'antd';

export interface ComPropsType {
  data: API.AllBatchType;
  sort?: string;
  callBack?: (batchId: string) => void;
}
function People({ data, callBack }: ComPropsType) {
  const { pathname, query } = useLocation() as any;
  const [trainees, setTrainees] = useState<PeopleType[]>([]);
  const [trainers, setTrainers] = useState<PeopleType[]>([]);
  const [removeTrainee, setRemoveTraiee] = useState<boolean>(false);
  const [removeTrainer, setRemoveTraier] = useState<boolean>(false);
  const [removeTraineeList, setRemoveTraieeList] = useState<string[]>([]);
  const [removeTrainerList, setRemoveTraierList] = useState<string[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deleteList, setDeleteList] = useState<PeopleType[]>([]);
  const [deleteType, setDeleteType] = useState<string>('');
  const [drawerShowVisible, setDrawerShowVisible] = useState<boolean>(false);
  const [drawerUser, setDrawerUser] = useState<PeopleType>({} as PeopleType);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setRemoveTraiee(false);
    setRemoveTraier(false);
    setRemoveTraieeList([]);
    setRemoveTraierList([]);
    setDeleteList([]);
    if (data && Object.keys(data).length > 0) {
      setTrainees(data?.trainees || []);
      setTrainers(data?.trainers || []);

      const ids = ([...data?.trainers, ...data?.trainees] || []).map((item) => {
        return item.userId;
      });
      setLoading(true);
      getUserList({ idList: ids })
        .then((res) => {
          const len = data?.trainers.length;
          const tempee = res.splice(0, len);
          const temper = res.splice(res.lenth - len);
          setTrainers(tempee);
          setTrainees(temper);
        })
        .catch((error) => {
          console.log('%cindex.tsx line:52 error', 'color: #007acc;', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [data]);

  const updateUserData = (id: string) => {
    getUserList({ idList: [id] }).then((res) => {
      let tempee = [...trainees];
      let temper = [...trainers];
      tempee = tempee.map((item) => {
        if (item.userId == id) {
          return res[0];
        } else {
          return item;
        }
      });
      temper = temper.map((item) => {
        if (item.userId == id) {
          return res[0];
        } else {
          return item;
        }
      });
      setTrainees([...tempee]);
      setTrainers([...temper]);
      setDrawerUser(res[0]);
    });
  };

  const deleteValue = (type: string) => {
    if (type == 'Trainee') {
      const temp = trainees.filter((ite) => {
        return removeTraineeList.includes(ite.userId);
      });
      setDeleteList([...temp]);
    } else {
      const temp = trainers.filter((ite) => {
        return removeTrainerList.includes(ite.userId);
      });
      setDeleteList([...temp]);
    }
    setDeleteType(type);
    setDeleteModalVisible(true);
  };
  const DeleteOk = (type: string) => {
    if (type == 'Trainee') {
      deleteTrainee({
        batchId: data.batchId,
        personIds: removeTraineeList,
      }).then(() => {
        message.success('delete success');
        setDeleteModalVisible(false);
        if (callBack) callBack(data.batchId);
      });
    } else {
      deleteTrainer({
        batchId: data.batchId,
        personIds: removeTrainerList,
      }).then(() => {
        message.success('delete success');
        setDeleteModalVisible(false);
        if (callBack) callBack(data.batchId);
      });
    }
  };
  const onclickPeople = (user: PeopleType) => {
    setDrawerUser(user);
    setDrawerShowVisible(true);
  };

  const AddNewPeople = (type: string) => {
    const isMybatch = pathname.startsWith('/myBatch');

    history.push({
      pathname: `${isMybatch ? '/myBatch' : '/Category/Batches/tasks'}/people/${type}/${
        data.batchId
      }/${data.name}`,
      query,
    });
  };
  return (
    <div className={style.PeoplePage}>
      <Spin spinning={loading}>
        <div className={style.PeopleTrainer}>
          <div className={style.PeopleTraineeTitle}>
            <div className={style.PeopleTitle}>Trainers ({trainers.length})</div>
            {!removeTrainer ? (
              <div>
                <SeeButton
                  onClick={() => {
                    setRemoveTraier(true);
                  }}
                >
                  - Remove Trainer
                </SeeButton>
                <SeeButton style={{ marginLeft: 12 }} onClick={() => AddNewPeople('Trainer')}>
                  + Add Trainer
                </SeeButton>
              </div>
            ) : (
              <div>
                <span className={style.SlectChoose}>{removeTrainerList.length} Selected</span>
                <SeeButton
                  style={{ marginLeft: 12 }}
                  onClick={() => {
                    setRemoveTraier(false);
                  }}
                >
                  Cancel
                </SeeButton>
                <SeeButton
                  style={{ marginLeft: 12 }}
                  type="danger"
                  onClick={() => deleteValue('Trainer')}
                  disabled={removeTrainerList.length == 0}
                >
                  Remove Trainer Now
                </SeeButton>
              </div>
            )}
          </div>

          <ListPeople
            data={[...trainers]}
            type="trainer"
            chooseShow={removeTrainer}
            chooseList={removeTrainerList}
            onChoose={(e) => {
              setRemoveTraierList([...e]);
            }}
            onClick={onclickPeople}
          />
        </div>
        <div className={style.PeopleTrainee}>
          <div className={style.PeopleTraineeTitle}>
            <div className={style.PeopleTitle}>Trainees ({trainees.length})</div>
            {!removeTrainee ? (
              <div>
                <SeeButton
                  onClick={() => {
                    setRemoveTraiee(true);
                  }}
                >
                  - Remove Trainee
                </SeeButton>
                <SeeButton style={{ marginLeft: 12 }} onClick={() => AddNewPeople('Trainee')}>
                  + Add Trainee
                </SeeButton>
              </div>
            ) : (
              <div>
                <span className={style.SlectChoose}>{removeTraineeList.length} Selected</span>
                <SeeButton
                  style={{ marginLeft: 12 }}
                  onClick={() => {
                    setRemoveTraiee(false);
                  }}
                >
                  Cancel
                </SeeButton>
                <SeeButton
                  style={{ marginLeft: 12 }}
                  type="danger"
                  onClick={() => deleteValue('Trainee')}
                  disabled={removeTraineeList.length == 0}
                >
                  Remove Trainee Now
                </SeeButton>
              </div>
            )}
          </div>
          <ListPeople
            data={[...trainees]}
            chooseShow={removeTrainee}
            onChoose={(e) => setRemoveTraieeList([...e])}
            chooseList={removeTraineeList}
            onClick={onclickPeople}
          />
        </div>
        {deleteModalVisible && (
          <DeleteModal
            visible={deleteModalVisible}
            list={deleteList}
            type={deleteType}
            onClose={() => setDeleteModalVisible(false)}
            onOk={DeleteOk}
          />
        )}
        {drawerShowVisible && (
          <DrawerShow
            visible={drawerShowVisible}
            batch={data}
            onClose={() => setDrawerShowVisible(false)}
            user={drawerUser}
            getData={updateUserData}
          />
        )}
      </Spin>
    </div>
  );
}

export default People;
