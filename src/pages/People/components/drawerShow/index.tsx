import CardTitle from '@/components/CardTitle';
import IconFont from '@/components/IconFont';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Drawer, Dropdown, Menu, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { PeopleType, SubscriptionsType } from '../../typeList';
import { addSummary, updateSummary, deleteSummary } from '@/services/kpi';
import { getSubscription } from '@/services/people';
import style from './index.less';
import { FeedbackType } from '@/pages/Kpi/detail/typeList';
import FeedBackModal from '@/pages/Kpi/detail/componts/FeedBackModal';
import { date2desc } from '@/utils';
import TagShow from '@/components/TagShow';
import moment from 'moment';
import { getUserAvatar } from '@/services/user';
import { useModel } from 'umi';

export interface userShowDrawer {
  user: PeopleType;
  visible: boolean;
  batch: API.AllBatchType;
  onClose?: () => void;
  getData: (id: string) => void;
}
function DrawerShow({ user, batch, visible, onClose, getData }: userShowDrawer) {
  const [data, setData] = useState<PeopleType>({} as PeopleType);
  const { initialState } = useModel('@@initialState');
  const userId = initialState?.userId;
  const [modalValue, setModalValue] = useState<FeedbackType>({} as FeedbackType);
  const [openModal, setOpenModal] = useState(false);
  // const [subscriptions, setSubscrioptions] = useState<SubscriptionsType[]>();
  const [avatarSrc, setAvatar] = useState<string>();

  useEffect(() => {
    setData(user || ({} as PeopleType));
    // getSubscription(user.userId).then((res) => {
    //   setSubscrioptions(res);
    // });
    // getUserAvatar(user.userId).then((avatar: Blob) =>
    //   setAvatar(URL.createObjectURL(avatar) as string),
    // );
  }, [user]);

  const editOrSaveFeed = (dataFeed: FeedbackType) => {
    const dataValue = {
      userId: data.userId,
      summary: { ...dataFeed },
      batchId: batch.batchId,
    };
    if (dataFeed.summaryId) {
      updateSummary(dataValue).then(() => {
        message.success('update Success');
        getData(data.userId);
      });
    } else {
      addSummary(dataValue).then(() => {
        message.success('add Success');
        getData(data.userId);
      });
    }
    setModalValue({} as FeedbackType);
    setOpenModal(false);
  };
  const renderTag = (title: string, value: string) => {
    return (
      <div className={style.textBlock}>
        <div className={style.title}> {title}</div>
        <div className={style.value}>{value}</div>
      </div>
    );
  };
  const editFeed = (value: FeedbackType) => {
    setModalValue({ ...value });
    setOpenModal(true);
  };
  const deleteFeed = (value: FeedbackType) => {
    Modal.confirm({
      title: 'Delete Feedback',
      content: (
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, lineHeight: '26px' }}>
            Are you sure of deleting the feedback?
          </p>
          <p>This action CANNOT be undone.</p>
        </div>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk() {
        const submitData = {
          userId: data.userId,
          batchId: batch.batchId,
          summaryId: value.summaryId,
        };
        deleteSummary(submitData).then(() => {
          message.success('delete success');
          getData(data.userId);
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const renderMenu = (item: FeedbackType) => {
    const menuItems = [
      {
        label: <a onClick={() => editFeed(item)}>edit</a>,
        key: 'edit',
      },
      {
        label: <a onClick={() => deleteFeed(item)}>delete</a>,
        key: 'delete',
      },
    ];
    return <Menu items={menuItems} />;
  };

  return (
    <>
      <Drawer
        placement="right"
        closable={false}
        onClose={onClose}
        open={visible}
        className={style.drawerModal}
        width={650}
        //
      >
        <div className={style.drawerShow}>
          <div className={style.drawerTitle}>
            <div className={style.left}>
              <div>
                <Avatar
                  style={{
                    backgroundColor: '#87d068',
                    width: 80,
                    height: 80,
                    verticalAlign: 'middle',
                  }}
                  src={avatarSrc}
                  // src="https://joeschmoe.io/api/v2/trainer/random"
                >
                  {/* {data?.firstName?.slice(0, 1).toUpperCase()} */}
                </Avatar>
                <div className={style.name}>
                  {data?.firstName}
                  {data?.lastName}
                </div>
                <div className={style.Pref}>{data?.preferredName}</div>
                <div className={style.botomtext}>{data?.phone}</div>
                <div className={style.botomtext}>{data?.email}</div>
              </div>
              {/* <SeeButton type="primary">View Full Profile</SeeButton> */}
            </div>
            <div className={style.center}>
              {renderTag('Company', data?.company?.companyName)}
              <div className={style.textBlock}>
                <div className={style.title}> Status</div>
                <div className={style.statusValue}>{data?.status} </div>
              </div>
              {renderTag('Batch', batch.name)}
            </div>
            <div className={style.right}>
              {renderTag('Account Manager', '')}
              {renderTag('Plan', '')}
              {renderTag('Batch Start Date', batch.startDate)}
            </div>
          </div>
          <div className={style.showContent}>
            {/* {subscriptions && subscriptions.length > 0 && (
              <div className={style.Subscriptions}>
                <CardTitle
                  title={'Subscriptions'}
                  iconFont={<IconFont type="icon-wallet-membership" />}
                  // extra={<PlusOutlined onClick={() => setOpenModal(true)} />}
                />
                {(subscriptions || []).map((ite: SubscriptionsType) => {
                  return (
                    <div className={style.subscriptionOnes} key={ite.subscriptionId}>
                      <CardTitle title={ite.name} />
                      <div className={style.subClient}>
                        <span className={style.ClientName}>Client</span>
                        <TagShow list={ite.targets} />
                      </div>
                      <div className={style.subDetail}>
                        {renderTag('Start Date', moment(ite.startDate).format('MM/DD/YYYY'))}
                        {renderTag('Period', ite.daysLeft.toString())}
                        <div className={style.textStatus}>
                          <div className={style.title}> Status</div>
                          <div className={style.value}>{ite.status}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )} */}
            <div className={style.drawerSummaries}>
              <CardTitle
                title={'Recent Feedback'}
                iconFont={<IconFont type="icon-file-list-3-line" />}
                extra={<PlusOutlined onClick={() => setOpenModal(true)} />}
              />
              {(data?.summaries || []).map((item) => {
                return (
                  <div className={style.summareOnes} key={item.summaryId} id={'drawerModal'}>
                    <CardTitle
                      title={`Overall suggestion`}
                      extra={
                        item.userId === userId ? (
                          <Dropdown
                            overlay={renderMenu(item)}
                            trigger={['click']}
                            placement="bottomLeft"
                            getPopupContainer={(e) => e.parentNode as HTMLElement}
                          >
                            <span style={{ marginLeft: 20 }} onClick={(e) => e.preventDefault()}>
                              <MoreOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
                            </span>
                          </Dropdown>
                        ) : (
                          ''
                        )
                      }
                    />
                    <div className={style.overall}>
                      <div className={style.title}>
                        <div className={style.byOther}>
                          by
                          <span style={{ color: '#2875D0' }}>
                            {item.userId === userId
                              ? '  me'
                              : ` ${item.reviewer?.firstName} ${item.reviewer?.lastName} `}
                          </span>
                        </div>
                        <div className={style.commData}>
                          {' '}
                          {date2desc(item?.createdDateTime || '')}
                        </div>
                      </div>
                      <div className={style.detail}>{item.overall}</div>
                    </div>
                    {(item.details || []).map((ite) => {
                      return renderTag(ite.name, ite.value);
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ) : (
            <div className={style.noFeed}>No Feedback Available</div>
          )} */}
        </div>
        {openModal && (
          <FeedBackModal
            visible={openModal}
            data={modalValue}
            onClose={() => {
              setOpenModal(false);
              setModalValue({} as FeedbackType);
            }}
            onOk={(e) => editOrSaveFeed(e)}
            userId={userId}
          />
        )}
      </Drawer>
    </>
  );
}

export default DrawerShow;
