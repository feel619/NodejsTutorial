// var amqp = require('amqplib/callback_api');
// amqp.connect('amqp://localhost', function (error, connection) {
//     connection.createChannel(function (error, channel) {
//         var queue = 'task_queue';
//         channel.assertQueue(queue, {
//             durable: true
//         });
//         channel.prefetch(1);
//         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
//         channel.consume(queue, function (msg) {
//             var secs = msg.content.toString().split('.').length - 1;

//             console.log(" [x] Received %s", msg.content.toString());
//             setTimeout(function () {
//                 console.log(" [x] Done");
//                 channel.ack(msg);
//             }, secs * 1000);
//         }, {
//             noAck: false
//         });
//     });
// });


const amqp = require("amqplib");

async function startConsumer() {
    try {
        // 1️⃣ Create connection
        const connection = await amqp.connect("amqp://localhost");

        // 2️⃣ Create channel (virtual connection)
        const channel = await connection.createChannel();

        const queue = "task_queue";
        // 3️⃣ Ensure durable queue exists
        await channel.assertQueue(queue, {
            durable: true
        });
        await channel.prefetch(1);
        // 4️⃣ Prefetch = 1 (one message at a time)
        //❓ Prefetch kya karta hai?
        // RabbitMQ ko bolta hai: Ek time pe sirf 1 unacknowledged message bhejo
        //❓ Kyun zaroori?
        //Without prefetch:
        //RabbitMQ ek consumer ko saare messages de dega
        //Dusre consumers idle rahenge
        //With prefetch(1):
        // Fair dispatch
        // Load evenly distribute
        console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

        // 5️⃣ Consume messages
        await channel.consume(
            queue,
            async (msg) => {
                if (msg === null) return;
                const message = JSON.parse(msg.content);
                //const message = msg.content.toString();
                // 6️⃣ Simulate work (dot = 1 second)
                //const secs = message.split(".").length - 1;
                console.log(" [x] Received %s", message);
                setTimeout(() => {
                    channel.ack(msg);
                    console.log(" Send ACK after work is [x] Done");
                }, 5000);//measured in milliseconds
            },
            {
                noAck: true
            }
            //❓ noAck kya hota hai ?
            //false = manual ACK
            //Consumer khud bolega:
            //“Message successfully process ho gaya”
        );

    } catch (error) {
        console.error("Consumer Error:", error);
    }
}

startConsumer();


/*
Fair Dispatch
To address the limitations of basic round-robin, RabbitMQ supports a "fair dispatch"
or "worker-aware" mode using the basic.qos method (Quality of Service).
By setting a prefetch count of 1 (or another specific number), you instruct
RabbitMQ not to send a new message to a consumer until it has acknowledged the previous one.
This ensures that busy consumers aren't overloaded and messages go to the next available worker.
*/