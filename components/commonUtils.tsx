import React from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import moment from 'moment';
import { CommonTipMessage, DetailOperateEnum, TimeFormatEnum } from '@/enums/common.enum';
import { PubParamEnum } from '@/enums/param.enum';
import ParamManager from '@/services/paramManager';
import { TwoLineRender } from '@/types/common';
import { transportModeIconMap } from '../constants/global';
import { EmptyText } from './formColumnUtil';
import { isNullOrUnDef, isUnDef } from './is';
import { messageInstance } from './message';

export const DetailWrap = styled.div`
  border-radius: 8px;
  padding: 0 12px;
  min-height: calc(100vh / var(--zoom) - 72px);
`;
export class CommonUtils {
  /**时间区间搜索条件处理函数  timeList 是日期范围框返回的数组*/
  static handleRangeTime = (timeList) => {
    if (timeList && timeList.length) {
      return [timeList[0].startOf('day').valueOf(), timeList[1].endOf('day').valueOf()];
    } else {
      return [null, null];
    }
  };
  static isObjValueExist = (
    t: object,
    keys = isNullOrUnDef(t) ? [] : Object.keys(t),
    // filterNull null是否算作空
    // filterEmptyStr 空字符串是否算作空
    options = { filterNull: true, filterEmptyStr: false },
  ): boolean => {
    return isNullOrUnDef(t)
      ? false
      : keys.every(
          (k) =>
            !(options.filterNull ? isNullOrUnDef(t[k]) : isUnDef(t[k])) && (!options.filterEmptyStr || t[k] !== ''),
        );
  };
  static isObjValueEmpty(
    t: object,
    keys = isNullOrUnDef(t) ? [] : Object.keys(t),
    // filterNull null是否算作空
    // filterEmptyStr 空字符串是否算作空
    options = { filterNull: true, filterEmptyStr: false },
  ): boolean {
    return isNullOrUnDef(t)
      ? true
      : keys.every(
          (k) => (options.filterNull ? isNullOrUnDef(t[k]) : isUnDef(t[k])) || (options.filterEmptyStr && t[k] === ''),
        );
  }

  static hasOptions = (value: string | null | undefined, options: Array<any>): boolean => {
    let option = options.find((item) => item.value == value);
    if (option) return true;
    return false;
  };
  static unique(arr, key) {
    const res = new Map();
    return arr.filter((arr) => !res.has(arr[key]) && res.set(arr[key], 1));
  }
  static formatDate(text: string | Date, format: TimeFormatEnum = TimeFormatEnum.DATE_Y_M_D_H_S) {
    return text ? moment(text).format(format) : '';
  }
  static formatDayjsDate(text: string | Date, format: TimeFormatEnum = TimeFormatEnum.DATE_Y_M_D_H_S) {
    return text ? dayjs(text).format(format) : '';
  }
  static getDescByIEFlag(ieFlag, textI, textE) {
    return ieFlag === 'I' ? textI : textE;
  }

  static getEllipsisTitle(title) {
    const ellipsisTitle = title.substr(0, 6);
    return (
      <div title={title} style={{ cursor: 'pointer' }}>
        {ellipsisTitle}...
      </div>
    );
  }
  static renderTableParamName(kind: string, text: string, showCode: boolean = false, style?: any) {
    if (text) {
      const value = ParamManager.getInstance().getName(kind, text);
      return (
        <div className="catl-table-cell-ellipsis form-cell-ellipsis" style={{ width: '100%', ...style }} title={value}>
          {showCode ? (text || '') + ' ' + (value || '') : value}
        </div>
      );
    } else {
      return <EmptyText />;
    }
  }
  static renderTransf(text) {
    return text ? (
      <div className="transport-mode-table-cell">
        <div style={{ marginLeft: '10px' }}>{transportModeIconMap[text]}</div>
        <span className="catl-table-cell-light">
          {CommonUtils.renderTableParamName(PubParamEnum.TRANSF, text === null ? null : text.toString())}
        </span>
      </div>
    ) : (
      <EmptyText />
    );
  }

