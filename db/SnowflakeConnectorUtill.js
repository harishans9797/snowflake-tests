const Snowflake = require('snowflake-promise').Snowflake

const connectionProperties = {
    account: 'TEST_ACCOUNT',
    username: 'TEST_USERNAME',
    role: 'TEST_ROLE',
    database: 'TEST_DB',
    schema: 'TEST_SCHEMA',
    warehouse: 'TEST_WAREHOUSE',
    authenticator: 'SNOWFLAKE_JWT',
    privateKeyPath: process.env.SF_TEST_PRIVATE_KEY,
    privateKeyPass: process.env.SF_TEST_PRIVATE_KEY_PASS,
}

const taskHistoryTable = `${connectionProperties.database}.INFORMATION_SCHEMA.TASK_HISTORY`
const packageStagingTable = `${connectionProperties.database}.PACKAGE_STAGING`
const packageFinalTable =  `${connectionProperties.database}.PACKAGE_FINAL`

class SnowflakeConnectorUtil {
    async snowflakePool() {
        return new Snowflake(connectionProperties)
    }

    async createPool() {
        let pool = await this.snowflakePool()
        await pool.connect()

        return pool
    }

    async getSnowflakeFailedTasksInLast24Hours() {
        return `SELECT *
       FROM (
          SELECT 
            distinct name, 
            first_value(completed_time) ignore nulls over (partition by name order by completed_time desc) as last_completed_time, 
            first_value(state) ignore nulls over (partition by name order by completed_time desc) as last_state
          FROM ${taskHistoryTable} 
        )
        WHERE last_state IN ('FAILED', 'CANCELLED', 'FAILED_AND_AUTO_SUSPENDED') AND last_completed_time >= DATEADD(DAY, -1, GETDATE());`
    }

    checkNullValuesQueries = [
        {
           description: 'Package Sender or Recipient ID',
           query: `select * from dbo.schema.packages_final
               where sender_id is null or getter_id is null`,
           expected: 0,
        },
        {
           description: 'User ID',
           query: `select * from dbo.schema.user_request where user_id is null`,
           expected: 0,
        }
    ]

    getPackageStagingTableQuery(packageId) {
        return `select * from ${packageStagingTable} where package_id = '${packageId}'`
    }

    getPackageFinalTableQuery(packageId) {
        return `select * from ${packageFinalTable} where package_id = '${packageId}'`
    }
}

module.exports = SnowflakeConnectorUtil
