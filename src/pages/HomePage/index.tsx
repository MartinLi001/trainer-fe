import React, { useEffect, useState } from 'react';
import style from './index.less';
import ItemCard from './components/ItemCard';
import CalendaRight from './components/Calendar';
import BlankPage from './components/BlankPage';
import notask from '@/assets/notask.svg';
import smile from '@/assets/smile.png';
import ListBatch from './components/ListItem';
import type { valuesType } from './TypeList';
import { useModel } from 'umi';
import { Select, Spin } from 'antd';
const { Option } = Select;
const HomePage: React.FC = () => {
  const { data = {}, loading } = useModel('useBatch');
  const tasks = (data?.tasks as valuesType[]) || [];
  const [valueShow, setValueShow] = useState<boolean>(false);
  const [dataList, setDataList] = useState<valuesType[]>([]);

  const chooseCalend = (date: string) => {
    const temp: valuesType[] = [];
    tasks.map((ite) => {
      if (ite.startDateTime && ite.startDateTime.indexOf(date) != -1) {
        temp.push(ite);
      }
    });
    if (temp.length > 0) {
      setDataList(temp);
      setValueShow(true);
    } else {
      setDataList([]);
      setValueShow(false);
    }
  };

  useEffect(() => {
    setValueShow(true);
    chooseCalend(getNowFormatDate());
  }, [data]);

  const BlankPageFlag = !Object.keys(data).length;

  if (loading)
    return (
      <Spin
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
      />
    );

  return (
    <>
      <div style={{ display: 'none' }}>test</div>
      {BlankPageFlag && <BlankPage />}
      {!BlankPageFlag && (
        <div className={style.PageHome}>
          <ItemCard />
          <div className={style.PageHomeContent}>
            {valueShow && (
              <div className={style.PageTask}>
                <span className={style.PageTaskTitle}>Tasks</span>
                <div className={style.PageTaskSlect}>
                  <span className={style.PageTaskSlectTitle}>Sort by</span>
                  <Select style={{ width: 120 }} className={style.PageTaskSlectList}>
                    <Option value="jack">Time</Option>
                    <Option value="lucy">Status</Option>
                  </Select>
                </div>
                <div className={style.PageTaskListBatch}>
                  <ListBatch list={dataList} />
                </div>
              </div>
            )}
            {!valueShow && (
              <div className={style.PageTask}>
                <span className={style.PageTaskTnoitle}>
                  No Tasks Today<img src={smile} width={30}></img>
                </span>
                <img src={notask} style={{ maxWidth: '100%' }} />
              </div>
            )}
            <div className={style.PageCalend}>
              <span className={style.PageCalendTitle}>Search tasks by dates</span>
              <CalendaRight onChoose={chooseCalend} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;

function getNowFormatDate() {
  const date = new Date(),
    seperator1 = '-', //格式分隔符
    year = date.getFullYear(); //获取完整的年份(4位)
  let month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
    strDate = date.getDate(); // 获取当前日(1-31)
  if (month >= 1 && month <= 9) month = '0' + month; // 如果月份是个位数，在前面补0
  if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate; // 如果日是个位数，在前面补0

  const currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
