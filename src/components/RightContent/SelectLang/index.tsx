import { Menu } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { getLocale, setLocale, useIntl } from 'umi';

import HeaderDropdown from '../../HeaderDropdown';
import styles from './index.less';

function SelectLang(props: any) {
  const intl = useIntl();
  const changeLang = ({ key }: any) => {
    setLocale(key, false);
    // qiankunActions.setGlobalState({ lang: key });
  };
  const { className } = props;
  const selectedLang = getLocale();
  const languageLabels: any = {
    'zh-CN': '简体中文',
    // 'zh-TW': '繁体中文',
    'en-US': 'English',
  };

  const languageIcons: any = {
    'zh-CN': '🇨🇳',
    'en-US': '🇬🇧',
    // 'zh-TW': '🇭🇰',
  };

  // const items =locales.map((locale) => (
  //      {
  //       label: <>
  //       <span role="img" aria-label={languageLabels[locale]}>
  //       {languageIcons[locale]}
  //     </span>
  //     {languageLabels[locale]}
  //       </>
  //      }
  //   ));

  const items = [
    {
      label: (
        <>
          {languageIcons['zh-CN']}
          {languageLabels['zh-CN']}
        </>
      ),
      key: 'zh-CN',
    },
    {
      label: (
        <>
          {languageIcons['en-US']}
          {languageLabels['en-US']}
        </>
      ),
      key: 'en-US',
    },
  ];

  const langMenu = (
    <Menu
      className={styles.menu}
      items={items}
      selectedKeys={[selectedLang]}
      onClick={(item) => changeLang(item)}
    />
  );

  // useEffect(() => {
  //   const { initialState } = props;
  //   initialState?.mitt.on('changeLanguage', (aaa) => console.log(aaa,'=======change'));
  // }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        <GlobalOutlined title={intl.formatMessage({ id: 'languages' })} />
      </span>
    </HeaderDropdown>
  );
}

export default SelectLang;
