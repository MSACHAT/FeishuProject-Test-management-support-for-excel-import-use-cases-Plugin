export const PLUGIN_ID = 'MII_66977877C86E0004';

export const PLUGIN_SECRET = 'EB3C51EAC95568C09190404ACCDBF274';

export const HEADERS = {
  headers: {
    'X-PLUGIN-TOKEN': localStorage.getItem("user_jwt"),
    'X-USER-KEY': '7391674093034127364',
    'Content-Type': 'application/json',
  },
};
export const BASE_URL = 'https://project.feishu.cn';