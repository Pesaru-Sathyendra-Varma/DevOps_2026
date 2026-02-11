module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.js"],
  transform: {
    "^.+\\.[jt]sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "ecmascript",
            jsx: true
          },
          transform: {
            react: {
              runtime: "automatic"
            }
          }
        }
      }
    ]
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy"
  },
  testMatch: ["<rootDir>/src/**/__tests__/**/*.[jt]sx"]
};
