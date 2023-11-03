import React, { useEffect } from 'react';
import { Reducer, Action } from 'redux';
import storage from 'redux-persist/es/storage';
import { persistStore, persistReducer } from 'redux-persist';
import {
  IRoute,
  useModel,
  setCreateHistoryOptions,
  history,
  getDvaApp,
  RunTimeLayoutConfig,
} from 'umi';
import type { BasicLayoutProps } from '@ant-design/pro-layout';

import defaultSettings from '../config/defaultSettings';

import { PageLoading } from '@/components/Loading';
import RightContent from '@/components/RightContent';
import HeaderTitleRender from '@/components/HeaderTitleRender';
import { getUserInfo } from '@/services/user';
import { getSsoToken, checkIsLogin } from '@/utils';

import { getSystemAccess, getProductList } from '@/services/summary';
import { RegisterUserInfo } from '@/services/user/interface';

import { ErrorPage403 } from '@/components/ErrorPage';

import route from '../config/routes';
import { useSize, useThrottleEffect } from 'ahooks';

interface InitialStateType {
  route: IRoute;
  userId: string;
  name: string;
  preferredName: string;
  lastName: string;
  firstName: string;
  avatar: string | Blob;
  userInfo: RegisterUserInfo;
}

export async function getInitialState(): Promise<InitialStateType> {
  try {
    if (window.__POWERED_BY_QIANKUN__) {
      return {} as InitialStateType;
    }

    const userInfo = await getUserInfo();

    if (userInfo.status === 'Added') {
      history.push('/register');
    }

    localStorage.setItem('userInfo', JSON.stringify(userInfo || '{}'));
    localStorage.setItem('userId', userInfo.userId);

    const productList = await getProductList();

    const systemAccess = await getSystemAccess();

    return {
      ...userInfo,
      ...productList,
      ...systemAccess,
      route,
      collapsed: false,
    } as InitialStateType;
  } catch (error) {
    return {} as InitialStateType;
  }
}

export function patchRoutes() {}

export async function render(oldRender: any) {
  if (!window.__POWERED_BY_QIANKUN__) {
    await getSsoToken();

    if (await checkIsLogin()) {
      oldRender();
    }
  }
  oldRender();
}

const Footer = React.memo(() => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { globalState } = useModel('@@qiankunStateFromMaster') ?? {};

  useEffect(() => {
    if (window.__POWERED_BY_QIANKUN__) {
      setInitialState({
        ...initialState,
        ...globalState,
        route,
        collapsed: false,
      });
      localStorage.setItem('userInfo', JSON.stringify(globalState || '{}'));
      localStorage.setItem('userId', globalState.userId);
    }

    setTimeout(() => {
      const app = getDvaApp();
      persistStore(app._store);
    }, 10);
  }, [globalState]);

  const size = useSize(document.querySelector('body')) as any;

  useThrottleEffect(
    () => {
      setInitialState((preState: any) => ({
        ...preState,
        collapsed: size?.width < 768,
      }));
    },
    [size],
    { wait: 300 },
  );

  return <></>;
});

export const layout: RunTimeLayoutConfig = ({ initialState }: { initialState: any }) => {
  const hideMenu = location.pathname?.startsWith('/problems');
  return {
    title: '',

    headerHeight: 56,
    headerRender: !window.__POWERED_BY_QIANKUN__,

    headerTitleRender: () => <HeaderTitleRender />,

    rightContentRender: () => <RightContent />,

    menuRender: hideMenu
      ? false
      : (menuItemProps: any, defaultDom: any) => {
          if (initialState?.collapsed) return [menuItemProps, undefined][1];
          return defaultDom;
        },
    menuFooterRender: (props: BasicLayoutProps) => {
      if (props?.collapsed) return undefined;
      return <div className="copyRight">{defaultSettings.copyRight}</div>;
    },
    footerRender: () => <Footer />,

    collapsedButtonRender: false,

    disableMobile: true,
    disableContentMargin: true,

    contentStyle: { backgroundColor: '#FFFFFF' },
    waterMarkProps: {
      content: initialState?.firstName,
    },
    onPageChange: (routeItem: IRoute) => {
      if (
        routeItem.pathname === '/register' &&
        localStorage.userInfo &&
        JSON.parse(localStorage.userInfo).status === 'Enrolled'
      ) {
        history.push('/');
      }
    },

    unAccessible: <ErrorPage403 />,
    ...initialState?.settings,
  };
};

// 子应用单跑时，设置route base
if (!window.__POWERED_BY_QIANKUN__) {
  setCreateHistoryOptions({ basename: '/' });
}

export const qiankun = {
  async bootstrap() {},

  // 应用 renders 之前触发
  async mount({ setLoading }: any) {
    setLoading?.(false);
  },

  // 应用卸载之后触发
  async unmount() {},
};

export const locale = {
  default: 'en-US',
};

export const initialStateConfig = {
  loading: window.__POWERED_BY_QIANKUN__ ? <></> : <PageLoading />,
};

export const dva = {
  config: {
    onError(e: { preventDefault: () => void }) {
      console.log('=======error');
      e.preventDefault();
    },
    onReducer(reducer: Reducer<unknown, Action<any>>) {
      const persistConfig = {
        key: 'trainer',
        storage,
        blacklist: [],
      };
      console.log('=======reducer');
      return persistReducer(persistConfig, reducer);
    },
  },
};
