import React from 'react';
import styles from './index.less';
import { useModel } from 'umi';
interface CommentProps {
  text: string;
  author?: string;
  date?: string;
}

const Comment: React.FC<CommentProps> = ({ text, author, date }) => {
  const { initialState } = useModel('@@initialState');
  return (
    <div className={styles.wrapper}>
      <div className={styles.middle}>
        <div className={styles.author}>
          {author ? `by ${initialState?.firstName === author ? 'me' : author}` : ''}
        </div>
        <div className={styles.date}>{date}</div>
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default Comment;
