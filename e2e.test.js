import { v6 as uuidv6 } from 'uuid';
const Kafka = require('./KafkaProducer')
const SnowflakeConnectorUtil = require('./db/SnowflakeConnectorUtill')
const kafka = new Kafka()
const snowflakeConnectorUtil = new SnowflakeConnectorUtil()

describe('E2E test example', () => {
    let pool
    let packageId

    beforeAll(async () => {
        pool = await snowflakeConnectorUtil.createPool()
        packageId = uuidv6()
        await kafka.sendMessage(
        `{
            'packageId', ${packageId}, 
            'senderFirstName': 'John',
            'senderLastName: 'Doe',
            'recipientFirstName': 'Jane',
            'recipientLastName': 'Doe',
        }`)
    })

    it ('Verify staging table', async () => {
        const pacakgesStagingQuery = snowflakeConnectorUtil.getPackageStagingTableQuery(packageId)
        const packagesStaging = await pool.execute(pacakgesStagingQuery)
        expect(packagesStaging).toBeGreaterThan(0)
        expect(packagesStaging[0].senderFirstName).toBe('John')
        expect(packagesStaging[0].senderLastName).toBe('Doe')
        expect(packagesStaging[0].recipientFirstName).toBe('Jane')
        expect(packagesStaging[0].recipientLastName).toBe('Doe')
    })

    it ('Verify final table', async () => {
        const pacakgesFinalQuery = snowflakeConnectorUtil.getPackageFinalTableQuery(packageId)
        const packagesFinal = await pool.execute(pacakgesFinalQuery)
        expect(packagesFinal).toBeGreaterThan(0)
        expect(packagesFinal[0].senderFirstName).toBe('John')
        expect(packagesFinal[0].senderLastName).toBe('Doe')
        expect(packagesFinal[0].recipientFirstName).toBe('Jane')
        expect(packagesFinal[0].recipientLastName).toBe('Doe')
    })

    afterAll(async () => {
        await pool.destroy()
    })
})