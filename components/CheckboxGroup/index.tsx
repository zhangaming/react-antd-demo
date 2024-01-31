import { Checkbox } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { RadioGroupProps } from './types';
export default function RadioGroup(props: RadioGroupProps) {

  const [value, setValue] = useState<any>([])
  useEffect(() => {
    if (props?.defaultValue && !props.disabled) {
      setValue(props?.defaultValue)
    }
  }, [])
  useEffect(() => {
    if (props.value) {
      setValue(props.value)
    }
  }, [props.value])
  function getClassName(checkboxType: number) {
    switch (checkboxType) {
      case 1:
        return 'schema-radio-group-item'
      case 2:
        return 'schema-radio-group-item-tow'
      case 3:
        return 'schema-radio-group-item-three'
      case 4:
        return 'schema-radio-group-item-two-big'
      default:
        return 'schema-radio-group-item'
    }
  }
  function getGroupClassName(checkboxType: number) {
    switch (checkboxType) {
      case 1:
        return 'schema-radio-group'
      case 2:
        return 'schema-radio-group'
      default:
        return 'schema-radio-group'
    }
  }
  const itemClassName = useMemo(() => {
    return getClassName(props.checkboxType)
  }, [props.checkboxType])

  const groupClassName = useMemo(() => {
    return getGroupClassName(props.checkboxType)
  }, [props.checkboxType])
  return (
    <div className={`schema-radio-group ${props.disabled ? 'disabled' : ''}`} id={props.id ? props?.id : ''}>
      {props.options.length > 0 ? props.options.map((item) => {
        return <div
          key={item.value}
          value={item.value}
          style={props.itemWidth ? {width: props.itemWidth} : {}}
          className={`${itemClassName} ${value.includes(item.value) ? 'active' : ''}`}
          onClick={() => {
            if (props.disabled) {
              return
            }
            let ary = JSON.parse(JSON.stringify(value))
            if (ary.includes(item.value)) {
              ary = ary.filter(it => it !== item.value)
            } else {
              ary.push(item.value)
            }
            props.onChange?.(ary)
          }}>{
              [2, 3].includes(props.checkboxType) ? <Checkbox checked={value.includes(item.value)} disabled={props.disabled} >{item.label}</Checkbox> : 
              [4].includes(props.checkboxType) ? <div style={{width: '100%', display: 'flex',justifyContent: 'space-between'}}><div>{item.label} </div><div><Checkbox checked={value.includes(item.value)} disabled={props.disabled}></Checkbox> </div></div> :
              item.label
            }
          </div>
      }) : null}
    </div>
  )
}
