const { getAllProducts } = require("../../../database.js");
const fs = require('fs');
const htmlToPdf = require('html-pdf');
const path = require('path');

function getImageSrc(produto) {
    return produto.imagem ? `data:image/png;base64,${Buffer.from(produto.imagem).toString('base64')}` : 'path/to/default-image.png';
}

function readCssFile() {
    const cssFilePath = path.join(__dirname, './template.css');
    return fs.readFileSync(cssFilePath, 'utf-8');
} 

function readHtmlFile() {
    const htmlFilePath = path.join(__dirname, './template.html');
    return fs.readFileSync(htmlFilePath, 'utf-8');
}

function createCardHTML(produto, index) {
    const imageSrc = getImageSrc(produto);

    let cardHTML = `
    <td>
        <div class="itemProdutos">
            <h1>${produto.produto}</h1>
            <h4>${produto.marca}</h4>
            <button>R$ ${produto.preco}</button>
            <img src="${imageSrc}" width="175" height="150">
        </div>
    </td>
    `;

    if ((index + 1) % 3 === 0) {
        cardHTML += '</tr><tr>';
    }

    return cardHTML;
}

async function exportPdf() {
    const cssContent = readCssFile();
    let htmlContent = readHtmlFile() + '<style>' + cssContent + '</style>';

    try {
        const rows = await getAllProducts();
        if (rows && rows.length > 0) {
            // htmlContent = htmlContent + rows.map(createCardHTML).join('');
            const cardsHTML = rows.map((produto, index) => createCardHTML(produto, index)).join('');
            htmlContent = htmlContent + cardsHTML;
        }
    } catch (error) {
        handleDatabaseError(error);
    }

    // htmlContent = "</div></main><script src='./home.js'></script></body></html>" + htmlContent;
    htmlContent = "</tr></table></body></html>" + htmlContent;

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
