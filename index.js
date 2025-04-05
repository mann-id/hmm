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

app.post('/hapus-data', (req, res) => {
    const key = req.headers['x-api-key'];
    if (key !== API_KEY) {
        return res.status(403).json({ message: 'API Key tidak valid' });
    }

    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ message: 'Username diperlukan untuk menghapus data' });
    }

    if (!fs.existsSync('data.json')) {
        return res.status(404).json({ message: 'File data tidak ditemukan' });
    }

    let data = JSON.parse(fs.readFileSync('data.json'));

    const dataAwal = data.length;
    data = data.filter(item => item.username !== username);
    const dataAkhir = data.length;

    if (dataAwal === dataAkhir) {
        return res.status(404).json({ message: 'Data dengan username tersebut tidak ditemukan' });
    }

    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    res.json({ message: `Data dengan username "${username}" berhasil dihapus` });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
