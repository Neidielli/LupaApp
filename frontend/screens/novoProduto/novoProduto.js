const { insertDatabase } = require("../../../database");
const fs = require('fs');

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("meu-formulario");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const produto = document.querySelector("#produto").value;
        const marca = document.querySelector("#marca").value;
        const preco = document.querySelector("#preco").value;
        const imagemInput = document.querySelector("#imagem");
        const descricao = document.querySelector("#descricao").value;

        let imagem = null;
        
        if (imagemInput.files.length > 0) {
            const imagePath = imagemInput.files[0].path;
            imagem = fs.readFileSync(imagePath);
            console.log(imagem);
        }

        insertDatabase(produto, marca, preco, imagem, descricao);
        
    });
});
