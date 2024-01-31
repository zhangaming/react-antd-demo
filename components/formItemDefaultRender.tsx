import React from 'react';
import dayjs from 'dayjs';
import { CommonUtils } from './commonUtils';
import { EmptyText } from './formColumnUtil';

export class FormItemDefaultRender {
  static enhanceTextRender(text, props) {
    return text ? (
      <div className="form-cell-ellipsis" title={text}>
        {text}
      </div>
    ) : (
      <EmptyText />
    );
  }

  static enhanceDateRender(text, props) {
    return text ? (
      <div className="form-cell-ellipsis" title={text}>
        {dayjs(text).format('YYYY-MM-DD')}
      </div>
    ) : (
      <EmptyText />
    );
  }

  static paramSelectRender(text, props) {
    const kind = props.fieldProps.kind;
    if (text === null || text === undefined || text === '') {
      return <EmptyText />;
    }
    if(props.fieldProps.showValue){
      return text;
    }
    if (props.fieldProps.kind) {
      return CommonUtils.renderTableParamName(kind, text);
    } else if (props.fieldProps.options) {
      return CommonUtils.renderLocalParamName(props.fieldProps.options, text);
    }
    return text;
  }

  static radioGroupRender(text, props) {
    return CommonUtils.renderLocalParamName(props.fieldProps.options, text);
  }
}
