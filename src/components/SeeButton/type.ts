//定义按钮尺寸e

// export enum ButtonSize {
//   Large = 'lg',
//   Small = 'sm',
// }

//定义按钮的类型
export enum ButtonType {
  Default = 'default',
  Primary = 'primary',
  Warning = 'warning',
  Danger = 'danger',
  Link = 'link',
  Subtle = 'subtle',
}

// 按钮传值接口
export interface BaseButtonProps {
  className?: string;
  children: React.ReactNode;
}
