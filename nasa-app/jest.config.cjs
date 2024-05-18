module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/fileMock.js",
  },
  moduleFileExtensions: ["js", "jsx"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["/node_modules/"],
};
