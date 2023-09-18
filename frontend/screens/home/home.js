const {getProductByMarca, getProductByNameAndMarca} = require("../../../database");

function getImageSrc(produto) {
    return produto.imagem ? `data:image/png;base64,${
        Buffer.from(produto.imagem).toString('base64')
    }` : 'path/to/default-image.png'; // Replace with the desired path to the default image
}

function createCardHTML(produto) {
    const imageSrc = getImageSrc(produto);

    return `
        <div class="itemProdutos" onclick="window.location.href='../visualizarProduto/visualizarProduto.html?id=${
        produto.id
    }';">
            <h1>${
        produto.produto
    }</h1>
    <button>R$ ${
        produto.preco
    }</button>
            <img src="${imageSrc}" width="175" height="150">
        </div>
    `;
}

function createCards(produtos) {
    const cardHTML = produtos.map(createCardHTML).join('');
    document.getElementById("CardProdutos").innerHTML = cardHTML;
}

async function performSearch() {
    const searchInput = document.getElementById("pesquisa");
    const searchTerm = searchInput.value;
    const marca = window.location.search.split("=")[1].replace("%20", " ")

    try {
        const rows = await getProductByNameAndMarca(searchTerm, marca);
        console.log(rows)
        if (rows && rows.length >= 0) {
            createCards(rows);
        }
    } catch (error) {
        handleDatabaseError(error);
    }
}

function handleDatabaseError(error) {
    console.error('Erro ao buscar registros:', error);
}

async function startScreen() {
    const marca = window.location.search.split("=")[1].replace("%20", " ")
    try {
        const rows = await getProductByMarca(marca);
        if (rows && rows.length > 0) {
            createCards(rows);
        }
    } catch (error) {
        handleDatabaseError(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("pesquisar").addEventListener("click", performSearch);
    document.getElementById("pesquisa").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });

});

window.onload = startScreen;
