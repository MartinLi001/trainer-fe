import React from 'react';
import { useDrop } from 'react-dnd';

const List: React.FC<I.DropContainer> = ({ hover = () => null, children, ...param }) => {
  const [, drop] = useDrop({
    accept: 'card',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: hover,
    // drop(item: any, monitor) {},
  });

  return (
    <div ref={drop} {...param}>
      {children}
    </div>
  );
};

export default List;