  static renderTableTwoLine(topField: TwoLineRender, bottomField: TwoLineRender) {
    const topFieldClass = topField.type ? `${topField.type} catl-table-cell-ellipsis` : 'catl-table-cell-ellipsis';
    const bottomFieldClass = bottomField.type
      ? `${bottomField.type} catl-table-cell-ellipsis`
      : 'catl-table-cell-ellipsis';
    const topValue = topField.fieldValue || <EmptyText />;
    const bottomValue = bottomField.fieldValue || <EmptyText />;
    return (
      <div className="twoFieldsWrap">
        <div className="field-row">
          {topField.fieldName ? <span className="catl-table-cell-light">{topField.fieldName}：</span> : ''}
          {topField.showType === 'link' ? (
            <div
              className={`${topFieldClass} catl-table-cell-link`}
              title={topField.fieldValue}
              onClick={() => topField!.clickFun!()}
            >
              {topValue}
            </div>
          ) : (
            <div className={topFieldClass} title={topField.fieldValue}>
              {topValue}
            </div>
          )}
        </div>
        <div className="field-row subTitle-margin">
          {bottomField.fieldName ? <span className="catl-table-cell-light">{bottomField.fieldName}：</span> : ''}
          {bottomField.showType === 'link' ? (
            <div
              className={`${bottomFieldClass} catl-table-cell-cursor`}
              title={bottomField.fieldValue}
              onClick={() => bottomField!.clickFun!()}
            >
              {bottomValue}
            </div>
          ) : (
            <div className={bottomFieldClass} title={bottomField.fieldValue}>
              {bottomValue}
            </div>
          )}
        </div>
      </div>
    );
  }

  static renderTableStrong(text, isBlue = false) {
    return (
      <span title={text} className={isBlue ? 'catl-table-cell-blue catl-table-cell-strong' : 'catl-table-cell-strong'}>
        {text}
      </span>
    );
  }

  static renderTableLink(text, onClick) {
    return (
      <>
        <a
          className="catl-table-cell-strong catl-table-cell-link"
          onClick={() => {
            onClick?.();
          }}
        >
          {text || <EmptyText />}
        </a>
      </>
    );
  }

  static renderLocalParamName(options: Array<any>, text: string) {
    const value =
      text !== null && text !== ''
        ? options.filter((item) => {
            return item.value === text;
          })[0]?.label
        : '';
    return text !== null && text !== '' ? (
      <span style={{ display: 'inline-block', width: '100%' }} title={value}>
        {value}
      </span>
    ) : (
      <EmptyText />
    );
  }

  /**处理列表国家 */
  static handleTaxType = (data) => {
    if (data) {
      return (
        <span
          style={{
            display: 'inline-block',
            border: '1px solid #C7D7E6',
            fontSize: '12px',
            lineHeight: '20px',
            color: '#5C6F91',
            borderRadius: '2px',
            margin: '0',
            padding: '2px 8px',
          }}
        >
          {data}
        </span>
      );
    } else {
      return <EmptyText />;
    }
  };
  static getTimeStampByDayjsObject(dateObj, isStartTime = true) {
    //该方法把antd组件库日期选择后返回的日期对象转换成后端所需要的时间戳（开始时间设置为0:0:0，结束设置设置为23:59:59)
    if (!dateObj) return '';
    return isStartTime
      ? dateObj.hour(0).minute(0).second(0).millisecond(0).valueOf()
      : dateObj.hour(23).minute(59).second(59).millisecond(59).valueOf();
  }

  static timer(ms: number = 0) {
    return new Promise((resolve) => {
      const s = setTimeout(() => {
        clearTimeout(s);
        resolve(1);
      }, ms);
    });
  }

  static changeValues(val) {
    let arr: any[] = [];
    arr = JSON.parse(JSON.stringify(val));
    if (arr && Array.isArray(arr)) {
      arr.forEach((item) => {
        if (item.hasOwnProperty('value')) {
          item.label = item?.value + '-' + item?.label;
        } else if (item.hasOwnProperty('code')) {
          item.value = item?.code;
          item.label = item?.code + '-' + item?.name;
        }
      });
    }
    return arr;
  }

  //把dayjs的对象转换成时间戳，并把开始时间设置到当天的 0:0:0, 结束时间设置到当天的 23:59:59
  static setAndReturnStartTime(time, isStart = true) {
    if (!time) {
      return '';
    } else {
      if (isStart) {
        return time.hour(0).minute(0).second(0).millisecond(0).valueOf();
      }
      return time.hour(23).minute(59).second(59).millisecond(59).valueOf();
    }
  }

