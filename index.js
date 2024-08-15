const express = require('express');
const sequelize = require('./config/database');

const app = express();
const port = 3000;

const path = require('path');

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Testando a conexão
sequelize.authenticate()
    .then(() => {
        console.log('Conectado ao banco de dados com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

const Livro = require('./models/Livro');

// Sincronizar o modelo com o banco de dados
sequelize.sync()
    .then(() => {
        console.log('Modelos sincronizados com o banco de dados!');
    })
    .catch(err => {
        console.error('Erro ao sincronizar os modelos:', err);
    });

app.use(express.json()); // Middleware para parsear JSON no corpo das requisições

// Criar um novo livro
app.post('/livros', async (req, res) => {
    try {
        const livro = await Livro.create(req.body);
        res.status(201).json(livro);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todos os livros
app.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.findAll();
        res.status(200).json(livros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter um livro específico
app.get('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findByPk(req.params.id);
        if (livro) {
            res.status(200).json(livro);
        } else {
            res.status(404).json({ error: 'Livro não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar um livro
app.put('/livros/:id', async (req, res) => {
    try {
        const [updated] = await Livro.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedLivro = await Livro.findByPk(req.params.id);
            res.status(200).json(updatedLivro);
        } else {
            res.status(404).json({ error: 'Livro não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Deletar um livro
app.delete('/livros/:id', async (req, res) => {
    try {
        const deleted = await Livro.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Livro não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
