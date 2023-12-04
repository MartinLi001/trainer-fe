import { request } from '@/utils';

export function getUserList(data: any) {
  return request.post(`/batch/api/v2/trainer/users/ids`, {
    data,
  });
}
export function getSearchUser(data: any) {
  return request.post(`/users/api/v2/trainer/search`, {
    data,
  });
}

export function searchTrainers(data: any) {
  return request.post(`/batch/api/v2/trainer/users/trainer`, {
    data,
  });
}

export function searchTrainees(data: any) {
  return request.post(`/batch/api/v2/trainer/users/trainee`, {
    data,
  });
}


export function searchUsers(data: any) {
  // return Promise.resolve({
  //   users: [
  //     {
  //       userId: '16a84f51-14d2-4bb1-acd6-95bd29d2c8e4',
  //       firstname: 'Zongrui',
  //       lastname: 'Liu',
  //       preferredName: 'Zongrui',
  //       addresses: [
  //         {
  //           addressId: 'ec5c7199-62bd-4e05-a327-280a7e14cc9e',
  //           addressLine1: '17 Washington St',
  //           addressLine2: '',
  //           apt: '',
  //           city: 'Malden',
  //           state: 'Massachusetts',
  //           zipcode: '02148',
  //           isPrimaryAddress: 'true',
  //         },
  //       ],
  //       appUserId: 'orgappu_7211ba7b-3109-4db2-82fd-ac224cc50880',
  //       orgUserId: 'orgu_eb605ce0-eb9d-4dff-9dd9-2957fb87b3e5',
  //       status: 'Terminated',
  //       summaries: [
  //         {
  //           summaryId: 'baf04a8a-d52c-43c9-a554-767722609964',
  //           userId: '0a2f6fca-9c10-4a5e-9d95-196640dc1e78',
  //           overall: '"23.5 Java\nfiltered 6/5"',
  //           createdDateTime: {
  //             $date: '2023-07-27T19:54:46.642Z',
  //           },
  //           lastModifiedDateTime: {
  //             $date: '2023-07-27T19:54:46.642Z',
  //           },
  //         },
  //       ],
  //       tags: [
  //         {
  //           name: 'role',
  //           value: 'Trainee',
  //         },
  //       ],
  //       tenantUserId: 'tu_fcf081de-bc77-4e9b-bac2-d6147c121a9c',
  //       email: 'zongruiaus@gmail.com',
  //       firstName: 'Zongrui',
  //       lastName: 'Liu',
  //     },
  //   ],
  //   totalUserFound: 1,
  // });
  return request.post(`/batch/api/v2/trainer/users/search`, {
    data,
  });
}
/**
 * 删除Trainee
 */

export const deleteTrainee = (data: any) => {
  return request.delete('/batch/api/v2/trainer/trainee/remove', {
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
  return request.delete('/batch/api/v2/trainer/trainer/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

export function trainerAdd(data: any) {
  return request.post(`/batch/api/v2/trainer/trainer/add`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export function traineeAdd(data: any) {
  return request.post(`/batch/api/v2/trainer/trainee/add`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

export function getSubscription(id: string) {
  return request.get(`/subscriptions/api/v2/trainer/${id}`);
}
