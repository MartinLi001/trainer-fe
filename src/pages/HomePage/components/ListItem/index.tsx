// import { useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { List } from 'antd';
import type { valuesType, submitted } from '../../TypeList';
import Submitted from '@/assets/Submitted.svg';
import Late from '@/assets/Late.svg';
import Unsubmitted from '@/assets/Unsubmitted.svg';
import style from './index.less';
import { useHistory } from 'umi';
import { date2desc } from '@/utils';

interface itemType {
  list: valuesType[];
}

function ListBatch({ list }: itemType) {
  // const [loading, setLoading] = useState(false);
  const history = useHistory();

  const renderStatus = (summitted: submitted) => {
    if (!summitted.isSubmitted) {
      return (
        <div className={`${style.Unsubmitted} ${style.status}`}>
          <img src={Unsubmitted} />
          unsubmitted
        </div>
      );
    } else if (summitted.isLate) {
      return (
        <div className={`${style.Late} ${style.status}`}>
          <img src={Late} />
          Late
        </div>
      );
    } else {
      return (
        <div className={`${style.Submitted} ${style.status}`}>
          <img src={Submitted} />
          Submitted
        </div>
      );
    }
  };
  const jumpDetailPage = (type: string, id: string) => {
    history.push(`/batch/${type}/${id}`);
  };
  return (
    <List
      itemLayout="horizontal"
      className={style.ListBatch}
      dataSource={list}
      renderItem={(item) => (
        <List.Item onClick={() => jumpDetailPage(item.type, item.taskId)}>
          <List.Item.Meta
            title={<div className={style.ListBatchTitle}>{item.name}</div>}
            description={<div className={style.ListBatchDesc}>{date2desc(item.startDateTime)}</div>}
          />
          <div className={style.ListBatchright}>
            {item.submissionSummaryDto && renderStatus(item.submissionSummaryDto)}
          </div>
          <RightOutlined />
        </List.Item>
      )}
    />
  );
}

export default ListBatch;
