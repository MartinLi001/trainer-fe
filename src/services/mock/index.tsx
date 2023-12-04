import { request } from '@/utils';

/**
 * @description 删除评论信息
 */
/**
 * 更新用户信息
 */
export function submitShortResult(data: any) {
  return request.put('/batch/api/v2/trainer/mock/short/result/submit', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 更新用户信息
 */
export function submitCodingResult(data: any) {
  return request.put('/batch/api/v2/trainer/mock/coding/result/submit', {
    data,
    requestType: 'form',
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 更新mock group(创建、编辑普通组、创建、编辑补考组、创建、编辑一对一组)
 */
export function updateMockGroups(data: any) {
  return request.put('/batch/api/v2/trainer/mock/short/groups/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

// /**
//  * 更新mock Individual group
//  */
// export function updateMockIndividualGroups(data: any) {
//   return request.put('/batch/api/v2/trainer/mock/short/group/update', {
//     data,
//     headers: {
//       'request-type': 'command',
//     },
//   });
// }

/**
 * mock创建补考组
 */
export function updateMockMackupGroups(data: any) {
  return request.post('/batch/api/v2/trainer/mock/short/groups/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 更新coding mock status
 */
export function updateMockStatus(data: any) {
  return request.put('/batch/api/v2/trainer/mock/coding/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}
