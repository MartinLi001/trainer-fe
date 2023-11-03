import React from 'react';
import Avatar from './AvatarDropdown';
// import SelectLang from './SelectLang';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  return (
    <div className={styles.right}>
      <Avatar />
      {/* <SelectLang className={styles.action} /> */}
    </div>
  );
};
export default GlobalHeaderRight;
