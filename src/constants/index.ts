import SDK from '@lark-project/js-sdk';
const sdk = new SDK();
sdk.config({
  pluginId: 'MII_66977877C86E0004', // 此处填写插件凭证，可从开发者后台插件详情获取
  isDebug: true, // 开启调试模式，会在控制台 log 调用参数和返回值
});
export const PLUGIN_ID = 'MII_66977877C86E0004';

export const PLUGIN_SECRET = 'EB3C51EAC95568C09190404ACCDBF274';

export const HEADERS = {
  headers: {
    'X-PLUGIN-TOKEN': localStorage.getItem('user_jwt'),
    //'X-USER-KEY': '7391674093034127364',
    'X-USER-KEY': localStorage.getItem('user_key'),
    //'X-PLUGIN-TOKEN': 'p-31d63537-f527-4e96-9bee-acb58a91ddb2',
    'Content-Type': 'application/json',
  },
};

export const BASE_URL = 'https://project.feishu.cn';
