// @ts-ignore
/* eslint-disable */
import { request } from '@/utils';

export function saveGrade(data: any) {
  return request.put('/batch/api/v1/assignment/mark', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export const deleteResource = (data: any) => {
  return request.delete('/batch/api/v1/task/resource/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

export function commentAdd(data: any) {
  return request.post('/batch/api/v1/assignment/comment/add', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export function commentUpdate(data: any) {
  return request.put('/batch/api/v1/assignment/comment/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export const commentDelete = (data: any) => {
  return request.delete('/batch/api/v1/assignment/comment/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

export function ResourceAdd(data: any) {
  return request.post('/batch/api/v1/task/resource/add', {
    data,
    requestType: 'form',
    headers: {
      'request-type': 'command',
    },
    timeout: 90000,
  });
}

export function UpdateAssignment(data: any) {
  return request.put('/batch/api/v1/assignment/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export function mockCommentUpdate(data: any) {
  return request.put('/batch/api/v1/mock/comment/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}
