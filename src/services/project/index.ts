import { request } from '@/utils';

/**
 * 更新project的分组情况
 */
export function updateProjectGroups(data: API.UpdateProjectGroupsType) {
  return request.put('/batch/api/v2/trainer/project/groups/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * Add Comment for group project
 */
export function addGroupComment(data: API.AddGroupComment) {
  return request.post('/batch/api/v2/trainer/project/group/feedback/add', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * Update Comment for group project
 */
export function updateGroupComment(data: API.UpdateGroupComment) {
  return request.put('/batch/api/v2/trainer/project/group/feedback/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * Remove Comment for group project
 */
export function removeGroupComment(data: API.RemoveGroupComment) {
  return request.delete('/batch/api/v2/trainer/project/group/feedback/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}
