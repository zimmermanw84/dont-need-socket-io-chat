# dont-need-socket-io-chat

Just playing around with websockets using Node.js.  

Warning: Not production ready

You can use the dirty client if you like or something like or [Simple WebSocket Client](https://chrome.google.com/webstore/detail/simple-websocket-client/pfdhoblngboilpfeibdedpjgfnlcodoo?hl=en) for Chrome and if you're hooked up to a Wifi (or any) network you can have someone host the server and use the host's IP address to connect i.e.  

If you are the host.
```
ws://localhost:4000
```

If someone else is the host.
```
ws://<SOME_IP_ADDRESS_ON_THE_NETWORK_RUNNING_THIS_SERVER>:4000
```

Port 4000 only because it's the default port.
