import { CheckCircleFilled } from '@ant-design/icons';
import { Tag, Timeline } from 'antd';
import { debounce } from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { getFormKeysForshowAndRequired, scrollDomColor, scrollToDomId, tagOptionsFilter } from './filter';
import './index.less';
import { FormPocProps, ItemProps, customAttrs } from './type';
import Poc from './img/poc.png'
import Watch from './img/watch.png'

const FormPoc = (props: FormPocProps, ref): any => {
  const {
    style,
    ShemaForms,
    beforeHandle,
    isDetail = false
  } = props
  const [isFormPoc, setIsFormPoc] = useState<boolean>(false)//一个标识表单是否改变
  const [scrollHeight, setScrollHeight] = useState<number>(0)
  const refreshCard = debounce(() => {
    setIsFormPoc(state => !state)
  }, 300)
  var timeHandle = null
  // 获取出colums里的包含required的值
  // const [TimelineItems,setTimelineItems] = useState<any>([])
  const getTimelineItems = (ShemaForms: ItemProps[], timeHandle) => {
    const ary = ShemaForms.map((item: ItemProps) => {
      let tagOptions: customAttrs = {
        TimeLineColor: '#BDC4D0',
        color: 'processing',
        text: '进行中'
      }
      if (item?.formRef) {
        let {
          myRequiredFromKeys,
          resultsKeys
        } = getFormKeysForshowAndRequired(item)
        tagOptions = tagOptionsFilter(myRequiredFromKeys, resultsKeys, item)
      } else {
        tagOptions = item.custom || {
          TimeLineColor: 'gray',
          color: 'default',
          text: '非必填'
        }
      }

      return {
        color: isDetail ? scrollDomColor(scrollHeight, item.key) : tagOptions.TimeLineColor,
        dot: isDetail ? null : tagOptions.TimeLineDot ? <CheckCircleFilled className="form-poc-circle" /> : null,
        children: <div className='time-line-row' key={`time-line-${item.key}`}>
          <div className='time-line-title' onClick={() => {
            if (beforeHandle) {
              beforeHandle?.()
              clearTimeout(timeHandle)
              timeHandle = setTimeout(() => {
                scrollToDomId(item.key)
              }, 1000);
            } else {
              scrollToDomId(item.key)
            }
          }}> {item.title} </div>
          {isDetail ? null : <Tag className='time-line-tag' bordered={false} color={tagOptions.color}>{tagOptions.text}</Tag>}
        </div>
      }
    })
    return ary
  }
  const TimelineItems = useMemo(() => {
    return getTimelineItems(ShemaForms, timeHandle)
  }, [ShemaForms, isFormPoc, timeHandle, scrollHeight])

  /**刷新 */
  useImperativeHandle(ref, () => ({
    refreshCard
  }));

  let activeDOMs = document.querySelectorAll(`.dicc-tabs-content-holder`)
  let activeDOM = activeDOMs[0]
  const windowChange = () => {
    const height = activeDOM.scrollTop
    setScrollHeight(height)
  }
  useEffect(() => {
    activeDOM.addEventListener('scroll', windowChange)
    return () => {
      activeDOM.removeEventListener('scroll', windowChange)
    }
  }, [])

  return (
    <div style={style}>
      <div className='form-poc-img' >
        <img src={isDetail ? Watch : Poc} alt={isDetail ? '浏览助手' : '填写助手'} />
      </div>
      <div className='form-poc'>
        <Timeline
          items={TimelineItems}
        />
      </div>
    </div>
  )
}

export default forwardRef(FormPoc);