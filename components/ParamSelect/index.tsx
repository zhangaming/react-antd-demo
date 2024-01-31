import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import _ from 'lodash';
import ParamManager from '@/services/paramManager';
import { ParamSelectProps, ParamSelectType } from './type';

export default function ParamSelect(props: ParamSelectProps) {
  const {
    placeholder = '请选择',
    kind,
    options,
    isNeedUniq = false,
    showType = ParamSelectType.ALL,
    extendFields,
    ...selectProps
  } = props;
  const [selectOptions, setSelectOptions] = useState<any>([]);
  const checkExtendField = (input, option) => {
    let result = false;
    if (extendFields && extendFields.length) {
      extendFields.some((item) => {
        if (option[item]?.indexOf(input.toUpperCase()) != -1 || option[item]?.indexOf(input.toLowerCase()) != -1) {
          result = true;
          return true;
        }
        return false;
      });
    }
    return result;
  };
  const filterOption = (input, option) => {
    if (
      option.label?.indexOf(input.toUpperCase()) != -1 ||
      option.label?.indexOf(input.toLowerCase()) != -1 ||
      option.value?.indexOf(input.toUpperCase()) != -1 ||
      option.value?.indexOf(input.toLowerCase()) != -1 ||
      checkExtendField(input, option)
    ) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    if (kind) {
      ParamManager.getInstance()
        .options(kind, extendFields && extendFields.length ? true : false)
        .then((result) => {
          const data = result;
          if (showType === ParamSelectType.VALUE) {
            data.forEach((item) => {
              item.label = item.value;
            });
          }
          if (isNeedUniq) {
            setSelectOptions(_.uniqBy(data, 'value'));
          } else {
            setSelectOptions(data);
          }
        });
    } else {
      if (isNeedUniq) {
        setSelectOptions(_.uniqBy(options, 'value'));
      } else {
        setSelectOptions(options);
      }
    }
  }, [kind, options]);
  return (
    <Select
      showSearch
      {...selectProps}
      optionLabelProp="label"
      allowClear={true}
      filterOption={filterOption}
      placeholder={selectProps.disabled ? '' : placeholder}
      getPopupContainer={
        selectProps?.getPopupContainer
          ? selectProps?.getPopupContainer
          : (triggerNode: any) => {
              return triggerNode.parentNode || document.body;
            }
      }
    >
      {Array.isArray(selectOptions)?selectOptions.map((item, index) => (
        <Select.Option key={index} value={item.value} label={item.label} {...item}>
          {showType === ParamSelectType.ALL
            ? extendFields
              ? `${item.value}  ${item.label} ${extendFields.map((option) => item[option]).join(' ')}`
              : `${item.value}  ${item.label}`
            : showType === ParamSelectType.LABEL
            ? item.label
            : item.value}
        </Select.Option>
      )):null}
    </Select>
  );
}
