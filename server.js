const express = require('express');
const path = require('path');
const cors = require('cors');

const { Pool } = require('pg');
const { error } = require('console');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public')); 

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});    

app.get('/api/gifts', async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, image FROM gifts WHERE status = 'available'");
        res.json({
            message: "success",
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/present', async (req, res) => {
    const { id, guest_name, guest_phone } = req.body;
    try {
        const result = await pool.query(
            `UPDATE gifts SET status = 'given', guest_name = $1, guest_phone = $2 WHERE id = $3 RETURNING *`,
            [guest_name, guest_phone, id]
        );
        res.json({ message: "Presente reservado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/present/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'present.html'));
});

app.get('/api/given-gifts', async (req, res) => {
try {
        const result = await pool.query("SELECT * FROM gifts WHERE status = 'given'");
        res.json({
            message: "success",
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }});

app.post('/api/unreserve-gift', async (req, res) => {
const { id } = req.body;
    try {
        await pool.query(
            `UPDATE gifts SET status = 'available', guest_name = NULL, guest_phone = NULL WHERE id = $1`,
            [id]
        );
        res.json({ message: "Presente devolvido à lista!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }});

app.get('/reservados', (req, res) => {
    const senha = req.query.senha;
    if (senha === 'minhasenha123') {
        res.sendFile(path.join(__dirname, 'public', 'reservados.html'));
    } else {
        res.status(403).send('Acesso negado! Informe a senha correta.');
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});