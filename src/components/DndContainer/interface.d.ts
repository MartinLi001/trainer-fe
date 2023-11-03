declare namespace I {
  interface DndProvider {
    children: any;
  }
  interface DropContainer {
    hover?: (item?: any, monitor?: DropTargetMonitor) => void;
    className?: string;
    children?: any;
    [param: string]: any;
  }
  interface DragCard {
    item: any;
    begin?: (item?: any) => void;
    end?: (item?: any, monitor?: DragSourceMonitor) => void;
    className?: string;
    children?: any;
    [param: string]: any;
  }
  interface DragDropCard {
    index: number;
    item: any;
    moveCard: (dragIndex: number, hoverIndex: number, dragItem?: any) => void;
    moveClassName?: string;
    dragEnd?: (item?: any, monitor?: DragSourceMonitor) => void;
    className?: string;
    children: any;
    [param: string]: any;
  }
}
