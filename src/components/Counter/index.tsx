import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import SeeButton from '../SeeButton';
import styles from './index.less';

export interface CounterProps {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  value?: number;
  onChange?: (value: number) => void;
}

export default function Counter({
  min = 0,
  max = 5,
  value = 0,
  step = 0.1,
  precision,
  onChange,
}: CounterProps) {
  // const [current, { inc, dec, set }] = useCounter(value, { min: min / step, max: max / step });

  const [current, setCurrent] = useState<any>(value);

  const reduce = () =>
    setCurrent((now: any) => {
      const res = (now * 1000 - step * 1000) / 1000;
      if (res <= min) return min;
      return res;
    });

  const add = () =>
    setCurrent((now: any) => {
      const res = (now * 1000 + step * 1000) / 1000;
      if (res >= max) return max;
      return res;
    });

  useEffect(() => {
    onChange?.(current);
  }, [onChange, current]);

  // const result = useMemo(() => current.toFixed(1), [current]);

  return (
    <div className={styles.wrapper}>
      <SeeButton
        icon={<MinusOutlined />}
        shape="circle"
        onClick={() => reduce()}
        disabled={current == min}
      />
      <InputNumber
        min={min}
        max={max}
        controls={false}
        size="large"
        value={current}
        onChange={(v) => setCurrent(v || 0)}
        precision={precision}
        // onChange={(v) => setCurrent(+`${v}`.slice(0, 3) || 0)}
        className={styles.inputNumber}
      />
      <SeeButton
        icon={<PlusOutlined />}
        shape="circle"
        onClick={() => add()}
        disabled={current == max}
      />
    </div>
  );
}
