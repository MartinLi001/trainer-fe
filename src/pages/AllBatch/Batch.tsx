import { useLocation, history } from 'umi';
import classNames from 'classnames';
import type { RadioChangeEvent } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Radio, Row, Col, Dropdown, Menu, Empty, Spin, message } from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';

import IconFont from '@/components/IconFont';
import SeeButton from '@/components/SeeButton';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import ArchiveModal from './components/ArchiveModal';
import EditBatchModal from './components/EditBatchModal';

import { useRequest } from 'ahooks';

import {
  getBatchesByCategoryId,
  getTrainerBatches,
  createBatch,
  createBatchByTemplate,
  updateBatch,
  updateBatchActive,
} from '@/services/batch';

import styles from './index.less';
import moment from 'moment';

const colProps = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
};

export default function BatchesPage() {
  const [errorData, setErrorData] = useState();
  const [type, setType] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showIconFlag, setShowIconFlag] = useState({});
  const [trainerBatches, setTrainerBatches] = useState<Record<string, string>[]>([]);

  const [batchList, setBatchList] = useState<API.AllBatchType[][]>([]);
  const [currentBatch, setCurrentBatch] = useState<API.AllBatchType>({} as API.AllBatchType);

  const [modalType, setModalType] = useState<string | undefined>();
  const {
    query: { categoryName, categoryId },
  } = useLocation() as any;

  const getBatchListFun = () => {
    setLoading(true);

    Promise.all([
      getBatchesByCategoryId({ categoryId, isTemplate: true }),
      getBatchesByCategoryId({ categoryId, isTemplate: false }),
    ])
      .then((data: API.AllBatchType[][]) => {
        setBatchList(data);
      })
      .finally(() => setLoading(false));
  };

  const typeChangeHandle = (e: RadioChangeEvent) => {
    setType(e.target.value);
  };

  const menuClickHandle = ({ key }: any, batch: API.AllBatchType) => {
    setCurrentBatch(batch);
    setModalType(key);
  };

  const onCancel = () => {
    setCurrentBatch({} as API.AllBatchType);
    setModalType(undefined);
  };

  const updateBatchFun = (data: API.AllBatchType, isUpdate = false) => {
    setLoading(true);
    (isUpdate ? updateBatch : updateBatchActive)(data)
      .then(() => {
        onCancel();
        getBatchListFun();
      })
      .catch(({ fieldErrors }) => {
        if (fieldErrors && fieldErrors['Batch Status']) {
          message.error(fieldErrors['Batch Status']);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const { loading: addLoading, runAsync: addBatchFun } = useRequest(createBatch, {
    manual: true,
  });

  const { loading: addBatchByTemplateLoading, runAsync: addBatchByTemplateFun } = useRequest(
    createBatchByTemplate,
    {
      manual: true,
    },
  );

  const onCreate = (values: API.AllBatchType) => {
    if (modalType === 'add') {
      (values.batchId ? addBatchByTemplateFun : addBatchFun)({
        ...values,
        batchCategoryId: categoryId,
        startDate: moment(values.startDate).format('YYYY-MM-DD'),
      })
        .then(() => {
          getBatchListFun();
          setModalType(undefined);
        })
        .catch((err) => {
          const { fieldErrors } = err;
          setErrorData(fieldErrors);
        });

      return;
    }

    updateBatchFun(
      {
        ...currentBatch,
        ...values,
        startDate: moment(values.startDate).format('YYYY-MM-DD'),
      },
      true,
    );
  };

  const changeArchiveHandle = () => {
    const isClosed = currentBatch.isClosed;
    updateBatchFun({
      ...currentBatch,
      isClosed: !isClosed,
    });
  };

  const renderMenu = (batch: API.AllBatchType) => {
    const items = [
      {
        label: 'Edit Batch',
        key: 'edit',
      },
    ];

    if (!batch.isTemplate) {
      items.push(
        batch.isClosed
          ? {
              label: 'Restore Batch',
              key: 'restore',
            }
          : {
              label: 'Archive Batch',
              key: 'archive',
            },
      );
    }

    return <Menu onClick={(key) => menuClickHandle(key, batch)} items={items} />;
  };

  const findBatchByBatchId = (batchId: string) =>
    trainerBatches.some((batch) => batch.batchId === batchId);

  const renderRight = (batch: API.AllBatchType) => {
    const { batchId } = batch;

    return showIconFlag[batchId] || !findBatchByBatchId(batchId) ? (
      <Dropdown overlay={renderMenu(batch)} trigger={['click']}>
        <span className={styles.icon}>
          <MoreOutlined />
        </span>
      </Dropdown>
    ) : findBatchByBatchId(batchId) ? (
      <div className={styles.other}>
        <span className={styles.icon}>
          <IconFont type="icon-pushpin-line" />
        </span>
        My Batch
      </div>
    ) : (
      ''
    );
  };

  useEffect(() => {
    setLoading(true);
    getTrainerBatches()
      .then((data) => {
        setTrainerBatches(data.batchIds ?? []);
        getBatchListFun();
      })
      .catch(() => setLoading(false));
  }, []);

  const list = useMemo(() => {
    return batchList
      .flat()
      .filter((item: API.AllBatchType) => {
        if ([0, 2].includes(type)) {
          if (searchText.trim()) {
            return (
              item.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) &&
              item.isClosed === !!type &&
              !item.isTemplate
            );
          }
          return item.isClosed === !!type && !item.isTemplate;
        }
        return (
          !!item.isTemplate &&
          item.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
        );
      })
      .reduce(
        (result: API.AllBatchType[][], batch: API.AllBatchType) => {
          if (findBatchByBatchId(batch.batchId)) {
            result[0].push(batch);
          } else {
            result[1].push(batch);
          }
          return result;
        },
        [[], []],
      )
      .flat();
  }, [batchList, type, searchText, trainerBatches]);

  const showOptionIcon = (batchId: string) => {
    const flag = showIconFlag[batchId];
    if (flag) {
      showIconFlag[batchId] = !flag;
      setShowIconFlag({ ...showIconFlag });
      return;
    }
    showIconFlag[batchId] = true;
    setShowIconFlag({ ...showIconFlag });
  };

  const hideOptionIcon = () => {
    setShowIconFlag({});
  };

  const goDetails = (batch: API.AllBatchType) => {
    history.push({
      pathname: '/Category/Batches/tasks',
      query: {
        type: 'all',
        batchId: batch.batchId,
        categoryName,
        fromAllBatch: 'true',
      },
    });
  };

  const leftClassNames = classNames({
    [styles.item]: true,
    [styles.extra]: true,
  });

  return (
    <Spin spinning={loading}>
      <div className={styles.pageHeaderWrapper}>
        <PageHeader
          items={[
            {
              name: 'All Batches',
              href: '/Category',
            },
            {
              name: categoryName,
            },
          ]}
        />
        <SearchInput
          title="Search for a batch"
          placeholder="Enter here…"
          onChangeKeyWord={setSearchText}
        />
      </div>
      <div className={styles.pageWrapper}>
        <div className={styles.operation}>
          <div className={styles.left}>
            <span className={styles.label}>Type</span>
            <Radio.Group onChange={typeChangeHandle} value={type}>
              <Radio value={0}>Active Batch</Radio>
              <Radio value={1}>Templates</Radio>
              <Radio value={2}>Archived</Radio>
            </Radio.Group>
          </div>
          <div className={styles.right}>
            <SeeButton
              icon={<PlusOutlined />}
              shape="round"
              type="primary"
              onClick={() => setModalType('add')}
            >
              Create New Batch
            </SeeButton>
          </div>
        </div>

        {list.length > 0 ? (
          <div className={styles.list}>
            <Row gutter={[20, 20]}>
              {list.map((batch: API.AllBatchType) => (
                <Col span={8} {...colProps} key={batch.batchId}>
                  <div className={leftClassNames}>
                    <div className={styles.left} onClick={() => goDetails(batch)}>
                      <IconFont style={{ fontSize: 24 }} type="icon-computer-line" />
                      <div className={styles.leftContent}>
                        <span className={styles.title}>{batch.name}</span>

                        {[0, 2].includes(type) && (
                          <div className={styles.time}>
                            <span className={styles.timeLabel}>Start Date: </span>
                            <span className={styles.timeValue}>
                              {batch.startDate ? moment(batch.startDate).format('MMM D YYYY') : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={styles.right}
                      onMouseLeave={() => hideOptionIcon()}
                      onMouseEnter={() => showOptionIcon(batch.batchId)}
                    >
                      {renderRight(batch)}
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

      <EditBatchModal
        data={currentBatch}
        open={['edit', 'add'].includes(modalType as string)}
        templateData={batchList[0] as API.AllBatchType[]}
        onCreate={onCreate}
        onCancel={onCancel}
        loading={addLoading || addBatchByTemplateLoading || loading}
        errorData={errorData}
      />

      <ArchiveModal
        type="batch"
        action={modalType}
        open={modalType === 'archive' || modalType === 'restore'}
        onSave={changeArchiveHandle}
        onCancel={onCancel}
        loading={loading}
      />
    </Spin>
  );
}
