import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_3583708_cvgd0nunv3c.js',
});

export default function (props: {
  type: string;
  style?: React.CSSProperties | undefined;
  className?: string;
  [extra: string]: any;
}) {
  return <IconFont {...props} />;
}
