import React, { useEffect, useState } from 'react';
import styles from './Box.less';
import {
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
  SearchOutlined,
  WarningFilled,
} from '@ant-design/icons';
import { Input, Modal, Spin } from 'antd';
import SeeButton from '@/components/SeeButton';
import { useDebounceFn } from 'ahooks';
import SectionMessage from '@/components/SectionMessage';

/**
 * @param {string} type 'topic' | 'tag' | 'client'
 * @param {Function} initFunc 初始化列表的方法,传进来是为了在组件内管理loading状态
 * @param {Array} list 数据列表
 * @param {ReactNode} title icon
 * @param {Function} clickCreate 点击创建新标签的方法
 * @param {Function} onRemove 删除标签的方法
 * @param {Function} onSearch 搜索标签的方法
 */
interface BoxI {
  type: 'topic' | 'tag' | 'client';
  initFunc: () => Promise<void>;
  list: TagManagementI.TagItemI[];
  icon: React.ReactNode;
  clickCreate: () => void;
  onRemove: (id: string) => Promise<void>;
  onSearch?: (term: string) => Promise<void>;
}
export default function Box({ type, initFunc, list, icon, clickCreate, onRemove, onSearch }: BoxI) {
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [noResultText, setNoResultText] = useState(`No ${type}s added yet`);
  const [searchError, setSearchError] = useState('');
  useEffect(() => {
    setLoading(true);
    initFunc?.()?.finally(() => {
      setLoading(false);
    });
  }, [initFunc]);

  function deleteError() {
    SectionMessage({
      type: 'error',
      title: 'Couldn’t delete the tag',
      description: "We're having some trouble deleting the tag. Refresh the page and try again.",
      descriptionExtra: (
        <a style={{ fontSize: 14 }} onClick={() => window.location.reload()}>
          Refresh
        </a>
      ),
    });
  }

  function onClickRemove(data: TagManagementI.TagItemI) {
    Modal.confirm({
      title: (
        <span>
          Are you sure about deleting the {type}?
          {/* <span style={{ textTransform: 'capitalize' }}> {type}?</span> */}
        </span>
      ),
      content: (
        <span>
          “{data.name}” will be removed from {type}s. This action may cause change in question bank.
          Please review this action.
        </span>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true, style: { borderRadius: 3 } },
      cancelButtonProps: { style: { borderRadius: 3 } },
      onOk: () => {
        return onRemove?.(data.id)
          ?.then(() => setRemoving(false))
          .catch((err) => {
            deleteError();
            return Promise.reject(err);
          });
      },
      icon: <WarningFilled style={{ color: '#F14D4F' }} />,
      width: 600,
      centered: true,
      maskClosable: true,
    });
  }

  const { run: onChangeSearch } = useDebounceFn(
    (e: any) => {
      if (!onSearch) return;
      const value = e.target.value ?? '';
      if (value.length < 3 && value.length > 0) {
        setSearchError('please type at least 3 characters in the input field.');
        return;
      }
      if (value.length > 32) {
        setSearchError('please type at most 32 characters in the input field.');
        return;
      }
      setSearchError('');
      if (value.length > 0) {
        setLoading(true);
        onSearch(e.target.value).finally(() => setLoading(false));
        setNoResultText('No result found');
      } else {
        setLoading(true);
        initFunc?.()?.finally(() => setLoading(false));
        setNoResultText(`No ${type}s added yet`);
      }
    },
    { wait: 1000 },
  );

  const renderList = () => {
    if (list.length) {
      return list?.map((item) => (
        <div key={item.id} className={`${styles.tag} ${removing ? styles.removing : ''}`}>
          {item.name}
          {removing && <CloseOutlined className={styles.x} onClick={() => onClickRemove(item)} />}
        </div>
      ));
    } else {
      return <span>{loading ? '' : noResultText}</span>;
    }
  };

  return (
    <>
      <div className={styles.title}>
        {/* <SnippetsOutlined className={styles.icon} /> */}
        <span className={styles.icon}>{icon}</span>
        <div className={styles.text}>{type}s</div>
        {removing ? (
          <SeeButton type="link" onClick={() => setRemoving(false)}>
            Cancel
          </SeeButton>
        ) : (
          <>
            <div className={styles.action} onClick={clickCreate}>
              <PlusOutlined />
            </div>
            <div className={styles.action} onClick={() => setRemoving(true)}>
              <MinusOutlined />
            </div>
          </>
        )}
      </div>
      <div className={styles.box}>
        {onSearch && (
          <div className={styles.search}>
            <div className={styles.label}>search by tag name</div>
            <div className={styles.inputBox}>
              <Input
                placeholder={`enter ${type} name to search`}
                className={`${styles.searchInput} ${searchError ? styles.error : ''}`}
                prefix={<SearchOutlined style={{ fontSize: 16 }} />}
                bordered={false}
                onChange={onChangeSearch}
              />
              <div className={styles.searchError}>{searchError}</div>
            </div>
          </div>
        )}
        <Spin spinning={loading}>
          <div className={styles.list}>{renderList()}</div>
        </Spin>
      </div>
    </>
  );
}
