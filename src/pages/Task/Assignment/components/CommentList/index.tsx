import React, { memo, useCallback, useEffect, useState } from 'react';
import style from './index.less';
import { CommentItem } from '../../typeList';
import IconFont from '@/components/IconFont';
import SeeButton from '@/components/SeeButton';
import { date2desc } from '@/utils';
import { Input } from 'antd';
import { useModel } from 'umi';
const { TextArea } = Input;

interface ScoreProps {
  value?: CommentItem;
  type: string;
  edit?: boolean;
  editChange?: (id: string) => void;
  onCommentChange: (value: string, commentId?: string) => void;
  onDelete?: (value: string) => void;
}
const CommentTitle = ({ value, type, onCommentChange, edit, editChange, onDelete }: ScoreProps) => {
  const { initialState } = useModel('@@initialState');
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState<string>('');
  const { userId } = initialState || {};

  useEffect(() => {
    setEditing(value ? false : true);
  }, [value]);

  useEffect(() => {
    setEditing(edit || false);
  }, [edit]);
  const onEditing = useCallback(() => {
    if (editChange) editChange(value?.commentId || '');
  }, [editing]);

  const onDeleteChagne = useCallback(() => {
    if (onDelete) onDelete(value?.commentId || '');
  }, [onDelete]);

  const onChangValue = (e: any) => {
    setContent(e.target.value);
  };

  const SaveComment = useCallback(() => {
    if (type == 'Edit') {
      onCommentChange(content, value?.commentId);
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
              type="gost"
              onClick={() => {
                if (editChange) editChange('');
              }}
            >
              Cancel
            </SeeButton>
            <SeeButton type="primary" onClick={() => SaveComment()} disabled={!content}>
              Save
            </SeeButton>
          </div>
        </div>
      )}
      {!editing && value && (
        <div className={style.commentContentShow}>
          <div className={style.title}>
            <div className={style.byOther}>
              by
              <span style={{ color: '#2875D0' }}>
                {userId == value.commentBy ? ' me' : ` ${value.firstName} ${value.lastName}`}
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
  data: CommentItem[];
  addComment: (value: string) => void;
  editComment: (value: string, commentId: string) => void;
  deleteComment?: (key: any) => void;
  titleText?: string;
  addable?: boolean;
}

function CommentList({
  data,
  addComment,
  editComment,
  deleteComment,
  titleText,
  addable = true,
}: CommentListType) {
  const [addFlag, setAddFlag] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const onCommentChange = (value: string, commentId?: string) => {
    if (commentId) {
      editComment(value, commentId);
      setEditId('');
    } else {
      addComment(value);
    }
    setAddFlag(false);
  };

  // console.log(data, '======data');
  return (
    <div className={style.commentList}>
      <div className={style.commentListTitle}>
        <div>{titleText || 'Comment'}</div>
        {addable && (
          <IconFont
            type="icon-add-line"
            onClick={() => {
              setAddFlag(!addFlag);
              document.getElementById('commentListShow')!.scrollTop = 0;
            }}
          />
        )}
      </div>
      <div className={style.commentListShow} id="commentListShow">
        {addFlag && (
          <CommentTitle
            type={'Add'}
            onCommentChange={onCommentChange}
            edit={true}
            editChange={() => setAddFlag(false)}
          />
        )}
        {data?.map((ite) => {
          return (
            <CommentTitle
              editChange={(id: string) => setEditId(id)}
              key={ite.commentId}
              edit={editId == ite.commentId}
              value={ite}
              type={'Edit'}
              onCommentChange={onCommentChange}
              onDelete={deleteComment}
            />
          );
        })}
      </div>
    </div>
  );
}

export default memo(CommentList);
