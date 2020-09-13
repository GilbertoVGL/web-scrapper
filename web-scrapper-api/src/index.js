const express = require('express');
const cors = require('cors');
const cron = require("node-cron");

const app = express();
const router = express.Router();
const port = 3000;

app.use(cors({ origin: true }));
app.use(express.json());

const endpoints = require('./endpoints');
const realtyScrapperEndpoint = new endpoints.RealtyScrapperEndpoint();

app.get('/scrap', realtyScrapperEndpoint.get);

const server = app.listen(port, () => {
    console.log('Server ready http://localhost:', port);
    console.log('Process ', process.pid);
});

cron.schedule("0 0 * * *", () => console.log("Executando a tarefa a cada 1 minuto"));

function handleSignal() {
    console.log('SIGNAL RECEIVED');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
}

process.on('SIGTERM', handleSignal);
process.on('SIGKILL', handleSignal);
