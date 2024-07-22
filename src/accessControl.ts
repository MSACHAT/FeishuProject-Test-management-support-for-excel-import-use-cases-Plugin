import {HEADERS,BASE_URL} from './config';
import SDK from '@lark-project/js-sdk';
import axios from 'axios';
// Get the login status of the plug-in
// If return false, will call the function `authorize` with a code
const sdk = new SDK();
sdk.config({
  pluginId: 'MII_66977877C86E0004', // 此处填写插件凭证，可从开发者后台插件详情获取
  isDebug: true, // 开启调试模式，会在控制台 log 调用参数和返回值
});
export function isLogin() {
  return true;
}

// Identity authentication
export function authorize(code) {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
}

export const visibilityControl = async (type, key) => {
  const context=await sdk.Context.load();
  const projectKey=context.mainSpace?.id
  const works=await axios.get(`${BASE_URL}/open_api/${projectKey}/work_item/all-types`,HEADERS)
  //测试用例工作项的typeKey
  const workTypeKeyOfTest=works.data.data.filter((work: { api_name: string; })=>work.api_name==="test")[0].type_key
  //用户当前所在工作项目的typeKey
  const currentWorkTypeKey=context.activeWorkItem?.workObjectId
  console.log(workTypeKeyOfTest)
  console.log(currentWorkTypeKey)
  return new Promise((resolve, reject) => {
    if (type === 'DASHBOARD' && workTypeKeyOfTest===currentWorkTypeKey) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

export function getIntergrationPointConfig(type, key = '') {
  const configs = {
    BUTTON: {
      button_demo: { need_self_renderer: true, work_item_type: ['_all'] },
      button_id: { need_self_renderer: true, work_item_type: ['_all'] },
    },
  };
  return configs[type] ? configs[type][key] : {};
}
