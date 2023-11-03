import React, { useEffect, useRef, memo } from 'react';
import { getFile } from '@/services/question';
import style from './index.less';
import SeeButton from '@/components/SeeButton';
import Quill from '@/components/Quill';
import { DownloadOutlined } from '@ant-design/icons';
import { download } from '@/utils';
import { questionType } from '../../typeList';

export interface QuestionListType {
  data: questionType;
  // onSave?: (key: string) => void;
}

function QuestionShow({ data }: QuestionListType) {
  const QuillRef = useRef<any>();

  const downLoadFile = async (questionId: string, fileId: string, name: string) => {
    if (questionId === '') {
      return;
    }
    const ret = await getFile(questionId, fileId);
    download(ret, name);
  };
  useEffect(() => {
    if (data.description) {
      QuillRef.current.setContent(data.description.renderedContent);
    } else {
      QuillRef.current.setContent('');
    }
  }, [data]);
  return (
    <>
      <div className={style.QuestionShow}>
        <div className={style.QuestionShowTitle}>Question Name</div>
        <span className={style.TitleShow}> {data.name}</span>

        <div className={style.QuestionShowTitle}>Descirption</div>
        <Quill
          ref={QuillRef}
          style={{
            height: 'auto',
            backgroundColor: '#fff',
          }}
          id={data.questionId}
          readOnly
        />
        {data.resources && (
          <div className={style.downloadFile}>
            <p className={style.downloadTitle}>Attachment:</p>
            {Object.keys(data.resources).map((key) => {
              const ite = data?.resources[key];
              return (
                <SeeButton
                  icon={<DownloadOutlined />}
                  type="ghost"
                  onClick={() => downLoadFile(data.questionId, ite.resourceId, ite.name)}
                >
                  {' '}
                  {ite.name}{' '}
                </SeeButton>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default memo(QuestionShow);
