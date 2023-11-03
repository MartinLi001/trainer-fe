// @ts-ignore
/* eslint-disable */
import { request } from '@/utils';
import type { SearchType } from '../../pages/Question/typeList';

/**
 * 获取问题列表
 */
export function QuestionList(data: SearchType) {
  return request.post(`/questions/api/v1/search`, {
    data,
  });
}
/**
 * 获取question列表头部标签
 */
export function getTopicsList() {
  return request.get(`/questions/api/v1/topics`);
}

/**
 * 获取question列表头部标签
 */
export function getClients() {
  return request.get(`/questions/api/v1/clients`);
}

/**
 * 获取question列表头部标签
 */
export function getTags() {
  return request.get(`/questions/api/v1/tags`);
}

/**
 * 获取question列表头部标签
 */
export function getClientsSearch(data?: object) {
  return request.post(`/questions/api/v1/clients`, {
    data,
  });
}

/**
 * 获取question列表头部标签
 */
export function getTagsSearch(data?: object) {
  return request.post(`/questions/api/v1/tags`, {
    data,
  });
}

/**
 * 获取questionDetail信息
 */
export function getQuestionDetail(data: string) {
  return request.get(`/questions/api/v1/search/${data}`);
}

/**
 * 获取blob文件，富文本编辑器回显在用
 */
export function getFile(questionId: string, fileId: string) {
  return request.get(`/questions/api/v1/file/${questionId}/${fileId}`);
}

/**
 * 获取资源id
 */
export function generateResource(fileName: string) {
  return request.get(`/questions/api/v1/resource/generate/${fileName}`, {
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 新建question
 */
export function CreateQuestion(data: any) {
  return request.post('/questions/api/v1/create', {
    data,
    requestType: 'form',
    headers: {
      'request-type': 'command',
    },
  });
}
/**
 * 更新question
 */
export function UpdateQuestion(data: any) {
  return request.put('/questions/api/v1/update', {
    data,
    requestType: 'form',
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 删除question
 */

export const removeQuesiton = (data: any) => {
  return request.delete('/questions/api/v1/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

/**
 * 更新short answer mock的questions列表，用于排序和删除，老接口，应该有可替代的方案？
 */
export const saveAndDeleteQuestions = (data: any) => {
  return request.put('/batch/api/v1/mock/question/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

// 好像没用？
export function getSubscription(data?: object) {
  return request.get(`/question/api/v1/question-subscription`, {
    data,
    // headers: {
    //   'request-type': 'command',
    // },
  });
}

export function getHistorySubscription(data?: object) {
  return request.post(`/questions/api/v1/question-subscription-history/search`, {
    data,
  });
}

/**
 * 创建订阅
 */
export const createSubscription = (data: any) => {
  return request.post('/questions/api/v1/question-subscription', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

/**
 * 更新订阅
 */
export const updateSubscription = (data: any) => {
  return request.patch('/questions/api/v1/question-subscription', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

/**
 * 删除订阅
 */
export const deleteSubscription = (data: any) => {
  return request.delete('/questions/api/v1/question-subscription', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

/**
 * 获取单个订阅详情
 */
export const findSubscriptionById = (id: any) => {
  return request.get(`/question/api/v1/question-subscription?userId=${id}`);
};

/**
 * This API is used to search question-subscriptions by providing searching criterias.
 */
export function searchSubscriptions(data: object) {
  return request.post(`/questions/api/v1/question-subscription/search`, {
    data,
  });
}

/**
 * 获取订阅config
 */
export const getSubscriptionConfig = () => {
  return request.post(`/questions/api/v1/config`);
};

/**
 * 获取tagManagement clients
 */
export function getSubscriptionsClients() {
  return request.get(`/subscriptions/api/v1/clients`);
}

/**
 * 创建Topic
 */
export const createTopic = (data: { name: string }) => {
  return request.post(`/questions/api/v1/topic/create`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

/**
 * 创建Tag
 */
export const createTag = (data: { name: string }) => {
  return request.post(`/questions/api/v1/tag/create`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

/**
 * 创建Client
 */
export const createClient = (data: { name: string }) => {
  return request.post(`/subscriptions/api/v1/clients`, {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

/**
 * 删除Topic
 */
export const removeTopic = (data: any) => {
  return request.delete('/questions/api/v1/topic/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

/**
 * 删除Tag
 */
export const removeTag = (data: any) => {
  return request.delete('/questions/api/v1/tag/remove', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
};

/**
 * 删除Tag
 */
export const removeClient = (clientId: string) => {
  return request.delete(`/subscriptions/api/v1/clients/${clientId}`, {
    headers: {
      'request-type': 'command',
    },
  });
};
