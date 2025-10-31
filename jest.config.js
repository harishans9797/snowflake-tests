module.exports = {
  reporters: [
    'default',
    [require.resolve('jest-allure2-reporter'), { resultsDir: 'allure-results' }],
  ],
  testEnvironment: require.resolve('jest-allure2-reporter/environment-node'),
  testTimeout: 30000,
};
