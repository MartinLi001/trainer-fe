import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import IconFont from '../IconFont';
import { AuButton } from '@aurora-ui-kit/core';

interface CodeListProps {
  type: number;
  addFile: () => void;
}
// * - 0 sample-solution
// * - 1 Dependency-file
// * - 2 input output
// * - 3 Add General Class
// * - 4 Add General Function

const emptyCodeShowList = [
  {
    key: '0',
    title: 'Add Sample Solution',
    content:
      'Click the button below to add a Sample Solution for this question. It will be displayed to the users when enabled.',
    button: 'Add Sample Solution',
  },
  {
    key: '1',
    title: 'Dependency File',
    content:
      'Click the button below to add a Solution Template for this question. It will be displayed for this question at startup.',
    button: 'Add Solution Template',
  },
  {
    key: '2',
    title: 'No Existing Parser',
    content: 'Select an Input & Output Parameter from the left to add a Parser.',
    button: '',
  },
  {
    key: '3',
    title: 'Add General Class',
    content: 'Click the button below to add a General Class for this question.',
    button: 'Add Sample Solution',
  },
  {
    key: '4',
    title: 'Add General Function',
    content: 'Click the button below to add a General Function for this question.',
    button: 'Add Sample Solution',
  },
];
function EmptyCode({ type, addFile }: CodeListProps) {
  return (
    <div className={styles.EmptyCode}>
      <IconFont type="icon-a-Iconscode" style={{ fontSize: 40 }} />
      <div className={styles.emptyTitle}>{emptyCodeShowList[type].title}</div>
      <div className={styles.emptyPageContent}>{emptyCodeShowList[type].content}</div>
      {emptyCodeShowList[type].button && (
        <AuButton type="link" prefix={<IconFont type="icon-add-line" />} onClick={addFile}>
          {emptyCodeShowList[type].button}
        </AuButton>
      )}
    </div>
  );
}

export default EmptyCode;
