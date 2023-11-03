import React, { useEffect, useState } from 'react';

import styles from './index.less';
import { Drawer } from 'antd';
import { AuButton } from '@aurora-ui-kit/core';
import CodeMirrorCom from '@/components/CodeMirror6';

interface PreviewModalprops {
  /**
   * 是否显示
   */
  visible?: boolean;
  //数据
  previewData: string;
  /**
   * 关闭事件
   */
  handleCancel: () => void;
  /**
   * 返回之后显示文字。
   */
  loading?: boolean;
}

interface searchType {
  page: number;
  pageSize: number;
  content?: string;
}
export default function PreviewModal({
  visible,
  handleCancel,
  loading = false,
  previewData,
}: PreviewModalprops) {
  return (
    <Drawer
      footer={<AuButton onClick={handleCancel} type='outlined'> Close </AuButton>}
      open={visible}
      onClose={handleCancel}
      // wrapClassName={styles.addMemberModal}
      width={700}
      closable={false}
      title={'Solution Template Preview'}
    >
      <div className={styles.PreviewModal}>
        <CodeMirrorCom codeValue={previewData} readOnly={true} />
      </div>
    </Drawer>
  );
}
