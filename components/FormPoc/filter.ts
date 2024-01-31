import { ItemProps } from './type';
//获得必填项的值和有显示的值
export const getFormKeysForshowAndRequired = (item: ItemProps) => {
  // 获取到含有required为true的keys
  // 根据对应的id获取对应表单下的key
  let requiredKeys = getIdRequiredKeys()
  const AllfromFields = item.formRef?.current?.getFieldsValue()
  let myRequiredFromKeys: string[] = []
  for (let key in AllfromFields) {
    if (requiredKeys.includes(key)) {
      myRequiredFromKeys.push(key)
    }
  }
  const fromFields = item.formRef?.current?.getFieldsValue(true)
  let fromKeys: string[] = []
  for (let key in fromFields) {
    if (fromFields[key]) {
      fromKeys.push(key)
    }
  }
  const resultsKeys = fromKeys.filter(item => myRequiredFromKeys.includes(item))
  return {
    myRequiredFromKeys,
    resultsKeys
  }
}
//获取所有表单元素里有required属性的值
export const getRequiredKeys = () => {
  let labelAry: any = (document as any).getElementsByTagName('label')
  let requiredKeys: string[] = []
  for (let i = 0; i < labelAry.length; i++) {
    let className = labelAry[i].attributes['class']?.value
    let key = labelAry[i].attributes['for']?.value
    if (className.indexOf('required') != '-1') {
      // required为true
      requiredKeys.push(key)
    }
  }
  return requiredKeys
}
// 项目里的页签会把之前的页面缓存下来 所以要先保证展示页面下查找的表单
//获取表单id下的表单元素有required属性的值
export const getIdRequiredKeys = () => {
  // let activeDOMs = document.querySelectorAll(`.dicc-tabs-tabpane-active #${id}`)
  let activeDOMs = document.querySelectorAll(`.dicc-tabs-tabpane-active`)
  let activeDOM = activeDOMs[0]
  let labelAry: any = activeDOM?.getElementsByTagName('label') || []
  let requiredKeys: string[] = []
  for (let i = 0; i < labelAry.length; i++) {
    let className = labelAry[i].attributes['class']?.value
    let key = labelAry[i].attributes['for']?.value
    if (className.indexOf('required') != '-1') {
      // required为true
      requiredKeys.push(key)
    }
  }
  return requiredKeys
}

//根据必填项的值 和表单内有显示的值进行对比
export const tagOptionsFilter = (requiredKeys: string[], results: string[], item: ItemProps) => {
  return item.formRef?.current ? (requiredKeys.length == 0 ? {
    TimeLineColor: 'gray',
    color: 'default',
    text: '非必填'
  } : requiredKeys.length > 0 && results.length == 0 ? {
    TimeLineColor: 'gray',
    color: 'default',
    text: '未填写'
  } :
    (requiredKeys.length > 0 && results.length > 0) && (requiredKeys.length == results.length) ? {
      TimeLineColor: '#1677ff',
      TimeLineDot: true,
      color: 'success',
      text: '已完成'
    } :
      requiredKeys.length > 0 && (results.length < requiredKeys.length) ? {
        TimeLineColor: 'gray',
        color: 'processing',
        text: `${requiredKeys.length - results.length}项待填`
      } :
        {
          TimeLineColor: '#1677ff',
          color: 'processing',
          text: '进行中'
        }
  ) : {
    TimeLineColor: 'gray',
    color: 'default',
    text: '未填写'
  }
}


//跳转到点击元素
export const scrollToDomId = (id: string) => {
  let activeDOMs = document.querySelectorAll(`.dicc-tabs-tabpane-active #${id}`)
  let activeDOM = activeDOMs[0]
  activeDOM?.scrollIntoView({
    block: 'start',
    behavior: 'smooth'
  })
}

//跳转到点击元素
export const scrollDomColor = (height, id) => {
  let activeDOMs = document.querySelectorAll(`.dicc-tabs-tabpane-active #${id}`)
  let activeDOM = activeDOMs[0]
  let offsetTop = activeDOM?.offsetTop
  let clientHeight = activeDOM?.clientHeight
  let offsetBottom = (offsetTop + clientHeight)
  if (height >= offsetTop && height < offsetBottom) {
    return '#1677ff'
  } else {
    return 'gray'
  }
}