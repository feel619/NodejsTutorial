#install redis
to bane rahiye video ke end tak last me Redis uninstall bhi krenge

so hame homebrew ki help se redis install karne wale he so make sure kijiyega ke aapki system me homebrew alredy install ho agr aap macos me install kar rahe ho

so first of all hame brew tap redis wali line ko copy karke terminal me paste krke enter karna hai ye line Homebrew me  Redis ka official source add karegi,
aap jese aapke phone me naya app install krne ke liye phele app store download krte ho wese,

uske bad brew install --cask redis terminsl me paste krke etner krna hai
ye wali line redis ka GUI and pckage install kargei hamari sustem me

and then hame echo $PATH karke, ye check kran hai agr aap Apple silicon Macs use kr rahe ho to  /opt/homebrew/bin
aur agr app Intel Mac use kr rhe ho to /usr/local/bin  hamre output path me dikh raha hai
agr dikh rha hai to thik hai nahi to aapkko ye wala path ~/.bashrc or ~/.zshrc file me add karna padega based on your sheell

so me aapko add kr ke dikhata hu me path bashrc me add kr raha hu so nano ~/.bashrc copy karke file open krunga aur ye wala path add karke file ko save kar lunga
aur file save krne ke bad source ~/.bashrc
source bolata hai ki is configration file ko read karo aur apply karo

and then hame redis ko backgound me start krna hai so ye wali line redis ko background me start kr degi so ye wali line run krte hai terminal me

and last me hame check krna hai hamara redis installation complate huva hai so redis-cli karenge
usme hame ping karan hai
agr output pong mila means  redis successfully install  ho gaya hai

ye wali line hame redis ke all module output me dekhayegi
redis-cli MODULE LIST


how to uninstall redis ?
first hame redis shtdown karna hai  so line copy krke enter krnge terminal me
then hame uninstall krna hai redis pckage so
brew uninstall redis and then me  Redis ka official source  bhi remove kar rha hu homebrew mese
aur fir hame check kran hai redis.conf file still installed to nahi hai
agr ye line ka output aesa milta hai to aapko last wali line terminal me copy paste krke enter krna hai

please Like 👍, Share 🔁 aur Subscribe 🔔.


#redis install on docker
hello dosto
aaj ke video me ham dekhenge how to install redis on docker

so first open redis offical website go to docs then open redis producst click on redis open source
click on install and uograde and then install and upgrade me open link install redis open souce and then we are installed redis on docker
so open Run Redis Open Source on Docker link

run redis open souce on docker page me hame Terminal me ye command run krna hai,
Is command ka matlab hai
docker run matlbe container start karo
-d →hyphyen -d means background me run karo
--name redis means container ka naam redis
-p 6379:6379 bolta local port ko Redis port se connect
redis:<version> ye wala image version downlaod karo

me version latest rakhenga

and then hame Redis CLI se Connect Karna hai so
hamara redis docker me install hai isliye  ye walo command run kran hoga
docker exec -it redis redis-cli
docker exec matbl running container ke andar jao
-it mtlb interactive terminal provide karo
redis hameara container name
redis-cli redis client

redis cli me ping kran hai  pong mila means redis susccuefuly installed

Agar aapke system me redis-cli hai, to ye wale command se app directly terminal se connect kar sakte ho
$ redis-cli -h 127.0.0.1 -p 6379

By default, Redis Docker container internal configuration file use karta hai.
Lekin real projects me hame:
Memory limit set karni hoti hai
Password enable karna hota hai
Persistence change karni hoti hai

Isliye hume apna custom redis.conf use karna padta hai.

so ham apni custom redis.conf file banake dockerfile ke trough reids start krte hai
so first hame folder create karna hai redis-docker
so mkdir redis-foler, go to folder cd redis-docker,

is fodler me nano karke redis.conf file create krni hai jisme mene
bind 0.0.0.0 Redis sabhi network interfaces se aane wali requests accept karega
port 6379  Redis 6379 number ke port pe listen karega
protected-mode no matlb Redis external connections allow karega
appendonly yes
means redis har write operation disk me likhega, becasuse Redis me Data RAM me hota hai, to agr Redis restart then data lost,
mtlb Agar server restart ho gaya, Docker container crash ho gaya, ya machine reboot ho gayi
to data lost na ho isliye appendonly yes

aur fir create karni hai Dockerfile, dockerfile me ye content add kar raha.
FROM redis means Official Redis image use karo
COPY redis.conf mtlb Local config ko container ke andar copy karo
CMD means Redis ko custom config ke saath start karo
save file and exist

ab hame apni Docker Image Build Karni hai
docker build -t my-redis .
docker build means image create karo
-t my-redis → image ka naam
. → current folder context

docker images check image
so is wali image ke use krke hame container run karana hai

docker run -d --name redis-server -p 6379:6379 my-redis
aur ye command already hamne dekh liya hai only custom image change ki hai
so succfully haman container run ho gaya hai

docker ps karke check krte hai

docker ke under jake check karte hai
docker exec -it redis-server redis-cli

ping krenge pong response aagay so redis succfully installed

Ye method aap production setups me use kr sakte ho


Agar aap custom image or Dockerfile banana nahi chahte, to is command ka use kr skate ho
jisme aap directly local config file use kar sakte ho

docker run -v /myredis/conf:/usr/local/etc/redis --name myredis redis redis-server /usr/local/etc/redis/redis.conf

-v mtlb local folder ko container se connect karo
/myredis/conf ye hamaara local folder hai jisme redis.conf file hai
/usr/local/etc/redis → container ka config path

mkdir myredis
cd myredis
is fodler me nano karke redis.conf file create krni hai jisme mene
bind 0.0.0.0
port 6379
protected-mode no
appendonly yes


Agar Docker me Redis samajh aaya ho,
Like 👍, Share 🔁 aur Subscribe 🔔 zaroor karo.

👉 Is folder ke andar mene
  redis.conf
  Dockerfile create ki hai.
*/
