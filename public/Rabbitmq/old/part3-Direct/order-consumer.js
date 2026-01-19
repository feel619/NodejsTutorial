// consumer-order.js
const amqp = require("amqplib");

async function startConsumer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "orders_ex";
    const queue = "order_queue1";
    const routingKey = "order_created";

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: true });

    await channel.bindQueue(queue, exchange, routingKey);

    console.log("📦 Waiting for order.created messages...");

    channel.consume(queue, (msg) => {
        const data = JSON.parse(msg.content.toString());
        console.log("🧾 Order received:", data);
        channel.ack(msg);
    });
}

startConsumer();
