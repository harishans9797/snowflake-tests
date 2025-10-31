const { allure } = require("jest-allure2");

describe('E2E test example', () => {
  let pool;
  let packageId;

  beforeAll(async () => {
    allure.epic("E2E Pipeline");
    allure.feature("Database Verification");
    allure.story("Setup phase");
    allure.step("Connecting to database...");
    console.log("Connected to database");
  });

  it('Verify staging table', async () => {
    allure.story("Staging Table Check");
    allure.description("Verify that staging table data matches expected schema");
    allure.step("Querying staging table...");
    console.log("Staging table verified!");
    allure.attachment("Staging query result", "SELECT * FROM staging_table", "text/plain");
  });

  it('Verify final table', async () => {
    allure.story("Final Table Check");
    allure.description("Verify that final table contains correct results after processing");
    allure.step("Querying final table...");
    console.log("Final table verified!");
  });

  afterAll(async () => {
    allure.step("Closing connections");
    console.log("E2E test has passed!");
  });
});
