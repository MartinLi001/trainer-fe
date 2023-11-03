import { List } from 'antd';
import React from 'react';
import Lecture from '@/assets/Lecture.svg';
import Assignment from '@/assets/Assignment.svg';
import Mock from '@/assets/Mock.svg';
import Project from '@/assets/Project.svg';
import type { ListItem } from '../../TypeList';
import ListCard from '../Card';

const data: ListItem[] = [
  {
    title: 'Lecture',
    color: '#2875D0',
    picture: Lecture,
  },
  {
    title: 'Assignment',
    color: '#FFB121',
    picture: Assignment,
  },
  {
    title: 'Mock',
    color: '#EF6C6D',
    picture: Mock,
  },
  {
    title: 'Project',
    color: '#8FCE28',
    picture: Project,
  },
];

const ItemCard: React.FC = () => (
  <List
    grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }}
    dataSource={data}
    renderItem={(item) => (
      <List.Item>
        <ListCard item={item} />
      </List.Item>
    )}
  />
);
export default ItemCard;
