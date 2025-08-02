// server.js

// 1. Impor modul yang diperlukan
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// 2. Inisialisasi aplikasi Express
const app = express();
const port = 3000;

// 3. Konfigurasi middleware
app.use(cors()); // Mengizinkan permintaan dari domain lain (frontend)
app.use(express.json()); // Mem-parsing body permintaan dalam format JSON

// 4. Konfigurasi koneksi database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Ganti dengan username database 
    password: '',      // Ganti dengan password database
    database: 'todolist' // Nama database yang telah dibuat tadi
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Successfully connected to database.');
});

// 5. Membuat Rute API (API Routes)

// GET/read: Mengambil semua tugas
app.get('/tugas', (req, res) => {
    const sql = 'SELECT * FROM tugas ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// POST/create: Menambah tugas baru
app.post('/tugas', (req, res) => {
    const { judul } = req.body;
    if (!judul) {
        return res.status(400).send('Title is required');
    }
    const sql = 'INSERT INTO tugas (judul) VALUES (?)';
    db.query(sql, [judul], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        // Mengirim kembali data yang baru dibuat
        res.status(201).json({ No: result.insertNo, judul, is_completed: false });
    });
});

// PUT/update: Memperbarui status tugas (selesai/belum selesai)
app.put('/tugas/:No', (req, res) => {
    const { No } = req.params;
    const { is_completed } = req.body;
    const sql = 'UPDATE tugas SET is_completed = ? WHERE No = ?';
    db.query(sql, [is_completed, No], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Task not found');
        }
        res.send('Task updated successfully');
    });
});

// DELETE/delete: Menghapus tugas
app.delete('/tugas/:No', (req, res) => {
    const { No } = req.params;
    const sql = 'DELETE FROM tugas WHERE No = ?';
    db.query(sql, [No], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Task not found');
        }
        res.send('Task deleted successfully');
    });
});

// 6. Menjalankan server
app.listen(port, () => {
    console.log(`🚀 Server backend berjalan di http://localhost:${port}`);
});