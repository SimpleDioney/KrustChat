const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)){
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, safeName);
    }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(express.static('public'));

let messages = [];

// Função para carregar mensagens de um arquivo
const loadMessages = () => {
    try {
        messages = JSON.parse(fs.readFileSync('messages.json', 'utf8'));
    } catch (err) {
        messages = [];
    }
};

// Inicializa mensagens
loadMessages();

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify([data]));
        }
    });
}

const server = app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.send(JSON.stringify(messages));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        messages.push(data);
        fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
        broadcast(data);
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const { file } = req;
    const type = /\.(jpg|jpeg|png|gif|bmp)$/i.test(file.originalname) ? "image" : "file";
    const message = { name: req.body.name, message: `/uploads/${file.filename}`, caption: req.body.caption, type };

    messages.push(message);
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
    broadcast(message);
    res.json({ filePath: `/uploads/${file.filename}` });
});

module.exports = app; // Exporta o app para Vercel
