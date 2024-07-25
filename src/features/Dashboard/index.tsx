import { hot } from 'react-hot-loader/root';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Upload, Button, Modal, Steps, ToastFactory, Card, Avatar, Table, Progress } from '@douyinfe/semi-ui';
import './index.less';
import { IconFile, IconHelpCircle, IconClear } from '@douyinfe/semi-icons';
import * as XLSX from 'xlsx';
import Meta from '@douyinfe/semi-ui/lib/es/card/meta';
import { BeforeUploadProps } from '@douyinfe/semi-ui/lib/es/upload';
import SDK from '@lark-project/js-sdk';
import axios from 'axios';
import { BASE_URL, HEADERS } from '../../constants';
import { Field, mergeTestCases } from './request';


const sdk = new SDK();

const STEP_1_UPLOAD = 0;
const STEP_2_PREVIEW = 1;
const STEP_3_FINISH = 2;

const SetIsReadyForNextStepContext = React.createContext((isReady: boolean) => {
});
const SetCurrentErrorContext = React.createContext((currentErr: string) => {
});
const SetFileNameContext = React.createContext((filename: string) => {
});
const SetFileContext = React.createContext((file: File) => {
});

//创建一个在页面顶部且置顶的弹窗
export const ToastOnTop = ToastFactory.create({
  zIndex: 99999,
});

/*
   此处封装了每一步独特的页面的组件

   参数:无

   返回值:progress组件
    */
