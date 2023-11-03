// import DndComponentProvider, { Container, DragCard, DragDropCard } from '@/components/DndContainer';
import DndComponentProvider, { DragDropCard } from '@/components/DndContainer';
// import Card from '@/components/DndContainer/DragDropCard';
import { cloneDeep } from 'lodash';
import { useState } from 'react';
import styles from './demo.less';

// const initList = [
//   { id: '0', category: '000', text: '000', bg: 'lightpink' },
//   { id: '1', category: '111', text: '111', bg: 'lightpink' },
//   { id: '2', category: '222', text: '222', bg: 'lightpink' },
//   { id: '3', category: '333', text: '333', bg: 'lightpink' },
// ];

const initGroup = [
  { id: '4', category: '444', text: '444', bg: 'lightpink' },
  { id: '5', category: '555', text: '555', bg: 'lightpink' },
  { id: '6', category: '666', text: '666', bg: 'lightpink' },
  { id: '7', category: '777', text: '777', bg: 'lightpink' },
  { id: '8', category: '888', text: '888', bg: 'lightpink' },
];

export default function Demo() {
  //   const [list, setList] = useState(initList);
  const [groups, setGroups] = useState(initGroup);

  return (
    <div>
      <DndComponentProvider>
        {groups.map((item, index) => (
          <DragDropCard
            key={index + '-card'}
            index={index}
            item={item}
            moveCard={(dragIndex, hoverIndex) => {
              // 交换拖动的item和目标item的位置
              const dragCard = groups[dragIndex];
              const backupList = cloneDeep(groups);
              backupList.splice(dragIndex, 1);
              backupList.splice(hoverIndex, 0, dragCard);
              setGroups(backupList);
            }}
          >
            <div className={styles.item}>
              <div>{item.text}</div>
            </div>
          </DragDropCard>
        ))}
      </DndComponentProvider>

      <br />

      {/* <DndComponentProvider>
        {list.map((item, index) => (
          <DragCard
            key={index + 'dragcard'}
            item={item}
            end={(_, monitor) => {
              const lessIndex = groups.findIndex((i) => i.id === item.id);
              if (!monitor.didDrop() && lessIndex >= 0) {
                const backupList = cloneDeep(groups);
                backupList.splice(lessIndex, 1);
                setGroups(backupList);
              }
            }}
          >
            <div className={styles.item}>
              <div>{item.category}</div>
            </div>
          </DragCard>
        ))}
        <Container
          hover={(item) => {
            const useless = groups?.find((i) => i.id === item.id);
            // 拖拽开始时，向 list 数据源中插入一个占位的元素，如果占位元素已经存在，不再重复插入
            if (!useless) {
              setGroups([...groups, { ...item }]);
            }
          }}
        >
          <div className={styles.container}>
            {groups.map((item, index) => (
              <DragDropCard
                index={index}
                key={index + 'card'}
                item={item}
                moveCard={(dragIndex, hoverIndex, dragItem) => {
                  if (dragIndex === undefined) {
                    const lessIndex = groups.findIndex((item) => item.id === dragItem.id);
                    if (lessIndex < 0) return;
                    const card = groups[lessIndex];
                    const backupList = cloneDeep(groups);
                    backupList.splice(lessIndex, 1);
                    backupList.splice(hoverIndex, 0, card);
                    setGroups(backupList);
                  } else {
                    const dragCard = groups[dragIndex];
                    const backupList = cloneDeep(groups);
                    backupList.splice(dragIndex, 1);
                    backupList.splice(hoverIndex, 0, dragCard);
                    setGroups(backupList);
                  }
                }}
              >
                <div className={styles.item}>
                  <div>{item.category}</div>
                </div>
              </DragDropCard>
            ))}
          </div>
        </Container>
      </DndComponentProvider> */}
    </div>
  );
}
