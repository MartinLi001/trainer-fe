import { Modal, DatePicker, Form, Empty, Tooltip } from 'antd';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import { useUpdateEffect } from 'ahooks';
import { useEffect, useState } from 'react';
import { ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { attendantsType, mockGroupsType, TaskResponse } from '../../../../mock/typeList';
import SeeButton from '@/components/SeeButton';
import { getUserName } from '@/utils';
import styles from './index.less';

export default function MemberBlock({
  mockGroup,
  data,
}: {
  mockGroup: mockGroupsType;
  data: TaskResponse;
}) {
  return (
    <>
      <div className={styles.title}>Member</div>
      <ul className={styles.list}>
        {(mockGroup?.trainees as any)?.length > 0 &&
          mockGroup?.trainees?.map((trainee) => {
            const isAbsent = data?.attendants?.find(
              (user) => user.userId === trainee.userId && user.status === 'Absent',
            );
            return (
              <Tooltip placement="top" title={getUserName(trainee, true)}>
                <li
                  key={trainee.userId}
                  className={classNames({
                    [styles.userName]: true,
                    [styles.isAbsent]: isAbsent,
                  })}
                >
                  {getUserName(trainee, false, true)}
                  {isAbsent && <span style={{ color: '#FF522C', marginLeft: 5 }}>(absent)</span>}
                </li>
              </Tooltip>
            );
          })}
      </ul>
    </>
  );
}

export const AllAbsenteesBlock = ({
  data,
  isAll,
  trainees,
  onCreateAbsent,
}: {
  isAll: boolean;
  data: TaskResponse;
  trainees: attendantsType[];
  onCreateAbsent: () => void;
}) => {
  return (
    <>
      <div className={styles.title}>
        {isAll ? 'All Absentees' : 'Absentees'}
        {
          // data?.mockGroups && data.mockGroups.some((group) => group.status !== 'Graded') &&
          trainees?.length > 0 && isAll && (
            <span className={styles.extra} onClick={onCreateAbsent}>
              <PlusOutlined /> Create Absentee’s Mock Group
            </span>
          )
        }
      </div>
      {trainees?.length > 0 ? (
        <ul className={styles.list}>
          {trainees?.map((trainee) => {
            return (
              <Tooltip placement="top" title={getUserName(trainee, true)}>
                <li
                  key={trainee.userId}
                  className={classNames({
                    [styles.userName]: true,
                    [styles.isAbsent]: isAll,
                  })}
                >
                  {getUserName(trainee, false, true)}
                </li>
              </Tooltip>
            );
          })}
        </ul>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
};

function SetMemberTime({
  group,
  open,
  loading,
  onOk,
  onCancel,
}: {
  group: mockGroupsType;
  open: boolean;
  loading: boolean;
  onOk: (values: { startTime: Moment }) => void;
  onCancel: () => void;
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (group && group.startTime) {
      form.setFieldsValue({
        startTime: moment(group.startTime),
      });
      return;
    }
    form.resetFields();
  }, [group]);

  return (
    <Modal
      title={
        <>
          Edit Mock Time for{' '}
          <span style={{ color: '#2875D0' }}>
            {group.trainees?.[0].firstName} {group.trainees?.[0].lastName}
          </span>
        </>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <SeeButton onClick={onCancel} key="cancel">
          Cancel
        </SeeButton>,
        <SeeButton
          key="save"
          type="primary"
          loading={loading}
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                onOk(values);
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}
        >
          Save
        </SeeButton>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="startTime" name="startTime" required>
          {/* @ts-ignore */}
          <DatePicker showTime use12Hours />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export const IndividualMemberBlock = ({
  activeKey,
  data,
  onSave,
  loading,
  goDetailPage,
}: {
  loading: boolean;
  activeKey: string;
  data: TaskResponse;
  goDetailPage: (oneOnOneTraineeId: string) => void;
  onSave: (resultGroups: mockGroupsType[], editGroup: mockGroupsType, startTime: string) => void;
}) => {
  const [groups, setGroups] = useState<mockGroupsType[]>();
  const [editGroup, setEditGroup] = useState<mockGroupsType>({});
  const [open, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    setGroups(
      data?.mockGroups?.filter((group) => {
        // return (group?.host as attendantsType)?.userId === activeKey)
        // return group.mockGroupId === activeKey;
        return (group?.host as attendantsType)?.userId === activeKey;
      }),
    );
  }, [activeKey, data]);

  useUpdateEffect(() => {
    setEditGroup({});
    setOpenModal(false);
  }, [data]);

  const onOk = ({ startTime }: { startTime: Moment }) => {
    const resultGroups: any = data.mockGroups?.map((groupItem) => {
      if (editGroup?.mockGroupId === groupItem.mockGroupId) {
        return {
          ...groupItem,
          host: (groupItem?.host as attendantsType)?.userId as string,
          traineeIds: groupItem.trainees?.map((trainee) => trainee.userId),
          startTime: startTime.format('YYYY-MM-DDTHH:mm:ss'),
        };
      }
      return {
        ...groupItem,
        host: (groupItem?.host as attendantsType)?.userId as string,
        traineeIds: groupItem.trainees?.map((trainee) => trainee.userId),
      };
    });
    onSave(resultGroups, editGroup, startTime.format('YYYY-MM-DDTHH:mm:ss'));
  };

  return (
    <>
      <SetMemberTime
        loading={loading}
        open={open}
        group={editGroup}
        onOk={onOk}
        onCancel={() => {
          setOpenModal(false);
        }}
      />
      {/* <div style={{ marginLeft: -5 }}> */}
      {groups?.map((groupItem) => {
        return (
          <div
            // xl={{ span: 12 }}
            // lg={24}
            // md={{ span: 24 }}
            // sm={{ span: 24 }}
            key={groupItem.mockGroupId}
            style={{ float: 'left', margin: '8px 5px' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <Tooltip
                placement="top"
                title={getUserName(groupItem?.trainees?.[0] as attendantsType, true)}
              >
                <div
                  style={{ width: 136 }}
                  className={styles.userName}
                  onClick={() => goDetailPage(groupItem.mockGroupId as string)}
                >
                  {getUserName(groupItem?.trainees?.[0] as attendantsType, false, true)}
                </div>
              </Tooltip>
              <div style={{ flex: 1 }}>
                {/* {editGroup?.mockGroupId === groupItem?.mockGroupId ? (
                    // @ts-ignore
                    <DatePicker showTime onOk={onOk} value={moment(groupItem.startTime)} />
                  ) : } */}
                {groupItem?.startTime ? (
                  <div
                    className={styles.clockItem}
                    onClick={() => {
                      setEditGroup(groupItem);
                      setOpenModal(true);
                    }}
                  >
                    <ClockCircleOutlined style={{ marginRight: 5 }} />
                    <span style={{ cursor: 'pointer' }}>
                      {moment(groupItem?.startTime).format('hh:mmA MM/DD')}
                    </span>
                  </div>
                ) : (
                  <div
                    className={styles.clockItem}
                    onClick={() => {
                      setEditGroup(groupItem);
                      setOpenModal(true);
                    }}
                  >
                    <ClockCircleOutlined style={{ marginRight: 5 }} />
                    <span style={{ cursor: 'pointer' }}>add a timeslot</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {/* </div> */}
    </>
  );
};
