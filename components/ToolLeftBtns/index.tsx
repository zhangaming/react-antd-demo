import React, { useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Space } from 'antd';
import { ColumnKey } from '@/enums/common.enum';
import { downloadExcel } from '@/services/commonDownload';
import globalStore from '@/store/globalStore';
import { messageInstance } from '@/utils/message';
import './index.less';
import { RequestEnum } from '@/enums/http.enum';
import { useExportLoading } from '@/globalHook';
import { getIntl } from '@/utils/i18n';

interface ButtonProps {
  name: string;
  key: string;
  onClick?: (record?: any) => void;
  disabled?: ((record?: any) => void) | boolean;
}

interface ToolLeftBtnsProps {
  buttons: ButtonProps[];
  showNum: number;
  record?: any;
  style?: any;
}

export function exportPart(config, setExportLoading?:Function) {
  handleExport(false, config, setExportLoading);
}
export function exportAll(config, setExportLoading?:Function) {
  handleExport(true, config, setExportLoading);
}

export function handleExport(isSelectAll: boolean, config, setExportLoading?:Function) {
  const {
    tableRef,
    bodyTableRef,
    exportCustomData,
    taskCode,
    excelName,
    secondHeader,
    getSearch,
    paramTransform,
    exportUrl,
  } = config;
  const uidList = tableRef.current.getSelection().map((item) => item[tableRef.current.getColumnKey()]);
  if (!isSelectAll && !uidList?.length) {
    messageInstance.warning('请勾选需要导出的数据');
    return;
  }
  /**处理字段合并的列表项(存在relatedColumns属性)*/
  const handleTableColumns = (list) => {
    let tableColumns: any = [];
    list.forEach((item) => {
      if (item.relatedColumns) {
        tableColumns = [...tableColumns, ...item.relatedColumns];
      } else {
        tableColumns = [...tableColumns, item];
      }
    });
    return tableColumns;
  };
  let header = handleTableColumns(tableRef.current.getColumns())
    .map((item) => ({
      key: item.dataIndex,
      value: item.title,
    }))
    .filter((item) => ![ColumnKey.ROW_OPERATIONS, ColumnKey.SERIAL_NO].includes(item.key));
  /**有第二表格时拼接导出数据*/
  if (bodyTableRef) {
    header = [
      ...header,
      ...handleTableColumns(bodyTableRef.current.getColumns())
        .map((item) => ({
          key: item.dataIndex,
          value: item.title,
        }))
        .filter((item) => ![ColumnKey.ROW_OPERATIONS, ColumnKey.SERIAL_NO].includes(item.key)),
    ];
  }
  /**有自定义字段时拼接导出数据*/
  if (exportCustomData) {
    header = [...header, ...exportCustomData];
  }

  let data = {
    taskCode,
    name: excelName,
    header,
    secondHeader,
    searchReq: {},
  };
  if (isSelectAll) {
    data.searchReq = {
      selected: 1,
      ...(getSearch ? getSearch(tableRef.current.getQueryParam()) : tableRef.current.getQueryParam()),
    };
  } else {
    data.searchReq = {
      selected: 0,
      uidList: uidList,
    };
  }
  if (paramTransform) {
    data = paramTransform(data);
  }
  downloadExcel(exportUrl, data, {}, RequestEnum.POST, true, setExportLoading ? setExportLoading : window['setExportLoading']);
}

const ToolLeftBtns = (props: ToolLeftBtnsProps) => {
  const {exportLoading,setExportLoading} = useExportLoading()
  window['setExportLoading'] = setExportLoading
  const { buttons, showNum = 1, record } = props;
  // const [items, setItems] = useState<any>([]);
  const [inButton, setInButton] = useState<any>([]);
  const [outButton, setOutButton] = useState<any>([]);
  /**
   * 导出按钮配置
   */

  function filterBtns(buttons, showNum, records) {
    let buttonObj: any = buttons.reduce(
      (pre: any, cur, index) => {
        if (index < showNum) {
          pre.outButton?.push(cur);
        } else {
          pre.inButton?.push({
            key: cur.key,
            label: <span>{cur.name}</span>,
            // disabled: cur.disabled?.(records),
            onClick: () => {
              cur.onClick?.(records);
            },
          });
        }
        return pre;
      },
      {
        outButton: [],
        inButton: [],
      },
    );
    return buttonObj;
  }
  /**
   * 组件内功能
   */
  useEffect(() => {
    // 过滤下权限按钮
    const permissionCheckResult: any = globalStore.permissionCheckResult || {};
    let btns: any = [];
    let btnsPer: any = [];
    buttons.forEach((el: any) => {
      let keys = Object.keys(el);
      if (keys.includes('permissionCode')) {
        if (el.permissionCode) {
          if (el.permissionCode in permissionCheckResult) {
            btnsPer.push(el);
          }
        }
      } else {
        btns.push(el);
      }
    });
    //过滤当前按钮显示
    let newButtons = [...btns, ...btnsPer];
    let buttonObj: any = filterBtns(newButtons, showNum, record);
    setInButton(buttonObj.inButton);
    setOutButton(buttonObj.outButton);
  }, [showNum, record, buttons]);

  let items = useMemo(() => {
    return inButton;
  }, [inButton, record]);
  return (
    <Space className="ToolLeftBtnsWrap" style={props.style ? props.style : {}}>
      {outButton.length > 0
        ? outButton.map((item, index) => {
            return (
              <Button
                type={index === 0 ? 'primary' : 'default'}
                key={item.key}
                onClick={() => {
                  item.onClick?.(record);
                }}
                loading={(item.key && item.key.startsWith('export') && item.loading === undefined) ? exportLoading : item.loading}
              >
                {item.name}
              </Button>
            );
          })
        : null}
      {items.length > 0 ? (
        <Dropdown
          placement="bottom"
          key="moreControls"
          menu={{
            items,
          }}
        >
          <Button type="default" key="moreListData">
            {getIntl('button.moreOperation', '更多操作')}
          </Button>
        </Dropdown>
      ) : null}
    </Space>
  );
};

export default ToolLeftBtns;
