const express = require('express');
const sequelize = require('./config/database');
const methodOverride = require('method-override');


const app = express();
const port = 3000;

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));  // Isso permite usar _method para sobrepor métodos POST com PUT ou DELETE
app.use(express.urlencoded({ extended: true }));


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

app.use(express.json());

//Lista todos os livros
app.get('/', (req, res) => {
    res.redirect('/livros'); 
});

// Criar um novo livro
app.post('/livros', async (req, res) => {
    try {
        const livro = await Livro.create(req.body);
        res.redirect('/livros');  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Exibir o formulário para adicionar um livro
app.get('/livros/addBook', (req, res) => {
    res.render('addBook'); 
});


// Listar todos os livros
app.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.findAll(); 
        res.render('livros', { livros }); 
    } catch (error) {
        console.error('Erro ao carregar a lista de livros:', error);
        res.status(500).json({ error: 'Erro ao carregar a lista de livros.' });
    }
});


// Obter um livro específico
app.get('/livros/:id', async (req, res) => {
    try {
        const livro = await Livro.findByPk(req.params.id);
        if (livro) {
            res.render('bookDetails', { livro });
        } else {
            res.status(404).send('Livro não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao buscar o livro');
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
            res.redirect(`/livros/${updatedLivro.id}`);
        } else {
            res.status(404).json({ error: 'Livro não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Exibir o formulário de edição de livro
app.get('/livros/:id/editBook', async (req, res) => {
    try {
        const livro = await Livro.findByPk(req.params.id);
        if (livro) {
            res.render('editBook', { livro });
        } else {
            res.status(404).send('Livro não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao buscar livro');
    }
});

// Deletar um livro
app.delete('/livros/:id', async (req, res) => {
    try {
        const deleted = await Livro.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.redirect('/livros');
        } else {
            res.status(404).json({ error: 'Livro não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
