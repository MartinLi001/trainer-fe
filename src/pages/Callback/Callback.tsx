import Loading from '@/components/Loading';
import { token } from '@/services/auth';
import { APP_NAME } from '@/utils/constant';
import useSearchParams from '@/utils/useSearchParams';
import { useRequest } from 'ahooks';
import { useEffect, useMemo } from 'react';
import { useModel } from 'umi';

const Callback = () => {
  const searchParams = useSearchParams();
  const { setInitialState } = useModel('@@initialState');
  // const { setOrganizationId } = useModel('appInfo');

  const orgId = useMemo(() => {
    return searchParams?.get('org_id') || '';
  }, [searchParams]);

  const { run } = useRequest(token, {
    // throwOnError: true,
    manual: true,
    onSuccess: (res) => {
      if (window.__POWERED_BY_QIANKUN__) {
        localStorage.setItem(`token|${APP_NAME}|${res.orgId}`, res.accessToken);
        localStorage.setItem(`idToken|${APP_NAME}|${res.orgId}`, res.idToken);
        localStorage.setItem(`orgId|${APP_NAME}`, res.orgId);
      } else {
        localStorage.setItem(`token|${res.orgId}`, res.accessToken);
        localStorage.setItem(`idToken|${res.orgId}`, res.idToken);
        localStorage.setItem(`orgId`, res.orgId);
      }
      const prevPath = localStorage.getItem('prevUrl');
      localStorage.removeItem('prevUrl');
      location.href = prevPath || location.origin;
      // } catch (error) {
      //   AuNotification.error(0, 'Failed to fetch data', 'top');
      // }
    },
    // onError: (err) => {
    //   //
    // },
  });

  useEffect(() => {
    run({
      code: searchParams.get('code') || '',
      orgId: orgId,
      state: searchParams.get('state') || '',
      redirectUri: window.location.href,
    });
  }, []);
  return <Loading />;
};

export default Callback;
