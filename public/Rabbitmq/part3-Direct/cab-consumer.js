// direct-consumer-cab.js
const amqp = require("amqplib");

async function consumer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_exchange";
    const queue = "cab_queue";
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

// Consumer File and Code already write kar liya hai
// yaha tak ka code haumne  producer me samj liya hai
//  channel.assertQueue bhi hamne pichli video me samj liya tha lekin fir se samaja deta hu
//assert queue ka kam hai check karna queue already exist karti hai agr alredy queue rabbimq me exist hai to use karo nahi to creat karo
//yeh line sabse important hai.
//Yahan humne queue ko exchange ke saath bind kiya hain routing key ke through.
//Iska matlab:
//Agar exchange pe message aaya ride.cab routing key ke saath,
//to woh message isi queue me aayega.
//Yeh sirf ek log hai jo batata hai Cab service ab ready hai messages receive karne ke liye.
//uske bad consumer start hota hai.
//Jaise hi koi message queue me aata hai,
//yeh function automatically trigger ho jata hai
//RabbitMQ message buffer format me deta hai,
//isliye hum pehle usse JSON me parse karte hain.
//Yeh line RabbitMQ ko batati hai
//ki message successfully process ho gaya hai.
//Agar hum ack nahi bhejte,
//to RabbitMQ same message dubara bhej sakta hai.”

// uber-consumer.js
// const amqp = require("amqplib");

// async function startUberService() {
//     const connection = await amqp.connect("amqp://localhost");
//     const channel = await connection.createChannel();

//     const exchange = "ride_exchange";
//     const queue = "uber_queue";
//     const routingKey = "ride.requested";

//     await channel.assertExchange(exchange, "direct", { durable: true });
//     await channel.assertQueue(queue, { durable: true });
//     await channel.bindQueue(queue, exchange, routingKey);

//     console.log("🔵 Uber waiting for ride requests...");

//     channel.consume(queue, (msg) => {
//         const data = JSON.parse(msg.content.toString());
//         console.log("🚕 Uber received ride:", data);
//         channel.ack(msg);
//     });
// }

// startUberService();
