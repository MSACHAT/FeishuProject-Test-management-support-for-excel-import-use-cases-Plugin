import { Field, mergeTestCases } from './request';

import * as XLSX from 'xlsx';
import { BASE_URL, HEADERS } from '../../constants';
import SDK from '@lark-project/js-sdk';
import axios from 'axios';

const sdk = new SDK();

sdk.config({
  pluginId: 'MII_66977877C86E0004', // 此处填写插件凭证，可从开发者后台插件详情获取
  isDebug: true, // 开启调试模式，会在控制台 log 调用参数和返回值
});

export interface FieldOption {
  label: string;
  value: string;
  is_disabled?: number;
  is_visibility?: number;
}

interface MetaField {
  field_type_key: string;
  is_validity: number;
  label: string;
  is_visibility: number;
  field_alias: string;
  field_key: string;
  default_value: {
    default_appear: number;
  };
  field_name: string;
  is_required: number;
  options?: FieldOption[];
}

export const optionMapping = (excelData: Object[], fields: Field[]) => {
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
};

export const checkErr = async (
  setHeaders: { (value: React.SetStateAction<string[]>): void; (arg0: string[]): void },
  setResolvedExcelData: {
    (value: React.SetStateAction<Object[]>): void;
    (arg0: Object[]): void;
  },
  setExcelDataForDisplay: { (value: React.SetStateAction<Object[]>): void; (arg0: Object[]): void },
  setFields: {
    (value: any): void;
    (arg0: any): void;
  },
  file: Blob,
): Promise<{ hasError: boolean; errors: string[] }> => {
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
    headers.forEach(field => {
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
    excelData.forEach(row => {
      const keys = Object.keys(row);
      const optionKeys = Object.keys(options);
      keys.forEach((key: string) => {
        if (optionKeys.includes(key) && !options[key].includes(row[key])) {
          if (!errFields.includes(row[key])) errFields.push(`${key}-${row[key]}`);
        }
      });
    });
    if (errFields.length > 0) {
      errors.push(`选项不存在:${errFields.join(',')}`);
    }
  };

  /*
     此函数用于检查必填的字段(用例名称和前置条件)是否存在
  
     参数:
       1.headers:excel文档中解析出来的表头
       2.metaFields:飞书文档中的元字段
       3.errors:外部传入的对象，有错误就push到这个对象中
  
     返回值:无
  
     */
  const checkRequired = (headers: string[], metaFields: MetaField[], errors: string[]): void => {
    const IS_REQUIRED = 1;
    const requiredNames = metaFields
      .filter((field: Field) => field.is_required === IS_REQUIRED)
      .map((field: Field) => field.field_name);
    for (const name of requiredNames) {
      if (!headers.includes(name)) {
        errors.push(`缺少必填字段:${name}`);
      }
    }
  };

  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async e => {
      if (e.target && e.target.result) {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: Object[] = XLSX.utils.sheet_to_json(worksheet);
        console.log(jsonData);
        let headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
        //筛出所有的undef
        headers = headers.filter(header => header);
        setHeaders(headers);
        const context = await sdk.Context.load();
        const projectKey = context.mainSpace?.id;
        const workItemTypeKey = context.activeWorkItem?.workObjectId;
        try {
          const fields = await axios.post(
            `${BASE_URL}/open_api/${projectKey}/field/all`,
            { work_item_type_key: workItemTypeKey },
            HEADERS,
          );
          const metaFields = await axios.get(
            `${BASE_URL}/open_api/${projectKey}/work_item/${workItemTypeKey}/meta`,
            HEADERS,
          );
          setFields(fields.data.data);
          const jsonDataCopy = JSON.parse(JSON.stringify(jsonData));
          setResolvedExcelData(optionMapping(jsonDataCopy, fields.data.data));
          setExcelDataForDisplay(jsonData);
          const fieldNames = fields.data.data.reduce(function (
            accumulator: string[] = [],
            current,
          ) {
            if (current.field_type_key === 'compound_field') {
              for (const field of current.compound_fields) {
                accumulator.push(field.field_name);
              }
            }
            accumulator.push(current.field_name);
            return accumulator;
          },
          []);
          const metaFieldNames = metaFields.data.data.map(
            (metaField: { field_name: string }) => metaField.field_name,
          );
          //用来储存错误
          let errors: string[] = [];

          checkHeaders(headers, [...fieldNames, ...metaFieldNames], errors);
          checkOptions(jsonData, fields.data.data, errors);
          checkRequired(headers, metaFields.data.data, errors);

          if (errors.length === 0) {
            resolve({ hasError: false, errors: [] });
          } else {
            resolve({ hasError: true, errors });
          }
        } catch {
          reject('请求失败');
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
