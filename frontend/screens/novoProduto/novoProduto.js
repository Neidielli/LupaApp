const {getProductById, insertDatabase, updateProduct} = require("../../../database");
const fs = require('fs');

function validatePriceInput(input) {
    // Remove caracteres que não são números, pontos ou vírgulas
    input.value = input.value.replace(/[^0-9.,]/g, '');
}

function initializeForm() {
    const form = document.getElementById("meu-formulario");
    const parametro = new URLSearchParams(window.location.search);
    const cadastrarButton = document.getElementById("botao-cadastrar");
    const produto = document.querySelector("#produto");
    const marca = document.querySelector("#marca");
    const preco = document.querySelector("#preco");
    const imagemInput = document.querySelector("#imagem");
    const descricao = document.querySelector("#descricao");
    const cancelButton = document.getElementById("botao-cancelar");
    const popup = document.getElementById("popUp");
    const confirmButton = document.getElementById("btnSim");
    const cancelButtonPopup = document.getElementById("btnCancelar");

    cancelButton.addEventListener("click", () => {
        popup.style.display = "block";
        document.getElementById("popUpOK").style.display = "none";
    });

    confirmButton.addEventListener("click", () => {
        form.reset();
        window.history.back();
    });

    cancelButtonPopup.addEventListener("click", () => {
        popup.style.display = "none";
    });

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
        try {
            await insertDatabase(produto.value, marca.value, preco.value, imagem, descricao.value);
            document.getElementById("popUpOK").style.display = "block";
        } catch (error) {
            console.error('Erro ao cadastrar o produto:', error);
        }
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
