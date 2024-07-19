import { hot } from 'react-hot-loader/root';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Upload, Button, Modal, Steps, ToastFactory, Card, Avatar } from '@douyinfe/semi-ui';
import './index.less';
import { IconFile, IconHelpCircle } from '@douyinfe/semi-icons';
import * as XLSX from 'xlsx';
import Meta from '@douyinfe/semi-ui/lib/es/card/meta';
import { BeforeUploadProps } from '@douyinfe/semi-ui/lib/es/upload';

const STEP_1_UPLOAD = 0;
const STEP_2_PREVIEW = 1;
const STEP_3_FINISH = 2;

const SetIsReadyForNextStepContext = React.createContext((isReady: boolean) => {
});
const SetCurrentErrorContext = React.createContext((currentErr: string) => {
});
const SetFileNameContext = React.createContext((filename: string) => {
});
const SetFileContext = React.createContext((file:File)=>{})

//创建一个在页面顶部且置顶的弹窗
const ToastOnTop = ToastFactory.create({
  zIndex: 99999,
});

/*
   此处封装了每一步独特的页面的组件

   参数:无

   返回值:progress组件
    */
const StepContent = ({ currentStep, parsedExcelData, setParsedExcelData }) => {
  const [fileName, setFileName] = useState<string>('');
  const [file, setFile] = useState<File>();

  /*
  此处封装了用于检查表格是否存在错误的函数

  参数:
    1. worksheet:类型未XLSX.Worksheet的参数，也就是一个表格

  返回值:
    1. 没有错误: {hasError:false, errMessage:""}
    2. 有错误: {hasError:true, errMessage:<错误信息>
   */
  const checkErr=(worksheet:XLSX.WorkSheet)=>{

  }

  switch (currentStep) {
    case STEP_1_UPLOAD:
      return <>
        <SetFileNameContext.Provider value={(filename: string) => setFileName(filename)}>
          <SetFileContext.Provider value={(file) => setFile(file)}>
            <UploadComponent callBack={setParsedExcelData} />
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
      </>;
    case STEP_2_PREVIEW:
      const reader = new FileReader();
      reader.onload = (e) => {//当文件读取完成时onload就会被触发
        if (e.target && e.target.result) {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          setParsedExcelData(jsonData)
        } else {
          throw Error('数据解析时遇到错误!');
        }
      };
      if(file) {
        reader.readAsArrayBuffer(file);
      }

      return <div>
        {parsedExcelData.map((data) => {
          let newData: string[] = [];
          for (let dat of Object.keys(data)) {
            newData.push(`${dat}:${data[dat]} \n`);
          }
          return newData;
        })}
      </div>;
    case STEP_3_FINISH:
      return <div>wancheng</div>;
  }
  return <UploadComponent callBack={setParsedExcelData} />;
};

/*
  此处封装了弹窗中每一步对应的页面

  参数:
    1. currentStep:表示当前是第几步

  返回值:ProgressComponent组件，也就是每一阶段对应的页面

  需要注意:currentStep的索引是从0开始的
   */
const ProgressComponent = ({ currentStep }: { currentStep: number }) => {
  const [parsedExcelData, setParsedExcelData] = useState<any>([]);
  return (
    <>
      <Steps type="basic" current={currentStep} onChange={(i) => console.log(i)}>
        <Steps.Step title="第一步:导入" description="导入xlsx. csv. 格式的文件" />
        <Steps.Step title="第二步:预览" description="预览导入的结果" />
        <Steps.Step title="第三步:完成" description="大功告成" />
      </Steps>
      <StepContent currentStep={currentStep} parsedExcelData={parsedExcelData}
                   setParsedExcelData={setParsedExcelData} />
    </>
  )
    ;
};

/*
  此处封装了一个上传按钮

  参数:
    1. callBack:回调函数，用于在用户上传完文件后把解析完的结果传回父组件

  返回值:UploadComponent组件
  */
const UploadComponent = ({ callBack }) => {
  const setIsReadyForNextStep = useContext(SetIsReadyForNextStepContext);
  const setFileName = useContext(SetFileNameContext);
  const setFile = useContext(SetFileContext)

  /*
   此函数会在用户上传完文件后执行，作用是对文件进行解析

   参数:
     1. file: semi的Upload组件会把用户上传的文件传入此参数

   返回值:false,由于没有后端所以直接返回false防止Upload组件自动上传
    */
  const handleBeforeUpload = (file:BeforeUploadProps):boolean => {
    const blob = file.file.fileInstance;
    if(blob) {
      setFile(blob)
      setFileName(blob.name);
      setIsReadyForNextStep(true);
    }
    else{
      ToastOnTop.error("文件已损坏");
    }

    return false;
  };

  return (
    <>
      <Upload
        draggable={true}
        dragMainText={'点击上传文件或拖拽文件到这里'}
        dragSubText="仅支持.xlsx, .csv格式的文件"
        accept={'.xlsx, .csv'}
        fileList={[]}//防止Update组件渲染filelist
        beforeUpload={handleBeforeUpload}
      >
      </Upload>
    </>
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
  }, [currentStep]);

  //显示弹窗
  const showDialog = () => {
    setCurrentStep(0);
    currentStepRef.current = 0;
    setVisible(true);
  };

  const handleOk = () => {
    if (!isReadyForNextStep) {

      ToastOnTop.error(currentError);
      return;
    }
    setCurrentStep(currentStep + 1);
    setIsReadyForNextStep(false);
    currentStepRef.current += 1;
    console.log('Ok button clicked');
  };

  //关闭弹窗
  const handleCancel = () => {
    setVisible(false);
    console.log('Cancel button clicked');
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
      >
        <SetIsReadyForNextStepContext.Provider value={(isReady) => setIsReadyForNextStep(isReady)}>
          <SetCurrentErrorContext.Provider value={(currentErr) => setCurrentError(currentErr)}>
            <ProgressComponent currentStep={(currentStepRef.current)} />
          </SetCurrentErrorContext.Provider>
        </SetIsReadyForNextStepContext.Provider>
      </Modal>
    </div>
  );
});
