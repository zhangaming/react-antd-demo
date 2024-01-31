# 配置

```js
export function rootContainer(container) {
  return (
    <RootContext.Provider
      value={{
        service: hzeroInstance,
      }}
    >
      <ProConfigProvider
        valueTypeMap={{
          enhanceText: {
            render: (text, props) => FormItemDefaultRender.enhanceTextRender(text, props),
            renderFormItem: (text, props) => {
              return <Input placeholder={props.placeholder} {...props.fieldProps} />;
            },
          },
          enhanceDate: {
            render: (text, props) => FormItemDefaultRender.enhanceDateRender(text, props),
            renderFormItem: (text, props) => {
              return (
                <DatePicker
                  {...props.fieldProps}
                  getPopupContainer={(triggerNode: any) => {
                    return triggerNode.parentNode;
                  }}
                  value={text ? dayjs(text) : null}
                />
              );
            },
          },
          autoComplete:{
            render: (text, props) => FormItemDefaultRender.enhanceTextRender(text, props),
            renderFormItem: (text, props) => <AutoComplete defaultValue={text || ''} {...props?.fieldProps} />,
          },
          paramSelect: {
            render: (text, props) => FormItemDefaultRender.paramSelectRender(text, props),
            renderFormItem: (text, props) => <ParamSelect {...props?.fieldProps} />,
          },
          multipleDate: {
            renderFormItem: (text, props) => {
              return <DatePickerMulti defaultValue={text || ''} {...props?.fieldProps} />;
            },
          },
          radioGroup: {
            render: (text, props) => FormItemDefaultRender.radioGroupRender(text, props),
            renderFormItem: (text, props) => {
              return <RadioGroup defaultValue={text || ''} {...props?.fieldProps} />;
            },
          },
          checkboxGroup: {
            renderFormItem: (text, props) => {
              return <CheckboxGroup defaultValue={text || ''} {...props?.fieldProps} />;
            },
          },
          selectPro: {
            renderFormItem: (text, props) => {
              return <SelectPro defaultValue={text || ''} {...props?.fieldProps} />;
            },
          },
          textArea: {
            renderFormItem: (text, props) => {
              return <TextArea defaultValue={text || ''} {...props?.fieldProps} />;
            },
          },
          uploadScheam: {
            renderFormItem: (text, props) => {
              return <UploadScheam defaultValue={text || ''} {...props?.fieldProps} />;
            },
          },
          checkboxGroupTwo: {
            renderFormItem: (text, props) => {
              return <CheckboxGroupTwo defaultValue={text || ''} {...props?.fieldProps} />;
            },
          },
        }}
      >
        {container}
      </ProConfigProvider>
    </RootContext.Provider>
  );
}
```