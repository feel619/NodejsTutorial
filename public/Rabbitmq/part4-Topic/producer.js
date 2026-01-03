/*
//2️⃣ TOPIC EXCHANGE
//🎯 Pattern-based routing (city + ride type)

                Producer
                     |
        routingKey = "ride.delhi.cab"
                     |
                     ▼
              ┌──────────────────┐
              │ Topic Exchange   │
              │ ride_topic_ex    │
              └───────┬──────────┘
                      |
      ┌───────────────┼────────────────┐
      |                                |
 binding: ride.delhi.*           binding: ride.#
      |                                |
 Delhi Queue                     Analytics Queue
      |                                |
 Delhi Drivers               All Ride Analytics


 🔑 Sabse Important Rule (Yaad Rakhna)

Topic exchange me routing key & binding key
DOT (.) se separate words ka hona MUST hai

word.word.word
RabbitMQ dot ke bina pattern samajhta hi nahi.
1️⃣ Kya *.delhi.* valid hai? ✅ YES
*.delhi.*
Meaning
First word: anything
Second word: exactly delhi
Third word: anything

Matches ✅
ride.delhi.cab
booking.delhi.auto
trip.delhi.bike

Does NOT Match ❌
ride.mumbai.cab
ride.delhi
ride.delhi.cab.lux

📌 Rule Used
* = exactly ONE word
DOT compulsory hai
2️⃣ Kya *.*.cab valid hai? ✅ YES
*.*.cab
Meaning
First word: anything
Second word: anything
Third word: cab
Matches ✅
ride.delhi.cab
trip.mumbai.cab
booking.pune.cab
Does NOT Match ❌
ride.delhi.auto
ride.cab
ride.delhi.cab.lux

ride.delhi.*
Matches ✅
ride.delhi.cab
ride.delhi.auto
ride.delhi.bike
Does NOT Match ❌
ride.delhi (word kam hai)
ride.delhi.cab.lux (extra word)
ride.mumbai.cab (city mismatch)


ride.# ka Simple Rule
ride.#
👉 ride se start hona chahiye
👉 Uske baad 0 ya more words aa sakte hain
👉 Words dot (.) se separated hone chahiye

✅ ride.# MATCH KARTA HAI
Routing Key	Kyun match?
ride	# = zero word
ride.delhi	# = 1 word
ride.delhi.cab	# = 2 words
ride.mumbai.auto	city + type
ride.delhi.cab.lux	extra level
ride.anything.anywhere.anytype	unlimited
❌ ride.# MATCH NAHI KARTA
Routing Key	Kyun nahi?
rides.delhi.cab	ride ≠ rides
myride.delhi.cab	start hi ride se nahi
booking.ride.delhi	ride first word nahi
ride-delhi-cab	dot nahi, dash hai
ridecab	single word, dot structure nahi

#    .   lazy   .   #
First # → zero or more words before
lazy → exact word hona chahiye
Second # → zero or more words after
Sab words dot (.) se separated hone chahiye
✅ Correct Version kya hoga?
✅ MATCH KAREGA (#.lazy.#)
Routing Key	Kyun match?
lazy	# = zero words before & after
ride.lazy	lazy at end
lazy.ride	lazy at start
ride.delhi.lazy.cab	lazy in middle
a.b.c.lazy.x.y	anywhere
lazy.cab.luxury	after words allowed
ride.lazy.cab.lux.fast	unlimited
❌ MATCH NAHI KAREGA
Routing Key	Reason
lazyy	word exactly lazy nahi
lazycab	dot separated word nahi
ride.laz.y	lazy broken hai
ride.delhi.laz	spelling mismatch
ride-delhi-lazy	dot nahi
laz.y
*/

// topic-producer.js
const amqp = require("amqplib");

async function producer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_topic_ex";
    await channel.assertExchange(exchange, "topic", {
        durable: true
    });

    const messages = [
        { key: "ride.delhi.auto", msg: "Delhi Cab Ride Booked" },
        { key: "ride.mumbai.bike", msg: "Mumbai Bike Ride Booked" }
    ];

    for (const data of messages) {
        channel.publish(
            exchange,
            data.key,
            Buffer.from(data.msg),
            { persistent: true }
        );
        console.log("Sent:", data.key, data.msg);
    }

    setTimeout(() => {
        channel.close();
        connection.close();
    }, 500);
}

producer();

