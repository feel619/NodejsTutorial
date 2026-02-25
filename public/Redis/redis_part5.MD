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
leftpush me element hai → [ C, B, A ]
rightpush me element hai → [ 0, 1, 2 ]
LMOVE leftpush rightpush LEFT LEFT
Kya hoga?
1️⃣ leftpush list mese head  mtlb LEFT se element niklega aur
2️⃣ rightpush list me HEAD mtlb LEFT se add hoga agr ME Last RIGHT lagata to end se matlb tail se elemet add hota
so result dekho
leftpush → [ B, A ]
rightpush → [ C,0,1,2 ]
LMOVE leftpush rightpush RIGHT RIGHT
leftpush → [ B ] so ab leftpush mese A elemet lega kyoki hamne RIGHT lagaya aur righpush me right end se elemert add karga
rightpush → [ C,0,1,2,A ]

aap khud left to right and right to left test karo aur comment karo aapka result kya aaya?


LRANGE ka kam hai:
👉 List ke andar se specific range ke elements nikalna
Matlab: Aap full list bhi nikal sakte ho
 Ya kuch specific indexes bhi nikl sakte ho

jiski Syntax hai
LRANGE
key → list ka naam
start → starting index
stop → ending index
⚠ Index zero-based hota hai.

exmpale dekhe to  hamere pas list hai mylist jisme elemet hai a b c d e f g h
jese ham spacifix index nikal skate hai LRANGE mylist 0 2
aur agr full list get karni hai to LRANGE mylist 0 -1 ,
jisme -1	means Last element,  -2	Second last and so on..


LTRIM ka matlab hai: 👉 List ko specified range tak limit kar dena
mtlb hame agar specific range tak elemetnt rkahana hai aur  👉 Baaki elements remove karna hai tub ham LTRIM use kar sakte hai
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

# Blocking commands

BLPOP
BLPOP ka full form hai: Blocking Left Pop
BLPOP list ke left (head) se element remove karta hai 👉 Lekin agar list empty hai… 👉 To immediately error nahi deta 👉 Balki WAIT karta hai 🔥
Isliye isko “blocking command” bolte hain.

BLPOP
key → list ka naam mulitple key bhi use kar sakte ho
timeout → kitne seconds wait kare

LPOP Agar list empty hai to lpop instant null return karega
LPOP ke opposite BLPOP agr list empty hai to aap jitna timeout rakhoge utne time tak wait krega
jese hi list me element aayega immediately elemet return krega
let's test

blpop jobs 10 -> 10 mtlb 10 second wait karga, agr elemet mila to instat return krga and agr 10 second tak nahi elemnt nahi mila to nil retunr hoga
blpop jobs 0 0 means infinity wait
ek list create krte hai rpush jobs a

BLMOVE ka matlab hai: Blocking List Move
BLMOVE ka kaam hai:
1️⃣ Source list se element remove karta hai
2️⃣ Destination list me insert karta hai
3️⃣ Agar source empty hai to WAIT karta hai

JO hamene LMOVE dekha same as simmiler hai bas timeout add kiya hai mtbl blocking and waiting support karta hai
LMOVE immediately return karega agar list empty hai. uske oppsite BLMOVE wait karega.

Sytax hai blmove source list name destination list name LEFT | RIGHT LEFT OR RIGHt and last me timeout



```markdown
const { client, connectRedis } = require('./redis')

async function run() {
    await connectRedis();




    const leftPop = await client.lPop("leftpushList");//leftpush list mese lpop ka use krke left side se elemet remove krte hai
    console.log("LPOP removed:", leftPop);//log kiya left pop jisme output print hoga jo elemetnt remove hoga uska
    const remaining = await client.lRange("leftpushList", 0, -1);//same lrane karke firse list mese elemet check krt hai
    console.log("remaining Result:", remaining);//varibale name change

    await client.lPush("rightpushlist", "A");//single elemenet push kiya
    await client.lPush("rightpushlist", ["B", "C"]);//agr array me krna hai to
    const rightData = await client.lRange("rightpushlist", 0, -1);//lrange se elemet nikalte hai 0 -1 mean infinity
    console.log(" result ", rightData);
    const leftpop = await client.lPop("rightpushlist");//leftpush list mese lpop ka use krke left side se elemet remove krte hai
    console.log(" leftpop ", leftpop);;//log kiya left pop jisme output print hoga jo elemetnt remove hoga uska
    const leftpopcount = await client.lPopCount("rightpushlist", 2);
    console.log(" leftpopcount ", leftpopcount);;//log kiya left pop jisme output print hoga jo elemetnt remove hoga uska
    const remain = await client.lRange("rightpushlist", 0, -1);
    console.log(" remain ", remain);


    await client.rPush("rightpushlist", "A");
    await client.rPush("rightpushlist", ["B", "C"]);
    const rightData = await client.lRange("rightpushlist", 0, -1);
    console.log(" result ", rightData);
    const rightpop = await client.rPop("rightpushlist");
    console.log(" rightpop ", rightpop);
    const rightpopcount = await client.rPopCount("rightpushlist", 2);
    console.log(" rightpopcount ", rightpopcount);
    const remain = await client.lRange("rightpushlist", 0, -1);
    console.log(" remain ", remain);

    //lLen se list ki length count get kar sakte ho
    const length = await client.lLen("rightpushlist");
    console.log("Total count:", length);

    move krenge lmove se souce list se destinatnio list me
    to first create pending list
    await client.rPush("pending", ["job1", "job2", "job3","job4","job5"]);
    fir move krna hai elemet pending to processing
    const movedJob = await client.lMove(
        "pending",
        "processing",
        "LEFT",
        "RIGHT"
    );
    console.log("Moved Job:", movedJob);
    aur fir ham pending list and proclist ka output print krange
    const pendingList = await client.lRange("pending", 0, -1);
    const processingList = await client.lRange("processing", 0, -1);
    console.log("Pending:", pendingList);
    console.log("Processing:", processingList);

    await client.lTrim("pending", 0, 2);//0 se 2 index tak elemetn rako baki ke clear kardo
    const result = await client.lRange("pending", 0, -1);
    console.log("After LTRIM:", result);

    BlPOP - mana lijiye hamara worker hai jo job ka wait kar raha hai
    console.log("Worker waiting for jobs...");
    const job = await client.blPop("jobs", 0);
    console.log("Received job:", job);

    hamari app.js mese jobs me element push krte hai
    await client.rPush("jobs", "Send Email Task");


    console.log("Worker waiting for jobs...");
  const job = await client.blMove(
    "pending",
    "processing",
    "LEFT",
    "RIGHT",
    0
  );
  console.log("Moved Job:", job);

  await client.rPush("pending", "Email Task");

    await client.quit();
}

run();

```
