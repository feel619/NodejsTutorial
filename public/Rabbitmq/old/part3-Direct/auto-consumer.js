
// direct-consumer-cab.js
const amqp = require("amqplib");

async function consumer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_exchange";
    const queue = "auto_queue";
    const bindingKey = "ride.cab";

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, bindingKey);

    console.log("🚖 Waiting for CAB rides...");

    channel.consume(queue, msg => {
        console.log("Received:", msg.content.toString());
        channel.ack(msg);
    });
}

consumer();




// ola-consumer.js
// const amqp = require("amqplib");

// async function startOlaService() {
//     const connection = await amqp.connect("amqp://localhost");
//     const channel = await connection.createChannel();

//     const exchange = "ride_exchange";
//     const queue = "ola_queue";
//     const routingKey = "ride.requested";

//     await channel.assertExchange(exchange, "direct", { durable: true });
//     await channel.assertQueue(queue, { durable: true });
//     await channel.bindQueue(queue, exchange, routingKey);
//     await channel.bindQueue(queue, exchange, "ride.cancelled");


//     console.log("🟢 Ola waiting for ride requests...");

//     channel.consume(queue, (msg) => {
//         const data = JSON.parse(msg.content.toString());
//         console.log("🚖 Ola received ride:", data);
//         channel.ack(msg);
//     });
// }

// startOlaService();