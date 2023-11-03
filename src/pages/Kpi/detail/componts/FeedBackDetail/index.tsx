import React, { memo } from 'react';
import style from './index.less';
import { Feeddetails } from '../../typeList';
import SeeButton from '@/components/SeeButton';

export interface FeedDetailListType {
  data: Feeddetails[];
  editFeed?: (value: Feeddetails, key: number) => void;
  deleteFeed?: (key: number) => void;
}

function FeedDetailList({ data, editFeed, deleteFeed }: FeedDetailListType) {
  return (
    <div className={style.FeedDetail}>
      {editFeed && (
        <div className={style.FeedDetailTitle}>
          <div>Added Details</div>
        </div>
      )}
      <div className={style.FeedDetailShow}>
        {data.map((ite, i) => {
          return (
            <div className={style.detailList} key={i}>
              <div className={style.title}>{ite.name}</div>
              <div className={style.detail}>{ite.value}</div>

              <div className={style.operation}>
                {editFeed && (
                  <SeeButton type="link" onClick={() => editFeed(ite, i)}>
                    Edit
                  </SeeButton>
                )}
                {deleteFeed && (
                  <SeeButton type="link" onClick={() => deleteFeed(i)}>
                    Delete
                  </SeeButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(FeedDetailList);
