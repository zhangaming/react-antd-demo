export interface ItemProps {
  formRef: any;
  title: string;
  key: string;
  custom?: any
}

export interface customAttrs {
  TimeLineColor: string,
  TimeLineDot?: boolean;
  color: string;
  text: string;
}

export interface FormPocProps {
  style?: React.CSSProperties;
  ShemaForms: ItemProps[];
  beforeHandle?: () => void;
  isDetail?: boolean //是否详情
}