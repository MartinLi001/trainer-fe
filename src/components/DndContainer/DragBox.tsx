import React from 'react';
import { useDrag } from 'react-dnd';

const Box: React.FC<I.DragCard> = ({
  item,
  children,
  begin = () => null,
  end = () => null,
  ...param
}) => {
  const [, drag] = useDrag({
    type: 'card',
    item() {
      begin?.(item);
      return item;
    },
    end,
  });
  return (
    <div ref={drag} {...param}>
      {children}
    </div>
  );
};

export default Box;