  //把时间戳拆分到两个字段里面去，比如createTime为"16000234,234522"，拆分为 createTimeStart和createTimeEnd
  static splitDateStrToTwoFields(data, startStr = 'Start', endStr = 'End') {
    if (typeof data === 'object') {
      let fields: any = [];
      /**把data里面的时间字段找到(默认以time结尾的字段是时间字段) */
      Object.keys(data).forEach((ele) => {
        let lowerStr = ele.toLowerCase();
        if (lowerStr.endsWith('time') || lowerStr.endsWith('date')) {
          //说明该字段是时间字段
          fields.push(ele);
        }
      });
      fields.forEach((ele) => {
        let tempStr = data[ele];
        if (typeof tempStr === 'string') {
          tempStr = tempStr.split(',');
        }
        delete data[ele];
        data[`${ele}${startStr}`] = tempStr ? [tempStr[0]] : null;
        data[`${ele}${endStr}`] = tempStr ? [tempStr[1]] : null;
      });
    }
    return data;
  }

  static selectEmptyWarning = () => {
    messageInstance.warning(CommonTipMessage.LIST_CHECK_NO);
  };

  static getWhetherName = (val: number) => {
    return val === 1 ? '是' : val === 0 ? '否' : '';
  };

  static renderWhetherName = (text) => CommonUtils.getWhetherName(text);

  static whetherOpts = [
    {
      label: '否',
      value: 0,
    },
    {
      label: '是',
      value: 1,
    },
  ];

  static whetherWithEmptyOpts = [
    {
      label: '是',
      value: 1,
    },
    {
      label: '否',
      value: 0,
    },
    {
      label: '空',
      value: 9,
    },
  ];

  static getWhetherText(text) {
    const textMap = {
      '0': '否',
      '1': '是',
      '9': '空',
    };
    return textMap[text];
  }

  static getUnitText(text) {
    const textMap = {
      '1': '率',
      '2': '单价',
      '3': '总价',
    };
    return textMap[text];
  }

  //特殊导出字段转换
  static specialExportParamTransform(params) {
    let data = {
      ...params.searchReq,
    };
    delete data.selected;
    return data;
  }

  static getCookieValue(key) {
    const regex = new RegExp(`${key}=([^;]+)`);
    const match = document.cookie.match(regex);
    return match && match[1];
  }

  //排序字段处理
  static transSortField(params) {
    if (typeof params.sort === 'string') {
      return params.sort;
    } else if (typeof params.sort === 'object') {
      if (Object.keys(params.sort).length === 0) {
        return '';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  static useTableItemConfig = (
    title: string,
    dataIndex: string,
    width?: number | string,
    sorter = true,
    resizable = false,
  ) => ({
    title,
    key: dataIndex,
    dataIndex,
    width,
    sorter,
    showSorterTooltip: false,
    ellipsis: true,
    resizable,
  });

  static addThousandsSeparator(number) {
    if (number === null || number === '') {
      return '';
    }
    // 将数字转为字符串
    let strNumber = number.toString();

    let ary = strNumber.split('.');

    // 使用正则表达式添加千分位分隔符
    ary[0] = ary[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let newStrNumber = ary.join('.');
    return newStrNumber;
  }
}

export const isUndef = (v: unknown): v is undefined => {
  return typeof v === 'undefined';
};

export const isNullish = (v: unknown): v is undefined | null => {
  return v === null || isUndef(v);
};

export const getPathname = (index: number) => {
  let paths = location.pathname.split('/');
  if ([3, 4].includes(index)) {
    let str = paths[paths.length - index];
    if (str) {
      if (str.indexOf('-I') !== -1) {
        return 'I';
      } else if (str.indexOf('-E') !== -1) {
        return 'E';
      }
    } else {
      return paths[paths.length - index];
    }
  } else {
    return paths[paths.length - index];
  }
};

export const getTypeAndUid = () => {
  let ary: any = [DetailOperateEnum.LOOK, DetailOperateEnum.EDIT, DetailOperateEnum.ADD];
  let type = getPathname(2);
  let uid = getPathname(1);
  if (ary.includes(type)) {
    return {
      ieMark: getPathname(3),
      type,
      uid,
    };
  } else {
    return {
      ieMark: getPathname(3),
      type: uid,
      uid: null,
    };
  }
};

export const compareData = (detailData, submitData) => {
  // 对比两组数据的每个字段，逐一进行比较。
  for (const key in submitData) {
    if (detailData.hasOwnProperty(key)) {
      // 检查每个字段的值是否相同。
      if (
        (detailData[key] === null || detailData[key] === '') &&
        (submitData[key] === null || submitData[key] === '')
      ) {
        continue;
      }
      if (detailData[key] !== submitData[key]) {
        // 如果发现有字段的值不同，说明该字段被修改过。
        return true;
      }
    } else {
      return true;
    }
  }
  // 所有字段的值都相同，说明数据没有被修改过。
  return false;
};
