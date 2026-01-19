// topic-consumer-analytics.js
const amqp = require("amqplib");

async function consumer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "ride_topic_ex";
    const queue = "ride_analytics_queue";
    const bindingPattern = "ride.#";
    /*
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
    */

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, bindingPattern);

    console.log("📍 Analytics Consumer waiting...");

    channel.consume(queue, msg => {
        console.log("Received:", msg.content.toString());
        channel.ack(msg);
    });
}

consumer();
