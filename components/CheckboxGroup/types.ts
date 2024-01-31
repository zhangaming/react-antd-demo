
import type { RadioChangeEvent } from 'antd';
export interface RadioGroupProps {
  onChange?: ((e: RadioChangeEvent) => void) | undefined,
  defaultValue?: any,
  value?: any,
  options?: any,
  disabled?: boolean,
  id?: string,
  checkboxType? :number //此类型自己区分 1 2
  itemWidth? :number
}

export enum ParamRadioType {
  VALUE = 'value',
  LABEL = 'label'
}