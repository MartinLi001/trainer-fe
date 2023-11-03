import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Calendar, Typography } from 'antd';
import type { Moment } from 'moment';
import { month2ENGmonth } from '@/utils';
import { memo } from 'react';
import './index.less';
import SeeButton from '@/components/SeeButton';

export interface CalendList {
  onChoose?: (key: string) => void;
}

function CalendaRight({ onChoose }: CalendList) {
  const onPanelChange = (value: Moment) => {
    if (onChoose) onChoose(value.format('YYYY-MM-DD'));
  };
  const onSelect = (value: Moment) => {
    if (onChoose) onChoose(value.format('YYYY-MM-DD'));
  };
  return (
    <div className={'Calendarmodule'}>
      <Calendar
        fullscreen={false}
        headerRender={({ value, onChange }) => {
          const monthnew = value.month();
          const year = value.year();
          return (
            <div className="CalendarHeader">
              <Typography.Title level={4}>
                {month2ENGmonth[monthnew]}
                {year}
              </Typography.Title>
              <div>
                <SeeButton
                  type="link"
                  icon={<LeftOutlined />}
                  style={{ marginRight: 20 }}
                  className="buttonSWitch"
                  onClick={() => {
                    const now = value.clone().month(monthnew - 1);
                    onChange(now);
                  }}
                ></SeeButton>
                <Button
                  type="link"
                  icon={<RightOutlined />}
                  className="buttonSWitch"
                  onClick={() => {
                    const now = value.clone().month(monthnew + 1);
                    onChange(now);
                  }}
                ></Button>
              </div>
            </div>
          );
        }}
        onPanelChange={onPanelChange}
        onSelect={onSelect}
      />
    </div>
  );
}

export default memo(CalendaRight);
