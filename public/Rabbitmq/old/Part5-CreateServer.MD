Now Lets Create a very basic Web server.

Replace your code with this

```
const http = require('http');

const server = http.createServer((req,res)=>{
    res.write(" Hello From Feel! Please Like and Subscribe Our Youtube Channel!")
    res.end();
});

server.listen(3000,()=>{
    console.log("Server running on port 3000")
});

```

Now run on Terminal:

```
Node server.js
```