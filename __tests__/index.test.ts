import { optionMapping, checkErr } from '../src/features/Dashboard/checkErr';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import axios from 'axios';
import * as path from 'path';
import SDK from '@lark-project/js-sdk';
import { fields } from '../cypress/fixtures/testData';

import {
  multiLineStepData,
  processedMultiLineStepData,
  metaFields,
} from '../cypress/fixtures/testDataIndex';

jest.mock('@lark-project/js-sdk');
jest.mock('axios');

const readFileAsBlob = (filePath: string): Blob => {
  const buffer = fs.readFileSync(filePath);
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
};

describe('optionMapping', () => {
  it('should map options correctly', () => {
    const result = optionMapping(multiLineStepData, fields);

    expect(result).toEqual(processedMultiLineStepData);
  });

  it;
});
describe('checkErr function', () => {
  const mockSetHeaders = jest.fn();
  const mockSetResolvedExcelData = jest.fn();
  const mockSetExcelDataForDisplay = jest.fn();
  const mockSetFields = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('缺少表头', async () => {
    const file = readFileAsBlob(path.resolve(__dirname, './files/example(withNoHeaders).xlsx'));

    const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        data: fields,
      },
    });

    const getSpy = jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: metaFields,
      },
    });

    const result = await checkErr(
      mockSetHeaders,
      mockSetResolvedExcelData,
      mockSetExcelDataForDisplay,
      mockSetFields,
      file,
    );

    expect(result.hasError).toBe(true);
    expect(result.errors).toEqual([
      '表头不存在:123,功能用例,P1,啊吧吧吧,ty,sdjkabwd,das',
      '缺少必填字段:用例名称',
      '缺少必填字段:前置条件',
    ]);
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledTimes(1);

    postSpy.mockRestore();
    getSpy.mockRestore();
  });

  it('缺少必填字段', async () => {
    const file = readFileAsBlob(
      path.resolve(__dirname, './files/example(withLackRequiredFields).xlsx'),
    );

    const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        data: fields,
      },
    });

    const getSpy = jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: metaFields,
      },
    });

    const result = await checkErr(
      mockSetHeaders,
      mockSetResolvedExcelData,
      mockSetExcelDataForDisplay,
      mockSetFields,
      file,
    );

    expect(result.hasError).toBe(true);

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledTimes(1);

    postSpy.mockRestore();
    getSpy.mockRestore();
  });

  it('选项不存在', async () => {
    const file = readFileAsBlob(path.resolve(__dirname, './files/example(withNoOptions).xlsx'));

    const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        data: fields,
      },
    });

    const getSpy = jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: metaFields,
      },
    });

    const result = await checkErr(
      mockSetHeaders,
      mockSetResolvedExcelData,
      mockSetExcelDataForDisplay,
      mockSetFields,
      file,
    );

    expect(result.hasError).toBe(true);
    expect(result.errors).toEqual(['选项不存在:优先级-P^', '缺少必填字段:用例名称']);
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledTimes(1);

    postSpy.mockRestore();
    getSpy.mockRestore();
  });

  it('文件为空', async () => {
    const file = readFileAsBlob(path.resolve(__dirname, './files/empty-file.xlsx'));

    try {
      await checkErr(
        mockSetHeaders,
        mockSetResolvedExcelData,
        mockSetExcelDataForDisplay,
        mockSetFields,
        file,
      );
    } catch (error) {
      expect(error).toEqual('请求失败');
    }
  });
  it('文件中所有字段都有效', async () => {
    const file = readFileAsBlob(
      path.resolve(__dirname, './files/example(withAllSupportFields).xlsx'),
    );

    const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        data: fields,
      },
    });

    const getSpy = jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: metaFields,
      },
    });

    const result = await checkErr(
      mockSetHeaders,
      mockSetResolvedExcelData,
      mockSetExcelDataForDisplay,
      mockSetFields,
      file,
    );

    expect(result.hasError).toBe(false);

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledTimes(1);

    postSpy.mockRestore();
    getSpy.mockRestore();
  });
});
