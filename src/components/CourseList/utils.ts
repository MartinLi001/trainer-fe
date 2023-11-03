import moment from 'moment';

/**
 * @description 对数据进行分组，data是要被分组的数据[]，key是分组依据的关键字
 */
export const data2group = (data: API.TaskType[], key: string) => {
  const groups = {};
  data.forEach((item) => {
    const value = item[key];
    let dateFormat;
    dateFormat = `${value}`;
    if (key === 'priority') {
      dateFormat = `${value}`;
    } else {
      dateFormat = `${item.priority}/${moment(value).format('YYYY-MM-DD')}`;
    }
    groups[dateFormat] = groups[dateFormat] || [];
    groups[dateFormat].push(item);
  });
  return groups;
};

export const formatTaskTitle = (task: API.TaskType) => {
  if (task.startDateTime) {
    return `Day ${task.priority} - ${moment(task.startDateTime).format('YYYY MMMM Do')}`;
  }
  return `Day ${task.priority}`;
};
