import * as React from 'react';

const createContext = jest.fn(() => ({
  Provider: ({ children }: { children: React.ReactNode }) => children,
  Consumer: ({ children }: { children: () => React.ReactNode }) => children(),
}));

export default {
  ...React,
  createContext,
};
