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

function deleteProductById(productId) {
    initializeDatabase();
    const sql = `DELETE FROM sua_tabela WHERE id = ?`;

    db.run(sql, [productId], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Registro apagado com sucesso, ID: ${productId}`);
    });
}

function updateProduct(id, produto, marca, preco, imagem, descricao) {
    initializeDatabase();
    let sql = `UPDATE sua_tabela 
               SET produto = ?, marca = ?, preco = ?, descricao = ? 
               WHERE id = ?`;
    let params = [produto, marca, preco, descricao, id];

    if (imagem !== null && imagem !== '') {
        sql = `UPDATE sua_tabela 
               SET produto = ?, marca = ?, preco = ?, imagem = ?, descricao = ? 
               WHERE id = ?`;
        params.splice(3, 0, imagem); 
    }

    db.run(sql, params, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Registro atualizado com sucesso, ID: ${id}`);
    });
}

function getProductByMarca(productMarca) {
    initializeDatabase();
    const sql = "SELECT * FROM sua_tabela WHERE marca = ?";

    return new Promise((resolve, reject) => {
        db.all(sql, [productMarca], (err, rows) => {
            if (err) {
                reject(err.message);
            }
            resolve(rows);
        });
    });
}

function getProductById(productId) {
    initializeDatabase()
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

function getProductByNameAndMarca(productName, productMarca) {
    initializeDatabase();
    const sql = "SELECT * FROM sua_tabela WHERE produto LIKE ? AND marca = ?";

    return new Promise((resolve, reject) => {
        db.all(sql, [`%${productName}%`, productMarca], (err, rows) => {
            if (err) {
                reject(err.message);
            }
            resolve(rows);
        });
    });
}

function getAllProducts() {
    initializeDatabase();
    const sql = "SELECT * FROM sua_tabela ORDER BY marca ASC";

    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err.message);
            }
            resolve(rows);
        });
    });
}

module.exports = {
    closeDatabase,
    deleteProductById,
    getAllProducts,
    getProductById,
    getProductByNameAndMarca,
    getProductByMarca,
    initializeDatabase,
    insertDatabase,
    updateProduct
};
