import { Modal, ModalProps } from 'antd';
import React from 'react';
import styles from './index.less';

export default function CommonModal(
  props: JSX.IntrinsicAttributes & ModalProps & { children?: React.ReactNode },
) {
  return <Modal {...props} className={styles.commonModalWrap + ' ' + props.className} />;
}
