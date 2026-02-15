# Redis install on docker 🚀

hello dosto, aaj ke video me ham dekhenge **how to install redis on docker**
- so first open redis offical website open karni hai
- go to docs
- then open redis products
- click on Redis open source
- click on install and upgrade
- open link install Redis open source
- and then we installed Redis on docker so open Run Redis Open Source on Docker link


Run Redis open souce on docker page me hame Terminal me ye command run krna hai
```markdown
docker run -d --name redis -p 6379:6379 redis:<version>
```
Is command ka matlab hai

- **🚀 docker run**: docker run matlbe container start karo
- **📁 -d →hyphyen**:  -d means background me run karo
- **📊 --name redis**: means container ka naam redis
- **🔢 -p 6379:6379**: bolta local port ko Redis port se connect
- **💾 redis:version>**: ye wala image version downlaod karo
me version change kar rahahu latest

---
* and then hame Redis CLI se Connect Karna hai so
* hamara redis docker me install hai isliye  hame docker ke under jake rediscli run kran hoga
so iske liye aap ye wala command use krna hai
```markdown
docker exec -it redis redis-cli
```
**🎯 Perfect For:**
- 📋 docker exec matbl running container ke andar jao
- 📝 -it mtlb interactive terminal provide karo
- 📊 redis hameara container name
- 🎓 redis-cli

redis cli client me ping kran hai  pong mila means redis successfully installed

> **Pro Tip**: Agar aapke system me **redis-cli** hai, to ye wale command se app directly terminal se connect kar sakte ho
**redis-cli -h 127.0.0.1 -p 6379**!

----
## next part me ham apni configuration file and image banake redis docker me install karegne

**⚡ By default, Redis Docker container internal configuration file use karta hai.:**
- Lekin real projects me hame
- **Memory limit set karni hoti hai**
- **Password enable karna hota hai**
- **Persistence change karni hoti hai**

> Isliye hume apna custom [redis.conf](/tools) use karna padta hai.

-so ham apni custom redis.conf file banake dockerfile ke trough reids start krenge:
- so first hame folder create karna hai redis-docker
 ```mkdir redis-folder```, go to folder ```cd redis-docker```
- and folder me hame redis.conf create karni hai  ```nano redis.conf```

**✨ Preview Support:**
- ✅ mkdir redis-folder
- ✅ cd redis-folder
- ✅ nano redis.conf
```markdown
bind 0.0.0.0
port 6379
protected-mode no
appendonly yes
```
- bind 0.0.0.0 Redis sabhi network interfaces se aane wali requests accept karega
- port 6379  Redis 6379 number ke port pe listen karega
- protected-mode no matlb Redis external connections allow karega
- appendonly yes
- means redis har write operation disk me likhega, becasuse Redis me Data RAM me hota hai, to agr Redis restart then data lost,
- mtlb Agar server restart ho gaya, Docker container crash ho gaya, ya machine reboot ho gayi
- to data lost na ho isliye appendonly yes


**🚀 aur fir create karni hai Dockerfile, ```nano Dockerfile ``` dockerfile me ye content add kar raha.:**
```markdown
FROM redis
COPY redis.conf /usr/local/etc/redis/redis.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
```
- FROM redis means Official Redis image use karo
- COPY redis.conf mtlb Local config ko container ke andar copy karo
- CMD means Redis ko custom config ke saath start karo

save file and exist


## ab hame apni Docker Image Build Karni hai!

```markdown
## docker build -t my-redis .
```

1. docker build means image create karo
2. -t my-redis → image ka naam
3. **. (dot)** → current folder context

```markdown
docker images
```
so is wali image ke use krke hame container run karana hai

```markdown
docker run -d --name redis-server -p 6379:6379 my-redis
```
- aur ye command already hamne dekh liya hai only custom image change ki hai
- so successfully haman container run ho gaya hai

aap
```docker ps ```
karke check kar sakte ho

docker ke under jake check karte hai
```markdown
docker exec -it redis-server redis-cli
```
ping krenge pong response aagay so redis successfully installed

> **Bookmark this**: Ye method aap production setups me use kr sakte ho!

---

## Agar aap custom image or Dockerfile banana nahi chahte, to is command ka use kr skate ho
jisme aap directly local config file use kar sakte ho

```markdown
# My Project Documentation

docker run -v /myredis/conf:/usr/local/etc/redis --name myredis redis redis-server /usr/local/etc/redis/redis.conf

## Quick Setup
1. -v mtlb local folder ko container se connect karo
2. /myredis/conf ye hamaara local folder hai jisme redis.conf file hai
3. /usr/local/etc/redis → container ka config path
```
```markdown
 mkdir -p myredis/conf
 cd myredis/conf
 cp ../../redis-foler/redis.conf ./
 cd ../../
```
mene apna local folder ka path change kiya hai jaha pe meri redisconf file hai
```markdown
docker run -v ~/Desktop/docker/redis/myredis/conf/:/usr/local/etc/redis --name myredis -d redis redis-server /usr/local/etc/redis/redis.conf
```
and then last me redis cli me ping pong kr ke check krenge
```markdown
docker exec -it myredis redis-cli
```