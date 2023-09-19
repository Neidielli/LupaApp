const fs = require('fs');
const PDFDocument = require('pdfkit');

document.getElementById('exportButton').addEventListener('click', function() {
    // Crie um novo documento PDF
    const doc = new PDFDocument();

    // Adicione dados ao documento PDF
    doc.text('Catálogo Lupa');
    doc.moveDown();

    // Suponha que você tenha uma lista de dados do banco de dados
    // const dadosDoBanco = [...]; // Preencha com seus dados reais

    // dadosDoBanco.forEach((item) => {
    //   doc.text(`Campo1: ${item.campo1}`);
    //   doc.text(`Campo2: ${item.campo2}`);
    //   doc.moveDown();
    // });
    doc.text(`Ola`);

    // Salve o PDF em um arquivo
    doc.pipe(fs.createWriteStream('dados.pdf'));
    doc.end();
});

