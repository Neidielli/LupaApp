const { initializeDatabase, getProductById } = require("../../../database");

document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById("meusProdutos").addEventListener("click", () => {
        window.history.back();
    })
})
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
        initializeDatabase();

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get("id");
        console.log(urlParams)
        console.log(productId)
        
        document.getElementById("botao-editar").addEventListener("click", () => {
            window.location.href = `../novoProduto/novoProduto.html?mode=Editar&id=${productId}`;
        });

        if (!productId) {
            console.error("O parâmetro 'id' não foi encontrado na URL.");
            return;
        }

        const row = await getProductById(parseInt(productId));
        createDescription(row);
    } catch (error) {
        handleDatabaseError(error);
    }
}


window.onload = startScreen;
