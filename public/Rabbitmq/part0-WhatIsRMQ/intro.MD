# What is RabbitMQ? RabbitMQ kya hai?

## RabbitMQ ek Message Broker hai.
### Iska kaam hota hai ek system se message lena aur dusre system tak safely pahunchana.
#### 👉 Matlab agar 2 services/apps aapas me baat karna chahti hain, to RabbitMQ beech ka mediator ban jata hai.

## Exmpale : POSTOFFICE

# 🔹 RabbitMQ ka basic flow
* Producer
    * Jo message bhejta hai
    * Example: Sender Message of User
    * Sochiye App ek ltr bhejan chate ho apne ek dost ko jo aapke ghar se dur rehata hai
    * to app ek producer ho
    * agar apka dost dur rehta hai to direct aap usko lter to nahi bhej sakte to rabbitmq ek broker hai jo aapko help karta hai apka ltr puchana ke liye


* Exchange
    * Message ko rule ke hisaab se route karta hai
    * Decide karta hai kaunsa queue
    * 👉 kaunsa message kaunsi queue me jayega
    * smajo exhange ek Postoffice ka clerk ya employee hai jo appke letter check karta: Routing key ke hisab se sahi queues mein daalta.
    * 📌 Exchange kabhi message store nahi karta
    * 📌 Sirf routing rules follow karta

* Queue
    * Message yahan line me store hota hai FIFO (first-in, first-out)
    * Jab tak consumer process na kare
    * JO appne letter bheja tha wo queue me save hota hai matable
    * jo aapka letter Bheja tha wo exchange rule k hisab se queue me pohacha diya gaya hai

* Consumer
    * Jo message receive & process karta hai
    * Consumer ka kam hai queue mese message utana aur ack karana ke muje Message mil gaya hai
    * jese hi aapka dost letter queqe mese received karta hai wo turt ack karta hai queue ko ke muje ltr mil gaya hai  so queue is ltr ko remove karegi

# 🔹 Exchange ke types (important) 🎯
* Exhange types Detail me ham aane wali video me samajege
* jisme ham har type ke upper Ek ek video banayege
* abhi short samaje hai

## 1️⃣ Direct Exchange
### Example: order.created Exact match routing key - matlb Exact key ko match krata hai jese aapne lter me address likha hai 45_delhi to jab tak ae same key address nathi milta tab tak consumer usko consume nati kar sakega 45_delhi

# 2️⃣ Fanout Exchange
## Message sab queues ko
### Example: Notification broadcast

# 3️⃣ Topic Exchange
## Pattern based routing
## Topic exchange me routing key & binding key DOT (.) se separate words ka hona MUST hai
### Example: ride.*.cab, ride.#
### ⭐ * (Star) – Exactly ONE Word,  ride.*.cab First word: exactly ride Second word: anything, Thirword = cab
### 🔥 # (Hash) – ZERO ya MORE Words payment.# First word: exactly payment DOT (.) then anything

# 4️⃣ Headers Exchange
## Headers ke basis par routing
### x-match=all                        x-match=any
### Cab-Delhi Queue                    High Priority Queue
 (headers: city=delhi,              (headers: priority=high,
 rideType=cab,                      x-match=any)
 x-match=all)

|  x-match=all   | x-match=any |
| ------------- |:-------------:|
|  Cab-Delhi Queue                                      | High Priority Queue                   |
| headers: city=delhi, rideType=cab, x-match=all        | headers: priority=high, x-match=any   |
|  all	Saare headers match hone chahiye                |  any	Koi ek bhi header match ho jaye |


# RabbitMQ kyun use karte hain?

## “RabbitMQ use karte hain taaki system loosely coupled ho,
## traffic handle ho, data safe rahe,
## aur user ko fast response mile.”
### system loosely coupled means ek service dusre pe depend na rahe
### traffice handle ksese hota hai - manlo 1 lakh orders ek sath aa gaye rabbmitmq Orders ko queue me store kar leta hai consumer one by one process kar deta hai
### data safe rahe- 1 lakh order mese ek bhi order miss nahi hone dega
### fast response mile- order Payment done k bad notification bhej diya jayega baki ki process background me hoti rahegi

## ✅ System loosely coupled ho jata hai
 * 🤔 Pehle Samjho: Coupled vs Loosely Coupled
 * ❌ Tightly Coupled System kya hota hai?
 * Jab ek service directly dusri service pe depend karti hai,
 * aur ek fail hui to poora system Down ho jaye.
    * ❌ Payment service down → Order fail
    * ❌ Email service slow → Order slow
 * Loosely Coupled System kya hota hai?
 * Jab services directly ek dusre ko call nahi karti,
 * balki messages ke through baat karti hain.

## ✅ High traffic handle karta hai
## ✅ Messages loss nahi hote - maan lijie ek sath bahut sare message aa rahe hai aur
## ✅ Microservices ke liye perfect
## ✅ Async processing possible
    User ne bill pay kiya:
    Receipt generate
    Email bhejna
    SMS bhejna
    User ko turant success response
    Baaki kaam background me

# 🔹 Simple use-cases 💡
## Email sending
## SMS / Push notification
## Order processing
## Payment handling
## Background jobs
## Microservices
## Load Balancing
## Real-Time Data Streaming

