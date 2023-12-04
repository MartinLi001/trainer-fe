import { request } from '@/utils';
import type { AddCommentRequest, removeCommentRequest } from './interface';

export const batchQuery = (batchId: string) => {
  return request.get(`/batch/api/v2/trainer/${batchId}`);
};

/**
 * @description 获取当前用的category
 */
export const getCategory = () => {
  return request.get('/batch/api/v2/trainer/category');
};

/**
 * @description 学生端获取当前用户下的batchId
 */
export const getBatchId = () => {
  return request.get('/batch/api/v2/trainer/user');
};

/**
 * @description 通过taskId查看信息
 */
export const getTaskInfo = (taskId: string): any => {
  return request.get(`/batch/api/v2/trainer/task/${taskId}`);
};

/**
 * @description 通过taskId查看信息
 */
export const downloadTaskFile = (taskId: string, resourceId: string) => {
  return request.get(`/batch/api/v2/trainer/task/file/download?taskId=${taskId}&resourceId=${resourceId}`);
};

/**
 * @description 新增评论信息
 */
export const addComment = (data: AddCommentRequest) => {
  return request.post('/batch/api/v2/trainer/assignment/comment/add', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

/**
 * @description 删除评论信息
 */
export const removeComment = (data: removeCommentRequest) => {
  return request.delete('/batch/api/v2/trainer/assignment/comment/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

/**
 * @description 删除评论信息
 */
export const submitAssignment = (data: FormData) => {
  return request.post('/batch/api/v2/trainer/assignment/submit', {
    data,
    requestType: 'form',
    headers: {
      'request-type': 'command',
    },
  });
};

/**
 * @description 添加组内评论信息
 */
export const addGroupReviewComment = (data: AddCommentRequest) => {
  return request.post('/batch/api/v2/trainer/project/group/review/add', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};
