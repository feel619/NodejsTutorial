// var amqp = require('amqplib/callback_api');
// amqp.connect('amqp://localhost', function (error0, connection) {
//     if (error0) {
//         console.log(error0);
//     }
//     connection.createChannel(function (error1, channel) {
//         if (error1) {
//             console.log(error1, "error1");
//         }
//         var queue = 'task_queue';
//         var msg = process.argv.slice(2).join(' ') || "Hello World!";

//         channel.assertQueue(queue, {
//             durable: true
//         });
//         channel.sendToQueue(queue, Buffer.from(msg), {
//             persistent: true
//         });
//         console.log(" [x] Sent '%s'", msg);
//     });
//     setTimeout(function () {
//         connection.close();
//         process.exit(0);
//     }, 500);
// });

const amqp = require("amqplib");

async function sendMessage() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const queue = "order_queue";

        // 4️⃣ Ensure queue exists (durable)
        await channel.assertQueue(queue, {
            durable: true             //durable: true Durable = Queue ka life
        });
        setInterval(() => {
            const now = new Date();
            const msg = {
                token: now.getSeconds(),
                time: now.toLocaleTimeString()
            };

            channel.sendToQueue(
                queue,
                Buffer.from(JSON.stringify(msg)),
                { persistent: true }
            );
            //❓ persistent: true kyun ?
            //  Message disk pe save hota hai
            //  RabbitMQ crash ho jaye → message safe
            //🔹 Case 2: RabbitMQ Server CRASH / RESTART 💥
            //durable: true Durable = Queue ka life
            //persistent: false Persistent = Message ka life
            //RabbitMQ Restart → RAM cleared → Message LOST ❌
            // 📌 Kyunki message disk pe save nahi tha
            console.log(" [x] Sent", msg);
        }, 2000);

        // 6️⃣ Close connection safely
        // setTimeout(async () => {
        //     await channel.close();
        //     await connection.close();
        //     process.exit(0);
        // }, 500);

        process.on("SIGINT", async () => {
            console.log("Closing RabbitMQ connection...");
            await channel.close();
            await connection.close();
            process.exit(0);
        });


    } catch (error) {
        console.error("RabbitMQ Error:", error);
    }
}

sendMessage();

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
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌────────────┐  ┌────────────┐  ┌────────────┐
│ Consumer 1 │  │ Consumer 2 │  │ Consumer 3 │
│  (Worker)  │  │  (Worker)  │  │  (Worker)  │
└────────────┘  └────────────┘  └────────────┘
     ACK              ACK              ACK


Producer:
    Producer sirf message bhejta hai
    Usko ye nahi pata hota:
    kaunsa consumer message uthayega
    kitne consumers hain
    👉 Producer = fire-and-forget

Queue (task_queue)
    Queue ek common buffer hai
    Messages FIFO order me store hote hain
    Message tab tak queue me rehta hai:
        jab tak koi consumer ACK na bheje

🔹 Multiple Consumers (Workers)
    Har consumer independent worker hota hai
    RabbitMQ round-robin + prefetch ke basis par messages deta hai

Agar prefetch(1) use ho:
    Ek consumer = ek message at a time
    Fair load distribution

Case 1️⃣ durable: false
durable: false
persistent: true

❌ Queue hi gayab
❌ Message bhi gayab
➡️ Persistent useless ho jata hai

Case 2️⃣ durable: true
durable: true
persistent: false
✔ Queue bachegi
❌ Messages lost on restart

Case 3️⃣ durable: true
durable: true
persistent: true
✔ Queue safe
✔ Messages safe
✅ Production-ready


Diagram (Real Life Style)
                📱 Customer App
                       │
                       │ Order Placed
                       ▼
               ┌────────────────┐
               │  Order Service │
               │   (Producer)   │
               └───────┬────────┘
                       │
                       ▼
                ┌──────────────┐
                │   Order      │
                │   Queue      │
                └──────┬───────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
👨‍🍳 Chef A        👨‍🍳 Chef B        👨‍🍳 Chef C
(Consumer)      (Consumer)      (Consumer)
   ACK              ACK              ACK

🔍 Step-by-Step Flow (Hinglish)
1️⃣ Customer Order
    smajo aap ne food order kiya
    Order Service Producer ban gaya to aap prodcer ho

2️⃣ Producer sends message
Order = "Pizza + Coke"

Producer ko ye nahi pata:
kaunsa chef free hai - aapko nahi pata k konsa chef free hai so producer not create queue
kitne chefs available hain

3️⃣ Queue (Order Board)
Order ek board pe chipak jata hai
Jab tak koi chef uthaye nahi
Order wahin rehta hai

4️⃣ Multiple Consumers (Chefs)
Har chef:
board se ek order uthata
cook karta
complete hone pe bolta:
“Done!” (ACK)

📌 prefetch(1) =
Ek chef ek time pe ek order

5️⃣ Load Distribution (Fair)
Order 1 → Chef A
Order 2 → Chef B
Order 3 → Chef C
Order 4 → Chef A


Fast chef → zyada kaam
Slow chef → kam kaam

6️⃣ Failure Scenario ❌
Chef B beech me chala gaya 😵
Order complete nahi hua
ACK nahi gaya

RabbitMQ:
Order → Queue → Chef C

✔ Order waste nahi hota
🔐 Reliability Settings Explained
Producer side
durable: true
persistent: true

✔ Order board restart ho to bhi orders safe
Consumer side
prefetch(1)
noAck: false

✔ Ek chef = ek order
✔ Complete hone pe hi ACK
*/