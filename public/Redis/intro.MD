
# Redis

Hello dosto 👋
Aaj ke video me hum Redis ko zero se samjhenge —
Redis kya hai
Redis kyun use hota hai
Mac and Docker me Redis install karenge
Aur Redis ke all important data types

Redis kya hai ?
Redis ka full form hai Remote Dictionary Server
Redis ek in-memory data store hai, matlab data RAM me store hota hai —
data ram me store hota hai, isliye ye super fast hota hai
Microseconds me response deta hai
aur Mostly temporary/frequently used data ke liye use hota hai


Redis ko hum use kar sakte hain as:
Database ke jese but limited cases me
Cache ke liye
Message broker

Why Use Redis? (Redis Kyun Use Kare?)
Ab sawal aata hai — jab  already itne sare database hai to Redis kyun?
Redis isliye use hota hai jab hame High speed chahiye, Repeated data bar-bar database se nahi lana pade, Performance improve karni ho

🚀 Real Life Example #1:
Assume kijiye  Swiggy / Zomato App hai, jisme million of user hai, jo every day app open krte hai,
Har ek user jub app open karta hai to wo server pe request krta hai, aur bolta hai ki give me  Restaurant list,
aur server query krta hai Database pe, based on query Database toda time lega kuch seconds or milliseconds,
aur jo data fetch hoga wo server ko dega and server response ko send krdega user ko.

so ye jo Database ne milliscond liya is vajah se user ke app pe loader guma, mtlb user ko wait krna pada,
aur million of user jo request krtne hai to database pe load padega
aur same request bar bar call huvi so Database pe same query million time fetch huvi

so is prblem ke solution ke liye picture me aata hai redis
redis kya krega, jese hi pehli request aayi, database me query chali, data fetch huva aur redis pe store ho gaya.
pehli bar Database mese data uthaya aur store kar liya.
ab jub next user request kerga server pe, server data Database mese nahi,  direct redis se fetch karega.

redis ke use se jo user ko wait krna padta tha wo nahi krna pada so user happy no loader on app,
aur same query database me nahi chali isliye database pe load khatm.
kyoki data fetch huva redis mese aur redis data ram me store krta hai to fetch bhi super fast hoga.


❌ Redis Ko Kab Use Nahi Karna Chahiye?
Redis powerful hai but kaha hame Redis ko Avoid karna hai:
Large permanent data store chahiye
Strong relational queries chahiye
Financial / critical data ho jo loss nahi kar sakte so aesi jagah redis avoid kare

Redis mostly cache + speed layer ke liye best hai 👍
agr one word me bole to redis aek database ke upper rakhi fast memory layer hai

so har ek user jb app open krega  bar-bar load hoti hai, Database pe heavy load
Solution with Redis:
Pehli request → data DB se aaya Same data Redis me store ho gaya Next user request → direct Redis se data
Result: Page fast load DB load kam User happy 😄

Common use cases:
Caching
Same data bar-bar fetch hota hai to ham waha redis use kar sakte hai

Session management
Millions of users logged in kar rahe he to
Session data DB me store → slow,
Session data Redis me store kar ke

OTP & Token Storage
OTP temporary hota hai, so Expiry logic set kar sakte hai

Rate Limiting
Too many requests → server crash,so koi ek user bar bar API call kar rha hai to user ke ip se user ki request count kr ke limit execed set kr sakte hai


Leaderboards & Ranking System
Real-time ranking calculate karna ho

Real-time chat / counter
jese Online/offline status or message Unread count real-time
Like / view count fast update chahiye

Message Queue / Task Queue
Background tasks manage karna, Email, Notification, SMS delay

aesa manlo Redis microseconds me response deta hai, jabki DB milliseconds leta hai.