/*
Headers exchange routing key ignore karta hai
Message headers (key–value pairs) ke basis pe route hota hai.

📌 Ye tab use hota hai jab:
Routing key sufficient nahi hoti
Multiple conditions pe routing chahiye
Metadata ke base pe decision lena ho

🚕 Real-Life Example – Ride Booking App (Headers Exchange)
Scenario
Ride event aaya hai, aur hume routing karni hai based on:
city
rideType
priority

📨 Message Headers (Producer bhejta hai)
{
  "city": "delhi",
  "rideType": "cab",
  "priority": "high"
}

                     Producer
                  (Ride Service)
                         |
        headers: city=delhi, rideType=cab, priority=high
                         |
                         ▼
                ┌────────────────────┐
                │ Headers Exchange   │
                │  ride_headers_ex  │
                └─────────┬──────────┘
                          |
        ┌─────────────────┼──────────────────┐
        |                                    |
   Cab-Delhi Queue                    High Priority Queue
(headers: city=delhi,              (headers: priority=high,
 rideType=cab,                      x-match=any)
 x-match=all)
        |                                    |
   Cab Drivers                        Urgent Handling

🔑 x-match Rule (MOST IMPORTANT)
    x-match	Meaning
    all	Saare headers match hone chahiye
    any	Koi ek bhi header match ho jaye


🧠 When to Use Headers Exchange
When routing depends on multiple attributes
✅ When routing key structure is messy
❌ Not for high-performance (slower than topic)


| Feature          | Direct             | Topic               | Fanout     | **Headers**                               |
| ---------------- | -------------      | ------------------- | ---------- | ----------------------------------------- |
| Routing logic    | Exact match        | Pattern (`*`, `#`)  | None       | **Header key-value match**                |
| Routing key      | Required           | Required            | Ignored    | **Ignored**                               |
| Routing based on | routing key        | routing key pattern | N/A        | **Message headers**                       |
| Match rule       | `key == bind`      | wildcard match      | All queues | **`x-match: all / any`**                  |
| Use case         | Specific command   | Events + Filters    | Broadcast  | **Complex conditions / metadata routing** |
| Performance      | Fast               | Fast                | Fast       | **Slightly slower**                       |

Direct exchange tab use karo jab exact service ko message bhejna ho
Topic Pattern match karni ho tab use kare jese
Fanout bole — routing key chhod, sabko bhej 🚀
Headers exchange tab use karo jab routing decision metadata pe ho
*/

// headers-producer.js
const amqp = require("amqplib");

async function producer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_headers_ex";

    // 1️⃣ Create headers exchange
    await channel.assertExchange(exchange, "headers", { durable: true });

    const message = {
        event: "RIDE_BOOKED",
        user: "Amit",
        city: "delhi",
        rideType: "cab"
    };

    // 2️⃣ Publish with headers
    channel.publish(
        exchange,
        "",
        Buffer.from(JSON.stringify(message)),
        {
            headers: {
                city: "delhi",
                rideType: "cab",
                priority: "high"
            }
        }
    );

    console.log("📦 Headers Message Sent:", message);

    setTimeout(async () => {
        await channel.close();
        await connection.close();
        process.exit(0);
    }, 500);
}

producer();
