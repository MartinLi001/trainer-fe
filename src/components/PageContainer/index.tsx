import { useModel, useRouteMatch, history } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import { ReactNode } from 'react';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import { Breadcrumb } from 'antd';

interface KeyListType {
  code: string;
  name?: string;
  children: string;
}

const getPathByKey = (dataSource: any, curKey: string, keyConfig: KeyListType) => {
  /** 存放搜索到的树节点到顶部节点的路径节点 */
  let result: Route[] = [];

  const params = {
    code: (keyConfig && keyConfig.code) || 'code',
    name: (keyConfig && keyConfig.name) || 'name',
    children: (keyConfig && keyConfig.children) || 'children',
  };

  /**
   * 路径节点追踪
   * @param {*} key 树节点标识的值
   * @param {array} path 存放搜索到的树节点到顶部节点的路径节点
   * @param {*} data 树
   * @returns undefined
   */
  const traverse = (key: string, path: any[], data: any) => {
    // 树为空时，不执行函数
    if (data.length === 0) {
      return;
    }

    // 遍历存放树的数组
    for (const item of data) {
      // 遍历的数组元素存入path参数数组中
      path.push(item);
      // 如果目的节点的id值等于当前遍历元素的节点id值
      if (item[params.code] === key) {
        // 把获取到的节点路径数组path赋值到result数组
        result = JSON.parse(JSON.stringify(path));
        return;
      }

      // 当前元素的children是数组
      const children = Array.isArray(item[params.children]) ? item[params.children] : [];
      // 递归遍历子数组内容
      traverse(key, path, children);
      // 利用回溯思想，当没有在当前叶树找到目的节点，依次删除存入到的path数组路径
      path.pop();
    }
  };

  traverse(curKey, [], dataSource);
  // 返回找到的树节点路径
  return result;
};

export default function Container({ children, extra }: { children: ReactNode; extra?: ReactNode }) {
  const { initialState } = useModel('@@initialState');
  const match = useRouteMatch();

  const itemRender = (route: Route) => {
    return route.breadcrumbName ? (
      <span onClick={() => history.replace(route.path)}>{route.breadcrumbName}</span>
    ) : (
      ''
    );
  };

  return (
    <PageContainer
      style={{ height: 'calc(100vh - 80px)' }} // header+margin=56+24=80px
      // header={{
      //   breadcrumb: {
      //     separator: '>',
      //     // itemRender(route) {
      //     //   return route.breadcrumbName ? (
      //     //     <span onClick={() => history.replace(route.path)}>{route.breadcrumbName}</span>
      //     //   ) : (
      //     //     ''
      //     //   );
      //     // },
      //     routes: [
      //       ...getPathByKey(initialState?.route, match.path, {
      //         code: 'path',
      //         name: 'name',
      //         children: 'routes',
      //       }),
      //     ],
      //   },
      // }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Breadcrumb
          separator=">"
          itemRender={itemRender}
          routes={[
            ...getPathByKey(initialState?.route, match.path, {
              code: 'path',
              name: 'name',
              children: 'routes',
            }),
          ]}
        />
        {extra}
      </div>
      {children}
    </PageContainer>
  );
}
