import Quill from '@/components/Quill';
import { DetailValueType } from '@/pages/AddQuestion/typeList';
import { useEffect, useRef } from 'react';
import style from './index.less';

export interface userShowDrawer {
  question: DetailValueType;
  type: string;
}
function QuestionShow({ question, type }: userShowDrawer) {
  const QuillRef1 = useRef<any>();
  const QuillRefanswer1 = useRef<any>();

  useEffect(() => {
    if (question?.sampleAnswer && question?.sampleAnswer.renderedContent) {
      QuillRefanswer1.current?.setContent(question?.sampleAnswer.renderedContent || '');
    }
    if (question?.description && question?.description.renderedContent) {
      QuillRef1.current?.setContent(question?.description.renderedContent || '');
    }
  }, [question]);

  return (
    <>
      <div className={style.questionDetail}>
        <div className={style.questioItem}>
          <div className={style.wordTitle}>Question Name</div>
          <span className={style.TitleShow}> {question?.name}</span>
        </div>
        <div className={style.questioItem}>
          <div className={style.wordTitle}>Descirption</div>
          <Quill
            ref={QuillRef1}
            style={{
              height: 'auto',
            }}
            id={question?.questionId}
            readOnly
          />
        </div>

        <div className={style.questioItem}>
          <div className={style.wordTitle}>Sample Answer</div>
          <Quill
            ref={QuillRefanswer1}
            style={{
              height: 'auto',
            }}
            id={question?.questionId}
            readOnly
          />
        </div>
        {type != 'link' && (
          <div className={style.questioItem}>
            <div className={style.wordTitle}>Weight</div>
            <span className={style.TitleShow}> {question?.weight}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default QuestionShow;
