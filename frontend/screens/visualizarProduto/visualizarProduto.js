const { initializeDatabase, getProductById } = require("../../../database");

function handleDatabaseError(error) {
    console.error('Erro ao buscar registros:', error);
}

function getImageSrc(produto) {
    return produto.imagem
        ? `data:image/png;base64,${Buffer.from(produto.imagem).toString('base64')}`
        : null; 
}

function createDescription(produto) {
    document.getElementById("tituloProduto").textContent = produto.produto;
    document.getElementById("precoProduto").textContent = produto.preco;
    document.getElementById("descricaoProduto").textContent = produto.descricao;
    document.getElementById("imagemProduto").src = getImageSrc(produto);
}

async function startScreen() {
    try {
        await initializeDatabase();

        const productId = window.location.search.split("=")[1];
        const row = await getProductById(parseInt(productId.match(/\d+/g)[0]));
        createDescription(row); 
    } catch (error) {
        handleDatabaseError(error);
    }
}

window.onload = startScreen;
