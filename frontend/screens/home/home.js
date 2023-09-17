const { initializeDatabase, getDatabase } = require("../../../database");

function getImageSrc(produto) {
    return produto.imagem
        ? `data:image/png;base64,${Buffer.from(produto.imagem).toString('base64')}`
        : 'path/to/default-image.png'; // Replace with the desired path to the default image
}

function createCardHTML(produto) {
    const imageSrc = getImageSrc(produto);

    return `
        <div class="itemProdutos" onclick="window.location.href='../visualizarProduto/visualizarProduto.html?id=${produto.id}}';">
            <h1>${produto.produto}</h1>
            <button>${produto.preco}</button>
            <img src="${imageSrc}" width="175" height="150">
        </div>
    `;
}

function createCards(produtos) {
    const cardHTML = produtos.map(createCardHTML).join('');
    document.getElementById("CardProdutos").innerHTML = cardHTML;
}

function handleDatabaseError(error) {
    console.error('Erro ao buscar registros:', error);
}

async function startScreen() {
    try {
        initializeDatabase();
        const rows = await getDatabase();
        if (rows && rows.length > 0) {
            createCards(rows);
        }
    } catch (error) {
        handleDatabaseError(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("pesquisar").addEventListener("click", startScreen);
});

window.onload = startScreen;