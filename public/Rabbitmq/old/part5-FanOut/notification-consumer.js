// fanout-consumer-notification.js
const amqp = require("amqplib");

async function consumer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_fanout_ex";
    const queue = "notification_queue";

    await channel.assertExchange(exchange, "fanout", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, "");

    console.log("📨 Waiting for notifications...");

    channel.consume(queue, msg => {
        console.log("Notify:", msg.content.toString());
        channel.ack(msg);
    });
}

consumer();