const StepContent = ({ currentStep }) => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [resolvedExcelData, setResolvedExcelData] = useState<Object[]>([]);
  //用于保存专门用来展示的exceldata
  const [excelDataForDisplay,setExcelDataForDisplay] = useState<Object[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const setIsReadyForNextStep = useContext(SetIsReadyForNextStepContext);
  const setCurrentError = useContext(SetCurrentErrorContext);
  const [fileName, setFileNameState] = useState<string>('');
  const [file, setFileState] = useState<File>();
  const [columns, setColumns] = useState<Object[]>([]);
  const [fields, setFields] = useState<any>([]);
  const [progress, setProgress] = useState<number>(0);
  const [isWorkCreated, setIsWorkCreated] = useState<boolean>(false);//防止工作项被重复创建

  /*
  此函数用于把用户excel表格里的数据映射成调用API时传入的参数

  参数:
    1.excelData:解析完的excel表格数据
    2.fields:飞书项目中的字段

  返回值:
    1.excelData:映射完的excel表格数据
   */
  const optionMapping=(excelData:Object[],fields:Field[])=>{
    const options = fields
      .filter((field: Field) => {
        return field.field_type_key === 'select' || field.field_type_key === 'multi_select';
      })
      .reduce((acc, field: Field) => {
        let result: { [key: string]: string } = {};
        if (field.options) {
          for (const opt of field.options) {
            result[opt.label] = opt.value;
          }
        }
        acc[field.field_name] = result; // 动态设置键和值
        return acc;
      }, {} as { [key: string]: { [key: string]: string } }); // 指定初始值和累加器的类型

    excelData = excelData.map((row: { [key: string]: any }) => {
      for (const key of Object.keys(row)) {
        if (options[key]) {
          row[key] = options[key][row[key]];
        }
      }
      return row;
    });
    return excelData;
  }

  /*
  此处封装了用于检查表格是否存在错误的函数

  参数:
    1. headline:表头

  返回值:
    1. 没有错误: {hasError:false, errFields:[]}
    2. 有错误: {hasError:true, errFields:[<有问题的字段>]
   */
  const checkErr = async (): Promise<{ hasError: boolean, errors: string[] }> => {

    /*
    此函数用于检查表头是否存在

    参数:
      1.headers:excel表格的表头
      2.fieldNames:飞书项目所有字段的名称
      3.errors:外部传入的对象，有错误就push到这个对象中

    返回值:无
     */
    const checkHeaders = (headers: string[], fieldNames: string[], errors: string[]): void => {
      let errFields: string[] = [];
      headers.forEach((field) => {
        if (fieldNames.indexOf(field) === -1) {
          errFields.push(field);
        }
      });
      if (errFields.length > 0) {
        errors.push(`表头不存在:${errFields.join(',')}`);
      }
    };

    /*
    此函数用于检查选项是否存在

    参数:
      1.excelData:解析完的excel表格数据
      2.fields:飞书项目的字段
      3.errors:外部传入的对象，有错误就push到这个对象中

    返回值：无
     */
    const checkOptions = (excelData: Object[], fields: Field[], errors: string[]): void => {
      let errFields: string[] = [];
      const options = fields
        .filter((field: Field) => {
          return field.field_type_key === 'select' || field.field_type_key === 'multi_select';
        })
        .reduce((acc, field: Field) => {
          let result: string[] = [];
          if (field.options) {
            for (const opt of field.options) {
              result.push(opt.label);
            }
          }
          acc[field.field_name] = result; // 动态设置键和值
          return acc;
        }, {} as { [key: string]: string[] }); // 指定初始值和累加器的类型
      excelData.forEach((row) => {
        const keys = Object.keys(row);
        const optionKeys = Object.keys(options);
        keys.forEach((key: string) => {
          if (optionKeys.includes(key) && (!options[key].includes(row[key]))) {
            if (!errFields.includes(row[key]))
              errFields.push(`${key}-${row[key]}`);
          }
        });
      });
      if (errFields.length > 0) {
        errors.push(`选项不存在:${errFields.join(',')}`);
      }
    };

    //检查必填的字段(用例名称和前置条件)是否存在
    const checkRequired = (headers: string[], excelData: Object[], fields: Field[], errors: string[]): void => {
      const requiredNames = fields.filter((field: Field) => (field.field_key === 'name') || (field.field_key))[0].field_name;

    };


    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        if (e.target && e.target.result) {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: Object[] = XLSX.utils.sheet_to_json(worksheet);
          let headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
          //筛出所有的undef
          headers = headers.filter((header) => header);
          setHeaders(headers);
          const context = await sdk.Context.load();
          const projectKey = context.mainSpace?.id;
          const workItemTypeKey = context.activeWorkItem?.workObjectId;
          const fields = await axios.post(`${BASE_URL}/open_api/${projectKey}/field/all`, { work_item_type_key: workItemTypeKey }, HEADERS);
          setFields(fields.data.data);
          const jsonDataCopy = JSON.parse(JSON.stringify(jsonData));
          setResolvedExcelData(optionMapping(jsonDataCopy, fields.data.data));
          setExcelDataForDisplay(jsonData)
          const fieldNames = fields.data.data.map((field: { field_name: string; }) => field.field_name);
          //用来储存错误
          let errors: string[] = [];
          checkHeaders(headers, fieldNames, errors);
          checkOptions(jsonData, fields.data.data, errors);

          if (errors.length === 0) {
            resolve({ hasError: false, errors: [] });
          } else {
            resolve({ hasError: true, errors });
          }
        } else {
          reject('数据解析时遇到错误!');
        }
      };

      if (file) {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  useEffect(() => {
    if (currentStep === STEP_2_PREVIEW && file) {
      checkErr().then(res => {
        if (res.hasError) {
          setIsReadyForNextStep(false);
          if (errors.length === 0) {
            setErrors(res.errors);
          }
          setCurrentError('此表格数据有问题');
        } else {
          setIsReadyForNextStep(true);
        }
      }).catch(err => {
        setIsReadyForNextStep(false);
        setCurrentError(err);
      });
    }
    if (currentStep === STEP_3_FINISH && !isWorkCreated) {
      mergeTestCases(resolvedExcelData, fields, setProgress);
      setIsWorkCreated(true);
    }
  }, [currentStep, file, setIsReadyForNextStep, setCurrentError]);

  useEffect(() => {
    if (headers.length !== 0) {
      setColumns(headers.map(header => ({
        title: header,
        dataIndex: header,
      })));
    }
  }, [resolvedExcelData]);

  useEffect(() => {
    if (progress >= 99) {
      setIsReadyForNextStep(true);
    }
  }, [progress]);

  return (
    <>
      {currentStep === STEP_1_UPLOAD && (
        <>
          <SetFileNameContext.Provider value={setFileNameState}>
            <SetFileContext.Provider value={setFileState}>
              <UploadComponent />
            </SetFileContext.Provider>
          </SetFileNameContext.Provider>
          <div className={'dashboard-container-file-display'}>
            <Card
              style={{ maxWidth: '50%' }}
              bodyStyle={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Meta
                title={fileName ? fileName : '未上传文件'}
                avatar={
                  <Avatar size="default" style={{ margin: 4 }}>
                    {fileName ? <IconFile /> : <IconHelpCircle />}
                  </Avatar>
                }
              />
            </Card>
          </div>
        </>
      )}
      {currentStep === STEP_2_PREVIEW && (
        <div className={'current-step-container'}>
          {errors.map((err) => <div style={{ display: 'flex', alignItems: 'center' }}><IconClear
            style={{ color: 'red' }} /><strong>{err}</strong></div>)}
          <Table columns={columns} dataSource={excelDataForDisplay} pagination={{ pageSize: 5 }} />
        </div>
      )}
      {currentStep === STEP_3_FINISH && <div><Progress percent={progress} showInfo={true} /></div>}
    </>
  );
};

/*
  此处封装了弹窗中每一步对应的页面

  参数:
    1. currentStep:表示当前是第几步

  返回值:ProgressComponent组件，也就是每一阶段对应的页面

  需要注意:currentStep的索引是从0开始的
   */
const ProgressComponent = ({ currentStep }: { currentStep: number, setCurrentError: any }) => {
  return (
    <div className={'step-indicator'}>
      <Steps type="basic" current={currentStep} className={'steps'}>
        <Steps.Step title="第一步:导入" description="导入xlsx. csv. 格式的文件" />
        <Steps.Step title="第二步:预览" description="预览导入的结果" />
        <Steps.Step title="第三步:完成" description="大功告成" />
      </Steps>
      <StepContent currentStep={currentStep} />
    </div>
  )
    ;
};

/*
  此处封装了一个上传按钮

  参数:
    1. callBack:回调函数，用于在用户上传完文件后把解析完的结果传回父组件

  返回值:UploadComponent组件
  */
const UploadComponent = () => {
  const setIsReadyForNextStep = useContext(SetIsReadyForNextStepContext);
  const setFileName = useContext(SetFileNameContext);
  const setFile = useContext(SetFileContext);

  /*
   此函数会在用户上传完文件后执行，作用是对文件进行解析

   参数:
     1. file: semi的Upload组件会把用户上传的文件传入此参数

   返回值:false,由于没有后端所以直接返回false防止Upload组件自动上传
    */
  const handleBeforeUpload = (file: BeforeUploadProps): boolean => {
    const blob = file.file.fileInstance;
    if (blob) {
      setFile(blob);
      setFileName(blob.name);
      setIsReadyForNextStep(true);
      ToastOnTop.success('上传成功');
    } else {
      ToastOnTop.error('文件已损坏');
    }

    return false;
  };

  return (
    <div className={'upload-button'}>
      <Upload
        draggable={true}
        dragMainText={'点击上传文件或拖拽文件到这里'}
        dragSubText="仅支持.xlsx, .csv格式的文件"
        accept={'.xlsx, .csv'}
        fileList={[]}//防止Update组件渲染filelist
        beforeUpload={handleBeforeUpload}
      >
      </Upload>
    </div>
  );
};

export default hot(() => {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef(0);
  const [isReadyForNextStep, setIsReadyForNextStep] = useState(false);
  //此变量用于保存当前无法进行下一步操作的原因
  const [currentError, setCurrentError] = useState('未上传文件');
  useEffect(() => {
    setCurrentStep(currentStepRef.current);
    if (currentStepRef.current === STEP_2_PREVIEW) {
      setCurrentError('请稍等，正在加载');
    }
    if (currentStepRef.current === STEP_3_FINISH) {
      setCurrentError('导入中，请稍等');
    }
  }, [currentStep]);

  useEffect(() => {
    sdk.config({
      pluginId: 'MII_66977877C86E0004', // 此处填写插件凭证，可从开发者后台插件详情获取
      isDebug: true, // 开启调试模式，会在控制台 log 调用参数和返回值
    });
  }, []);

  //显示弹窗
  const showDialog = () => {
    setCurrentStep(0);
    currentStepRef.current = 0;
    setVisible(true);
    setCurrentError('未上传文件!');
  };

  const handleOk = () => {
    if (!isReadyForNextStep) {
      ToastOnTop.error(currentError);
      return;
    }
    if (currentStep === STEP_3_FINISH) {
      setVisible(false);
    } else {
      setIsReadyForNextStep(false);
    }
    setCurrentStep(currentStep + 1);
    currentStepRef.current += 1;
  };

  //关闭弹窗
  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className="dashboard-container" id="dashboard-container">
      <Button onClick={showDialog}>打开弹窗</Button>
      <Modal
        title="基本对话框"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        closeOnEsc={false}
        width={'80vw'}
        height={'80vh'}
        okText={'下一步'}
        className={'dashboard-container-modal'}
      >
        <SetIsReadyForNextStepContext.Provider value={(isReady) => setIsReadyForNextStep(isReady)}>
          <SetCurrentErrorContext.Provider value={(currentErr) => setCurrentError(currentErr)}>
            <ProgressComponent currentStep={(currentStepRef.current)} setCurrentError={setCurrentError} />
          </SetCurrentErrorContext.Provider>
        </SetIsReadyForNextStepContext.Provider>
      </Modal>
    </div>
  );
});
