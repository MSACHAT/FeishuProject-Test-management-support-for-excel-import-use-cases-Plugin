import axios from 'axios';
import { PLUGIN_ID, PLUGIN_SECRET } from './constants';

localStorage.setItem('IsUserTokenAvailable', 'false');

// Get the login status of the plug-in
// If return false, will call the function `authorize` with a code
export async function isLogin() {
  if (await validateJWT()) {
    return true;
  }
  return false;
}

// Identity authentication
export async function authorize(code: string) {
  try {
    const pluginToken = await fetchPluginToken(PLUGIN_ID, PLUGIN_SECRET);

    localStorage.setItem('user_jwt', pluginToken);

    return true;
  } catch (error) {
    return false;
  }
}

export const visibilityControl = async (type, key) => {

  return new Promise((resolve, reject) => {
    if (type === 'DASHBOARD') {
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

async function validateJWT(JWT?: string | undefined) {
  const isUserTokenAvailable = localStorage.getItem('IsUserTokenAvailable');
  if (isUserTokenAvailable === 'true') {
    return true;
  } else {
    return false;
  }
}

async function fetchPluginToken(
  pluginId: string,
  pluginSecret: string,
  type: number = 1,
): Promise<string> {
  /*
  获取plugin token

  Args:
    pluginId(String): 插件id
    pluginSecret(String): 插件密码

  Returns:
    String: plugin Token
  */

  const url = 'https://project.feishu.cn/open_api/authen/plugin_token';
  const headers = {
    'Content-Type': 'application/json',
  };
  const data = {
    plugin_id: pluginId,
    plugin_secret: pluginSecret,
    type: type,
  };

  try {
    const response = await axios.post(url, data, { headers });

    return response.data.data.token;
  } catch (error) {
    console.error(
      'Error fetching plugin token:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

async function fetchUserPluginToken(
  pluginAccessToken: string,
  code: string,
  grantType = 'authorization_code',
) {
  /**
   * 获取User Plugin Token
   *
   * Args:
   *  pulginAccessToken(String): 由调用接口生成的插件访问token
   *  code(String): 由系统传给authorize(code)的code
   *
   * Returns:
   *  String: User Plugin Token
   */
  const url = 'https://project.feishu.cn/open_api/authen/user_plugin_token';
  const headers = {
    'Content-Type': 'application/json',
    'X-Plugin-Token': pluginAccessToken,
  };
  const data = {
    code: code,
    grant_type: grantType,
  };

  try {
    const response = await axios.post(url, data, { headers });

    return response.data.data.token;
  } catch (error) {
    console.error(
      'Error fetching user plugin token:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}
