import { useModel, history } from 'umi';
import { Grid, Popover } from 'antd';
import { useState } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import IconFont from '@/components/IconFont';
import logo from '@/assets/logo.png';
import { withRouter } from 'react-router-dom';

import styles from './index.less';

const { useBreakpoint } = Grid;

const NavMenu = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { initialState } = useModel('@@initialState');
  return (
    <div>
      <div className={styles.navBar}>
        <div className={styles.navTitle}>In-App Navigation</div>
      </div>
      <div>
        {initialState?.route
          .filter((route: any) => !route.hideInMenu && route.name)
          ?.map((route: any) => (
            <div
              key={route.name}
              className={styles.routeWrap}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                history.push(route.path);
              }}
            >
              <IconFont style={{ fontSize: 22, marginRight: 15 }} type={route.icon} />
              <span>{route.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

const HeaderTitleRender = () => {
  const [open, setOpen] = useState(false);
  const screens = useBreakpoint();
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <div className={styles.headerTitleWrap}>
      {!screens.md && (
        <Popover
          overlayClassName="navMenu"
          content={<NavMenu setOpen={setOpen} />}
          showArrow={false}
          placement="bottom"
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <span onClick={(e) => e.stopPropagation()}>
            <AppstoreOutlined
              style={{
                fontSize: 22,
                marginRight: 10,
                color: '#6B778C',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            />
          </span>
        </Popover>
      )}
      <img src={logo} width={30} alt="logo" />
      <span className={styles.title}>Drill</span>
    </div>
  );
};

export default withRouter(HeaderTitleRender);
