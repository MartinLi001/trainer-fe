import React, { useState } from 'react';
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { EditorView } from '@codemirror/view';
import { csharp } from '@replit/codemirror-lang-csharp';
import { useDebounceEffect } from 'ahooks';
import { whiteLight } from '@uiw/codemirror-theme-white';
import './index.less';

const langConfigMap = {
  js: [javascript({ jsx: true })],
  java: [java()],
  cpp: [cpp()],
  python: [python()],
  csharp: [csharp()],
};

interface CodeType extends ReactCodeMirrorProps {
  language?: 'js' | 'java' | 'cpp' | 'python' | 'csharp';
  codeValue: string;
  onChange?: (value: string) => void;
  autoSaveCode?: (value: string) => void;
}
function CodeMirrorCom({
  height = '100%',
  language = 'js',
  codeValue,
  onChange,
  autoSaveCode,
  ...restProps
}: CodeType) {
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const [code, setCode] = useState<string>(codeValue);

  const onChangeCode = React.useCallback((value: string) => {
    if (onChange) onChange(value);
    setCode(value);
    setEditFlag(true);
  }, []);

  // 自动保存

  const autoSave = () => {
    if (autoSaveCode) autoSaveCode(code);
    setEditFlag(false);
  };

  useDebounceEffect(
    () => {
      if (editFlag) {
        autoSave();
      }
    },
    [code],
    {
      wait: 2000,
    },
  );
  return (
    <CodeMirror
      value={codeValue}
      theme={whiteLight}
      extensions={[langConfigMap[language], EditorView.lineWrapping]}
      onChange={onChangeCode}
      // onFocus={() => setEditFlag(true)}
      onBlur={() => {
        if (editFlag) autoSave();
      }}
      height={height}
      {...restProps}
    />
  );
}
export default CodeMirrorCom;
