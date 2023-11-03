import React from 'react';

export interface CourseListProps {
  data: API.TaskType[];
  sort?: string;
  extra?: (dataItem: API.TaskType) => React.ReactElement;
}

export type SortList = Record<string, API.TaskType[]>;
