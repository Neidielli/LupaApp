const { getAllProducts } = require("../../../database.js");
const fs = require('fs');
const htmlToPdf = require('html-pdf');
const path = require('path');

function getImageSrc(produto) {
    return produto.imagem ? `data:image/png;base64,${Buffer.from(produto.imagem).toString('base64')}` : 'path/to/default-image.png';
}

function readCssFile() {
    const cssFilePath = path.join(__dirname, './../css_geral.css');
    return fs.readFileSync(cssFilePath, 'utf-8');
} 

function readHtmlFile() {
    const htmlFilePath = path.join(__dirname, './template.html');
    return fs.readFileSync(htmlFilePath, 'utf-8');
}

function createCardHTML(produto) {
    const imageSrc = getImageSrc(produto);

    return `
        <div class="itemProdutos" onclick="redirecionar(${produto.id});">
            <h1>${produto.produto}</h1>
            <button>R$ ${produto.preco}</button>
            <img src="${imageSrc}" width="175" height="150">
        </div>
    `;
}

async function exportPdf() {
    const cssContent = readCssFile();
    let htmlContent = readHtmlFile() + '<style>' + cssContent + '</style>';

    try {
        const rows = await getAllProducts();
        if (rows && rows.length > 0) {
            htmlContent = htmlContent + rows.map(createCardHTML).join('');
        }
    } catch (error) {
        handleDatabaseError(error);
    }

    if (htmlContent.trim() !== '') {
        const pdfOptions = {
            format: 'Letter'
        };
        htmlToPdf.create(htmlContent, pdfOptions).toFile('Catalogo.pdf', (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('PDF gerado com sucesso:', res);
        });
    } else {
        console.error('O conteúdo HTML está vazio. Nenhum PDF será gerado.');
    }
}

function handleDatabaseError(error) {
    console.error('Erro ao buscar registros:', error);
}

function redirecionar(id) {
    // Esta função deve ser usada no lado do cliente (navegador)
    window.location.href = `../home/home.html?id=${id}`;
}
