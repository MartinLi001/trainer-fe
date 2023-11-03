import { Tabs } from 'antd';
import PageHeader from '@/components/PageHeader';
import Profile from './Profile';
import UserAvatar from './Avatar';
import PasswordFrom from './PassWord';
import Subscription from './Subscription';
import styles from './index.less';
const { TabPane } = Tabs;

function MyProfile() {
  return (
    <>
      <PageHeader title={['']} />
      <div className={styles.profileWrap}>
        <UserAvatar />
        <Tabs defaultActiveKey="1" className={styles.tabs} onChange={() => {}}>
          <TabPane tab={<span className={styles.tabsTitle}>Profile</span>} key="1">
            <Profile />
          </TabPane>
          <TabPane tab={<span className={styles.tabsTitle}>Password</span>} key="2">
            <PasswordFrom />
          </TabPane>
          <TabPane tab={<span className={styles.tabsTitle}>Subscription</span>} key="3">
            <Subscription />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default MyProfile;
