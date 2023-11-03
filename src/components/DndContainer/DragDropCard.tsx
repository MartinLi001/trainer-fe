import React, { useRef } from 'react';
// import type { XYCoord } from 'dnd-core';
import { useDrag, useDrop } from 'react-dnd';
import type { DragSourceMonitor, DropTargetMonitor } from 'react-dnd';

const Card: React.FC<I.DragDropCard> = ({
  index,
  item,
  moveCard,
  moveClassName,
  dragEnd,
  children,
  ...param
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { ...item, index },
    end: dragEnd,
  });

  const [, drop] = useDrop({
    accept: 'card',
    collect: (minoter: DropTargetMonitor) => ({
      isOver: minoter.isOver(),
    }),
    hover(dragItem: any) {
      if (!ref.current) {
        return;
      }
      const dragIndex = dragItem.index;
      const hoverIndex = index;

      // 拖拽元素下标与鼠标悬浮元素下标一致时，不进行操作
      if (dragIndex === hoverIndex) {
        return;
      }

      // // 确定屏幕上矩形范围
      // const hoverBoundingRect = ref.current!.getBoundingClientRect();

      // // 获取中点垂直坐标
      // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // // 确定鼠标位置
      // const clientOffset = monitor.getClientOffset();

      // // 获取距顶部距离
      // const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // /**
      //  * 只在鼠标越过一半物品高度时执行移动。
      //  *
      //  * 当向下拖动时，仅当光标低于50%时才移动。
      //  * 当向上拖动时，仅当光标在50%以上时才移动。
      //  *
      //  * 可以防止鼠标位于元素一半高度时元素抖动的状况
      //  */

      // // 向下拖动
      // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      //   return;
      // }

      // // 向上拖动
      // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      //   return;
      // }

      // 执行 move 回调函数
      moveCard(dragIndex, hoverIndex, dragItem);

      /**
       * 如果拖拽的组件为 dragCard，则 dragIndex 为 undefined，此时不对 item 的 index 进行修改
       * 如果拖拽的组件为 dragDropCard，则将 hoverIndex 赋值给 item 的 index 属性, 也为了阻止抖动闪烁
       */
      if (dragItem.index !== undefined) {
        dragItem.index = hoverIndex;
      }
    },
  });

  /**
   * 使用 drag 和 drop 对 ref 进行包裹，则组件既可以进行拖拽也可以接收拖拽组件
   * 使用 dragPreview 包裹组件，可以实现拖动时预览该组件的效果
   */
  drag(drop(ref));

  return (
    <div ref={ref} className={isDragging ? moveClassName : ''} {...param}>
      {children}
    </div>
  );
};

export default Card;
