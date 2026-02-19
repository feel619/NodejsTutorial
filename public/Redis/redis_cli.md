# Redis Data Type – STRINGS
hello dost, pichili hamne video Redis insight installation dekha,
Aaj hum dekhenge: Data type sting

- Redis String kya hota hai?
- CLI me kaise use karte hain?
- Node.js me Redis kaise connect karte hain?
- Aur real-life me iska use kaha hota hai?

**So let’s start 🚀**

---
* Redis String Kya Hai?
- Redis me String sabse basic data type hai.
- Simple language me bole to
- 👉 Key → Value pair
- jisme app text store kar skte ho
- Number store kar sakte ho
- JSON string store kar sakte ho
- and Even counters bhi bana sakte ho

--
mene redis offical website open kari hai
aur user Develop with redis
-> Data Types then Overview and usme Strings

hame SET comand use karenge
SET command ki syntex hai SET Key value and then options
Options me
- NX - Ye tabhi value set karega jab key already exist nahi karti.
- XX -- Ye tabhi value set karega jab key already already exists ho.
- IFEQ – If Value Equals 👉 Sirf tab update karega jab current value exactly same ho.
- IFNE – If Not Equal 👉 Sirf tab set karega jab current value same na ho.
baki ke options aap check kar sakte ho


- to chaliye Redis CLI se key value pair set karte hai
- so first hame redis cli me jana hai so open terminal and go to redis cli

```markdown
docker exec -it redis-server redis-cli
```
- hamene alreyd ye command pichili video me samj liya hai

```markdown
SET username feelcode NX
```
ok aaya means hamara username set ho gaya hai

now ham username ko get karnge using GET command
```markdown
GET username
```
aur same value aap redis insight me check kar sakte ho

--
SETNX – Set If Not Exists
SETNX ka full form hai:
👉 Set if Not eXists

Example:
    SETNX lock:payment "locked"
Agar key exist nahi karti → return 1 (success)
Agar key already exist karti hai → return 0 (fail)

--
MGET ek hi time pe multiple keys retrieve karta hai.
agr aapne pichili video end tak dekhi hai to usme hamne like key set ki thi
so dono ki MGET se get karte hai

--
INCR – Increment by 1
INCR automatically number ko 1 se increase karta hai.

SET page:views 0
INCR page:views

---
and aapko Specific Number se Increment karna hai to aap
 INCRBY use kar sakte ho

---
floating point counters: INCRBYFLOAT Agar decimal values use karni ho:

SET rating 4.5
INCRBYFLOAT rating 0.1

# Redis Strings in Node.js (SET) – Practical Demo
chaliye nodejs me practical krte hai
is part me ham nodejs me data type stings ka use krenge
- 🛠 Step 1 me hame Redis Package Install karna hai
- 🔌 Step 2 me hame Redis  Connect  ko  Node.js me connect karna hai using redis pckg
- so iske liye ek file create karnge redis.js
```markdown
first hame Redis ka official Node.js package import krna hai aur useme creteclient function use karn hia
const { createClient } = require("redis");

createClient function me hame url me redis protocol, hamara server ip aur port likhan hai
const client = createClient({
  url: "redis://localhost:6379",
});

 agr connection me kuch error aaye to error handling karna hia
client.on("error", (err) => console.log("Redis Error", err));

fir ek functoin create krana hai jo server se connection establish kargea
async function connectRedis() {
  await client.connect();
  console.log("✅ Redis Connected");
}

aur last me module ko export karna hai jise ham dusri file me use kr sake
module.exports = { client, connectRedis };
```
so connection create hone ke bad hame step3 me ek aur file create karni hai jisme ham datatype ka use krenge
🧠 Step 3 – Basic SET Example Create app.js
```markdown
const { client, connectRedis } = require("./redis");
first jo hamen file create ki thi usko import krna hia and useme se 2 cheez imprt krgne client and coonectredis functin

and then ek asnc function creat karna hai
async function run() {
  await connectRedis(); jisme connectionredis function ko call kr diya hai jo ye line hamra redis server ke sath connection establish krgi

  and then hame username set krana hai so
  await client.set("username", "likesubscribe");
  aur Redis se stored value retrieve karne ke liye hai
  const value = await client.get("username");
    value ko Print karnge
  console.log("Username:", value);
    fir Redis connection close karna hai
  await client.quit();
}

run(); //aur last me Function call kiya hai
```

aap curly bracket me options pass kar sakte ho jese NX:true and EX:10
EX seconds -- me ham seconds me specified expire time set kar sakte hai, mtlb 10 second bad ye key delete ho jayegi

Managing counters Page View Counter
await client.set("page:views", 0);
const views = await client.incr("page:views");
