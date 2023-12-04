import React, { memo, useCallback, useEffect, useState } from 'react';
import style from './index.less';
import { commentsType, personType } from '../../typeList';
import IconFont from '@/components/IconFont';
import SeeButton from '@/components/SeeButton';
import { date2desc } from '@/utils';
import { Input } from 'antd';
import { useModel } from 'umi';
const { TextArea } = Input;

interface ScoreProps {
  value: commentsType;
  type: string;
  edit?: boolean;
  editChange?: (id: string) => void;
  onCommentChange: (value: string, data?: commentsType) => void;
  onDelete?: (data: commentsType) => void;
  peopleList: Record<string, personType>;
}
const CommentTitle = ({
  value,
  type,
  onCommentChange,
  edit,
  editChange,
  onDelete,
  peopleList,
}: ScoreProps) => {
  const { initialState } = useModel('@@initialState');
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState<string>('');
  const userId = initialState?.userId;

  useEffect(() => {
    setEditing(value ? false : true);
    setContent(value?.content || '');
  }, [value]);

  useEffect(() => {
    setEditing(edit || false);
  }, [edit]);

  const onEditing = useCallback(() => {
    if (editChange) editChange(value?.commentId || '');
  }, [editing]);

  const onDeleteChagne = useCallback(() => {
    if (onDelete) onDelete(value);
  }, [onDelete]);

  const onChangValue = (e: any) => {
    setContent(e.target.value);
  };

  const SaveComment = useCallback(() => {
    if (type == 'Edit') {
      onCommentChange(content, value);
    } else {
      onCommentChange(content);
    }
  }, [type, content]);

  return (
    <div className={style.commentContent}>
      {editing && (
        <div className={style.editCommentShow}>
          <div className={style.EditTitle}> {`${type} Comment`}</div>
          <TextArea
            placeholder="any comment"
            defaultValue={type == 'Edit' ? value?.content : ''}
            onChange={(e) => onChangValue(e)}
          />
          <div className={style.commentSave}>
            <SeeButton
              onClick={() => {
                if (editChange) editChange('');
              }}
              style={{ marginRight: 10 }}
            >
              Cancel
            </SeeButton>
            <SeeButton type="primary" onClick={() => SaveComment()}>
              Save
            </SeeButton>
          </div>
        </div>
      )}
      {!editing && value.content && (
        <div className={style.commentContentShow}>
          <div className={style.title}>
            <div className={style.byOther}>
              {' '}
              by{' '}
              <span style={{ color: '#2875D0' }}>
                {userId == value.commentBy
                  ? 'me'
                  : peopleList[value.commentBy]?.firstName +
                      ' ' +
                      peopleList[value.commentBy]?.lastName +
                      (peopleList[value.commentBy]?.preferredName
                        ? `(${peopleList[value.commentBy]?.preferredName})`
                        : '') || 'other '}
              </span>
            </div>
            <div className={style.commData}> {date2desc(value.commentDateTime)}</div>
          </div>
          <div className={style.detail}>{value.content}</div>
          {userId == value.commentBy && (
            <div className={style.operation}>
              <a style={{ marginRight: 24 }} onClick={onEditing}>
                Edit
              </a>
              <a onClick={onDeleteChagne}>Delete</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export interface CommentListType {
  dataList: commentsType[];
  addComment?: (value: string) => void;
  editComment?: (value: string, data: commentsType) => void;
  deleteComment?: (data: commentsType) => void;
  titleText?: string;
  addable?: boolean;
  peopleList?: Record<string, personType>;
}

function CommentList({
  dataList,
  addComment,
  editComment,
  deleteComment,
  titleText,
  addable = true,
  peopleList,
}: CommentListType) {
  const [addFlag, setAddFlag] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const onCommentChange = (value: string, data?: commentsType) => {
    console.log('%cindex.tsx line:134 value', 'color: #007acc;', value);
    if (data?.commentId && editComment) {
      editComment(value, data);
      setEditId('');
    } else {
      if (addComment) addComment(value);
    }
    setAddFlag(false);
  };
  // useEffect(() => {
  //   console.log('%cindex.tsx line:116 data', 'color: #007acc;', data);
  // }, [data]);
  return (
    <div className={style.commentList}>
      <div className={style.commentListTitle}>
        <div>{titleText || 'Comment'}</div>
        {addable && <IconFont type="icon-add-line" onClick={() => setAddFlag(!addFlag)} />}
      </div>
      <div className={style.commentListShow}>
        {/* {addFlag && <CommentTitle type={'Add'} onCommentChange={onCommentChange} />} */}
        {dataList.map((ite) => {
          return (
            <CommentTitle
              editChange={(id: string) => setEditId(id)}
              key={ite.commentId}
              edit={editId == ite.commentId}
              value={ite}
              type={'Edit'}
              onCommentChange={onCommentChange}
              onDelete={deleteComment}
              peopleList={peopleList || {}}
            />
          );
        })}
        {(dataList?.length < 1 || !dataList.some((i) => i.content)) && (
          <div className={style.noData}>No comments yet</div>
        )}
      </div>
    </div>
  );
}

export default memo(CommentList);
