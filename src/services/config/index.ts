// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

export async function getConfig() {
  return request('/api/config', {
    method: 'GET',
  });
}
