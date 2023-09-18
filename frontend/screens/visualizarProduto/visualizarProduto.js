const {deleteProductById, getProductById} = require("../../../database");

function handleDatabaseError(error) {
    console.error('Erro ao buscar registros:', error);
}

function getImageSrc(produto) {
    return produto.imagem ? `data:image/png;base64,${
        Buffer.from(produto.imagem).toString('base64')
    }` : null;
}

function createDescription(produto) {
    const tituloProduto = document.getElementById("tituloProduto");
    const precoProduto = document.getElementById("precoProduto");
    const descricaoProduto = document.getElementById("descricaoProduto");
    const imagemProduto = document.getElementById("imagemProduto");

    tituloProduto.textContent = produto.produto;
    precoProduto.textContent = produto.preco;
    descricaoProduto.textContent = produto.descricao;
    imagemProduto.src = getImageSrc(produto);
}

function showPopup(display) {
    const popUp = document.getElementById("popUp");
    popUp.style.display = display;
}

async function startScreen() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (! productId) {
        console.error("O parâmetro 'id' não foi encontrado na URL.");
        return;
    }

    const botaoExcluir = document.getElementById("botao-excluir");
    const botaoEditar = document.getElementById("botao-editar");

    botaoExcluir.addEventListener("click", () => showPopup("block"));

    document.getElementById("btnSim").addEventListener("click", () => {
        deleteProductById(productId);
    });

    document.getElementById("btnCancelar").addEventListener("click", () => showPopup("none"));

    botaoEditar.addEventListener("click", () => {
        window.location.href = `../novoProduto/novoProduto.html?mode=Editar&id=${productId}`;
    });

    try {
        const row = await getProductById(parseInt(productId));
        createDescription(row);
    } catch (error) {
        handleDatabaseError(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("meusProdutos").addEventListener("click", () => {
        window.history.back();
    });
});

window.onload = startScreen;
