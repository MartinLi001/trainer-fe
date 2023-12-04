import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import CodeMirrorCom from '@/components/CodeMirror6';
import { Badge } from 'antd';
import { updateCodeFile } from '@/services/coder';

interface CodeFileType {
  fileName: string;
  fileContent: string;
  questionId: string;
  language: 'js' | 'java' | 'cpp' | 'python' | 'csharp';
  id: number;
}

interface CodeFileTypeShow {
  data: CodeFileType;
  onChange: (value: string) => void;
}
function CodeFileTypeShow({ data, onChange }: CodeFileTypeShow) {
  const [codeShow, setCodeShow] = useState(false);
  const [editFlag, setEditFlag] = useState(false);

  const autoSave = (value: string) => {
    updateCodeFile({ ...data, fileContent: value }).then(() => {
      setEditFlag(false);
    });
  };

  const onChangeCode = (value: string) => {
    setEditFlag(true);
    onChange(value);
  };

  useEffect(() => {
    setCodeShow(false);
    if (data.fileName) {
      setTimeout(() => {
        setCodeShow(true);
      }, 0);
    }
  }, [data.fileName]);
  return (
    <div className={styles.CodeFile}>
      <span className={styles.CodeFileName}>
        <Badge dot={true} offset={[12, 12]} color={editFlag ? '#FF4D4F' : '#52C41A'}>
          <span className={styles.fileName}>{data.fileName}</span>
        </Badge>
      </span>
      {codeShow && (
        <div className={styles.CodeShow}>
          <CodeMirrorCom
            codeValue={data.fileContent}
            onChange={onChangeCode}
            autoSaveCode={autoSave}
            language={data.language}
          />
        </div>
      )}
    </div>
  );
}
export default CodeFileTypeShow;
