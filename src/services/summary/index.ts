// @ts-ignore
/* eslint-disable */
import { request } from '@/utils';

/**
 * 获取用户系统权限
 */
// export function getAccess() {
//   return request.get('/summary/api/v1/access/current');
// }

/**
 * 获取用户系统权限
 */
export function getSystemAccess() {
  return request.get('/subscriptions/api/v1/user/service-access');
}

/**
 * 获取用户系统权限
 */
export function getProductList() {
  return request.get('/subscriptions/api/v1/user/product-access');
}
/**
 * 获取资源id
 */
export function getTaskList(data: string) {
  return request.get(`/summary/api/v1/tasks/current/${data}`, {
    // headers: {
    //   'request-type': 'command',
    // },
  });
}
