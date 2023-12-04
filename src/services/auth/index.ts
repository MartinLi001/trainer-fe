import { request } from '@/utils';
/**
 * @description 重置密码
 */
export const resetPassWord = (data: API.PasswordReset) => {
  return request.put('/auth/api/v2/trainer/password/reset', {
    data,
  });
};

export async function token(body: API.Token, options?: { [key: string]: any }) {
  return request<any>(`/batch/api/v2/auth/token`, {
    method: 'POST',
    data: body ?? {},
    ...(options || {}),
  });
}

export async function logout() {
  return request<any>(`/batch/api/v2/auth/logout`, {
    method: 'POST',
  });
}
