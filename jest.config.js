module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['jest-localstorage-mock', '@testing-library/jest-dom/extend-expect'],
};
