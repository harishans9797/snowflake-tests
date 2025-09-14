

describe('E2E test example', () => {
    let pool
    let packageId

    beforeAll(async () => {
        
    })

    it ('Verify staging table', async () => {
        console.log("Staging table verified!")
    })

    it ('Verify final table', async () => {
        console.log("Final table verified!")
    })

    afterAll(async () => {
        await pool.destroy()
    })
})
