// Listar os livros na página principal
document.addEventListener('DOMContentLoaded', function () {
    const booksTableBody = document.querySelector('#booksTable tbody');
    let cont = 0;

    fetch('/livros')
        .then(response => response.json())
        .then(data => {
            data.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cont + 1}</td>
                    <td><a href="bookDetails.html?id=${book.id}">${book.titulo}</a></td>
                    <td>${book.autor}</td>
                    <td>${book.numeroPaginas}</td>
                    <td>${book.nota}</td>
                `;
                booksTableBody.appendChild(row);
                cont++;
            });
        })
        .catch(error => console.error('Erro ao carregar livros:', error));
});

// Adicionar um novo livro
if (document.getElementById('addBookForm')) {
    document.getElementById('addBookForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const bookData = {
            titulo: formData.get('titulo'),
            autor: formData.get('autor'),
            numeroPaginas: formData.get('numeroPaginas'),
            dataInicio: formData.get('dataInicio'),
            dataTermino: formData.get('dataTermino'),
            nota: formData.get('nota'),
            comentarios: formData.get('comentarios')
        };

        fetch('/livros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        })
        .then(response => response.json())
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch(error => console.error('Erro ao adicionar livro:', error));
    });
}

// Exibir detalhes do livro
if (window.location.pathname.includes('bookDetails.html')) {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');

    fetch(`/livros/${bookId}`)
        .then(response => response.json())
        .then(book => {
            const bookDetailsDiv = document.getElementById('bookDetails');
            bookDetailsDiv.innerHTML = `
                <p><strong>Título:</strong> ${book.titulo}</p>
                <p><strong>Autor:</strong> ${book.autor}</p>
                <p><strong>Número de Páginas:</strong> ${book.numeroPaginas}</p>
                <p><strong>Data de Início:</strong> ${book.dataInicio}</p>
                <p><strong>Data de Término:</strong> ${book.dataTermino}</p>
                <p><strong>Nota:</strong> ${book.nota}</p>
                <p><strong>Comentários:</strong> ${book.comentarios}</p>
            `;

            document.getElementById('editBookBtn').onclick = () => editBook(bookId);
            document.getElementById('deleteBookBtn').onclick = () => deleteBook(bookId);
        })
        .catch(error => console.error('Erro ao carregar detalhes do livro:', error));
}

// Editar um livro
function editBook(id) { 
   
}

// Deletar um livro
function deleteBook(id) {
    if (confirm('Você tem certeza que deseja deletar este livro?')) {
        fetch(`/livros/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch(error => console.error('Erro ao deletar livro:', error));
    }
}
