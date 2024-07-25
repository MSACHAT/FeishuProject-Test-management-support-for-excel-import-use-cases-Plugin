import './index.less';
import SDK from '@lark-project/js-sdk';
import { ToastOnTop } from './index';


// SDK 配置函数，用于初始化 SDK 配置
  const sdk = new SDK();


    setTimeout(async () => {
      try {
        await sdk.config({
          pluginId: 'MII_66977877C86E0004',
          isDebug: true,
        });
      } catch (e) {
       throw e
      }
    }, 0);

interface TestCase {
    [key: string]: any;
}

interface FieldOption {
    label: string;
    value: string;
    is_disabled: number;
    is_visibility: number;
}

interface Field {
    is_required: number;
    field_alias: string;
    field_type_key: string;
    is_visibility: number;
    default_value: {
        default_appear: number;
    };
    is_validity: number;
    field_name: string;
    field_key: string;
    label: string;
    options?: FieldOption[]; // 某些字段可能有选项
}

export interface DataFields {
    err: {};
    err_code: number;
    err_msg: string;
    data: Field[];
}

interface FieldValuePair {
    field_key: string;
    field_value: string | string[];
}

interface TestCaseData {
    field_value_pairs: FieldValuePair[];
}

/*
 * 发送测试用例数据请求函数
 * 参数: testCaseDataList - 测试用例数据数组
 * 返回值: { hasError: boolean, errFields: string[] }
 */
const request = async (testCaseDataList: TestCaseData[],setProgess): Promise<{ hasError: boolean, errFields: string[] }> => {
    try {
        const context = await sdk.Context.load();
        const projectKey = context.mainSpace?.id;
        if (!projectKey) {
            throw new Error('项目密钥未找到');
        }
        const INCREMENT_PERCENT=(1/testCaseDataList.length)*100;

        const errFields: string[] = [];
        for (const testCaseData of testCaseDataList) {
          console.log(testCaseData);
            // const response = await axios.post(
            //     `${BASE_URL}/open_api/${projectKey}/work_item/create`,
            //     {
            //         work_item_type_key: "63fc6356a3568b3fd3800e88",
            //         template_id: 1523819,
            //         field_value_pairs: testCaseData.field_value_pairs,
            //     },
            //     HEADERS
            // );
            // if (!response.data.success || response.data.errorCode) {
            //     errFields.push(`工作项创建失败: ${JSON.stringify(testCaseData.field_value_pairs)}`);
            // }
            setProgess((prevState:number)=>prevState+INCREMENT_PERCENT)
        }
        return { hasError: errFields.length > 0, errFields };
    } catch (error) {
        return { hasError: true, errFields: ['请求失败'] };
    }
};

/*
 * 创建字段映射函数
 * 参数: data - 字段数组
 * 返回值: { [key: string]: string }
 */
const createFieldMap = (data: Field[]): { [key: string]: string } => {
    return data.reduce((map, field) => {
        map[field.field_name] = field.field_key; // 将 field_key 作为键，field_name 作为值
        return map;
    }, {});
};

/*
 * 合并测试用例函数
 * 参数: testCases - 测试用例数组
 *        fields - 字段数组
 * 返回值: TestCaseData[] - 合并后的测试用例数据数组
 */
export function mergeTestCases(testCases: TestCase[], fields: Field[], setProgess): TestCaseData[] {
    const fieldMap = createFieldMap(fields);
    let result: TestCaseData[] = [];

    testCases.forEach(testCase => {
        const fieldValuePairs: FieldValuePair[] = Object.entries(testCase)
            .filter(([key]) => fieldMap[key]) // 仅保留在 fieldMap 中有对应 field_key 的项
            .map(([key, value]) => {
                const fieldKey = fieldMap[key];
                return { field_key: fieldKey, field_value: value };
            });
        result.push({ field_value_pairs: fieldValuePairs });
    });
    console.log(result)

   request(result, setProgess).then(results => {ToastOnTop.success("导入完成!")})
    return result;
}


export default mergeTestCases;