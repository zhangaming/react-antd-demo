# 填写助手POC

## 例子
### 注意点
对应的key 为跳转元素的id 为的是方便点击跳转
### 代码范例

```js
import FormPoc from '@/components/FormPoc';


const ShemaForms: ItemProps[] = [
    {
      formRef: baseFormRef,
      key: 'basicInfo',
      title: '基础信息'
    },
    {
      formRef: billFormRef,
      key: 'billInfo',
      title: '报关单信息'
    },
    {
      formRef: otherFormRef,
      key: 'otherInfo',
      title: '其他事项'
    },
    {
      formRef: applyFormRef,
      key: 'applyInfo',
      title: '生成两步申报信息'
    }
  ]

     <DataBlockWrap title="基础信息" id={'basicInfo'}>
                <BasicInfo
                  pceOpts={pceOpts}
                  formRef={baseFormRef}
                  type={type}
                  forwarders={forwarders}
                  suppliers={suppliers}
                  ieMark={ieMark}
                  FormPocRef={FormPocRef}
                />
              </DataBlockWrap>

   <FormPoc key={'FormPoc'} ShemaForms={ShemaForms} ref={FormPocRef} />


    onValuesChange={() => {
        props?.FormPocRef?.current?.refreshCard()
      }}
```


<!-- beforeHandle -->

### beforeHandle:
点击title 跳转之前触发的功能 比如先跳转对应页面再滚动 传入方法

### custom 
如果需要自定义时
传入一个 custom对象
 {
      formRef: null, //表单实例
      key: 'checkInfo', //需要点击滚动回去地方的id
      title: '检查检疫信息', //卡片标题
      custom: { //需要自定义配置时
        TimeLineColor: '#1677ff',
        TimeLineDot: true,
        color: 'success',
        text: '已完成'
      }
    },
    
custom：{
  TimeLineColor: '#1677ff', // 时间轴上点的颜色
  TimeLineDot: true,  // 时间轴上 是否打钩
  color: 'success', tag的颜色
  text: '已完成' 文案
}
<!-- 
custom: { //需要自定义配置时
        
      }
 -->