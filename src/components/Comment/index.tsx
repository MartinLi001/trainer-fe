import React from 'react';
import styles from './index.less';
interface CommentProps {
  text: string;
  author?: string;
  date?: string;
}

const isByMe = (author: string) => {
  const userInfo = JSON.parse(localStorage.userInfo ?? '{}');
  const firstName = userInfo?.firstName;
  if (author === firstName) {
    return 'by me';
  }
  return 'by' + ' ' + author;
};

const Comment: React.FC<CommentProps> = ({ text, author, date }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.middle}>
        <div className={styles.author}>{author ? isByMe(author) : ''}</div>
        <div className={styles.date}>{date}</div>
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default Comment;
