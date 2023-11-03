import { Input } from 'antd';

export interface DiInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const PhoneInput = (props: DiInputProps) => {
  return (
    <Input
      onChange={(e) => {
        const inputValue = e.target.value;
        if (inputValue.length > 3 && inputValue.length < 8) {
          props.onChange?.(inputValue.replace(/^(\d{3})/g, '$1-'));
        }
        props.onChange?.(inputValue.replace(/^(\d{3})(\d{3})/g, '$1-$2-'));
      }}
      value={props.value}
      addonBefore="(+1)"
    />
  );
};
