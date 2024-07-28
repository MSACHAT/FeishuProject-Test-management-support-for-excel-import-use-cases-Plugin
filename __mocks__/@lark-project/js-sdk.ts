class MockSDK {
  config = jest.fn();
  Context = {
    load: jest.fn().mockResolvedValue({ mainSpace: { id: 'mockedProjectKey' } }),
  };
}

export default MockSDK;
