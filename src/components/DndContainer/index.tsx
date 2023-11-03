import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from './DragDropCard';
import DragBox from './DragBox';
import List from './List';

/**
 * 使用拖拽功能必须用这个包起来
 */
export default function DndComponentProvider({ children }: I.DndProvider) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}

/**
 * 可以拖动的组件，只有drag功能
 * @param props.item 拖拽时携带的属性
 * @param props.begin 拖拽开始时执行的方法，就收一个参数：item
 * @param props.end 放下时执行的方法, 接收两个参数，1）drop组件在drop方法执行时返回的对象，2）mintor: DragSourceMonitor
 * @param props.className
 * @param props.children
 */
export function DragCard(props: I.DragCard) {
  const { children, ...param } = props;
  return <DragBox {...param}>{children}</DragBox>;
}

/**
 * 放card的容器，可以将容器外的card拖到里面，只有drop功能
 * @param props.hover (item?: any, monitor?: DropTargetMonitor) => void;
 * @param props.className
 * @param props.children
 */
export function DropContainer(props: I.DropContainer) {
  const { children, ...param } = props;
  return <List {...param}>{children}</List>;
}

/**
 * 既能drag，又能drop，可以用来做拖动排序
 * @index
 * @item 拖拽时携带的属性
 * @moveCard (dragIndex: number, hoverIndex: number, dragItem?: any) => void; 拖动排序时用于交换两个Card位置的方法，接收3个参数，1）正在拖动的Card的index，2）悬停在的Card的index，3）可选，正在拖拽的item的所有属性
 * @moveClassName 拖动到card上面时card容器的样式
 * @param props.className
 * @children
 */
export function DragDropCard(props: I.DragDropCard) {
  const { children, ...param } = props;
  return <Card {...param}>{children}</Card>;
}
