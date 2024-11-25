const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const port = 3000;

// Ajouter les en-têtes CORS
app.use(cors({
    origin: 'http://localhost:5173', // Autoriser cette origine
    methods: ['GET', 'POST'],       // Autoriser ces méthodes
}));

// Serveur HTTP pour l'application React
app.use(express.static('public'));

// Serveur WebSocket
const wss = new WebSocket.Server({
    noServer: true,
    maxPayload: Number.MAX_SAFE_INTEGER,
});

// Gestion des connexions WebSocket
wss.on('connection', (ws) => {
    console.log('Client connecté');

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        console.log('Message reçu:', parsedMessage);

        // Si le message est une offre ou une réponse (WebRTC)
        if (parsedMessage.type === 'offer' || parsedMessage.type === 'answer') {
            // Diffuser l'offre ou la réponse à l'autre client
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(parsedMessage));
                }
            });
        }

        // Si le message est un ICE candidate (WebRTC)
        if (parsedMessage.type === 'candidate') {
            // Diffuser le candidat ICE aux autres clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(parsedMessage));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client déconnecté');
    });
});

// Lier le serveur HTTP et WebSocket
const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
