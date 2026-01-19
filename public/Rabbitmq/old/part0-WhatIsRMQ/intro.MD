* What is RabbitMQ? RabbitMQ kya hai?

RabbitMQ ek Message Broker hai.
Iska kaam hota hai ek system se message lena aur dusre system tak safely pahunchana.

POSTOFFICE

Producer
Jo message bhejta hai
Example: Sender Message of User
Sochiye App ek ltr likhate ho apne ek dost ko jo bahut dur rehata hai
to app ek producer ho
agar apka dost dur rehta hai to direct aap usko lter to nahi bhej sakte to rabbitmq ek broker hai jo aapko help karta hai apka ltr puchana ke liye

Exchange
Message ko rule ke hisaab se route karta hai
Decide karta hai kaunsa queue
👉 kaunsa message kaunsi queue me jayega
smajo exhange ek Clerk jo appke letter check karta: Routing key ke hisab se sahi queues mein daalta.
📌 Exchange kabhi message store nahi karta
📌 Sirf routing rules follow karta

Queue
Message yahan line me store hota hai FIFO (first-in, first-out)
Jab tak consumer process na kare

JO appne letter bheja tha wo quque me save hota hai matable jo aapka letter hai wo aapki local branch se nikale k jaaha ltr pahuchana hai waha pohac gaya hai

Consumer
Jo message receive & process karta hai
Consumer ka kam hai queue mese message utana aur ack karana ke muje leter mil gaya hai
jese ji letter queqe me aata hai consumer usko consume matbl received karta hai aur ack karta hai

Exhange types ham agali video me dekhage jisme ham har type ke upper video banayege lekin abhi short samaj lijiye
🔹 Exchange ke types (important) 🎯
1️⃣ Direct Exchange
Exact match routing key
Example: order.created
2️⃣ Fanout Exchange
Message sab queues ko
Example: Notification broadcast
3️⃣ Topic Exchange
Pattern based routing
Example: order.*, user.#
4️⃣ Headers Exchange
Headers ke basis par routing

* RabbitMQ kyun use karte hain?
✅ System loosely coupled ho jata hai
✅ High traffic handle karta hai
✅ Messages loss nahi hote
✅ Async processing possible
✅ Microservices ke liye perfect

🔹 Simple use-cases 💡
Email sending
SMS / Push notification
Order processing
Payment handling
Background jobs