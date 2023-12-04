import Quill from '@/components/Quill';
import { questionType } from '@/pages/Task/mock/typeList';
import CodeMirror, { LanguageConfig } from '@/components/CodeMirror';
import DescriptionItem from '../DescriptionItem';
import { useEffect, useMemo, useRef } from 'react';
import SeeButton from '@/components/SeeButton';
import { SyncOutlined } from '@ant-design/icons';

export default function DetailListBlock({
  makeStatusIsUnavailable,
  currentQuestion,
  isOneOnOne,
  trainees,
  onRefresh,
}: {
  onRefresh?: () => void;
  isOneOnOne?: boolean;
  trainees?: any;
  currentQuestion: questionType;
  makeStatusIsUnavailable?: boolean;
}) {
  const followUps = currentQuestion?.followUps;
  const activeQuestionId = currentQuestion?.questionId;
  const codeRef = useRef<any>();

  const userAnswer = useMemo(() => {
    if (isOneOnOne) {
      const results = currentQuestion?.results ?? {};
      const keys = Object.keys(results)?.filter((userId) =>
        trainees.some((trainee: any) => trainee.userId === userId),
      );
      if (keys.length) {
        return results[keys[0]]?.userAnswer ?? {};
      }
    }
    return {} as any;
  }, [currentQuestion]);

  useEffect(() => {
    if (isOneOnOne) {
      const { content = '', language = 'Java' } = userAnswer;
      codeRef.current?.setOption(language);
      codeRef.current?.setValue(content);
    }
  }, [userAnswer]);

  return (
    <div>
      {isOneOnOne && (Object.keys(userAnswer).length > 0 || makeStatusIsUnavailable) ? (
        <DescriptionItem
          title={
            <>
              Submission
              <SeeButton
                onClick={onRefresh}
                type="primary"
                style={{ width: 24, height: 26, marginLeft: 10 }}
                icon={<SyncOutlined style={{ fontSize: 12 }} />}
              />
            </>
          }
          content={
            <CodeMirror ref={codeRef} height={400} width={500} options={{ readOnly: true }} />
          }
        />
      ) : (
        ''
      )}

      {/* description */}
      <DescriptionItem
        title="Description"
        content={
          <Quill
            content={currentQuestion?.description?.renderedContent ?? ''}
            style={{
              height: 'auto',
              backgroundColor: '#fff',
            }}
            id={activeQuestionId}
            readOnly
          />
        }
      />

      {/* Sample Answer */}
      <DescriptionItem
        title="Sample Answer"
        content={
          <Quill
            content={currentQuestion?.sampleAnswer?.renderedContent ?? ''}
            style={{
              height: 'auto',
              backgroundColor: '#fff',
            }}
            id={activeQuestionId}
            readOnly
          />
        }
      />

      {/* Weight */}
      <DescriptionItem title="Weight" content={currentQuestion?.weight} />

      {followUps?.length > 0 &&
        followUps?.map((followUp: any, index: number) => (
          <div key={index}>
            <div style={{ color: '#2875D0', fontWeight: 500, fontSize: 14, marginTop: 48 }}>
              Follow-up Question
            </div>

            {/* Follow-up Name */}
            <DescriptionItem title="Follow-up Question Name" content={followUp?.name} />

            {/* Follow-up description */}
            <DescriptionItem
              title="Description"
              content={
                <Quill
                  content={followUp?.description?.renderedContent ?? ''}
                  style={{
                    height: 'auto',
                    backgroundColor: '#fff',
                  }}
                  id={followUp.questionId}
                  readOnly
                />
              }
            />
            {/* Sample Answer */}
            <DescriptionItem
              title="Sample Answer"
              content={
                <Quill
                  content={followUp?.sampleAnswer?.renderedContent ?? ''}
                  style={{
                    height: 'auto',
                    backgroundColor: '#fff',
                  }}
                  id={followUp.questionId}
                  readOnly
                />
              }
            />
          </div>
        ))}
    </div>
  );
}
