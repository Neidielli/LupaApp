const {getProductById, insertDatabase, updateProduct} = require("../../../database");
const fs = require('fs');

document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById("botao-cancelar").addEventListener("click", () => {
        document.getElementById("popUp").style.display = "block"
    })
    document.getElementById("btnSim").addEventListener("click", () => { 
        document.getElementById("meu-formulario").reset();
        window.history.back();
    })
    document.getElementById("btnCancelar").addEventListener("click", () => {
        document.getElementById("popUp").style.display = "none"
    })

    const form = document.getElementById("meu-formulario");
    const parametro = new URLSearchParams(window.location.search);
    const cadastrarButton = document.getElementById("botao-cadastrar");
    const produto = document.querySelector("#produto");
    const marca = document.querySelector("#marca");
    const preco = document.querySelector("#preco");
    const imagemInput = document.querySelector("#imagem");
    const descricao = document.querySelector("#descricao");

    const action = parametro.get("mode");
    cadastrarButton.textContent = action;

    const itemId = parametro.get("id");

    if (action === "Editar") {
        populateFormFields(itemId, produto, marca, preco, descricao);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        handleSubmit(action, itemId, produto, marca, preco, imagemInput, descricao);
    });
}

async function populateFormFields(itemId, produtoField, marcaField, precoField, descricaoField) {
    let produtoSelecionado = null;
    produtoSelecionado = await getProductById(parseInt(itemId));
    console.log(produtoSelecionado)
    if (produtoSelecionado) {
        produtoField.value = produtoSelecionado.produto;
        marcaField.value = produtoSelecionado.marca;
        precoField.value = produtoSelecionado.preco;
        descricaoField.value = produtoSelecionado.descricao;
    }
}

async function handleSubmit(action, itemId, produto, marca, preco, imagemInput, descricao) {
    const imagem = await getImageFromInput(imagemInput);

    if (action === 'Cadastrar') {
        insertDatabase(produto.value, marca.value, preco.value, imagem, descricao.value);
    } else {
        updateProduct(itemId, produto.value, marca.value, preco.value, imagem, descricao.value);
    }
}

async function getImageFromInput(inputElement) {
    if (inputElement.files.length > 0) {
        const imagePath = inputElement.files[0].path;
        return fs.promises.readFile(imagePath);
    }
    return null;
}

document.addEventListener("DOMContentLoaded", initializeForm);
