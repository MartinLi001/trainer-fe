import Quill from '@/components/Quill';
import { questionType } from '../../typeList';
import CodeMirror from '@/components/CodeMirror';
import { UploadPreview } from '@/components/PreviewBar';
import style from './index.less';

export interface userShowDrawer {
  question: questionType;
  taskId: string;
}
function QuestionShow({ question, taskId }: userShowDrawer) {
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
            // ref={QuillRef1}
            style={{
              height: 'auto',
            }}
            content={question?.description?.renderedContent}
            id={question?.questionId}
            readOnly
          />
        </div>

        {question?.answer && (
          <div className={style.questioItem}>
            {question?.answer && <div className={style.wordTitle}>Answer</div>}
            <UploadPreview
              data={question?.answer.attachments ?? []}
              downIcon
              taskId={taskId || ''}
              colNumber={12}
            />
            <CodeMirror
              // ref={codeRef}
              {...question?.answer}
              height={342}
              options={{
                readOnly: true,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default QuestionShow;
