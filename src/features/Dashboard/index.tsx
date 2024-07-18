import { hot } from 'react-hot-loader/root';
import React, { useEffect, useRef, useState } from 'react';
import { Upload, Button, Modal, Steps } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';
import './index.less';
import * as XLSX from 'xlsx';

const STEP_1_UPLOAD = 0;
const STEP_2_PREVIEW = 1;
const STEP_3_FINISH = 2;

type parsedExcelData={}

const ProgressComponent = ({ currentStep }: { currentStep: number }) => {
  /*
  此处封装了弹窗中每一步对应的页面

  参数:
    1. currentStep:表示当前是第几步

  返回值:ProgressComponent组件，也就是每一阶段对应的页面

  需要注意:currentStep的索引是从0开始的
   */
  const [parsedExcelData, setParsedExcelData] = useState();
  const StepContent = () => {
    /*
    此处封装了每一步独特的页面的组件

    参数:无

    返回值:progress组件
     */
    switch (currentStep) {
      case STEP_1_UPLOAD:
        return <UploadComponent callBack={() => {
        }} />;
      case STEP_2_PREVIEW:
        return <div>2</div>;
      case STEP_3_FINISH:
        return <div>wancheng</div>;
    }
    return <UploadComponent callBack={() => {
    }} />;
  };
  return (
    <>
      <Steps type="basic" current={currentStep} onChange={(i) => console.log(i)}>
        <Steps.Step title="Finished" description="This is a description" />
        <Steps.Step title="In Progress" description="This is a description" />
        <Steps.Step title="Waiting" description="This is a description" />
      </Steps>
      <StepContent />
    </>
  )
    ;
};

const UploadComponent = ({ callBack }) => {
  /*
  此处封装了一个上传按钮

  参数:
    1. callBack:回调函数，用于在用户上传完文件后把解析完的结果传回父组件

  返回值:UploadComponent组件
  */
  const handleBeforeUpload = (file) => {
    /*
    此函数会在用户上传完文件后执行，作用是对文件进行解析

    参数:
      1. file: semi的Upload组件会把用户上传的文件传入此参数

    返回值:false,由于没有后端所以直接返回false防止Upload组件自动上传
     */
    const blob = file.file.fileInstance;
    const reader = new FileReader();
    reader.onload = (e) => {//当文件读取完成时onload就会被触发
      if (e.target && e.target.result) {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        callBack(jsonData);
      } else {
        throw Error('error during data resolving!');
      }
    };
    reader.readAsArrayBuffer(blob);
    return false;
  };

  const UploadButton = (
    <Button icon={<IconUpload />} theme="light">
      点击上传
    </Button>
  );

  return (
    <>
      <div
        style={{
          marginBottom: 12,
          marginTop: 12,
          borderBottom: '1px solid var(--semi-color-border)',
        }}
      ></div>
      <Upload
        beforeUpload={handleBeforeUpload}
      >
        {UploadButton}
      </Upload>
    </>
  );
};

export default hot(() => {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef(0);
  useEffect(() => {
    setCurrentStep(currentStepRef.current);
  }, [currentStep]);
  const showDialog = () => {//显示弹窗
    setCurrentStep(0);
    currentStepRef.current = 0;
    setVisible(true);
  };
  const handleOk = () => {
    setCurrentStep(currentStep + 1);
    currentStepRef.current += 1;
    console.log('Ok button clicked');
  };
  const handleCancel = () => {//关闭弹窗
    setVisible(false);
    console.log('Cancel button clicked');
  };
  return (
    <div className="dashboard-container">
      <Button onClick={showDialog}>打开弹窗</Button>
      <Modal
        title="基本对话框"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        closeOnEsc={true}
        width={'80vw'}
        height={'80vh'}
        okText={'下一步'}
      >
        <ProgressComponent currentStep={(currentStepRef.current)} />
      </Modal>
    </div>
  );
});
