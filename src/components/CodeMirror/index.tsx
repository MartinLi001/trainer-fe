import { useRef, useImperativeHandle, forwardRef, useCallback, useEffect, useState } from 'react';
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
// import 'codemirror/addon/hint/show-hint';
// import 'codemirror/theme/dracula.css';
// import 'codemirror/keymap/sublime';
// import 'codemirror/addon/display/placeholder';

// import 'codemirror/mode/sql/sql';
// import 'codemirror/addon/hint/sql-hint';

// import 'codemirror/mode/python/python';
// import 'codemirror/mode/clike/clike';

// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/addon/hint/javascript-hint';

// import 'codemirror/mode/swift/swift';

import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { EditorView } from '@codemirror/view';
import { csharp } from '@replit/codemirror-lang-csharp';
import { sql } from '@codemirror/lang-sql';
import { swift } from '@codemirror/legacy-modes/mode/swift';
import { kotlin } from '@codemirror/legacy-modes/mode/clike';
import { StreamLanguage } from '@codemirror/language';
import { dracula } from '@uiw/codemirror-theme-dracula';

import React from 'react';

const langConfigMap = {
  JavaScript: [javascript({ jsx: true })],
  Java: [java()],
  cpp: [cpp()],
  Python: [python()],
  CSharp: [csharp()],
  SQL: [sql()],
  Swift: [StreamLanguage.define(swift)],
  Kotlin: [StreamLanguage.define(kotlin)],
};

interface CodeType extends ReactCodeMirrorProps {
  languge?: 'JavaScript' | 'Java' | 'cpp' | 'Python' | 'CSharp' | 'SQL';
  content: string;
  options?: any;
  onChange?: (value: string) => void;
  autoSaveCode?: (value: string) => void;
}

const LanguageConfig = {
  Java: 'text/x-java',
  JavaScript: 'javascript',
  SQL: 'text/x-sql',
  Python: 'text/x-python',
  CSharp: 'text/x-csharp',
  Swift: 'text/x-swift',
  Kotlin: 'text/x-csrc',
};

function CodeMirrorCom(
  {
    height = '200px',
    languge = 'JavaScript',
    options,
    width,
    content,
    onChange,
    autoSaveCode,
    ...restProps
  }: CodeType,
  ref: any,
) {
  const [code, setCode] = useState<string>('');
  const [languageShow, setLanguageShow] = useState<
    'JavaScript' | 'Java' | 'cpp' | 'Python' | 'CSharp' | 'SQL'
  >('JavaScript');

  console.log('%cindex.tsx line:75 1111', 'color: #007acc;', 1111);
  // useEffect(() => {
  //   setCode(content);
  // }, [content]);

  // useEffect(() => {
  //   setLanguageShow(languge);
  // }, [languge]);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return code;
      },
      setOption(mode: 'JavaScript' | 'Java' | 'cpp' | 'Python' | 'CSharp' | 'SQL') {
        setLanguageShow(mode);
      },
      setValue(value: string) {
        setCode(value);
      },
    };
  });

  const onChangeCode = React.useCallback((value: string) => {
    if (onChange) onChange(value);
    setCode(value);
  }, []);

  return (
    <CodeMirror
      value={code}
      theme={dracula}
      extensions={[langConfigMap[languageShow], EditorView.lineWrapping]}
      onChange={onChangeCode}
      height={`${height}px`}
      width={`${width}px`}
      {...options}
      {...restProps}
    />
  );
}

export default forwardRef(CodeMirrorCom);

export { LanguageConfig };
