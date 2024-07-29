import { mergeTestCases } from '../src/features/Dashboard/request';
import axios from 'axios';
import SDK from '@lark-project/js-sdk';
import {
  fields,
  multiLineStepData,
  multiLineStepDataOutput,
  inputWithUnsupportField,
  singleLineData,
  singleLineDataOutput,
} from '../cypress/fixtures/testData';

jest.mock('@lark-project/js-sdk');
jest.mock('axios');

describe('正确合并测试用例', () => {
  let mockSetProgess: jest.Mock<any, any>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetProgess = jest.fn();
    localStorage.setItem('user_jwt', 'mocked_jwt_token');
    localStorage.setItem('user_key', 'mocked_user_key');
  });

  it('包含子不步骤', async () => {
    const axiosPost = jest.spyOn(axios, 'post');

    axiosPost.mockResolvedValueOnce({ data: { errorCode: null } });

    const result = await mergeTestCases(multiLineStepData, fields, mockSetProgess);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(2);
    expect(result).toEqual(multiLineStepDataOutput);
  });

  //包含不支持的字段
  it('包含不支持的字段', async () => {
    const axiosPost = jest.spyOn(axios, 'post');
    const errorResponse = {
      response: {
        data: {
          errorCode: 'ERROR_CODE',
        },
      },
    };

    axiosPost.mockRejectedValue(errorResponse);

    const result = await mergeTestCases(inputWithUnsupportField, fields, mockSetProgess);
  });

  it('包含单行不包含子步骤', async () => {
    const axiosPost = jest.spyOn(axios, 'post');

    axiosPost.mockResolvedValue({ data: { errorCode: null } });

    const result = await mergeTestCases(singleLineData, fields, mockSetProgess);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result).toEqual(singleLineDataOutput);
  });
});
