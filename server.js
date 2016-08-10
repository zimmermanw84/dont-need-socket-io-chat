//  WebSocket Test Server
//  ./server.js
//
//  Created by Walt Zimmerman on 8/10/16.
//
"use strict";

const http = require('http');

// Http Server
const httpServer = http.createServer();
// WebSocketServer
const WebSocketServer = require('websocket').server;
// Listen on PORT
const PORT = process.env.PORT || 4000;
// Connection specific
let activeConnections = 0;
// Connection map
const clients = {};

// Spin up HTTP server
httpServer.listen(PORT, () => {
	// Not really a WebSocket server yet, it's more to show the app is running
	console.log(`WebSocket Test Server Listening on port ${PORT}`);
});

// Attach HTTP server to WebSocket Server
const wsServer = new WebSocketServer({ httpServer });

// Helpers // 
// Later I'll put some logic in here
const isAcceptedOrigin = (origin) => { return true; };

// broadcast to all clients
const broadcast = (msg) => {
	for (let id in clients) clients[id].sendUTF(msg);
};

// Handlers //

// Request
wsServer.on('request', (request) => {
	// Check origin
	// NOTE: This is for fun and NOT production ready however good practice
	if(!isAcceptedOrigin(request.origin)) {
		// No soup for you
		request.reject();
		console.log(`${new Date} Connection rejected from origin ${connection.origin}`);
		return;
	}
	// Connection
	const connection = request.accept(null, request.origin);
	// Client Id
	let clientId = ++activeConnections;
	// Cache client
	clients[clientId] = connection;

	// Emit message to all clients
	broadcast(`Client ${clientId}: has joined the channel`);

	// Log connection
	console.log(`${new Date} Connection accepted ${connection.remoteAddress}`);

	// Message
	connection.on('message', (message) => {
		broadcast(`Client ${clientId}: ${message.utf8Data}`);
	});

	// Close
	connection.on('close', (code, description) => {
		broadcast(`Client ${clientId}: has disconnected`);
		// Remove Client Connection
		delete clients[clientId];
		// Log Info
		console.log(`${new Date} Connection ${connection.remoteAddress} disconnected`);
	});
});
