import { mergeTestCases } from '../src/features/Dashboard/request';
import axios from 'axios';
import SDK from '@lark-project/js-sdk';
import {
  fields,
  multiLineStepData,
  multiLineStepDataOutput,
  inputWithUnsupportField,
} from '../cypress/fixtures/testData';

jest.mock('@lark-project/js-sdk');
jest.mock('axios');

describe('mergeTestCase', () => {
  let mockSetProgess: jest.Mock<any, any>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetProgess = jest.fn();
  });

  it('正确合并测试用例', async () => {
    localStorage.setItem('user_jwt', 'mocked_jwt_token');
    localStorage.setItem('user_key', 'mocked_user_key');
    const axiosPost = jest.spyOn(axios, 'post');

    axiosPost.mockResolvedValueOnce({ data: { errorCode: null } });

    const result = await mergeTestCases(multiLineStepData, fields, mockSetProgess);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(2);
    expect(result).toEqual(multiLineStepDataOutput);
  });

  //包含不支持的字段
  it('包含不支持的字段', async () => {
    localStorage.setItem('user_jwt', 'mocked_jwt_token');
    localStorage.setItem('user_key', 'mocked_user_key');
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
});
