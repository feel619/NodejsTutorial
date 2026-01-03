// headers-consumer-priority.js
const amqp = require("amqplib");

async function consumer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_headers_ex";
    const queue = "high_priority_queue";

    await channel.assertExchange(exchange, "headers", { durable: true });
    await channel.assertQueue(queue, { durable: true });

    // 4️⃣ Bind with headers (ANY one match)
    await channel.bindQueue(queue, exchange, "", {
        "x-match": "any",
        priority: "high"
    });

    console.log("🚨 Waiting for high priority rides...");

    channel.consume(queue, msg => {
        console.log("High Priority Received:", msg.content.toString());
        channel.ack(msg);
    });
}

consumer();
