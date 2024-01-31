import { PubParamEnum } from '@/enums/param.enum';
import { SelectProps } from 'antd';

export enum ParamSelectType {
  ALL = 'all',
  VALUE = 'value',
  LABEL = 'label'
}
export interface ParamSelectProps extends SelectProps{
  kind?: string | PubParamEnum;
  showType?: ParamSelectType;
  isNeedUniq?: boolean;
  extendFields?: Array<string>;
}