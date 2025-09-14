const { Kafka } = require('kafkajs');

class KafkaProducer {

kafka;
producer;

    constructor() {
        this.kafka = new Kafka({ clientId: 'e2e-test', brokers: ['localhost:9092'] });
        this.producer = this.kafka.producer();
    }

    async sendMessage(message) {
        try {
            await this.producer.connect();
            await this.producer.send({ 
               topic: 'packages-test',
               messages: [ { value: message }, ],
        });
        await this.producer.disconnect()
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = KafkaProducer;