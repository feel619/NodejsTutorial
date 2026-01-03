// consumer.js
const amqp = require("amqplib");

async function receiveMessage() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "orderQueue";

    await channel.assertQueue(queue);

    console.log("Waiting for messages...");

    channel.consume(queue, (msg) => {
        //console.log(msg.content, " msg.content ");//Human readable ke liye string me convert
        console.log("Received:", msg.content.toString());
        //msg.content.toString()
        //msg.content = Buffer
        //Human readable ke liye string me convert
        channel.ack(msg);
        //❓ channel.ack(msg)
        //RabbitMQ ko batata:
        //"Message successfully process ho gaya"
        //Agar ack na bhejo:
        //❌ RabbitMQ message dobara bhej dega
    });
}

receiveMessage();


// const amqp = require('amqplib/callback_api');
// amqp.connect('amqp://localhost', function (error0, connection) {
//     if (error0) {
//         console.log(error0);
//     }
//     connection.createChannel(function (error1, channel) {
//         if (error1) {
//             console.log(error1);
//         }
//         var queue = 'hello';
//         channel.assertQueue(queue, {
//             durable: false
//         });
//         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
//         channel.consume(queue, function (msg) {
//             console.log(" [x] Received %s", msg.content.toString());
//         }, {
//             noAck: true
//         });
//     });
// });