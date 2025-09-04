const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/api/gifts', async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, price, image FROM gifts WHERE status = 'available'");
        res.json({
            message: "success",
            data: result.rows
        });
    } catch (err) {
        console.error('Erro ao buscar presentes:', err);
        res.status(500).json({ error: 'Erro ao buscar presentes.' });
    }
});

app.get('/api/gift/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM gifts WHERE id = $1", [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Presente não encontrado.' });
        }
    } catch (err) {
        console.error('Erro ao buscar presente:', err);
        res.status(500).json({ error: 'Erro ao buscar presente.' });
    }
});

app.post('/api/reserve-gift', async (req, res) => {
    const { id, guest_name, guest_phone } = req.body;
    try {
        const result = await pool.query(
            "UPDATE gifts SET status = 'reserved', guest_name = $1, guest_phone = $2 WHERE id = $3 AND status = 'available' RETURNING *",
            [guest_name, guest_phone, id]
        );
        if (result.rowCount > 0) {
            res.json({
                message: "success",
                data: result.rows[0]
            });
        } else {
            res.status(409).json({ error: "O presente já foi reservado." });
        }
    } catch (err) {
        console.error('Erro ao reservar presente:', err);
        res.status(500).json({ error: "Erro ao reservar presente." });
    }
});

app.post('/api/unreserve-gift', async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query(
            "UPDATE gifts SET status = 'available', guest_name = NULL, guest_phone = NULL WHERE id = $1",
            [id]
        );
        res.json({ message: "Presente devolvido à lista!" });
    } catch (err) {
        console.error('Erro ao devolver presente:', err);
        res.status(500).json({ error: "Erro ao devolver presente." });
    }
});

app.get('/api/given-gifts', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM gifts WHERE status = 'reserved'");
        res.json({
            message: "success",
            data: result.rows
        });
    } catch (err) {
        console.error('Erro ao buscar presentes reservados:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/present/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'present.html'));
});

app.get('/reservados', (req, res) => {
    const senha = req.query.senha;
    if (senha === 'minhasenha123') {
        res.sendFile(path.join(__dirname, 'public', 'reservados.html'));
    } else {
        res.status(403).send('Acesso negado! Informe a senha correta.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});