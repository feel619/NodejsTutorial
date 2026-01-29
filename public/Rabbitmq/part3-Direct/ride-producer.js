
//Direct: The message is routed to the queues whose binding key exactly matches the routing key of the message.
//For example, if the queue is bound to the exchange with the binding key pdfprocess, a message published to the exchange with a routing key pdfprocess is routed to that queue.
//Fanout: A fanout exchange routes messages to all of the queues bound to it.
//Topic: The topic exchange does a wildcard match between the routing key and the routing pattern specified in the binding.
//Headers: Headers exchanges use the message header attributes for routing.

/*

                Producer (Ride Service)
                        |
                        | routingKey = "ride.cab"
                        ▼
                ┌──────────────────┐
                │ Direct Exchange  │
                │  ride_exchange   │
                └───────┬──────────┘
                        |
        ┌───────────────┼─────────────────────┐
        |               |                     |
 bindingKey=ride.auto bindingKey=ride.cab bindingKey=ride.bike
        |               |                     |
     Auto Queue       Cab Queue           Bike Queue
        |               |                     |
   Auto Drivers       Cab Drivers         Bike Drivers

   Asssume kijye ek ride service mulitple user ride book kare hai x user bike book kar rha hai y user cab book kar rha hai
   aapko aesi system banani hai k jo bike ki request aaye wo bike ke driver hai uske pass jaye
   cab ki request cav drivers ke pas and auto ki auto driver ke pass
   so user jese hi ride book karge ham uski ride type ke hisab se request ko ride_exchange me route kargene routing key ke trough
   cab driver cab queue ke sathe bind hai with bindingkey ride.cab or auto auto dirver auto quque ke sath bind hai with bindingKey=ride.auto


🏭 Real Life Example (Courier Office)
Courier office me:
Address likha hota hai
Agar address match hua → parcel deliver
Agar match nahi hua → parcel reject

User  books CAB - samjo aap ek cab book kar rahe ho
Message sirf Cab Queue me - to message sirf cab queue me jayega
Sirf Cab drivers ko ride milegi -

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

// producer.js
const amqp = require("amqplib");

//anonymous functions
const publishRideRequest = async function () {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_exchange";
    const routingKey = 'ride.cab'; // ride.auto | ride.bike

    const rideRequest = {
        user: "Rahul",
        rideType: "cab",
        city: "Delhi"
    };

    // Producer only creates exchange
    await channel.assertExchange(exchange, "direct", { durable: true });
    //Direct Exchange
    //Exact match routing key
    //Example: order.created

    //Producer me hamne queue nahi create kiya hai aur karna bhi nahi chiahiye
    //mene pichli dono video me isliye producer me queue create tha kyoki ham easily understand kar sake
    // aur Technically RabbitMQ allowed karta hai  RabbitMQ mana nahi karta.
    //but Architecturally bad practice
    //kyoki agr app producer me queue creat karenge to tight coupling hogi
    // jisme Producer + Consumer strongly tied ho jaate hain Consumer change → Producer change
    //Scaling Problem aayegi jisme agar kal  New service add hui to → Producer modify
    //Deployment problem aaygi producer me aapne durable false rakha hai aur consumer me durable true then Rabbitmq error aayegi PRECONDITION_FAILED

    //terminal open karke test karte hai
    //pehle hame consumer start karna hai
    //kyoki first consumer start hoga to queue create hogi, wo quque exhange ke stah bind hogi,
    // Producer jo  message send karega wo message quque me store kargi aur consumer message recive karega
    //agar hum producer pehle start karenge to message lost hoga kyo
    //kyoki Producer pehel start hoga to  Exchange creat hoga, exchange me  message publish karga,
    //lekin exhnage ke sath queue bind nahi rahegi to message droped hoga kyoki message quque me save hota hai

    // ❓ Producer me queue create karna – galat ya sahi?
    // ✅ Technically allowed
    // RabbitMQ mana nahi karta.
    // ❌ Architecturally bad practice
    //but ⚠️ architectural & production-level problems aa sakti hain.
    // Especially microservices / scalable systems me.
    // await channel.assertQueue(queue, { durable: false });
    // await channel.bindQueue(queue, exchange, routingKey);

    //1️⃣ Tight Coupling (BIGGEST PROBLEM)
    //Producer ko pata:
    //  Queue ka naam
    //  Consumer ka design
    //  👉 Producer + Consumer strongly tied ho jaate hain
    //🔴 Result
    // Consumer change → Producer change
    // New service add → Producer modify
    //2️⃣ Scaling Problem
    //aaj
    //cab service auto service
    // kal bike service
    // 4️⃣ Deployment Order Problems(Production pain)
    // 🧩 Tech Explanation
    // Producer deploy hota hai pehle
    // Queue bana deta hai:
    // durable = false
    // Consumer expect karta:
    // durable = true
    // 👉 RabbitMQ error:
    // PRECONDITION_FAILED
    // 🔥 Production crash

    channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(rideRequest)),
        { persistent: true }
    );

    console.log("🚕 Ride request published:", rideRequest);

    setTimeout(async () => {
        await channel.close();
        await connection.close();
    }, 500);
}

publishRideRequest();
