import { Modal } from 'antd';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import Tabs, { TabsItemType } from '../Tabs';
import SeeButton from '@/components/SeeButton';
import { attendantsType, mockGroupsType, TaskResponse } from '@/pages/Task/mock/typeList';

import styles from './index.less';

export default function SetAbsenteModal({
  loading,
  open,
  data,
  onCancel = () => {},
  onSave = () => {},
}: {
  open: boolean;
  loading: boolean;
  data: TaskResponse;
  onCancel: () => void;
  onSave: (users: attendantsType[]) => void;
}) {
  const [tabsData, setTabsData] = useState<TabsItemType[]>([]);
  const [activeKey, setActiveKey] = useState('');
  const [users, setUsers] = useState<attendantsType[]>([]);

  useEffect(() => {
    if (!open) return;
    const trainers = data?.mockGroups
      ?.filter((item) => !item.isMakeUpMockGroup)
      ?.reduce((result, current) => {
        const { firstname, firstName } = current?.host as attendantsType;
        result.push({
          label: firstname ?? firstName,
          key: current.mockGroupId as string,
        });
        return result;
      }, [] as TabsItemType[]);

    if (data?.attendants?.length) {
      setUsers([...data?.attendants]);
    } else {
      setUsers([]);
    }

    setTabsData(trainers);
    setActiveKey(trainers?.[0]?.key);
  }, [data, open]);

  const currentGroup = useMemo(() => {
    return (data?.mockGroups?.find((group) => group.mockGroupId === activeKey) ??
      {}) as mockGroupsType;
  }, [activeKey, data]);

  const onSelectUser = (trainee: attendantsType) => {
    if (users.find((user) => user.userId === trainee.userId)) {
      const index = users.findIndex((user) => user.userId === trainee.userId);
      users.splice(index, 1);
      setUsers([...users]);
      return;
    }
    setUsers([
      ...users,
      {
        ...trainee,
        status: 'Absent',
      },
    ]);
  };

  return (
    <Modal
      title="Manage Absentee List"
      open={open}
      width={600}
      onCancel={onCancel}
      style={{ minHeight: 340 }}
      footer={[
        <SeeButton key="Cancel" onClick={onCancel}>
          Cancel
        </SeeButton>,
        <SeeButton key="Save" type="primary" loading={loading} onClick={() => onSave(users)}>
          Save
        </SeeButton>,
      ]}
    >
      <div style={{ margin: '0 auto', maxWidth: '90%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Trainer:
          <div style={{ overflowX: 'auto', marginLeft: 25, padding: '10px 0' }}>
            <Tabs
              data={tabsData}
              activeKey={activeKey}
              onChange={(item) => setActiveKey(item.key)}
            />
          </div>
        </div>
        <p className={styles.label}>Select trainee to mark as absent</p>
        <ul className={styles.list}>
          {currentGroup?.trainees?.map((trainee) => {
            const hasUer = users.find(
              (user) => trainee.userId === user.userId && user.status === 'Absent',
            );
            return (
              <li
                key={trainee.userId}
                className={classNames({
                  [styles.selected]: hasUer,
                })}
                onClick={() => {
                  onSelectUser(trainee);
                }}
              >
                {trainee.firstname ?? trainee.firstName}
                {hasUer && <span style={{ color: '#F14D4F', marginLeft: 5 }}>(Absent)</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}
