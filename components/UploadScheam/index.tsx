import React, { useEffect, useState } from 'react';
import { RcFile } from 'antd/es/upload';
import { CloseCircleFilled, CloseOutlined, DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Empty, Image, Upload } from 'antd';
import { debounce } from 'lodash';
import { RequestEnum } from '@/enums/http.enum';
import { download } from '@/services/commonDownload';
import dangerousPackageManageService from '@/services/dangerousPackageManageHttp';
import { EmptyText } from '@/utils/formColumnUtil';
import { messageInstance } from '@/utils/message';
import { errorImg } from './data';
import noFile from './img/noFile.png';
import pdfImg from './img/pdf.png';
import pptImg from './img/ppt.png';
import wordImg from './img/word.png';
import XlsxImg from './img/xlsx.png';
import './index.less';
import { UploadScheamProps } from './types';
import { RequestUrls } from '@/constants/requestUrls';

export default function UploadScheam(props: UploadScheamProps) {
  const {
    uid,
    bizType = '02',
    fileType,
    label,
    accept = '.png,.jpeg,.jpg,.pdf', //'.pdf', '.jpg', '.jpeg', '.png'
    simpleSize = 3,
    isControlSimpleSize = true,
    fileNumber,
    isControlNumber = true,
    multiple = true,
    type = 'file',
    openPreview,
    isDetail = false,
    dataIndex,
    tip = '',
  } = props;
  // const [value, setValue] = useState<any>(undefined);
  // const [fileNameArr, setFileNamArr] = useState<any>([]);
  const [fileList, setFileList] = useState<any>([]);

  // 待检清单-未发送_20231102193524.xlsx文件明显
  useEffect(() => {
    if (props?.defaultValue && !props.disabled) {
      setFileList(props?.defaultValue);
    }
  }, []);
  useEffect(() => {
    if (props.value) {
      setFileList(props.value);
    }
  }, [props.value]);

  const pushList = debounce(() => {
    // 请求接口
    let uploadFlies = fileList.filter((item) => {
      return !item.fileId;
    });

    let currentFlies = fileList.filter((item) => {
      return item.fileId;
    });
    getUploadparmas(uploadFlies, currentFlies, uid, bizType, fileType);
    // uploadFlies 去请求接口 返回id和nama uploadFliesResult
  }, 300);
  const getUploadEndVal = (fileName) => {
    return fileName.substring(fileName.lastIndexOf('.')).toLocaleLowerCase();
  };

  const getUploadImg = (fileName) => {
    let endVal = getUploadEndVal(fileName);
    return ['.xls', '.xlsx', '.csv'].includes(endVal)
      ? XlsxImg
      : ['.doc', '.docx'].includes(endVal)
      ? wordImg
      : ['.ppt', '.pptx', '.pptm'].includes(endVal)
      ? pptImg
      : ['.pdf'].includes(endVal)
      ? pdfImg
      : '';
  };

  /**
   *
   * @param file 文件
   * @returns
   */
  async function beforeUpload(file) {
    // if (!props.uid) {
    //   messageInstance.warning(`请先保存上面的表单数据`);
    //   return;
    // }
    if (isControlNumber && fileNumber && fileList.length >= fileNumber) {
      messageInstance.warning(`每次最多上传${fileNumber}个文件`, 3);
      return;
    }
    let size = Math.round((file.size / 1024 / 1024) * 100) / 100;

    if (isControlSimpleSize && size > simpleSize) {
      messageInstance.warning(`单个附件大小要求不超过${simpleSize}M`, 3);
    } else {
      let fileName = file.name;
      let endVal = getUploadEndVal(fileName);
      if (!accept.split(',').includes(`${endVal}`)) {
        messageInstance.warning(`只能上传${accept}格式文件`, 3);
        return;
      }
      //@ts-nocheck
      // if (fileNameArr.includes(fileName)) {
      //   messageInstance.warning(`${fileName}文件已经选择过，不能重复选择`, 3);
      //   return;
      // }

      if (type == 'img' && !file.url && !file.preview) {
        file.preview = await getBase64(file);
      }

      // fileNameArr.unshift(fileName);
      fileList.unshift({
        preview: file.preview || undefined,
        uid: file.uid,
        name: file.name,
        file,
      });
      pushList(); //请求接口
    }
    return false;
  }

  const getUploadparmas = async (fileLists, currentFlies, uid, bizType, fileType) => {
    let data: any = new FormData();
    data.extra = '';
    data.append('bizId', uid ? uid : '');
    data.append('bizType', bizType);
    data.append('fileType', fileType);
    if(label){
      data.append('label', label);
    }
    if (dataIndex) {
      data.append('fieldName', dataIndex);
    }
    fileLists.forEach((item) => {
      data.append('file', item.file);
    });
    if (fileNumber && currentFlies.length == fileNumber) {
      messageInstance.warning(
        `只能上传${fileNumber}${type == 'img' ? '张图片' : '份文件'},请先删除${type == 'img' ? '原图片' : '原文件'}`,
      );
      return;
    }
    if (multiple) {
      let all = fileLists.length + currentFlies.length;
      if (fileNumber && all > fileNumber) {
        messageInstance.warning(`该字段限制上传${fileNumber}${type == 'img' ? '张图片' : '份文件'}`);
        setFileList(currentFlies);
        return;
      }
    }
    const res = await dangerousPackageManageService.DangerousPackageManagePreHazardousProductUpload(data); //预甄别接口
    if (res.code == 0) {
      messageInstance.success('上传成功');
      let uploadFliesResult: any = res.data;
      let newFileList = JSON.parse(JSON.stringify(fileList));
      newFileList.forEach((el) => {
        uploadFliesResult.forEach((item) => {
          if (item.fileName == el.name) {
            el.fileId = item.uid;
            el.uid = item.uid;
          }
        });
      });
      setFileList(newFileList);
      props.onChange?.(newFileList);
    } else {
      messageInstance.error(res.message);
      let newFileList = JSON.parse(JSON.stringify(fileList));
      if (fileNumber && fileNumber == 1) {
        newFileList.forEach((el) => {
          fileLists.forEach((item) => {
            if (item.name == el.name) {
              el.status = 'error';
            }
          });
        });
        setFileList(newFileList);
        props.onChange?.(newFileList);
      } else {
        newFileList.forEach((el) => {
          fileLists.forEach((item) => {
            if (item.name == el.name && !el.fileId) {
              el.status = 'error';
            }
          });
        });
        setFileList(newFileList);
        props.onChange?.(newFileList);
      }
    }
  };
  /**
   *
   * @param file 文件
   */
  function onRemove(file): void {
    let newFileList = fileList.filter((ele) => ele.uid !== file.uid);
    setFileList(newFileList);
    props.onChange?.(newFileList);
    // cutFile(file.name);
  }
  // //减少文件
  // const cutFile = (val) => {
  //   let tempArray = fileNameArr.filter((ele) => ele !== val);
  //   setFileNamArr(tempArray);
  // };
  // 预览
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 下载
  function downloadData(data) {
    download(`${RequestUrls.dangerousPackageManageApi.DangerousPackageManageDownloadUrl}/${data}`, {}, {}, '', RequestEnum.POST, false);
  }

  return (
    <div className="schema-uploadp">
      {isDetail || (fileNumber && fileNumber == fileList.length) ? null : (
        <Upload
          disabled={false}
          action={''}
          accept={accept}
          fileList={fileList}
          showUploadList={false}
          onRemove={onRemove}
          multiple={multiple}
          beforeUpload={beforeUpload}
        >
          {type == 'img' ? (
            <div className="upload-img-button">
              <PlusOutlined className="upload-img-button-icon" />
            </div>
          ) : (
            <div>
              <Button icon={<UploadOutlined />}>选择文件</Button>
              <br />
              {tip ? (
                <span
                  style={{
                    color: '#999999',
                  }}
                >
                  {tip}
                </span>
              ) : null}
            </div>
          )}

          {/* /gcms/v1/docFile/upload */}
        </Upload>
      )}
      {/* 待检清单-未发送_20231102193524.xlsx */}
      {type == 'img' ? (
        <div
          className="download-box-container-img"
          style={isDetail || (fileNumber && fileNumber == fileList.length) ? { padding: 0 } : {}}
        >
          {fileList.length > 0 ? (
            fileList.map((file) => {
              return (
                <div className="download-box-img" key={file.uid}>
                  {isDetail ? null : (
                    <CloseCircleFilled
                      className="download-box-img-close"
                      onClick={() => {
                        console.log(uid && file.fileId);
                        if (uid && file.fileId) {
                          dangerousPackageManageService
                            .deleteFileDangerousPackageManagePreHazardousProduct(file.fileId)
                            .then((res) => {
                              if (res.code == 0) {
                                onRemove(file);
                              } else {
                                messageInstance.error(res.message);
                              }
                            });
                        } else {
                          onRemove(file);
                        }
                      }}
                    />
                  )}
                  {file.status == 'error' ? (
                    <Image width={48} height={48} src={errorImg} fallback={errorImg} />
                  ) : file.preview ? (
                    <Image width={48} height={48} src={file.preview} fallback={errorImg} />
                  ) : (
                    <Image width={48} height={48} src={file.src} fallback={errorImg} />
                  )}
                </div>
              );
            })
          ) : isDetail ? (
            <div className="download-box-img">
              <img
                style={{
                  width: 48,
                  height: 48,
                }}
                src={errorImg}
                fallback={errorImg}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className="download-box-container"
          style={isDetail || (fileNumber && fileNumber == 1 && fileList.length == 1) ? { padding: 0 } : {}}
        >
          {fileList.length > 0 ? (
            fileList.map((file) => {
              return (
                <div className="download-box" key={file.uid}>
                  <div className="download-img">
                    <img src={getUploadImg(file.name)} alt="" />
                  </div>
                  <div
                    className={`download-text ${file.status ? 'error' : ''}`}
                    onClick={() => {
                      // 预览
                      if (file.status) {
                        messageInstance.error('预览失败，请重新上传');
                        return;
                      }
                      if (file.fileId) {
                        // 预览
                        let endVal = getUploadEndVal(file.name);
                        if (['.pdf', '.jpg', '.jpeg', '.png'].includes(endVal)) {
                          let type = endVal.replace('.', '');
                          openPreview(file.fileId, type);
                        } else {
                          downloadData(file.fileId);
                        }
                      }
                    }}
                  >
                    {file.name}
                  </div>
                  <div
                    className={`download-icon ${file.status ? 'error' : ''}`}
                    onClick={() => {
                      // 下载
                      if (file.status) {
                        messageInstance.error('预览失败，请重新下载');
                        return;
                      }
                      if (file.fileId) {
                        // 下载
                        downloadData(file.fileId);
                      }
                    }}
                  >
                    {' '}
                    <DownloadOutlined />
                  </div>
                  {isDetail ? null : (
                    <div
                      className="download-close"
                      onClick={() => {
                        if (uid && file.fileId) {
                          dangerousPackageManageService
                            .deleteFileDangerousPackageManagePreHazardousProduct(file.fileId)
                            .then((res) => {
                              if (res.code == 0) {
                                onRemove(file);
                              } else {
                                messageInstance.error(res.message);
                              }
                            });
                        } else {
                          onRemove(file);
                        }
                      }}
                    >
                      <CloseOutlined />
                    </div>
                  )}
                </div>
              );
            })
          ) : isDetail ? (
            <EmptyText></EmptyText>
          ) : // <img src={noFile} alt="" />
          null}
        </div>
      )}
    </div>
  );
}
