export interface RadioGroupProps {
  onChange?: ((e: any) => void) | undefined;
  defaultValue?: any;
  value?: any;
  options?: any;
  disabled?: boolean;
  id?: string;
  radioType?: number; //此类型自己区分 1 2
  dataIndex?: string; // 第二个字段
  title?: string; // 第二个字段 标题
  formRef?: any; //表单实例
  inputTxet?: string; //是否显示input
  inputSize?: string; //大小
  otherValue?: string | number; // 点击按钮触发设置其他值
}

export enum ParamRadioType {
  VALUE = 'value',
  LABEL = 'label',
}
