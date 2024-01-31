import React, { useEffect, useState } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Tooltip } from 'antd';
import useContainer from '@/components/DiccSimpleTable/hooks/useContainer';
import { ColumnKey } from '@/enums/common.enum';
import globalStore from '@/store/globalStore';
import { getIntl } from '@/utils/i18n';
import './index.less';

interface ButtonProps {
  name: string;
  key: string;
  onClick?: (record: any) => void;
  disabled?: ((record: any) => void) | boolean;
}

interface OperationButtonProps {
  buttons: ButtonProps[];
  showNum: number;
  record: any;
}

export function OperationColumn(buttons: ButtonProps[], showNum: number) {
  return {
    title: getIntl('common.operations', '操作'),
    dataIndex: ColumnKey.ROW_OPERATIONS,
    fixed: 'right',
    width: getOperationWidth(buttons, showNum),
    ellipsis: true,
    render(text, record) {
      return <OperationButton record={record} buttons={buttons} showNum={showNum} />;
    },
  };
}

function filterBtnswidth(buttons, showNum) {
  let isAllShow = buttons.length == showNum + 1;
  let buttonObj: any = buttons.reduce(
    (pre: any, cur, index) => {
      if (index < showNum || isAllShow) {
        pre.outButton?.push(cur);
      } else {
        pre.inButton?.push({
          key: cur.key,
          label: <span>{cur.name}</span>,
          disabled: cur.disabled,
          onClick: cur.onClick,
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

//判断权限是否启用
export function action(permissionCode) {
  const permissionCheckResult: any = globalStore.permissionCheckResult || {};
  return permissionCode in permissionCheckResult;
}

export function getOperationWidth(buttons, showNum) {
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
  let buttonObj: any = filterBtnswidth(newButtons, showNum);
  let names = buttonObj.outButton.map((item) => item.name);
  let nameStr = names.join('');
  let inButton = buttonObj.inButton;
  const language = globalStore.userInfo?.language;
  // 最外面两个padding 8  + 名字字符长度 12 + ...字符的长度+12 +  名字按钮padding的长度+ ...字符按钮padding的长度
  let width =
    (names.length > 0 || inButton.length > 0 ? 8 * 2 : 0) +
    nameStr.length * (language == 'zh_CN' ? 12 : 6) +
    (inButton.length > 0 ? 12 : 0) +
    (names.length + inButton.length > 0 ? (names.length + (inButton.length > 0 ? 1 : 0)) * 18 : 0);
  // console.log('两个padding，width1', (names.length > 0 || inButton.length > 0 ? 8 * 2 : 0))
  // console.log('两个字体长度 width2', nameStr.length * 12)
  // console.log('...按钮字体 width3', (inButton.length > 0 ? 12 : 0))
  // console.log('(names.length + inButton.length)', (names.length + inButton.length), names.length, inButton.length)
  // console.log('width4  按钮的padding ', (names.length + inButton.length > 0 ? (names.length + (inButton.length > 0 ? 1 : 0)) * 18 : 0))
  // console.log('width', width)
  return width;
}

const OperationButton = (props: OperationButtonProps) => {
  const { buttons, showNum = 1, record } = props;
  const [items, setItems] = useState<any>([]);
  const [outButton, setOutButton] = useState<any>([]);
  const getContainer = useContainer();
  function filterBtns(buttons, showNum) {
    let isAllShow = buttons.length == showNum + 1;
    let buttonObj: any = buttons.reduce(
      (pre: any, cur, index) => {
        if (index < showNum || isAllShow) {
          pre.outButton?.push(cur);
        } else {
          pre.inButton?.push({
            key: cur.key,
            label:
              cur.disabled?.(record) && cur.tip ? (
                <Tooltip placement="top" title={cur.tip} getPopupContainer={getContainer}>
                  <span>{cur.name}</span>
                </Tooltip>
              ) : (
                <span>{cur.name}</span>
              ),
            disabled: cur.disabled?.(record),
            onClick: () => {
              cur.onClick?.(record);
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
    let buttonObj: any = filterBtns(newButtons, showNum);
    setItems(buttonObj.inButton);
    setOutButton(buttonObj.outButton);
  }, [buttons, showNum, record]);
  return (
    <div className="OperationButtonWrap">
      {outButton.length > 0
        ? outButton.map((item) => {
            return item.disabled?.(record) && item.tip ? (
              <Tooltip key={item.key} placement="top" title={item.tip} getPopupContainer={getContainer}>
                <Button
                  type="link"
                  key={item.key}
                  onClick={() => {
                    item.onClick(record);
                  }}
                  disabled={item.disabled?.(record)}
                >
                  {item.name}
                </Button>
              </Tooltip>
            ) : (
              <Button
                type="link"
                key={item.key}
                onClick={() => {
                  item.onClick(record);
                }}
                disabled={item.disabled?.(record)}
              >
                {item.name}
              </Button>
            );
          })
        : null}
      {items.length > 0 ? (
        <Dropdown
          overlayClassName="operation-dropdown"
          placement="bottomRight"
          getPopupContainer={getContainer}
          menu={{
            items,
          }}
        >
          <EllipsisOutlined className="ellipsisOutlined" />
        </Dropdown>
      ) : null}
    </div>
  );
};

export default OperationButton;
