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

// Helper - Later I'll put some logic in here
const isAcceptedOrigin = (origin) => { return true; };

// Handlers //

// Request
wsServer.on('request', (request) => {
	// Check origin
	// NOTE: This is for fun and NOT production ready however good practice
	if(isAcceptedOrigin(request.origin)) {
		// Connection
		const connection = request.accept(null, request.origin);
		// Client Id
		let clientId = ++activeConnections;
		// Cache client
		clients[clientId] = connection;
		// Use UTF8 encoded message
		const joinMsg = `Client_ID: ${clientId} has joined the channel`;
		// Emit message to all clients
		for (let id in clients) clients[id].sendUTF(joinMsg);
		// Log connection
		console.log(`${new Date} Connection accepted ${connection.remoteAddress}`);

		// Message
		connection.on('message', (message) => {
			// Use UTF8 encoded message
			const msg = `Client_ID: ${clientId} ${message.utf8Data}`;

			// Emit message to all clients
			for (let id in clients) clients[id].sendUTF(msg);
		});

		// Close
		connection.on('close', (code, description) => {
			const disconnectMsg = `Client_ID: ${clientId} has disconnected`;
			for (let id in clients) clients[id].sendUTF(disconnectMsg);

			delete clients[clientId];
			console.log(`${new Date} Connection ${connection.remoteAddress} disconnected`);
		});

	} else {
		// Reject response
	}
});
