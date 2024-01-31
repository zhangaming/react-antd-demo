import React, { useEffect, useRef, useState } from 'react';
import { Button, Space } from 'antd';
import { history, useLocation } from 'umi';
import { DetailOperateEnum } from '@/enums/common.enum';
import { closeCurrentTab } from '@/layouts/privateLayout/renderer';
import { CommonUtils } from '@/utils/commonUtils';
import { getIntl } from '@/utils/i18n';
import './index.less';
import { FormFootProps } from './types';

export function closeCurrentPage(url?: any) {
  if (url) {
    //走直接跳转
    closeCurrentTab();
    history.push({ pathname: url });
  } else {
    // 走判断新增编辑详情的
    let pathnames = location.pathname.split('/');
    let ary: any = [DetailOperateEnum.LOOK, DetailOperateEnum.EDIT];
    if (pathnames.length > 2) {
      if(pathnames[pathnames.length -1] === DetailOperateEnum.ADD || ary.includes(pathnames[pathnames.length - 2])){
        const path = pathnames[pathnames.length -1] === DetailOperateEnum.ADD ? pathnames.slice(0,pathnames.length - 1).join('/') :
        ary.includes(pathnames[pathnames.length - 2]) ? pathnames.slice(0,pathnames.length - 2).join('/') : '';
        closeCurrentTab();
        history.push({ pathname: path });
      }
    }
  }
}

const FormFooter: React.FC<FormFootProps> = (props) => {
  const location = useLocation();
  const { style, isDrawer, doms, isShowCancel = true } = props;
  const resizeObserver = useRef<any>();
  const searchDom = document.querySelector('.sider-menu-wrapper');
  const [leftWidth, setleftWidth] = useState<number>(60);
  const handleResize = () => {
    if (searchDom?.clientWidth) {
      setleftWidth(searchDom?.clientWidth);
    }
  };
  useEffect(() => {
    if (searchDom) {
      resizeObserver.current = new ResizeObserver(handleResize);
      resizeObserver.current.observe(searchDom as HTMLDivElement);
      CommonUtils.timer(100).then(() => {
        handleResize();
      });
      return () => {
        if (resizeObserver.current) {
          resizeObserver.current?.disconnect();
          resizeObserver.current = null;
        }
      };
    }
  }, [searchDom]);
  return (
    <div
      className={`${isDrawer ? 'drawer-form-footer' : 'form-footer'}`}
      style={isDrawer ? style : { ...style, left: leftWidth }}
    >
      <Space>
        {doms}
        {
          isShowCancel && (
            <Button
              onClick={() => {
                if(props.cancelUrl) {
                  closeCurrentPage(props.cancelUrl);
                } else {
                  closeCurrentPage()
                }
              }}
            >
              {getIntl('common.cancel', '取消')}
            </Button>
          )
        }
      </Space>
    </div>
  );
};

export default FormFooter;
