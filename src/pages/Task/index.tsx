import Lecture from '@/pages/Task/Lecture';
import { useParams } from 'umi';
import { taskType } from '@/components/CourseList/common';
import Mock from './mock';
import Project from '@/pages/Task/Project';
import Assignment from './Assignment';
import ShortMock from './ShortMock';
import { PageHeaderItemType } from '@/components/PageHeader';

const Task: React.FC = () => {
  const { type, taskId } = useParams<{ taskId: string; type: string }>();
  const pageHeaderItems = JSON.parse(
    localStorage.getItem('pageHeaderItems') ?? '[]',
  ) as PageHeaderItemType[];
  const taskData2Details = {
    [taskType.LECTURE]: <Lecture taskId={taskId} pageHeaderItems={pageHeaderItems} />,
    [taskType.ASSIGNMENT]: <Assignment taskId={taskId} pageHeaderItems={pageHeaderItems} />,
    [taskType.PROJECT]: <Project taskId={taskId} pageHeaderItems={pageHeaderItems} />,
    // @ts-ignore
    [taskType.CODINGMOCK]: <Mock taskId={taskId} type={type} pageHeaderItems={pageHeaderItems} />,
    [taskType.SHORTANSWERMOCK]: (
      // @ts-ignore
      <ShortMock taskId={taskId} type={type} pageHeaderItems={pageHeaderItems} />
    ),
  };

  return (
    <div style={{ height: 'calc(100vh - 56px)', overflow: 'auto' }}>{taskData2Details[type]}</div>
  );
};

export default Task;
