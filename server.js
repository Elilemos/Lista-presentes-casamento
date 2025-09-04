const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(express.static('public')); 

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado ao banco de dados.');
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS gifts (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT NOT NULL,
            status TEXT DEFAULT 'available',
            guest_name TEXT,
            guest_phone TEXT
        )
    `);

    db.run("DELETE FROM gifts"); 

    const gifts = [
        { name: "Air fryer", price: 0.00, image: "img/Air fryer.jpg" },
        { name: "Ajude os noivos com a lua de mel", price: 800.00, image: "img/Ajude os noivos com a lua de mel.jpg" },
        { name: "Aparelho De Jantar", price: 0.00, image: "img/APARELHO DE JANTAR.jpg" },
        { name: "Ar-condicionado", price: 0.00, image: "img/Ar Condicionado.jpg" },
        { name: "Armário de Cozinha", price: 0.00, image: "img/Armário de Cozinha Completa Suspenso 300cm Cinza Nice Madesa 07 - CINZA 1699,99.jpg" },
        { name: "Armário Multiuso Lavanderia", price: 0.00, image: "img/Armário Multiuso Lavanderia.jpg" },
        { name: "Aspirador de Pó Vertical", price: 0.00, image: "img/Aspirador de pó.jpg" },
        { name: "Batedeira", price: 0.00, image: "img/Batedeira Mondial Portátil preta - 115,00.jpg" },
        { name: "Bancada para cooktop", price: 0.00, image: "img/Bancada-para-cooktop.jpg" },
        { name: "Bebedouro", price: 0.00, image: "img/Bebedouro.jpg" },
        { name: "Cama Queen", price: 0.00, image: "img/Cama Box Colchão Tamanho Queen.jpg" },
        { name: "Chapa Grill", price: 0.00, image: "img/Chapa Grill para Fogão e Indução, Preto - 195,00.jpg" },
        { name: "Cobre Leito", price: 0.00, image: "img/Cobre Leito Cama Queen.jpg" },
        { name: "Conjunto de assadeiras Marinex", price: 0.00, image: "img/Conjunto de assadeiras Marinex.jpg" },
        { name: "Conjunto de faca inox", price: 0.00, image: "img/Conjunto de faca inox.jpg" },
        { name: "Conjunto para Banheiro", price: 0.00, image: "img/Conjunto para Banheiro.jpg" },
        { name: "Forno Elétrico", price: 0.00, image: "img/FORNO ELÉTRICO - PRETO.jpg" },
        { name: "Frigideira Indução", price: 0.00, image: "img/Frigideira Indução.jpg" },
        { name: "Garrafa de Café", price: 0.00, image: "img/GARRAFA DE CAFÉ - PRETA - 105,00.jpg" },
        { name: "Geladeira Brastemp", price: 0.00, image: "img/Geladeira Brastemp Frost Free Inverse A+++ 479 litros - CINZA OU PRETA 4.090,00.jpg" },
        { name: "Jogo de Xícaras", price: 0.00, image: "img/Jogo 6 Xicaras Cafe-Chá.jpg" },
        { name: "Jogo de Assadeiras", price: 0.00, image: "img/Jogo de Assadeiras Vidro com Tampa - Cor Cinza.jpg" },
        { name: "Jogo de Toalhas", price: 0.00, image: "img/Jogo De Toalhas Banhão - Tons Escuros.jpg" },
        { name: "Jogo de copo oval", price: 0.00, image: "img/jogo-de-copo-oval.jpg" },
        { name: "Jogo de Pratos", price: 0.00, image: "img/Jogo-de-pratos.jpg" },
        { name: "Kit 1 Cobre Leito", price: 0.00, image: "img/Kit 1 Cobre-leito Queen - Tons Escuros.jpg" },
        { name: "Kit 2 cobertores", price: 0.00, image: "img/Kit 2 cobertores.jpg" },
        { name: "Kit 2 mesas de cabeceira", price: 0.00, image: "img/Kit 2 mesas de cabeceira.jpg" },
        { name: "Kit 2 Travesseiros", price: 0.00, image: "img/Kit 2 travesseiros.jpg" },
        { name: "Kit Cobre Leito Colcha Queen 3 Peças", price: 0.00, image: "img/Kit Cobre Leito Colcha Queen 3Pç.jpg" },
        { name: "Kit 4 Toalhas", price: 0.00, image: "img/Kit Com 4 Toalhas Banhão Gigante.jpg" },
        { name: "Kit Utensílios", price: 0.00, image: "img/KIT DE UTENSÍLIOS - PRETO OU CINZA.jpg" },
        { name: "Kit Faqueiro", price: 0.00, image: "img/Kit Faqueiro Tramontina - 20 peças.jpg" },
        { name: "Kit Potes", price: 0.00, image: "img/Kit Potes Herméticos - Vidro Com Tampa De Bambu.jpg" },
        { name: "Kit Travessa", price: 0.00, image: "img/Kit Travessa De Vidro Branca.jpg" },
        { name: "Kit Travessseiros", price: 0.00, image: "img/Kit Travesseiros.jpg" },
        { name: "Kit Pote Hermético", price: 0.00, image: "img/Kit-Pote-Hermético.jpg" },
        { name: "Lava e Seca", price: 0.00, image: "img/Lava e Seca EOS 10,1kg Power Wash Titanium ELR2107LST 220V PRETA OU CINZA - 2699,00.jpg" },
        { name: "Liquidificador", price: 0.00, image: "img/Liquidificador.jpg" },
        { name: "Manta Queen", price: 0.00, image: "img/Manta queen - Tons Escuros.jpg" },
        { name: "Manta Queen", price: 0.00, image: "img/Mantas De Casal - Queen (Tons Escuros).jpg" },
        { name: "Mesa de Jantar", price: 0.00, image: "img/Mesa de Jantar Retangular Iluminata Com 4 cadeiras Cinzas - 830,00.jpg" },
        { name: "Micro-ondas", price: 0.00, image: "img/Micro-ondas Philco 25 Litros Espelhado - PRETOP OU CINZA - 617,50.jpg" },
        { name: "Multiprocessador", price: 0.00, image: "img/Multiprocessador.jpg" },
        { name: "Painel de TV", price: 0.00, image: "img/Painel para TV Jade Caemmun 1,20 - Marrom - 350,00.jpg" },
        { name: "Panela de Pressão Elétrica", price: 0.00, image: "img/Panela de Pressão Elétrica 5 Litros EOS Multicooker Digital Inox Preto - 350,00.jpg" },
        { name: "Panela de Pressão", price: 0.00, image: "img/Panela de Pressão.jpg" },
        { name: "Panela Polishop", price: 0.00, image: "img/Panela Polishop Ichef 24cm - 180,00.jpg" },
        { name: "Jogo de Pratos", price: 0.00, image: "img/Pratos.jpg" },
        { name: "Rede", price: 0.00, image: "img/Rede de Dormir Casal - TONS ESCUROS.jpg" },
        { name: "Sanduicheira e Grill", price: 0.00, image: "img/Sanduicheira e Grill.jpg" },
        { name: "Sofá", price: 0.00, image: "img/Sofá Cama Retrátil e Reclinável Fênix de 1,80m - CINZA.jpg" },
        { name: "Tábua Para Passar Roupa", price: 0.00, image: "img/Tabua Para Passar Roupa Com Organizador.jpg" },
        { name: "Toalhas", price: 0.00, image: "img/Toalhas Banhão Grande - Tons Escuros.jpg" },
        { name: "Utensílios", price: 0.00, image: "img/utensílios-completo.jpg" },
        { name: "Vozão Fem P", price: 0.00, image: "img/Vozão Fem P.jpg" },
        { name: "Vozão Masc M", price: 0.00, image: "img/Vozão Masc M.jpg" },
    ];
    
    const stmt = db.prepare("INSERT INTO gifts (name, price, image) VALUES (?, ?, ?)");
    gifts.forEach(gift => {
        stmt.run(gift.name, gift.price, gift.image); 
    });
    stmt.finalize();

    console.log('Presentes adicionados ao banco de dados.');
});

app.get('/api/gifts', (req, res) => {
    db.all("SELECT id, name, image FROM gifts WHERE status = 'available'", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

app.post('/api/present', (req, res) => {
    const { id, guest_name, guest_phone } = req.body;
    console.log(`Dados recebidos para a reserva: ID=${id}, Nome=${guest_name}, Telefone=${guest_phone}`);
    db.run(
        `UPDATE gifts SET status = 'given', guest_name = ?, guest_phone = ? WHERE id = ?`,
        [guest_name, guest_phone, id],
        function (err) {
            if (err) {
                console.error("Erro no banco de dados:", err.message);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: "Presente reservado com sucesso!" });
        }
    );
});

app.get('/present/:id', (req, res) => {
    const giftId = req.params.id;
    res.sendFile(path.join(__dirname, 'public', 'present.html'));
});

app.get('/api/given-gifts', (req, res) => {
    db.all("SELECT * FROM gifts WHERE status = 'given'", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

app.post('/api/unreserve-gift', (req, res) => {
    const { id } = req.body;
    db.run(
        `UPDATE gifts SET status = 'available', guest_name = NULL, guest_phone = NULL WHERE id =?`,
        [id],
        function (err) {
            if (err) {
                res.status(500).json({error});
                return
            }
            res.json({ message: "Presente devolvido à lista!"});
        }
    );
});

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