# Redis Data Type – STRINGS
hello dost, pichili hamne video Redis installation dekha,
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
- jisme app text store store kar skte ho
- Number store kar sakte ho
- JSON string store kar sakte ho
- and Even counters bhi bana sakte ho

- to chaliye Redis CLI key value pair set kar ke test karte hai
- so first hame redis cli me jana hai so open terminal and go to redis cli

```markdown
docker exec -it redis-server redis-cli
```
- hamene alreyd command pichili video me samj liya hai

ham first username set kargne  so hame command fire karna hai
```markdown
set username "final"
```
ok aaya means hamara username set ho gaya hai

now ham username ko get karnge using GET command
```markdown
GET username
```

same as aap number