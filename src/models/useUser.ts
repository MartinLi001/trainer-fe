import { useModel } from 'umi';
import { getUserInfo } from '@/services/user';
import type { RegisterUserInfo } from '@/services/user/interface';
export default function useAuthModel(): any {
  const { setInitialState, initialState } = useModel('@@initialState');
  const updateLocalUserInfo = async (userInfo?: RegisterUserInfo) => {
    let info = userInfo;
    if (!info) {
      info = (await getUserInfo()) as RegisterUserInfo;
    }

    const { preferredName, lastName, middleName, firstName } = info;

    const resultInfo = {
      ...JSON.parse(localStorage.userInfo ?? '{}'),
      ...info,
      name: `${preferredName} ${lastName}`,
      fullName: `${firstName} ${middleName} ${lastName}`,
    };

    setInitialState({
      ...initialState,
      ...resultInfo,
    } as any);

    localStorage.setItem('userInfo', JSON.stringify(resultInfo));
    localStorage.setItem('userId', resultInfo.userId);
  };

  return {
    updateLocalUserInfo,
  };
}
