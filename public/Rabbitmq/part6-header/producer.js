/*
Headers exchange routing key ignore karta hai
Message headers (key–value pairs) ke basis pe route hota hai.

📌 Ye tab use hota hai jab:
Routing key sufficient nahi hoti
Multiple conditions pe routing chahiye
Metadata ke base pe decision lena ho
Jab routing key sufficient nahi hoti, tab Headers Exchange ka use hota hai

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
(headers: city=delhi,
 rideType=cab,
 x-match=all)

  (headers: priority=high,
  x-match=any)

🧠 When to Use Headers Exchange
When routing depends on multiple attributes
✅ When routing key structure is messy
❌ Not for high-performance (slower than topic)

Headers exchange tab use karo jab routing decision metadata pe ho

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

Cab Delhi Queue me
city = delhi
rideType = cab
x-match = all
Matlab saare headers match hone chahiye, Message match hota hai
➡️ Cab drivers ko notification milta hai

High Priority Queue
priority = high
x-match = any
Is queue me sirf priority important hai, Matlab koi ek header bhi match ho gaya toh message aa jayega

x-match Rule
| x-match | Meaning                          |
| ------- | -------------------------------- |
| all     | Saare headers match hone chahiye |
| any     | Koi ek bhi header match ho jaye  |
Galat x-match lagaya toh routing fail ho sakti hai.


So far humne Direct, Fanout aur Topic Exchange dekhe…
aaj hum dekhane wale hai Headers Exchange

 header exchange routing key ko ignore karta hai aur message ko headers (key–value pairs) ke basis pe route karta hai.
Iska matlab message kis queue me jayega, ye decide hota hai message ke metadata se,

When do we use Headers Exchange?
Headers Exchange tab use hota hai jab
    Routing key se kaam nahi banta, Multiple conditions pe routing chahiye, Routing key structure messy ho, Metadata ke base pe decision lena ho
    Example ke liye samjo sirf city nahi, hame city + rideType + priority etc etc — sab check karna ho.

so hamne Producer banaya hai, jo event bhejta hai with header metadata,
ride_headers_ex message receive karta hai,
headers Exchange  headers metadata check karta hai
Aur matching queues ko message forward karta hai

aur fir hamene do consuemr create kiye hai, jisme hamne cab consumer ko bind kiya hai cab queue ke sath and cab queue me hamne header me match kiya hai city, ridetype and x-match=all,
x-match = all Matlab saare headers match hone chahiye, message match hota hai to message queue me store hoga aur queue me se cab consumer message ko receive karega

aur Priority consumer ko hamne bind kiya hai prioty queue ke sath and queue me header me pass kiya hai,
priority = high
x-match = any, Any Matlab koi ek header bhi match ho gaya toh message aa jayega

producer aur consumer ka code hamene rabbitmq series me already bahut bar samj liya hai.
producer file me mene sirf exhange type header, message payload aur channel.publish function me header pass kiya hai.
and in consumer file queue ko Bind kiya hai with headers aur cab delhi consumer me x-match all use kiya hai
aur same as proity consumer ko bind kiya hai x-match any ke sath

mene dono consumer ko alredy start kar liya hai
message ko pulish krke check krte hai
so jese hi message publish hota hai wo dono consumer ko milta hai kyoki  delhi wali consumer me hamen bola hai x-math= all mtlb city=delhi and ridetype=cab ho to muje milna chaoye
so dono header condition math ho rahi hai to message mil gaya agr ek bhi condition math nahi hoti to messge nahi milta

same as priority consumer bolta hai x-mathc=any mtalb koi bhi ek condtion match honi chaiye so prioty=high match ho gayi to message recieve ho gaya
agr ham prioty consume me ek or condition add karte hai rideType='bike' so iska matlb ya to proitoy high or rideTpe=;bike isme se koi bhi ek match hoga to me received kar lunga
agr ham produer me header change krte hai ridetype='bike' and prioty=low krte hai tb bhi prity consuner message recieve kr lega
agr aapne oprator use kiye to aesa mana lijiye, ANY matlb OR operator and All means AND ( && ) oprator

I hope aapko Headers Exchange clearly samajh aa gaya hoga.
Agar thoda bhi doubt ho, comment section open hai
Video ko like karo
Channel ko subscribe karo 🔔

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
