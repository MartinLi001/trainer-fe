import { request } from '@/utils';
/**
 * @description 重置密码
 */
export const resetPassWord = (data: API.PasswordReset) => {
  return request.put('/auth/api/v1/password/reset', {
    data,
  });
};
