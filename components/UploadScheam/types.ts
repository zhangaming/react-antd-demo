export interface UploadScheamProps {
  onChange?: ((e: any) => void) | undefined;
  defaultValue?: any;
  value?: any;
  options?: any;
  disabled?: boolean;
  id?: string;
  uid?: string; //表单的功能
  fileType?:string;// 00 性能单文档 01 容量标签加施方式附件 02 38.8报告编号附件 03 38.8试验概要编号附件 04分类鉴别报告编号附件 05 锂电产品外观图片 ...
  label?:string;
  bizType?:string;// 01性能单 02 预甄别 03 AI箱号图片
  simpleSize?: number; //单个文件大小
  totalSize?: number; //文件总大小
  isControlNumber?: boolean; //是否控制文件个数
  fileNumber?: number; //控制文件个数，当isControlNumber为true生效
  isControlSimpleSize?: boolean; //是否控制单文件大小
  accept?: string; //文件类型
  multiple?: boolean; //多选
  type?: string; //是否切换图片
  openPreview?: any; // 上传
  isDetail?: boolean; // 是否详情展示
  dataIndex?: string; //字段的key值
  tip?: string;
}
