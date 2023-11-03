// @ts-ignore
/* eslint-disable */
import { request } from '@/utils';
import { RegisterUserInfo } from './interface';

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request.get('/users/api/v1/current');
}

/**
 * 获取用户头像
 */
export function getUserAvatar(userId: string) {
  return request.get(`/users/api/v1/avatar/${userId}`);
}

/**
 * 上传用户头像
 */
export function uploadUserAvatar(data: any) {
  return request.patch(`/users/api/v1/avatar/${localStorage?.userId}`, {
    data,
    requestType: 'form',
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 更新用户信息
 */
export function createUserInfo(data: RegisterUserInfo) {
  return request.put('/users/api/v1/add', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 更新用户地址等信息
 */
export function updateUserInfo(data: any) {
  return request.put('/users/api/v1', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 添加用户地址
 */
export function addUserAddress(data: any) {
  return request.post('/users/api/v1/address/add', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 更改用户地址
 */
export function updateUserAddress(data: any) {
  return request.patch('/users/api/v1/address/update', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 删除用户地址
 */
export function deleteUserAddress(data: any) {
  return request.delete('/users/api/v1/address/delete', {
    data,
    headers: {
      'request-type': 'command',
    },
  });
}

/**
 * 获取订阅信息
 */
export function getSubscriptions() {
  return request.get('/subscriptions/api/v1/current');
}
