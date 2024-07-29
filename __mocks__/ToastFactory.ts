// __mocks__/ToastFactory.js
export const ToastFactory = {
  create: jest.fn().mockReturnValue({
    show: jest.fn(),
    hide: jest.fn(),
  }),
};
