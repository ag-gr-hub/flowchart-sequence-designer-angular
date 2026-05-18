/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          transform: {
            decoratorMetadata: true,
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@angular/core$': '<rootDir>/src/__mocks__/@angular/core.ts',
    '^@angular/common$': '<rootDir>/src/__mocks__/@angular/common.ts',
    '^flowchart-sequence-designer$': '<rootDir>/src/__mocks__/fsd.ts',
    '^flowchart-sequence-designer/ui$': '<rootDir>/src/__mocks__/fsd-ui.ts',
  },
};
