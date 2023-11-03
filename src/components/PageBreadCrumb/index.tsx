import { Breadcrumb } from 'antd';
import { ReactNode } from 'react';
import { history } from 'umi';
import styles from './index.less';

export const PageBreadCrumb = ({
  routes = [],
}: {
  routes: {
    label: string | ReactNode;
    href?: string;
  }[];
}) => {
  return (
    <Breadcrumb separator=">" className={styles.breadcrumb}>
      {routes?.map((route, i: number) => {
        if (i === routes.length - 1) {
          return <Breadcrumb.Item key={i}>{route.label}</Breadcrumb.Item>;
        }
        return (
          <Breadcrumb.Item key={i} onClick={() => history.replace(route.href as string)}>
            {route.label}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};
