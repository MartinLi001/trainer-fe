// @ts-ignore
/* eslint-disable */
import { request } from '@/utils';

export const getMyBatches = () => {
  return request.get(`/batch/api/v2/trainer/trainer-batches`);
};

export const getBatchDetails = (batchId: string) => {
  return request.get(`/batch/api/v2/trainer/${batchId}`);
};

/**
 * 获取batch category列表
 */
export function getAllCategory() {
  return request.get('/batch/api/v2/trainer/category');
}
/**
 * 创建batch category
 */
export function createCategory(data: API.CategoryType) {
  return request.post('/batch/api/v2/trainer/category/create', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}
/**
 * 更新batch category
 */
export function updateCategory(data: API.CategoryType) {
  return request.put('/batch/api/v2/trainer/category/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}
/**
 * 根据categoryId 获取 所有batch
 */
export function getBatchesByCategoryId({
  categoryId,
  isTemplate,
}: {
  categoryId: string;
  isTemplate: boolean;
}) {
  return request.get(`/batch/api/v2/trainer/batches/${categoryId}?isTemplate=${isTemplate}`);
}

/**
 * copy batch
 */
export function batchCopy(data: {
  batchId: string;
  originalBatchId: string;
  confirmOverwrite: boolean;
}) {
  return request.put('/batch/api/v2/trainer/copy', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 获取trainer 所有 batches
 */
export function getTrainerBatches() {
  return request.get('/batch/api/v2/trainer/trainer-batches');
}

/**
 * 创建batch
 */
export function createBatch(data: API.AllBatchType & { batchCategoryId: string }) {
  return request.post('/batch/api/v2/trainer/create', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 以template作为模版创建batch
 */
export function createBatchByTemplate(data: API.AllBatchType & { batchCategoryId: string }) {
  return request.post('/batch/api/v2/trainer/template/create', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 更新batch
 */
export function updateBatch(data: API.AllBatchType) {
  return request.put('/batch/api/v2/trainer/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 更新batch active状态
 */
export function updateBatchActive(data: API.AllBatchType) {
  return request.put('/batch/api/v2/trainer/batch', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 删除batch下的task
 */
export function deleteTask(data: Partial<API.TaskType>) {
  return request.delete('/batch/api/v2/trainer/task/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * unlock batch下的task
 */
export function unlockTask(data: Partial<API.TaskType>) {
  return request.put('/batch/api/v2/trainer/task/unlock', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * reopenList
 */
export function reopenList(data: Partial<API.TaskType>) {
  return request.put('/batch/api/v2/trainer/mock/reopen', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * lockTask
 */
export function lockTask(data: Partial<API.TaskType>) {
  return request.put('/batch/api/v2/trainer/task/lock', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}
/**
 * batch下添加task
 */
export function addTask(data: API.TaskType) {
  let type = data.type.toLocaleLowerCase();
  if (type.includes('short')) type = 'mock/short';
  if (type.includes('coding')) type = 'mock/coding';
  return request.post(`/batch/api/v2/trainer/${type}/add`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * batch下更新task
 */
export function updateTask(data: API.TaskType) {
  let type = data.type.toLocaleLowerCase();
  if (type.includes('project')) type = 'assignment';
  if (type.includes('short')) type = 'mock/short';
  if (type.includes('coding')) type = 'mock/coding';
  return request.put(`/batch/api/v2/trainer/${type}/update`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 获取ShortMock 详情
 */
export function getShortMockDetail(taskId: string) {
  return request.get(`/batch/api/v2/trainer/task/${taskId}`);
}

/**
 * 教师评分
 */
export function putMockResult(data: any) {
  return request.put(`/batch/api/v2/trainer/mock/result`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 修改mockGroup
 */
export function updateMockGroup(data: any) {
  return request.put(`/batch/api/v2/trainer/mock/short/group/update`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 修改updateMockShort
 */
export function updateMockShort(data: any) {
  return request.put(`/batch/api/v2/trainer/mock/short/update`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}
