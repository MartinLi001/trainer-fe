import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '@/components/PageContainer';
import styles from '../Create/index.less';
import EditSubscriptionForm from '../components/editSubscriptionForm';
import moment, { Moment } from 'moment';
import { Button, message } from 'antd';
import type { SelectedUserType } from '../typeList';
import { history, useParams } from 'umi';
import { updateSubscription } from '@/services/question';

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const [selectedUser, setSelectedUser] = useState<SelectedUserType>({} as SelectedUserType); // 已选择的学员列表
  const [clients, setClients] = useState<string[]>([]); // 已选择的公司列表
  const [subscribeAllClients, setSubscribeAllClients] = useState(true); // 是否全选client
  const [startDate, setStartDate] = useState<Moment>(); // 开始时间
  const [endDate, setEndDate] = useState<Moment>(); // 结束时间选择器中的值
  const [cycle, setCycle] = useState(0); // 持续时间单选框
  const [updateLoading, setupdateLoading] = useState(false);

  useEffect(() => {
    const data: any = history.location.state;
    if (!data) {
      history.push(`/Subscription`);
      return;
    }
    setSelectedUser(data.userInfo ? data.userInfo : {});
    setClients(data.subscribeAllClients ? [] : data.clients?.map((i: any) => i.clientId) || []);
    setSubscribeAllClients(data.subscribeAllClients);
    setStartDate(moment(data.startDate, 'MM/DD/YYYY').startOf('D'));
    setEndDate(moment(data.endDate, 'MM/DD/YYYY').endOf('D'));
    setCycle([30, 60, 90].includes(data.cycle) ? data.cycle : 0);
  }, [history]);

  const formCheck = useMemo(() => {
    return (clients?.length || subscribeAllClients) && startDate && endDate;
  }, [clients, subscribeAllClients, startDate, endDate]);

  function onClickUpdate() {
    const data: any = history.location.state || {};
    const sourceClients =
      data.clients?.map((i: any) => i.clientId).filter((i: any) => i !== 'All Client') || [];
    const param = {
      user: selectedUser,
      subscriptionId: id,
      addedClients: clients.filter((item) => !sourceClients.includes(item)),
      removedClients: sourceClients.filter((item: any) => !clients.includes(item)),
      subscribeAllClients: subscribeAllClients,
      startDate: startDate?.utc().format(),
      endDate: endDate?.utc().format(),
    };
    setupdateLoading(true);
    updateSubscription(param)
      .then(() => {
        history.push(`/Subscription`);
      })
      .catch((err) => message.error(err?.serviceStatus?.errorMessage || 'ERROR!'))
      .finally(() => setupdateLoading(false));
  }

  return (
    <PageContainer>
      <div className={styles.wrap}>
        <div className={styles.added}>
          <div className={styles.label}>Subscription User</div>
          <div>
            <div className={styles.user} key={selectedUser.userId + 'seleted'}>
              {selectedUser.userFirstName} {selectedUser.userLastName}
            </div>
          </div>
        </div>
        <EditSubscriptionForm
          clients={clients}
          setClients={setClients}
          subscribeAllClients={subscribeAllClients}
          setSubscribeAllClients={setSubscribeAllClients}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          startDate={startDate}
          endDate={endDate}
          cycle={cycle}
          setCycle={setCycle}
        />
        <div className={styles.buttons}>
          <Button onClick={() => history.goBack()}>Cancel</Button>
          <Button
            type="primary"
            onClick={onClickUpdate}
            disabled={!formCheck}
            loading={updateLoading}
          >
            Update
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
