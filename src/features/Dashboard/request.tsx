import './index.less';
import SDK from '@lark-project/js-sdk';
import axios from 'axios';
import { BASE_URL, HEADERS } from '../../constants';
import { useEffect } from 'react';


  const sdk = new SDK();


    setTimeout(async () => {
      try {
        await sdk.config({
          pluginId: 'MII_66977877C86E0004',
          isDebug: true,
        });
        console.log('SDK 配置成功');
      } catch (e) {
        console.error('SDK 配置失败:', e);
      }
    }, 0);


  //********************************************************************************************************************************** */
interface TestCase {
    [key: string]: any;
}

interface MergeTestCasesProps {
    testCases: TestCase[];
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

interface DataFields {
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
const request = async (testCaseDataList: TestCaseData[]): Promise<{ hasError: boolean, errFields: string[] }> => {
    try {
        console.log("testCaseDataList")
        console.log(testCaseDataList)

        const projectKey = 'jerrysspace'
        if (!projectKey) {
            console.log("项目密钥未找到")
            throw new Error('项目密钥未找到');
        }
        console.log("projectKey")
        console.log(projectKey)

        const errFields: string[] = [];
        for (const testCaseData of testCaseDataList) {
            console.log("testCaseData.field_value_pairs")
            console.log(testCaseData.field_value_pairs)
            const response = await axios.post(
                `${BASE_URL}/open_api/${projectKey}/work_item/create`,
                {
                    work_item_type_key: "63fc6356a3568b3fd3800e88",
                    template_id: 1523819,
                    field_value_pairs: testCaseData.field_value_pairs,
                },
                HEADERS
            );
            if (!response.data.success || response.data.errorCode) {
                errFields.push(`工作项创建失败: ${JSON.stringify(testCaseData.field_value_pairs)}`);
            }
        }
        return { hasError: errFields.length > 0, errFields };
    } catch (error) {
        console.error('请求失败:', error);
        return { hasError: true, errFields: ['请求失败'] };
    }
};


const createFieldMap = (data: Field[]): { [key: string]: string } => {
    return data.reduce((map, field) => {
        map[field.field_name] = field.field_key; // 将 field_key 作为键，field_name 作为值
        return map;
    }, {});
};

export function mergeTestCases(testCases: TestCase[], dataFields: DataFields): TestCaseData[] {
    const fieldMap = createFieldMap(dataFields.data);
    let result: TestCaseData[] = [];

    testCases.forEach(testCase => {
        const fieldValuePairs: FieldValuePair[] = Object.entries(testCase)
            .map(([key, value]) => {
                // 将 field_name 转换为 field_key
                const fieldKey = fieldMap[key] || key;
                return { field_key: fieldKey, field_value: value };
            });
        result.push({ field_value_pairs: fieldValuePairs });
    });
    //在这之后将代码合并
    request(result)
    return result;
}

interface Template {
    work_item_type_key: string;
    template_id: number;
    name: string;
    field_value_pairs: Array<{
        field_key: string;
        field_value: any; // 字段值可以是不同的类型，因此使用 any
    }>;
}