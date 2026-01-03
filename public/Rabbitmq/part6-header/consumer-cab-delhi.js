// headers-consumer-cab-delhi.js
const amqp = require("amqplib");

async function consumer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_headers_ex";
    const queue = "cab_delhi_queue";

    await channel.assertExchange(exchange, "headers", { durable: true });
    await channel.assertQueue(queue, { durable: true });

    // 3️⃣ Bind with headers (ALL must match)
    await channel.bindQueue(queue, exchange, "", {
        "x-match": "all",
        city: "delhi",
        rideType: "cab"
    });

    console.log("🚖 Waiting for Delhi Cab rides...");

    channel.consume(queue, msg => {
        console.log("Cab Delhi Received:", msg.content.toString());
        channel.ack(msg);
    });
}

consumer();
