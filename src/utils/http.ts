import { message, notification } from 'antd';
import type { ArgsProps } from 'antd/es/notification';
import { checkIsLogin, clearToken, toLogin } from '@/utils';
import { isProd } from '@/utils/constant';
import { extend } from 'umi-request';
notification.config({ maxCount: 1 });
const errorHandler = async (error: any) => {
  if (error.toString().indexOf('SyntaxError') > -1) {
    notification.error({
      description: '服务异常',
      message: '服务异常',
    });
    return Promise.reject(error);
  }

  const { errorCode, message } = error;

  if (errorCode) {
    let noticeConfig: ArgsProps = {
      message: '',
    };
    switch (errorCode) {
      case 401:
        noticeConfig = {
          message,
          duration: 2,
          onClose() {
            clearToken();
            toLogin();
          },
        };
        break;

      case 403:
        noticeConfig = {
          message,
          duration: null,
        };
        break;
      default:
        noticeConfig = {
          message,
        };
        break;
    }

    if (!window.__POWERED_BY_QIANKUN__) {
      notification.error(noticeConfig);
    }

    if (!(await checkIsLogin())) {
      notification.error({
        description: '网络异常，无法连接服务器或代理（地址）等异常',
        message: '网络异常',
      });
    }
  }
  return Promise.reject(error);
};
const request = extend({
  prefix: isProd ? process.env.API_BASE_URL : process.env.API_PREFIX,
  timeout: 30000,
  headers: {
    'request-type': 'query',
  },
  credentials: 'include',
  crossOrigin: true,
  errorHandler: errorHandler,
});

// 可以在里面对url、option中的参数进行进一步处理
request.interceptors.request.use((url: string, options: any) => {
  if (!window.__POWERED_BY_QIANKUN__) {
    checkIsLogin();
  }
  const { headers = {} } = options || {};
  const tokenHeaders = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    ...headers,
  };

  if (options.method?.toUpperCase() === 'GET') {
    options.params = options.data;
  } else {
    options.requestType = options.requestType ? options.requestType : 'json';
  }

  return {
    url,
    options: {
      ...options,
      interceptors: true,
      headers: tokenHeaders,
    },
  };
});

request.interceptors.response.use(async (response, option): Promise<any> => {
  const { url, status } = response;
  if (
    url?.includes('/download/') ||
    (url?.includes('/avatar') && option.method === 'GET') ||
    url?.includes('/file')
  ) {
    if (status !== 200) {
      if (status === 400) {
        return response;
      }
      notification.error({
        message: `下载出错 : ${url}`,
      });
    } else {
      return await response.clone().blob();
    }
    return null;
  }

  const result = (await response.clone().json()) as any;

  return new Promise((resolve, reject) => {
    const { error, errorCode, serviceStatus, code, message: errorMessage } = result;
    if (code || error || errorCode || (serviceStatus && !serviceStatus.success)) {
      if (code && errorMessage) {
        message.error(errorMessage);
      }

      if (serviceStatus?.errorMessage) {
        message.error(serviceStatus.errorMessage);
      }

      return reject(result);
    }

    return resolve(result.data ?? result);
  });
});

export default request;
