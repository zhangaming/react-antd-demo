import { ReactNode } from 'react';

export interface FormFootProps {
  style?: React.CSSProperties,
  isDrawer?: boolean,
  isShowCancel?: boolean,
  doms: ReactNode[] | ReactNode | undefined,
  cancelUrl?: string
}