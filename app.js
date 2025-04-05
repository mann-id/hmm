const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const API_KEY = "apikey-kamu";

app.use(express.json());

app.post('/tambah-data', (req, res) => {
    const key = req.headers['x-api-key'];
    if (key !== 'kucinghitam') {
        return res.status(403).json({ message: 'API Key tidak valid' });
    }

    const { username, password, nomor_bot, nomor_owner, nama_owner, IP } = req.body;

    if (!username || !password || !nomor_bot || !nomor_owner || !nama_owner || !IP) {
        return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const dataBaru = { username, password, nomor_bot, nomor_owner, nama_owner, IP };

    let data = [];
    if (fs.existsSync('data.json')) {
        data = JSON.parse(fs.readFileSync('data.json'));
    }
    data.push(dataBaru);
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

    res.json({ message: 'Data berhasil ditambahkan' });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});