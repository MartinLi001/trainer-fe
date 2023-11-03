import React, { useEffect, useRef, useState } from 'react';
import { Input, Space } from 'antd';
import styles from './index.less';
import { MinusCircleOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';

import { AuInput, AuButton } from '@aurora-ui-kit/core';

function OutPutList({ onChange, value }: { onChange?: (value: boolean) => void; value?: boolean }) {
  const [checked, setChecked] = useState(value);
  useEffect(() => {
    setChecked(value);
  }, [value]);

  const ChangeValue = () => {
    setChecked(!checked);
    if (onChange) onChange(!checked);
  };
  return (
    <div className={styles.outPut}>
      {checked ? (
        <div className={styles.outPutShow}>
          <Input value={'result'} addonBefore="Name" disabled={true} />{' '}
          <span onClick={() => ChangeValue()} className={styles.deleteCheck}>
            <CloseOutlined style={{ cursor: 'pointer' }} />
          </span>
        </div>
      ) : (
        ''
      )}
      <AuButton
        onClick={() => ChangeValue()}
        disabled={checked}
        variant="gray"
        prefix={<PlusOutlined />}
        className={styles.addButton}
        shape="round"
      >
        Add
      </AuButton>
    </div>
  );
}

export default OutPutList;
