import React, { useEffect, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Radio } from 'antd';
import './index.less';
import { RadioGroupProps } from './types';

export default function RadioGroup(props: RadioGroupProps) {
  const [value, setValue] = useState<any>(undefined);
  const [inputTxet, setInputTxet] = useState<any>(undefined);

  const [checked, setChecked] = useState<boolean>(false);
  useEffect(() => {
    if ((props?.defaultValue || props?.defaultValue === 0) && !props.disabled) {
      setValue(props?.defaultValue);
    }
  }, []);
  useEffect(() => {
    if (props.value || props?.value === 0) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    setChecked(props.inputTxet ? true : false);
    setInputTxet(props.inputTxet);
  }, [props.inputTxet]);
  function getClassName(radioType: number) {
    switch (radioType) {
      case 1:
        return 'schema-radio-group-item';
      case 2:
        return 'schema-radio-group-item-tow';
      case 3:
        return 'schema-radio-group-item-three';
      case 4:
        return 'schema-radio-group-item-four';
      case 5:
        return 'schema-radio-group-item';
      default:
        return 'schema-radio-group-item';
    }
  }
  function getGroupClassName(radioType: number) {
    switch (radioType) {
      case 1:
        return 'schema-radio-group';
      case 2:
        return 'schema-radio-group';
      case 4:
        return 'schema-radio-group schema-radio-group-four';
      case 5:
        return 'schema-radio-group schema-radio-group-four';
      default:
        return 'schema-radio-group';
    }
  }
  const itemClassName = useMemo(() => {
    return getClassName(props.radioType);
  }, [props.radioType]);

  const groupClassName = useMemo(() => {
    return getGroupClassName(props.radioType);
  }, [props.radioType]);
  return (
    <div className={`${groupClassName} ${props.disabled ? 'disabled' : ''}`} id={props.id ? props?.id : ''}>
      {props?.options?.length > 0
        ? props.options.map((item) => {
            return (
              <div
                key={item.value}
                value={item.value}
                className={`${itemClassName} ${value === item.value ? 'active' : ''} ${item.hidden ? 'hidden' : ''}`}
                style={item.style}
                onClick={() => {
                  if (props.disabled || item.hidden) {
                    return;
                  }
                  if (props.dataIndex) {
                    // 清除第二字段
                    setChecked(false);
                    setInputTxet('');
                    props.formRef?.current.setFieldValue(props.dataIndex, '');
                  }
                  setValue(item.value);
                  props.onChange?.(item.value);
                }}
              >
                {[2, 3].includes(props.radioType) ? (
                  <Radio checked={value === item.value} disabled={props.disabled}>
                    {item.label}
                  </Radio>
                ) : (
                  item.label
                )}
              </div>
            );
          })
        : null}

      {props.dataIndex ? (
        !checked ? (
          <Button
            size={props.inputSize}
            icon={<PlusOutlined />}
            style={{ marginLeft: 4, width: 181 }}
            onClick={() => {
              setChecked(true);
              setValue(props.otherValue || undefined);
              props.onChange?.(props.otherValue || undefined);
            }}
          >
            {props.title}
          </Button>
        ) : (
          <Input
            placeholder={`请输入${props.title}`}
            size={props.inputSize}
            allowClear
            value={inputTxet}
            style={{ marginLeft: 4, width: 181 }}
            onChange={(e: any) => {
              console.log(e.target.value);
              if (!e.target.value) {
                setChecked(false);
              }
              setInputTxet(e.target.value);
              props.formRef?.current.setFieldValue(props.dataIndex, e.target.value);
            }}
          />
        )
      ) : null}
    </div>
  );
}
