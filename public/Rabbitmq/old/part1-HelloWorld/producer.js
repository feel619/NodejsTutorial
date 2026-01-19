// const amqp = require('amqplib/callback_api');

// amqp.connect('amqp://localhost', function (error0, connection) {
//     if (error0) {
//         console.log(error0, " error0 ")
//     }
//     connection.createChannel(function (error1, channel) {
//         if (error1) {
//             console.log(error1, " error1 ");
//         }
//         var queue = 'hello';
//         var msg = 'like and subscribe!';

//         channel.assertQueue(queue, {
//             durable: false
//         });
//         channel.sendToQueue(queue, Buffer.from(msg));

//         console.log(" [x] Sent %s", msg);
//     });
//     setTimeout(function () {
//         connection.close();
//         process.exit(0);
//     }, 500);
// });
/*


                ┌──────────────┐
                │   Producer   │
                │ (Sender App) │
                └──────┬───────┘
                       │
                       │  Messages
                       ▼
                ┌──────────────┐
                │    Queue     │
                │  task_queue  │
                └──────┬───────┘
                       │
                       |
                       ▼
                ┌────────────┐
                │ Consumer 2 │
                │  (Worker)  │
                └────────────┘
                    ACK
*/
// amqplib ek Node.js library hai
// 🔹 Ye RabbitMQ ke saath AMQP protocol ke through baat karti hai
// 🔹 Ye hume:
// connection
// channel
// queue
// message send / receive
// sab ka access deti hai
const amqp = require("amqplib");
// RabbitMQ ke saath kaam network based hota hai
// 🔹 Network operations = time lete hain
// 🔹 Isliye async / await use karte hain
//exmpale of resuatut khana kane gaye
// aapne order kiya wo order app chef ko doge nahi ya fir chef ko diya or waiter aayega jisko aap mulitple item likhavoge wo jake chef ko bolega aur chef item banayega
//jo chef k pass k khana baneme toda time lagela jo bhi aapne order kiya hai
//to tab tak aap wait karoge
//Asynchronous Functions -> Arrow Function
async function sendMessage() {
    const connection = await amqp.connect("amqp://localhost");
    //❓ Connection kya hota hai?
    //RabbitMQ server ke saath physical TCP connection
    //Heavy resource hota hai
    //📌 Real life:Ye RabbitMQ ke saath phone call connect karne jaisa hai ☎️
    //❓ amqp://localhost kya hai?
    //amqp:// → protocol
    //localhost → RabbitMQ server address

    const channel = await connection.createChannel();
    //❓ Channel kya hota hai?
    //Channel ek virtual connection hota hai
    //Ek hi TCP connection ke andar multiple channels ho sakte hain
    // 📌 Real life: Connection = Highway Channel = Lanes 🚗🚗🚗
    //     RabbitMQ Server
    //       ||
    //       ||  ← TCP Connection (Highway)
    //       ||
    // =====================================
    // |   🚗 Lane 1  |  🚗 Lane 2 | 🚗 Lane 3 |
    // | Channel A    | Channel B  | Channel C|
    // =====================================
    //Highway = Connection (heavy)
    //Lanes = Channels (virtual, lightweight)
    // Agar har car ke liye naya highway banane lage:
    // ❌ expensive
    // ❌ slow
    //Isliye:
    // ✅ ek highway
    // ✅ multiple lanes
    //❓ Channel kyun chahiye?
    //RabbitMQ rule:
    //❌ Aap direct connection se message nahi bhej sakte
    //✅ Hamesha channel ke through hi kaam hota hai
    //Channel ke bina:
    //❌ Queue create nahi kar sakte
    //❌ Message send nahi kar sakte
    //❌ Consume nahi kar sakte

    const queue = "orderQueue";
    const message = "Order Created Successfully";

    await channel.assertQueue(queue);
    //Queue exist karti hai ya nahi check karta hai
    //Agar nahi hai → create kar deta hai
    //Agar already hai → kuch nahi karta
    //❌ Queue missing ho to error aayega
    let msgBuffer = Buffer.from(message);
    console.log(msgBuffer, " msgBuffer ");
    channel.sendToQueue(queue, msgBuffer);
    //Message ko queue me push karta hai
    //RabbitMQ sirf binary data samajhta hai
    //JavaScript string ❌ binary nahi hoti
    //String → Buffer → RabbitMQ
    //Raw binary data
    //❓ Agar Buffer na use karein ?
    // ❌ Error
    // ❌ Message corrupt ho sakta hai

    // Agar hum producer se direct queue me message bhejte hain
    // bina exchange define kiye,
    // toh exchange system ka use kaise hota hai?
    // RabbitMQ me bina exchange ke kabhi message nahi jaata.
    // Even sendToQueue() bhi exchange use karta hai.
    // 👉 Wo exchange default exchange hota hai.
    // RabbitMQ me ek built-in exchange hota hai:
    // name = ""
    // type = direct


    console.log("Message Sent:", message);
    //❓ setTimeout kyun?
    // RabbitMQ async hota hai
    // Message bhejne ke liye thoda time chahiye
    // Agar turant close kar diya:
    // ❌ Message deliver hone se pehle connection band
    setTimeout(() => {
        //9️⃣ connection.close() — WHY NEEDED ❗❗❗
        connection.close();
        // Connection close kyun karein ?
        // Connection system resources use karta hai
        // Agar close nahi kiya:
        // Memory leak
        // Open sockets
        // App hang
        // 📌 Real life:Phone call complete hone ke baad cut karna ☎️❌
    }, 500);
}

sendMessage();

/*
Fair Dispatch
To address the limitations of basic round-robin, RabbitMQ supports a "fair dispatch"
or "worker-aware" mode using the basic.qos method (Quality of Service).
By setting a prefetch count of 1 (or another specific number), you instruct
RabbitMQ not to send a new message to a consumer until it has acknowledged the previous one.
This ensures that busy consumers aren't overloaded and messages go to the next available worker.
*/