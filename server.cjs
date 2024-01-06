const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { Framework } = require('@vechain/connex-framework');
const { Driver, SimpleNet } = require('@vechain/connex-driver');

const app = express();
const port = process.env.PORT || 3000;

// SSL certificate options
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/apps.smuzzies.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/apps.smuzzies.com/fullchain.pem')
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create a Connex instance and connect to a VeChain node
const connectToVeChain = async () => {
    const net = new SimpleNet('https://sync-testnet.vechain.org/'); // Replace with your VeChain node URL
    const driver = await Driver.connect(net);
    const connex = new Framework(driver);
    
    // Now you have a ready-to-use Connex instance (connex) to interact with VeChain
    return connex;
};

app.get('/connect-vechain', async (req, res) => {
    try {
        const connex = await connectToVeChain();
        // Use the 'connex' instance to interact with the VeChain blockchain
        res.json({ message: 'Connected to VeChain blockchain' });
    } catch (error) {
        console.error("Error connecting to VeChain:", error);
        res.status(500).json({ error: 'Error connecting to VeChain blockchain' });
    }
});

const server = https.createServer(options, app);

server.listen(port, '0.0.0.0', () => {
    console.log(`ParaShoot app is running on port ${port}`);
});
