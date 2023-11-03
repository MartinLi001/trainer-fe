import { Button } from 'antd';
import classNames from 'classnames';
// import { SeeButton } from 'seethingx-com';
import styles from './button.less';

const SeeButton = (props: any) => {
  const {
    className = 'default',
    type = 'default',
    disabled,
    shape = 'default',
    children,
    ...restProps
  } = props;
  const classes = classNames(
    styles.seebtn,
    {
      [styles[`seebtn-${type}`]]: type,
      [styles.disabled]: disabled,
      [styles[`shape-${shape}`]]: shape,
    },
    className,
  );
  return (
    <>
      <Button {...restProps} disabled={disabled} type={type} className={classes}>
        {children}
      </Button>
    </>
  );
};

export default SeeButton;
