class MockSDK {
  config = jest.fn();
  Context = {
    load: jest
      .fn()
      .mockResolvedValue({
        mainSpace: { id: 'mockedProjectKey' },
        activeWorkItem: { workObjectId: 'workItemTypeKey' },
      }),
  };
}

export default MockSDK;
