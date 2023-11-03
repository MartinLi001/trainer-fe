import React from 'react';
import { useModel } from 'umi';
import TagManagement from './tagManagement';
import { TagManagementPage403 } from '@/components/ErrorPage';

export default function Index() {
  const initial = useModel('@@initialState') as any;
  const access = initial?.initialState?.permissionAccess || {};
  const checkTagManagementAccessFun = () =>
    access.settingClientWrite || access.settingCompanyWrite || access.settingQuestionWrite; // 以后会重新设计权限,现在暂时使用此逻辑.这三个任一个为true则可以进入tag管理.

  return checkTagManagementAccessFun() ? <TagManagement /> : <TagManagementPage403 />;
}
