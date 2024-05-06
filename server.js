const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new WebSocket.Server({ server });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'); // Substitui caracteres especiais por sublinhados
        cb(null, safeName);
    }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(express.static('public'));

let messages = JSON.parse(fs.readFileSync('messages.json', 'utf8'));

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify([data])); // Envia mensagem como array
        }
    });
}

wss.on('connection', (ws) => {
    ws.send(JSON.stringify(messages)); // Envia mensagens existentes ao conectar

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
    broadcast(message); // Atualiza todos os clientes
    res.json({ filePath: `/uploads/${file.filename}` });
});
