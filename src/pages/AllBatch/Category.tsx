import { FC, useEffect, useMemo, useState } from 'react';
import { history, CategoryModelState, ConnectProps, Loading, connect, Dispatch } from 'umi';

import type { RadioChangeEvent } from 'antd';
import { Radio, Row, Col, Dropdown, Menu, Empty, Spin } from 'antd';
import { PlusOutlined, MoreOutlined, FolderOutlined } from '@ant-design/icons';
import SeeButton from '@/components/SeeButton';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';

import EditCategoryModal from './components/EditCategoryModal';
import ArchiveModal from './components/ArchiveModal';

import { createCategory, updateCategory } from '@/services/batch';

import styles from './index.less';

const colProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
};

interface PageProps extends ConnectProps {
  categoryData: API.CategoryType[];
  currentCategory: API.CategoryType;
  loading: boolean;
  dispatch: Dispatch;
}

const CategoryPage: FC<PageProps> = ({ categoryData, dispatch, currentCategory, loading }) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [type, setType] = useState(true);
  const [searchText, setSearchText] = useState('');

  const [modalType, setModalType] = useState<string | undefined>();

  const getCategoryFun = () => {
    dispatch({
      type: 'category/getCategoryList',
    });
  };

  const setCurrentCategory = (payload = {}) => {
    dispatch({
      type: 'category/setCurrentCategory',
      payload,
    });
  };

  const typeChangeHandle = (e: RadioChangeEvent) => {
    setType(e.target.value);
  };

  const menuClickHandle = ({ key }: any, category: API.CategoryType) => {
    setCurrentCategory(category);
    setModalType(key);
  };

  const onCancel = () => {
    setCurrentCategory();
    setModalType(undefined);
  };

  const updateCategoryFun = (data: API.CategoryType) => {
    setActionLoading(true);
    updateCategory(data)
      .then(() => {
        onCancel();
        getCategoryFun();
      })
      .catch(() => {})
      .finally(() => {
        setActionLoading(false);
      });
  };

  const onCreate = (values: API.CategoryType) => {
    setActionLoading(true);
    if (currentCategory.batchCategoryId) {
      updateCategoryFun({
        ...currentCategory,
        ...values,
      });
      return;
    }
    createCategory({
      ...values,
      description: '',
    })
      .then(() => {
        onCancel();
        getCategoryFun();
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  const changeArchiveHandle = () => {
    const active = currentCategory.active;
    updateCategoryFun({
      ...currentCategory,
      active: !active,
    });
  };

  const goBatchPage = ({ batchCategoryId, name }: API.CategoryType) => {
    history.push(`/Category/Batches?categoryName=${name}&categoryId=${batchCategoryId}`);
  };

  const renderMenu = (category: API.CategoryType) => {
    return (
      <Menu
        onClick={(key) => menuClickHandle(key, category)}
        items={[
          {
            label: 'Edit Batch Category',
            key: 'edit',
          },
          category.active
            ? {
                label: 'Archive Batch Category',
                key: 'archive',
              }
            : {
                label: 'Restore Batch Category',
                key: 'restore',
              },
        ]}
      />
    );
  };

  useEffect(() => {
    getCategoryFun();
  }, []);

  const list = useMemo(() => {
    if (!categoryData.length) return [];
    return categoryData?.filter(
      (item: API.CategoryType) =>
        item.active === type &&
        item.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()),
    );
  }, [categoryData, type, searchText]);

  return (
    <Spin spinning={loading}>
      <div className={styles.pageHeaderWrapper}>
        <PageHeader
          items={[
            {
              name: 'All Batches',
            },
          ]}
        />
        <SearchInput
          title="Search for a batch category"
          placeholder="Place holder/type of input"
          onChangeKeyWord={setSearchText}
        />
      </div>
      <div className={styles.pageWrapper}>
        <div className={styles.operation}>
          <div className={styles.left}>
            <span className={styles.label}>Type</span>
            <Radio.Group onChange={typeChangeHandle} value={type}>
              <Radio value={true}>Active Category</Radio>
              <Radio value={false}>Archived</Radio>
            </Radio.Group>
          </div>
          <div className={styles.right}>
            <SeeButton
              icon={<PlusOutlined />}
              shape="round"
              type="primary"
              onClick={() => setModalType('edit')}
            >
              Create New Category
            </SeeButton>
          </div>
        </div>

        {list.length > 0 ? (
          <div className={styles.list}>
            <Row gutter={[20, 20]}>
              {list.map((category: API.CategoryType) => (
                <Col span={8} {...colProps} key={category.batchCategoryId}>
                  <div className={styles.item}>
                    <div
                      className={styles.left}
                      onClick={() => {
                        goBatchPage(category);
                      }}
                    >
                      <FolderOutlined />
                      <div className={styles.leftContent}>
                        <span className={styles.title}>{category.name}</span>
                      </div>
                    </div>
                    <div className={styles.right}>
                      <Dropdown overlay={renderMenu(category)} trigger={['click']}>
                        <span className={styles.icon}>
                          <MoreOutlined />
                        </span>
                      </Dropdown>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 200 }} />
        )}
      </div>

      <EditCategoryModal
        data={currentCategory}
        open={modalType === 'edit'}
        onCreate={onCreate}
        onCancel={onCancel}
        loading={actionLoading}
      />

      <ArchiveModal
        type="category"
        action={modalType}
        open={modalType === 'archive' || modalType === 'restore'}
        onSave={changeArchiveHandle}
        onCancel={onCancel}
        loading={actionLoading}
      />
    </Spin>
  );
};

export default connect(
  ({ category, loading }: { category: CategoryModelState; loading: Loading }) => ({
    categoryData: category.categoryData ?? [],
    currentCategory: category.currentCategory ?? {},
    loading: loading.models.category,
  }),
)(CategoryPage);
