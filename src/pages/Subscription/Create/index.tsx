import React, { useEffect, useMemo, useState } from 'react';
import PageContainer from '@/components/PageContainer';
import styles from './index.less';
import cx from 'classnames';
import { Button, Checkbox, message, Modal } from 'antd';
import type { Moment } from 'moment';
// import moment from 'moment';
import AddSubscriptionUsers from '../components/addSubscriptionUsers';
import type { SelectedUserType, clientType } from '../typeList';
import EditSubscriptionForm from '../components/editSubscriptionForm';
import { CloseOutlined, WarningFilled } from '@ant-design/icons';
import { createSubscription, getClients } from '@/services/question';
import { history } from 'umi';

export default function Create() {
  const [userAdding, setUserAdding] = useState(false); // 是否显示添加学员界面
  const [selectedUsers, setSelectedUsers] = useState<SelectedUserType[]>([]); // 已选择的学员列表
  const [clients, setClients] = useState<string[]>([]); // 已选择的公司列表
  const [subscribeAllClients, setSubscribeAllClients] = useState(true); // 是否全选client
  const [startDate, setStartDate] = useState<Moment>(); // 开始时间
  const [endDate, setEndDate] = useState<Moment>(); // 结束时间选择器中的值
  const [cycle, setCycle] = useState(30); // 持续时间单选框
  const [clientOptions, setClientOptions] = useState({});

  useEffect(() => {
    getClients().then((res: clientType[]) => {
      const options = {};
      for (const item of res) {
        options[item.clientId] = item.name;
      }
      setClientOptions(options);
    });
  }, []);

  function addUsers(users?: SelectedUserType[]) {
    if (users?.length) setSelectedUsers(users);
    setUserAdding(false);
  }

  const formCheck = useMemo(() => {
    return (
      selectedUsers?.length && (clients?.length || subscribeAllClients) && startDate && endDate
    );
  }, [selectedUsers, clients, subscribeAllClients, startDate, endDate]);

  function deleteUser(user: SelectedUserType) {
    setSelectedUsers(selectedUsers.filter((item) => item.userId !== user.userId));
  }

  function onClickNext() {
    const data = {
      users: selectedUsers,
      clients: clients,
      subscribeAllClients: subscribeAllClients,
      startDate: startDate?.utc().format(),
      endDate: endDate?.utc().format(),
      // endDatePicker: endDatePicker?.format(),
    };
    Modal.confirm({
      getContainer: document.getElementById('CreateSubscription') as HTMLElement,
      className: styles.nextModal,
      icon: <WarningFilled />,
      title: <div className={styles.title}>Subscribe to Question Service</div>,
      content: (
        <div className={styles.content}>
          <div className={styles.client}>
            Client:{' '}
            {subscribeAllClients ? 'All Client' : clients.map((i) => clientOptions[i]).join(', ')}.
          </div>
          <div className={styles.users}>
            {~~selectedUsers?.length} Users will be able to view question bank now.
          </div>
        </div>
      ),
      maskClosable: true,
      centered: true,
      width: 600,
      onOk: () =>
        createSubscription(data)
          .then((res) => {
            history.push(`/Subscription/Success/${res}`);
          })
          .catch((err) => message.error(err?.serviceStatus?.errorMessage || 'ERROR!')),
      okText: 'Confirm',
      okButtonProps: { className: styles.confirmButton },
    });
  }
  const renderCreateDom = () => {
    return (
      <div className={styles.wrap} id="CreateSubscription">
        <div className={styles.addUsers}>
          <div className={cx(styles.label, styles.inline)}>Subscription Users</div>
          <Button type="link" className={styles.addUser} onClick={() => setUserAdding(true)}>
            + Add Users
          </Button>
        </div>
        {!!selectedUsers?.length && (
          <div className={styles.added}>
            <div className={styles.label}>Added</div>
            <div>
              {selectedUsers.map((item) => (
                <div className={styles.user} key={item.userId + 'seleted'}>
                  {item.userFirstName} {item.userLastName}
                  <CloseOutlined className={styles.icon} onClick={() => deleteUser(item)} />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.service}>
          <div className={styles.label}>Service</div>
          <Checkbox className={styles.checkBox} checked={true}>
            View All Questions
          </Checkbox>
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
          <Button type="primary" onClick={onClickNext} disabled={!formCheck}>
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <PageContainer>
      {userAdding ? (
        <AddSubscriptionUsers initUsers={selectedUsers} confirmToBack={addUsers} />
      ) : (
        renderCreateDom()
      )}
    </PageContainer>
  );
}
