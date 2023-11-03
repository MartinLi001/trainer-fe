import { useState } from 'react';
import { message, Modal, Tag } from 'antd';
import { useModel } from 'umi';
import Card from './components/ProfileCard';
import CardTitle from '@/components/CardTitle';
import Button from '@/components/SeeButton';
import IconFont from '@/components/IconFont';
import AddressModal from './addressForm';
import BaseInfoForm from './baseInfoForm';
import { RegisterAddresses, RegisterUserInfo } from '@/services/user/interface';
import {
  updateUserInfo,
  updateUserAddress,
  addUserAddress,
  deleteUserAddress,
} from '@/services/user';
import styles from './index.less';
import { WarningOutlined } from '@ant-design/icons';

const userInfoDataConfig = {
  fullName: 'Full Name',
  preferredName: 'Preferred name',
  gender: 'Gender',
  dateOfBirth: 'Birthday',
  email: 'Email',
  phone: 'Phone',
};

const addressDataConfig: Partial<RegisterAddresses> = {
  addressLine1: 'Address line',
  addressLine2: 'Address line 2',
  city: 'City',
  state: 'State',
  zipcode: 'Zipcode',
};

function Profile() {
  const { initialState } = useModel('@@initialState');
  const { updateLocalUserInfo } = useModel('useUser');
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [addressData, setAddressData] = useState<RegisterAddresses>({} as RegisterAddresses);

  const [baseInfoFormVisible, setBaseInfoFormVisible] = useState<boolean>(false);
  const [baseInfoData, setBaseInfoData] = useState<RegisterUserInfo>({} as RegisterUserInfo);

  const [isEdit, setIsEdit] = useState<boolean>();
  const userInfoBaseConfig = {
    title: (
      <CardTitle
        iconFont={<IconFont type="icon-user-3-line" />}
        title="Basic Information"
        extra={
          <span
            className={styles.icon}
            onClick={() => {
              setBaseInfoFormVisible(true);
              setBaseInfoData(initialState as any);
            }}
          >
            <IconFont type="icon-edit-line" />
          </span>
        }
      />
    ),
  };

  const addressBaseConfig = {
    title: <CardTitle iconFont={<IconFont type="icon-key-line" />} title="Addresses" />,
    contentHeader: (data: any) => {
      const renderTag = () =>
        data.isPrimaryAddress ? (
          <Tag
            color="#FFFBEF"
            style={{ color: '#FFB121', height: 20, display: 'flex', alignItems: 'center' }}
          >
            Primary Address
          </Tag>
        ) : (
          <Tag color="green" style={{ height: 20, display: 'flex', alignItems: 'center' }}>
            Secondary Address
          </Tag>
        );

      const onClick = () => {
        setIsEdit(true);
        setAddressData(data);
        setAddressModalVisible(true);
      };

      return (
        <div className={styles.contentHeader}>
          {renderTag()}
          {/* <EditOutlined className={styles.icon} onClick={() => onClick()} /> */}
          {/* <img src={Edit} /> */}
          <span className={styles.icon} onClick={() => onClick()}>
            <IconFont type="icon-edit-line" />
          </span>
        </div>
      );
    },
    contentFooter: (showAddBtn: boolean) => {
      if (showAddBtn) {
        return (
          <div className={styles.contentFooter}>
            <Button
              onClick={() => {
                setIsEdit(false);
                setAddressModalVisible(true);
                setAddressData({} as RegisterAddresses);
              }}
            >
              + New Address
            </Button>
          </div>
        );
      }
      return;
    },
  };

  const updateInfo = (newInfo: any) => {
    return updateUserInfo(newInfo)
      .then(() => {
        updateLocalUserInfo(newInfo);
        message.success('update success');
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const onUpdateAddress = (address: RegisterAddresses) => {
    setConfirmLoading(true);

    updateUserAddress({
      userId: localStorage.userId,
      address,
    })
      .then(() => {})
      .finally(() => {
        const userInfo = JSON.parse(localStorage.userInfo ?? '{}');

        const result = userInfo?.addresses?.map((addressItem: RegisterAddresses) => {
          if (addressItem.addressId === address.addressId) return address;
          return addressItem;
        });

        updateLocalUserInfo({
          ...userInfo,
          addresses: result,
        });

        message.success('update success');
        setAddressModalVisible(false);
        setConfirmLoading(false);
      });
  };

  const deleteFun = ({ addressId }: RegisterAddresses) => {
    setConfirmLoading(true);
    deleteUserAddress({
      address: {
        addressId,
      },
      userId: localStorage.userId,
    })
      .then(() => {
        const userInfo = JSON.parse(localStorage.userInfo ?? '{}');
        const localAddress = userInfo?.addresses;

        const result = localAddress.filter(
          (address: RegisterAddresses) => address.addressId !== addressId,
        );

        updateLocalUserInfo({
          ...userInfo,
          addresses: result,
        });

        message.success('delete success');
        setAddressModalVisible(false);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const onDeleteAddress = (address: RegisterAddresses) => {
    const { isPrimaryAddress } = address;
    Modal.confirm({
      title: `Delete ${isPrimaryAddress ? 'Primary' : 'Secondary'} Address`,
      icon: <WarningOutlined style={{ color: '#F14D4F' }} />,
      width: 600,
      content: 'This action CANNOT be undone. ',
      okText: 'Delete',
      okType: 'primary',
      okButtonProps: {
        danger: true,
        loading: confirmLoading,
      },
      cancelText: 'Cancel',
      onOk() {
        deleteFun(address);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const onCreateAddress = (address: RegisterAddresses) => {
    setConfirmLoading(true);
    addUserAddress({
      userId: localStorage.userId,
      address: {
        ...address,
        isPrimaryAddress: !!!(initialState as any)?.addresses?.length,
      },
    })
      .then(({ userAddress }) => {
        const userInfo = JSON.parse(localStorage.userInfo ?? '{}');
        updateLocalUserInfo({
          ...userInfo,
          addresses: [...userInfo?.addresses, userAddress],
        });
        message.success('add success');
        setAddressModalVisible(false);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const onSave = async (values: RegisterUserInfo, callback: () => void) => {
    setConfirmLoading(true);
    const newInfo = {
      ...values,
      addresses: (initialState as any)?.addresses,
      userId: localStorage.userId,
    };
    try {
      await updateInfo(newInfo);
      callback();
      setBaseInfoFormVisible(false);
      setConfirmLoading(false);
    } catch (error) {}
    setConfirmLoading(false);
  };

  return (
    <div className={styles.profileContent}>
      <Card
        {...userInfoBaseConfig}
        dataSource={initialState as any}
        dataConfig={userInfoDataConfig}
      />
      <Card
        {...addressBaseConfig}
        dataSource={(initialState as any)?.addresses}
        dataConfig={addressDataConfig}
      />

      <BaseInfoForm
        visible={baseInfoFormVisible}
        data={baseInfoData}
        onSave={onSave}
        loading={confirmLoading}
        onCancel={() => setBaseInfoFormVisible(false)}
      />

      <AddressModal
        isEdit={isEdit}
        data={addressData}
        onlyOne={(initialState as any)?.addresses?.length === 1}
        visible={addressModalVisible}
        loading={confirmLoading}
        onUpdate={onUpdateAddress}
        onDelete={onDeleteAddress}
        onCreate={onCreateAddress}
        onCancel={() => {
          setAddressModalVisible(false);
        }}
      />
    </div>
  );
}

export default Profile;
