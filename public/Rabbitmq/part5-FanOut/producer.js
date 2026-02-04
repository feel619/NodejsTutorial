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

Welcome back guys 👋
Aaj ke video me hum samajhne wale hain RabbitMQ FANOUT Exchange.
Ye exchange sabse simple hota hai,
kyunki yahan routing key ka koi role hi nahi hota.

Fanout exchange ka kaam hota hai –
message ko sabhi bound queues me broadcast karna
Matlab jo bhi queue exchange se connected hai, sabko same message milta hai
When use FANOUT ?
Same message multiple systems ko bhejna ho
Koi filtering nahi chahiye
Pure broadcast chahiye tab hum fanout use kar sakte hai

  //assume kijiye ride canaceled ho rahi koi bhi xy resaon se
  // to hame notification send karna hai driver ko customer ko, refund krana hai aur analytic team ko bhi data send karan hai
  // jitne bhi module he unko hame bina filter ke message bhejna hai waha ham fanout exchnage use kr sakte hai

👉 Yahan hum exchange ka naam define kar rahe hain.
  chaliye code samjte hai
  Agar exchange pehle se exist karta hai → use kar lo
    Nahi hai to naya create karo
    exhchnange type use ki hai fanout jo brocast karga sari quqr me
    durable: true ka matlab:
    RabbitMQ restart hone ke baad bhi exchange delete nahi hoga
    and then message payload defind kiya hai jisme event and reson likha hai

    message ko publish kiya hai → ride_fanout_exchange me,
    chanell.puslish function ki syntax requirement hai, isliey routingkey hamne empty rakhi hai,
    aap agar routingkey defind karoge to bhi wo ignore ho jayegi,  kyoki fanout routingkey ignore krta hai,
    aur message ko binary data me convert kiya hai

    aur last me connection channel ko close kiya hai
    producer code done now we check consumer code
    SO in conumer  connection and chnnel connection create kiya hia
    exhane defind kiya hai make sure karna ke produder and consumer ka exchaneg same ho
    aur fir assetexchange adn assert quqe jo hamne already pichi video me samj liya hai, sirf exhange type fanout ki hai
    chaenl.bindquemen me hamen quqe ko exhane ke sath bind kiya hai witg empty routing key kyo ki fanout ingore routing key
    aur last me queue mese messg ko recive karke ackhownleg kiya hai
    baki ke dono consumer almost same hai sirf queue ka name change kiay hai

    chaliye test karte hai
    3no consumer ko first sstart krna hai consumer kyo first start karana hai wo hmne alreay samj liya hai
    jese hi produer message puslish krega hamre tino consumer ko message milna chaiye

    real life example se samje to princel hai jo mic pe annoument krta hai kal shclle bnad hai, so wo mesage class teacher securiy student sabko milta hai

I think ab aapko Fanout Exchange clear ho gaya hoga.
Agar doubt ho toh comment kariye 👇
Video ko like kijiye,
channel ko subscribe kijiye,
aur Quiz Question me answer kijiye

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
