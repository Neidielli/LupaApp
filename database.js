const sqlite3 = require('sqlite3').verbose();

let db;

function initializeDatabase() {
    db = new sqlite3.Database('seu-banco-de-dados.db', (err) => {
        if (err) {
            console.error('Erro ao criar o banco de dados', err.message);
        } else {
            console.log('Banco de dados criado com sucesso.');
            createTable();
        }
    });
}

function createTable() {
    db.run(`CREATE TABLE IF NOT EXISTS sua_tabela (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto TEXT,
        marca TEXT,
        preco REAL,
        descricao TEXT,
        imagem BLOB
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar a tabela', err.message);
        } else {
            console.log('Tabela criada com sucesso.');
        }
    });
}

function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar o banco de dados', err.message);
        }
    });
}

function insertDatabase(produto, marca, preco, imagem, descricao) {
    initializeDatabase()
    const sql = `INSERT INTO sua_tabela (produto, marca, preco, descricao, imagem) VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [produto, marca, preco, descricao, imagem], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Registro inserido com sucesso, ID: ${this.lastID}`);
    });
}

function getDatabase() {
    const sql = `SELECT * FROM sua_tabela`;

    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err.message);
            }
            resolve(rows);
        });
    });
}

function getProductById(productId) {
    const sql = `SELECT * FROM sua_tabela WHERE id = ?`;

    return new Promise((resolve, reject) => {
        db.get(sql, [productId], (err, row) => {
            if (err) {
                
                reject(err.message);
            }
            resolve(row);
        });
    });
}

module.exports = {
    initializeDatabase,
    closeDatabase,
    insertDatabase,
    getDatabase,
    getProductById
};
