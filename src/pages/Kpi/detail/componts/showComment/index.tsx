import React, { memo, useEffect, useState } from 'react';
import style from './index.less';
import { commentsType, personType } from '../../typeList';
import { date2desc } from '@/utils';
import moment from 'moment';

export interface CommentListType {
  dataList: commentsType[];
  editComment: (data: commentsType) => void;
  deleteComment: (data: commentsType) => void;
  titleText?: string;
  addable?: boolean;
  peopleList: Record<string, personType>;
  editKey: string;
}

function ShowCommentList({
  dataList,
  editComment,
  deleteComment,
  titleText,
  peopleList,
  editKey,
}: CommentListType) {
  const userId = localStorage.getItem('userId') as string;
  const [list, setList] = useState<commentsType[]>([]);

  useEffect(() => {
    const temp = [...(dataList || [])];
    temp.sort((a, b) => {
      const dataA = moment(a.commentDateTime);
      const dataB = moment(b.commentDateTime);
      if (dataA > dataB) {
        return 1;
      } else {
        return -1;
      }
    });
    setList([...temp]);
  }, [dataList]);

  return (
    <div className={style.commentList}>
      <div className={style.commentListTitle}>
        <div>{titleText || 'Comment'}</div>
      </div>
      <div className={style.commentListShow}>
        {list.map((ite) => {
          if (ite.commentId != editKey) {
            return (
              <div className={style.commentContent} key={ite.commentId}>
                {ite.content && (
                  <div className={style.commentContentShow}>
                    <div className={style.title}>
                      <div className={style.byOther}>
                        {' '}
                        by{' '}
                        <span style={{ color: '#2875D0' }}>
                          {userId == ite.commentBy
                            ? 'me'
                            : peopleList[ite.commentBy]?.firstName +
                                ' ' +
                                peopleList[ite.commentBy]?.lastName +
                                (peopleList[ite.commentBy]?.preferredName
                                  ? `(${peopleList[ite.commentBy]?.preferredName})`
                                  : '') || 'other '}
                        </span>
                      </div>
                      <div className={style.commData}> {date2desc(ite.commentDateTime)}</div>
                    </div>
                    <div className={style.detail}>{ite.content}</div>
                    {userId == ite.commentBy && (
                      <div className={style.operation}>
                        <a
                          style={{ marginRight: 24 }}
                          onClick={() => {
                            editComment(ite);
                          }}
                        >
                          Edit
                        </a>
                        <a
                          onClick={() => {
                            deleteComment(ite);
                          }}
                        >
                          Delete
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default memo(ShowCommentList);
