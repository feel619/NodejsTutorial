/*
FANOUT  → Broadcast (no key)

                Producer
             (Ride Service)
                     |
                     |  RIDE_CANCELLED
                     ▼
              ┌──────────────────┐
              │ Fanout Exchange  │
              │ ride_events_ex  │
              └───────┬──────────┘
                      |
      ┌───────────────┼───────────────┐
      |               |               |
 Notification Q   Refund Q       Analytics Q
      |               |               |
  SMS / Push      Money Back      Dashboards


🎯 Definition
“Sabko message bhejna, bina filter ke”

🏫 Real Life Example (School Announcement)
Principal mic pe bole:
    “Kal school band hai”
Kisko sunna hai?
    Class?
    Teacher?
    Security?
    Sabko message milta hai 📢
Prinicipal ko ye nahi sochna:
    Kaun sun raha hai
    Kaise sun raha hai


*/

// fanout-producer.js
const amqp = require("amqplib");

async function producer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_fanout_ex";

    await channel.assertExchange(exchange, "fanout", { durable: true });

    const msg = {
        event: "RIDE_CANCELLED",
        reason: "Driver not available"
    };


    channel.publish(
        exchange,
        "",
        Buffer.from(JSON.stringify(msg))
    );

    console.log("📢 Fanout Sent:", msg);

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
}

producer();
