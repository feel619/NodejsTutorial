
# How To Install RabbitMQ

🐳 Full Command
```
 docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
```

## 🔹 docker run
   ### 👉 Docker ko bol rahe ho:
   ### “Ek naya container start karo”
   ### Ye internally karta hai:
   ### Image download (agar nahi hai)
   ### Container create
   ### Container start

```
   docker exec -it rabbitmq bash
```
## 🔹 -it (Interactive + Terminal)
   ### -it
   ### Ye actually 2 flags ka combination hai:
   ### -i → interactive
   ### STDIN open rakhta hai
   ### Container se input/output possible
   ### -t → tty
   ### Terminal allocate karta hai
   ### Output clean & readable hota hai

## 📌 RabbitMQ ke case me:
   ### Logs terminal me dikhte hain
   ### Ctrl + C kaam karta hai

## 🔹 --rm (Auto Remove)
### --rm
###  👉 Matlab:
###  “Container band hote hi automatically delete kar do”
###  ❓ Why useful?
###  Temporary testing ke liye
###  Junk containers nahi bante
###  📌 Without --rm:
### Container stop hone ke baad bhi system me rahega
###  docker ps -a me dikhega
### 🔹 --name rabbitmq
### --name rabbitmq

# 👉 Container ka custom naam set karta hai
❓ Why needed?
Random name (crazy_brown_fox) se better
Easy commands:
docker stop rabbitmq
docker logs rabbitmq
🔹 -p 5672:5672 (AMQP Port)
-p 5672:5672

Format:
hostPort : containerPort
Yahan:
Container port 5672 → RabbitMQ AMQP protocol
Host port 5672 → Node.js / Java / Python app connect karegi
📌 Without this:
App RabbitMQ se connect nahi kar paayegi
🔹 -p 15672:15672 (Management UI)
-p 15672:15672

Ye port kis liye?
RabbitMQ Web Management Dashboard
Browser me access:
http://localhost:15672

Login:
username: guest
password: guest

Dashboard me:
Queues
Exchanges
Connections
Channels
Messages

sab visually dikhega 👀
GUI or Graphical User Interface
🔹 rabbitmq:4-management (Image)
rabbitmq:4-management

Breakdown:
Part	Meaning
rabbitmq	Official RabbitMQ image
4	RabbitMQ version
management	Management plugin enabled

📌 management tag bahut important hai
❌ Iske bina UI nahi milegi

🔹 Overall Flow (Diagram)
Browser → localhost:15672 → RabbitMQ UI
App     → localhost:5672  → AMQP Protocol

Host Machine
   │
   ├─ Port 5672 ──▶ RabbitMQ Container (AMQP)
   └─ Port 15672 ─▶ RabbitMQ Container (Dashboard)

🔹 What happens when you run this?

1️⃣ Docker image pull hota hai
2️⃣ RabbitMQ server start hota hai
3️⃣ AMQP port open
4️⃣ Management UI start
5️⃣ Logs terminal me dikhte hain

🔹 How to stop container?
Ctrl + C


Because:

-it → interactive

--rm → container auto delete

🔹 Interview-ready One Liner 🎯

This command runs RabbitMQ in a Docker container
with AMQP and Management UI ports exposed,
auto-removal enabled, and interactive logging.

🧠 Short Summary Table
Flag	Purpose
docker run	Start container
-it	Interactive terminal
--rm	Auto delete
--name	Container name
-p 5672	App connection
-p 15672	Web UI
rabbitmq:4-management	Image + UI
