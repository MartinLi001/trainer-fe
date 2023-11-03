import { request } from '@/utils';

export function getUserList(data: any) {
  return request.post(`/users/api/v1/ids`, {
    data,
  });
}
export function getSearchUser(data: any) {
  return request.post(`/users/api/v1/search`, {
    data,
  });
}

/**
 * 删除Trainee
 */

export const deleteTrainee = (data: any) => {
  return request.delete('/batch/api/v1/trainee/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};
/**
 * 删除Trainer
 */

export const deleteTrainer = (data: any) => {
  return request.delete('/batch/api/v1/trainer/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

export function trainerAdd(data: any) {
  return request.post(`/batch/api/v1/trainer/add`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export function traineeAdd(data: any) {
  return request.post(`/batch/api/v1/trainee/add`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export function getSubscription(id: string) {
  return request.get(`/subscriptions/api/v1/${id}`);
}
