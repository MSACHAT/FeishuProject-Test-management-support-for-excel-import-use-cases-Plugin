import './index.less';
import SDK from '@lark-project/js-sdk';
import axios from 'axios';
import { BASE_URL, HEADERS } from '../../constants';


// SDK 配置函数，用于初始化 SDK 配置
const sdk = new SDK();




sdk.config({
          pluginId: 'MII_66977877C86E0004',
          isDebug: true,
        });



interface TestCase {
  [key: string]: any;
}

interface compound_field{
    field_name: string;
    field_key: string;
}

export interface FieldOption {
    label: string;
    value: string;
    is_disabled: number;
    is_visibility: number;
}

export interface Field {
    is_required: number;
    field_alias: string;
    field_type_key: string;
    is_visibility: number;
    default_value: {
        default_appear: number;
    };
    compound_fields?: compound_field[];
    is_validity: number;
    field_name: string;
    field_key: string|any;
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
    field_name?: string;
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
const request = async (testCaseDataList, setProgress) => {
    try {
        
      const context = await sdk.Context.load();
      const projectKey = context.mainSpace?.id;
      if (!projectKey) {
        throw new Error('项目密钥未找到');
      }
      const INCREMENT_PERCENT = (1 / testCaseDataList.length) * 100;
  
      const errFields: string[] = [];
      for (const testCaseData of testCaseDataList) {
        const response = await axios.post(
          `${BASE_URL}/open_api/${projectKey}/work_item/create`,
          {
            work_item_type_key: "63fc6356a3568b3fd3800e88",
            template_id: 1523819,
            field_value_pairs: testCaseData.field_value_pairs,
          },
          HEADERS
        );
        if (response.data.errorCode) {
          errFields.push(`工作项创建失败: ${JSON.stringify(testCaseData.field_value_pairs)}`);
        } else {
          setProgress((prevState) => prevState + INCREMENT_PERCENT);
        }
      }
  
      if (errFields.length > 0) {
        // 显示错误弹窗
        alert('错误信息：\n' + errFields.join('\n'));
      }
      return { hasError: errFields.length > 0, errFields };
    } catch (error) {
      // 显示错误弹窗
      alert('请求失败: ' + error.message);
      return { hasError: true, errFields: ['请求失败'] };
    }
  };
/*
 * 创建字段映射函数
 * 参数: data - 字段数组
 * 返回值: { [key: string]: string }
 */
const createFieldMap = (data: Field[]): { [key: string]: string|any } => {
    return data.reduce((map, field) => {
        map[field.field_name] = field.field_key; // 将 field_key 作为键，field_name 作为值
        return map;
    }, {});
};

const createFieldCompMap = (data: Field[]): { [key: string]: any[] } => {
    return data.reduce((map, field) => {
        // 检查 compound_fields 是否存在且不是 undefined
        if (field.compound_fields && Array.isArray(field.compound_fields)) {
            map[field.field_key] = field.compound_fields; // 将 field_key 作为键，compound_fields 作为值
        }
        return map;
    }, {});
};

const createTypeMap = (data: Field[]): { [key: string]: string|any } => {
    return data.reduce((map, field) => {
        map[field.field_key] = field.field_type_key; // 将 field_key 作为键，field_name 作为值
        return map;
    }, {});
};


/*
 * 合并测试用例函数
 * 参数: testCases - 测试用例数组
 *        fields - 字段数组
 * 返回值: TestCaseData[] - 合并后的测试用例数据数组
 */
// 定义 actions 对象，包含不同的 action 函数
let compoundFieldsData:any = {}

let dataOutPut:any[][] = [];
const restrictedDict = {
    步骤: null,
    结果: null
  };

const actions = {
    "multi_select": (value) => {
      // 直接修改传入的 value 参数
      value.field_value = [{ // 假设 datadetail.field_value 是一个对象数组
        value: value.field_value
      }];
    },
    "select":(value) => {
        // 直接修改传入的 value 参数
        value.field_value = { // 假设 datadetail.field_value 是一个对象数组
          value: value.field_value
        };
      },
      "compound_fields":(value) =>{
        if(!restrictedDict['步骤']){
            restrictedDict["步骤"] = value.field_value;

        }else if(!restrictedDict["结果"]){
            restrictedDict["结果"] = value.field_value;
        }
        if(restrictedDict["步骤"]&&restrictedDict["结果"]){
            dataOutPut.push([
                    {
                        "field_value": [
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": restrictedDict["步骤"]
                                    }
                                ]
                            }
                        ],

                        "field_key": compoundFieldsData["case_detail_step"]
                    },
                    {
                        "field_key": compoundFieldsData["case_detail_result"],
                        "field_value": [
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": restrictedDict["结果"],
                                        "attrs": {
                                            "src": ""
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ])

                value.field_value = dataOutPut
                restrictedDict["步骤"] = null;
                restrictedDict["结果"] = null;

        }else{
            value.field_value = dataOutPut

        }







      }
  };

export function mergeTestCases(testCases: TestCase[], fields: Field[], setProgess): TestCaseData[] {

    const fieldMap = createFieldMap(fields);

    const typeMap = createTypeMap(fields);


    const compMap = createFieldCompMap(fields);

//  改为field_alias
    const aliasToKeyMap = Object.values(compMap).flat().reduce((map, field) => {
        map[field.field_alias] = field.field_key;
        return map;
    }, {});
    compoundFieldsData = aliasToKeyMap


    // 将 compMap 中的所有键和值添加到 fieldMap 数组中

    if (compMap) {
        const keys = Object.keys(compMap)[0];



        fieldMap[compMap[keys][0].field_name] = keys;
        fieldMap[compMap[keys][1].field_name] = keys;


        typeMap[keys]="compound_fields";


    }

    let result: TestCaseData[] = [];




    testCases.forEach(testCase => {
        const fieldValuePairs: FieldValuePair[] = Object.entries(testCase)
            .filter(([key]) => fieldMap[key]) // 仅保留在 fieldMap 中有对应 field_key 的项
            .map(([key, value]) => {
                const fieldKey = fieldMap[key];

                return { field_key: fieldKey, field_value: value };
                // 这里优化代码
            });
        result.push({ field_value_pairs: fieldValuePairs });
    });

    // 假设 result 是一个对象数组，每个对象都有 field_key 和其他属性

    let lastValidItem: TestCase | null = null;

for (let i = 0; i < result.length; i++) {
    const item = result[i];

    // 检查当前项的第一个 field_value_pairs 是否有 field_key: 'name'
    if (item.field_value_pairs[0]?.field_key === 'name') {
        // 如果有，保存当前项作为上一个有效的项
        lastValidItem = item;
    } else {
        // 如果没有，与上一个有效的项合并
        if (lastValidItem) {
            // 将当前项的 field_value_pairs 添加到上一个有效的项中
            lastValidItem.field_value_pairs = [
                ...lastValidItem.field_value_pairs,
                ...item.field_value_pairs
            ];
        }
    }
}


// 清理数组，只保留具有 field_key: 'name' 的项
result = result.filter(item => item.field_value_pairs[0]?.field_key === 'name');

    result.forEach(element => {
        const savedFieldKeys:string[]=[]

        element.field_value_pairs.forEach(datadetail => {

            if (actions[typeMap[datadetail.field_key]]) {
                actions[typeMap[datadetail.field_key]](datadetail);
            }
        });
        element.field_value_pairs=element.field_value_pairs.filter((field)=>{
            if(!savedFieldKeys.includes(field.field_key)){
                savedFieldKeys.push(field.field_key)
                return true
            }
            return false
        })


        dataOutPut = []
    });





    request(result, setProgess)
    return result;
}
