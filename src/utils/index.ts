import { history } from 'umi';
import request from './http';
import qiankunActions from './qiankunActions';
import moment from 'moment';
import { attendantsType } from '@/pages/Task/ShortMock/typeList';

const logout = () => {
  localStorage.removeItem('token');
  window.location.href = process.env.LOGOUT_URL + window.location.href;
};

const toLogin = () => {
  const redirectUrl = window.location.href;
  window.location.href = `${process.env.LOGIN_URL}${redirectUrl}`;
};

const getUrlSearch = (name: string, url?: string) => {
  const results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url || window.location.href);
  if (!results) {
    return '';
  }
  return results[1] || '';
};

const clearToken = () => {
  localStorage.clear();
};

const checkIsLogin = () => {
  return new Promise((resolve, reject) => {
    const x_token = localStorage.getItem('token');
    if (!x_token) {
      toLogin();
      reject();
    }
    resolve({});
  });
};

const getSsoToken = () => {
  return new Promise((resolve) => {
    const execSearch = getUrlSearch('token');
    if (execSearch) {
      localStorage.setItem('token', execSearch);
      history.replace('/');
    }
    resolve({});
  });
};

const download = (fileBlob: Blob, filename: string) => {
  const urls = window.URL.createObjectURL(fileBlob);
  const a = document.createElement('a');
  a.href = urls;
  a.download = filename;
  a.click();
  return window.URL.revokeObjectURL(urls);
};

const month2ENGmonth = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

const date2desc = (date: string) => {
  if (!date) return '';
  return moment(date).format('h:mm A MMM D YYYY');
};

const getUserName = (user: attendantsType, isHover?: boolean, isFirstUpperCase?: boolean) => {
  const { preferredName, firstName, lastName, lastname, firstname } = user;
  const fName = firstName || firstname;
  const lName = lastName || lastname;

  if (isFirstUpperCase) {
    return `${preferredName || fName} ${lName?.charAt(0)?.toLocaleUpperCase()}`;
  } else if (isHover) {
    return `${fName} ${lName}`;
  }
  return `${preferredName || fName} ${lName}`;
};

const roundingOff = (num: number, digit: number) => {
  if (digit < 0 || !num) return 0;
  const sign = Math.sign(num);
  const value = Math.abs(num);
  const decimal = Math.pow(10, ~~digit);
  const res = (sign * Math.round(value * decimal)) / decimal;
  return res.toFixed(digit);
};

function mergeStyles(origin: Record<string, any>, cover?: Record<string, any>) {
  if (!cover) return origin;
  const result = { ...origin };
  for (const key in cover) {
    result[key] = `${result[key] || ''} ${cover[key] || ''}`;
  }
  return result;
}

function linkURL(url: string) {
  return url.indexOf('http') > -1 ? url.trim() : 'http://' + url.trim();
}
export {
  request,
  clearToken,
  logout,
  toLogin,
  getUserName,
  getUrlSearch,
  checkIsLogin,
  getSsoToken,
  month2ENGmonth,
  qiankunActions,
  download,
  date2desc,
  roundingOff,
  mergeStyles,
  linkURL,
};
