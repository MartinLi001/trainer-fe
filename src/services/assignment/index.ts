// @ts-ignore
/* eslint-disable */
import { request } from '@/utils';

export function saveGrade(data: any) {
  return request.put('/batch/api/v2/trainer/assignment/mark', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export const deleteResource = (data: any) => {
  return request.delete('/batch/api/v2/trainer/task/resource/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

export function commentAdd(data: any) {
  return request.post('/batch/api/v2/trainer/assignment/comment/add', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export function commentUpdate(data: any) {
  return request.put('/batch/api/v2/trainer/assignment/comment/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export const commentDelete = (data: any) => {
  return request.delete('/batch/api/v2/trainer/assignment/comment/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

export function ResourceAdd(data: any) {
  return request.post('/batch/api/v2/trainer/task/resource/add', {
    data,
    requestType: 'form',
    headers: {
      'request-type': 'command',
    },
    timeout: 90000,
  });
}

export function UpdateAssignment(data: any) {
  return request.put('/batch/api/v2/trainer/assignment/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export function mockCommentUpdate(data: any) {
  return request.put('/batch/api/v2/trainer/mock/comment/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}
