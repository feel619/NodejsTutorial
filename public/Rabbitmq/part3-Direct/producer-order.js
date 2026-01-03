/*

                    Producer
                        │
            routingKey = "order.created"
                        │
                        ▼
                ┌──────────────────┐
                │  Direct Exchange │
                │   orders_ex      │
                └────────┬─────────┘
                         │
         ┌───────────────┼────────────────┐
         ▼                                ▼
┌─────────────────┐              ┌──────────────────┐
│ order_queue     │              │ payment_queue    │
│ rk:order.created│              │ rk:payment.created│
└─────────────────┘              └──────────────────┘
        │                                   │
     Consumer A                         Consumer B

Timeline Example (Why message lost)
❌ Wrong Order
1️⃣ Producer sends message
2️⃣ Exchange exists
3️⃣ Queue NOT created yet
4️⃣ Message DROPPED ❌
5️⃣ Consumer starts later

✅ Correct Order
1️⃣ Consumer starts
2️⃣ Queue created
3️⃣ Queue bound to exchange
4️⃣ Producer sends message
5️⃣ Message stored in queue
6️⃣ Consumer receives message ✅



*/
const amqp = require("amqplib");

async function sendMessage() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "orders_ex";
    const queue = "order_queue";
    const routingKey = "order.created";

    const message = {
        orderId: 501,
        item: "Phone",
        price: 45000
    };

    // Producer only ensures exchange exists
    await channel.assertExchange(exchange, "direct", { durable: true });
    // ❓ Producer me queue create karna – galat ya sahi?
    // ✅ Technically allowed
    // RabbitMQ mana nahi karta.
    // ❌ Architecturally bad practice
    // Especially microservices / scalable systems me.
    // await channel.assertQueue(queue, { durable: false });
    // await channel.bindQueue(queue, exchange, routingKey);

    channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
    );

    console.log("✅ Order event published");

    setTimeout(async () => {
        await channel.close();
        await connection.close();
    }, 500);
}

sendMessage();


// direct-producer.js
const amqp = require("amqplib");

async function producer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_direct_ex";
    const routingKey = "ride.cab"; // ride.auto | ride.bike

    await channel.assertExchange(exchange, "direct", { durable: true });

    const msg = {
        user: "Rahul",
        rideType: "cab",
        city: "Delhi"
    };

    channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(msg)),
        { persistent: true }
    );

    console.log("🚕 Direct Sent:", msg);

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
}

producer();
