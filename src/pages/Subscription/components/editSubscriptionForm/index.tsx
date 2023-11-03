import { getClients } from '@/services/question';
import { CloseOutlined } from '@ant-design/icons';
import { Checkbox, DatePicker, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment from 'moment';
import type { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import type { clientType } from '../../typeList';
import SelectChoose from '../selectChoose';
import styles from './index.less';
import SelectChooseStyles from './selectChooseStyles.less';

type SelectOptionType = { label: string; value: string };

interface Props {
  clients: string[];
  setClients: (v: string[]) => void;
  subscribeAllClients: boolean;
  setSubscribeAllClients: (v: boolean) => void;
  setStartDate: React.Dispatch<React.SetStateAction<Moment | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Moment | undefined>>;
  startDate?: string | Moment;
  endDate?: string | Moment;
  cycle: number;
  setCycle: (v: number) => void;
}
export default function EditSubscriptionForm({
  clients,
  setClients,
  subscribeAllClients,
  setSubscribeAllClients,
  setStartDate,
  setEndDate,
  startDate,
  endDate,
  cycle,
  setCycle,
}: Props) {
  const [clientOptions, setClientOptions] = useState<SelectOptionType[]>([]);
  const [endDatePicker, setEndDatePicker] = useState<Moment>(); // 结束时间选择器中的值，由于结束时间还受startDate, cycle影响，所以picker中的值在此保存一下

  function initClients() {
    getClients().then((res: clientType[]) => {
      setClientOptions(res.map((item) => ({ label: item.name, value: item.clientId })));
    });
  }

  useEffect(() => {
    initClients();
  }, []);
  useEffect(() => {
    // 初始化时，将结束时间的选择器的值赋为endDate
    if (!endDatePicker) {
      setEndDatePicker(endDate as Moment);
    }
  }, [endDate]);
  useEffect(() => {
    if ([30, 60, 90].includes(cycle)) {
      let res;
      if (startDate) {
        res = moment(startDate).add(cycle - 1, 'd'); // 开始时间取00:00，结束时间取23:59，计算时间差时需要-1
      }
      setEndDate(res);
    } else {
      setEndDate(endDatePicker);
    }
  }, [startDate, cycle, endDatePicker]);

  function onChangeAllClient(e: CheckboxChangeEvent) {
    const checked = e.target.checked;
    setSubscribeAllClients(checked);
    if (checked) {
      setClients([]);
    }
  }

  function onChangeCycle(e: RadioChangeEvent) {
    const value = e.target.value;
    setCycle(value);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.client}>
        <div className={styles.label}>Client</div>
        <SelectChoose
          value={clients}
          list={clientOptions}
          label="Click to Select"
          prop={{ id: 'value', name: 'label' }}
          onChange={setClients}
          classname={SelectChooseStyles}
          disabled={subscribeAllClients}
        />
        <div className={styles.selectedClient}>
          {clients.map((item) => (
            <div key={item + 'client'}>
              {clientOptions.find((i) => i.value === item)?.label}
              <CloseOutlined
                className={styles.icon}
                onClick={() => setClients(clients.filter((i) => i !== item))}
              />
            </div>
          ))}
        </div>
        {/* <Select
          className={styles.select}
          size="large"
          placeholder="Click to Select"
          options={clientOptions}
          mode="multiple"
          value={clients}
          onChange={setClients}
          showSearch={false}
          disabled={subscribeAllClients}
        /> */}
        {/* <Popover
          content={<div className={styles.content}>content</div>}
          placement="bottom"
          trigger="click"
        >
          <div className={styles.select}>Click to Select</div>
        </Popover> */}
        <div>
          <Checkbox
            className={styles.checkBox}
            defaultChecked
            checked={subscribeAllClients}
            onChange={onChangeAllClient}
          >
            All Client
          </Checkbox>
        </div>
      </div>
      <div className={styles.date}>
        <div className={styles.startDate}>
          <div className={styles.label}>Start Date</div>
          {/* @ts-ignore */}
          <DatePicker
            value={startDate}
            onChange={(v?: Moment) => setStartDate(v?.startOf('D'))}
            disabledDate={(current) => {
              return (
                (current && current < moment().startOf('day')) || // 今天之前的日期不可选
                (cycle === 0 && endDate && current > endDate) // 若自定义cycle，则结束日期之后的日期不可选
              );
            }}
            className={styles.datePicker}
            size="large"
          />
        </div>
        <div className={styles.endDate} hidden={cycle !== 0}>
          <div className={styles.label}>End Date</div>
          {/*  @ts-ignore */}
          <DatePicker
            value={endDate}
            onChange={(v?: Moment) => setEndDatePicker(v?.endOf('D'))}
            disabledDate={(current) => {
              return (
                // 今天之间的日期不可选、开始日期之前的日期不可选
                (current && current < moment().startOf('day')) || (startDate && current < startDate)
              );
            }}
            className={styles.datePicker}
            size="large"
          />
        </div>
      </div>
      <div className={styles.cycle}>
        <div className={styles.label}>Cycle</div>
        <Radio.Group value={cycle} onChange={onChangeCycle}>
          <Radio value={30}>30 Days</Radio>
          <Radio value={60}>60 Days</Radio>
          <Radio value={90}>90 Days</Radio>
          <Radio value={0}>Choose Specific End Date</Radio>
        </Radio.Group>
      </div>
    </div>
  );
}
