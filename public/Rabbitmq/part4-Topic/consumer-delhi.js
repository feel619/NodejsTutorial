// topic-consumer-delhi.js
const amqp = require("amqplib");

async function consumer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_topic_ex";
    const queue = "delhi_drivers_queue";
    const bindingPattern = "ride.delhi.*";

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, bindingPattern);

    console.log("📍 Waiting for Delhi rides...");

    channel.consume(queue, msg => {
        console.log("Received Request: ", msg.content.toString());
        channel.ack(msg);
    });
}

consumer();
