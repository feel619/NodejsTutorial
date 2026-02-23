# Redis Lists

Agar aap queue system banana chahte ho,
background job processing karna chahte ho,
ya chat messages store karna chahte ho…

Toh Redis Lists aapke liye perfect hai 🚀

Aaj hum cover karenge Basic List commands jese Lpush RPush Lpop Rpop and Blocking commands BLPOP, BLMOVE.
aur node.js practical demo karenge

Let start

---

#  What is REdis List ?

Redis List ek ordered collection hoti hai.
matlb array  stacks or queues ["msg1", "msg2", "msg3"]
jisme internally linked list structure hota hai.

# Where Redis Lists Used?
aap kaha redis list used kar sakte ho
-  Background jobs
-  Task queue management
-  Notification system
-  Chat application
- Background worker systems
me aap redis list use kar sakte ho

---

Basic Command :

Mene description and syntax redis offical website se hi copy paste kiya hai may be future me ye change bhi ho jaye.

LPUSH : lpush value add karga List ke Head se mtlb statring left side se element add karega

📌 LPUSH Syntax : LPUSH key element [element ...]
lpush command
 key -> list ka name
elemnt mltb jo value add krni hai wo
aur app multple elemtn bhi add kar sakrte ho ek hi command me

LPUSH elemetn ko 👉 Left se right read karta hai but har element ko head par means left side se insert karta hai
so first app insert kargo A so A add hoga 0 index pe -> Lpush leftpush A
fir ek aur elemtn add kargo B to A move hoga first index pe aur B index 0 pe aayega  -> Lpush leftpush B
and then C add kargo to A move hoge secodn pe and B move hoga first index pe  and C 0 pe aa jayega  -> Lpush leftpush C
aap multiple bhi kar sakte ho lpush leftpush d e f g

-LPush menas LIFO last in first out

RPUSH
Aur Same as RPUSH value add karta hai tail se mtlb list ke ending se, 👉 Har naya element end se add hota hai right side se
Syntax same hai LPUSH jese sirf command name replace hai RPUSH
- so right side value push karega, a b c,  FIFO first in first out
RPUSH rightpush 1
RPUSH rightpush 2
rpush rightpush 3 4 5 6 7 8 multiple value add kr sakte ho


LPOP - LEFT POP
👉 Head se element remove karta hai means (left side) se value remove hogi 👉 Aur jo element ko remove kiya hai usko return bhi karga
Syntax hai LPOP fir key and [count], count optional hai, agr [count] nhi rahega to single elemtne remove hoga

jo hamen leftpush kiya tha us list mese value remove krte hai, lpop leftpush so starting head left side se first element remove hoga.
aap count add krke multiple value bhi remvoe kar sakte ho lpop leftpush
2 two elemet remove from leftpush list

Same as RPOP JO 👉 Tail matlb right side se element remove karta hai


LLEN ka matlab hai 👉 List Length Matlab list me kitne elements hain — woh count return karta hai.
Syntax LLEN
key name

LMOVE Kya Hai? 👉 Ek list se element remove karta hai 👉 Aur usko dusri list me insert karta hai
Syntax hai LMOVE source fir destination and LEFT|RIGHT LEFT|RIGHT
Example Samjho ke sath samjete hai Agar humare paas hai:
pending → [ job1, job2, job3 ]
processing → [ ]
LMOVE pending processing LEFT RIGHT
Kya hoga?
1️⃣ pending list ke LEFT (head) se element niklega
2️⃣ processing list ke RIGHT (tail) me add hoga
so result dekho
pending → [ job2, job3 ]
processing → [ job1 ]

LRANGE ka matlab hai:
👉 List ke andar se specific range ke elements nikalna Matlab: Aap full list bhi nikal sakte ho Ya sirf kuch specific indexes

jiski Syntax hai
LRANGE
key → list ka naam
start → starting index
stop → ending index

⚠ Index zero-based hota hai.

jese hame mylist mese LRANGE mylist 0 2
full list nikal skate ho LRANGE mylist 0 -1

Index	Meaning
-1	Last element agr  -2	Second last ,


LTRIM ka matlab hai: 👉 List ko specified range tak limit kar dena
👉 Baaki elements automatically remove ho jaate hain
agr simple world me bole to List ko cut karke sirf required portion rakhna.

syntac hai
LTRIM
key → list ka naam
start → starting index
stop → ending index

Indexes zero-based hote hain (same as LRANGE)

mylist → [ A, B, C, D, E ]
LTRIM mylist 0 2
to Kya hoga?
👉 Sirf index 0 se 2 tak elements rahenge
👉 Baaki remove ho jayenge

LTRIM mylist -3 -1
original list [ A, B, C, D, E ]
result C D E

LRANGE	Command Data return karta hai
LTRIM	Command List ko permanently modify karta hai