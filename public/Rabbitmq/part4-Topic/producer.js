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


Is Video me ham cover karne wale hai TOPIC EXCHANGE, topic exchnage kse work krta hai, Topic exhange me routing pattern ke basis pe hoti hai
ye direct exchange se powerfull hota hai kyuki topic exhnage me hum WILDCARD use kar sakte hain.
TOpic exchange me hum 2 type ke WILDCARD RULES use kar skate hai, * star and 🔥 # (Hash).
* start bolta hai Exactly ek (ONE) word match karo
exmaple ke liye samjo hamne Pattern rakhi ride.delhi.*  to ride.delhi. fixed rahega lekin * ki cab,auto,bike koi ek word chalega
lekin agar ride.delhi.cab.xyz then not match kyuki cab ke bad ek aur extra word hai

# hash bolta hai — Zero OR MORE words, matlab 0, 1, ya unlimited words
agr hamari pattern ride.# hai, to  message ride se start hona chahiye uske baad kuch bhi aa sakta hai,
lekin agr myrides.delhi.cab ride me aapne s laga diya to nahi match hoga kyoki hamen bola hai first word ride useke bad kuch bhi

Agar aapko strict control chahiye → * use karo aur Agar aapko flexibility chahiye → # use karo

Topic exchange me routing key and binding key DOT(.) se seperate hona bahut jaruri hai
aesa manlo DOT compulsory hai, dot ke bina wo pattern samajga hi nahi.
agar app routing key defined karte ho ride*delhi ride#cab *delhi* ye sub invalid mani jayega topic exhnage me

Topic exchange kab use hota hai
jab aapko category-wise ya region-wise filtering chahiye.

aur 2 consumer cretae kiye hai jisme dono consumer ki queqe ko Binding Pattern ki help se bind kiya hai
delhi consumser ko binding kiya hai * or  anaylytics consumer ko bind kiya hai # se

chaliye code samjte hai 


aur Direct exchange se TOPic exhange powerfull hota hai kyoki isme hum whild card use kar skate hai
⭐ WILDCARD RULES (VERY IMPORTANT)

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

