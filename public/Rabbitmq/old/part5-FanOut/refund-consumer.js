// fanout-consumer-refund.js
const amqp = require("amqplib");

async function consumer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_fanout_ex";
    const queue = "refund_queue";

    await channel.assertExchange(exchange, "fanout", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, "");

    console.log("💸 Refund Service waiting...");

    channel.consume(queue, msg => {
        console.log("Refund Process:", msg.content.toString());
        channel.ack(msg);
    });
}

consumer();
