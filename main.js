const { app, BrowserWindow } = require('electron');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

function createMainWindow() {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    preload: path.join(__dirname, 'preload.js'),
  });

  mainWindow.loadFile('frontend/screens/index/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

app.on('ready', () => {
  const mainWindow = createMainWindow();

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.executeJavaScript(`
      document.getElementById("exportPdfButton").addEventListener("click", async () => {
        const { getAllProducts } = require('./../../../database.js');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const cssContent = readCssFile();
        let htmlContent = readHtmlFile() + '<style>' + cssContent + '</style>';

        try {
            const rows = await getAllProducts();
            console.log(rows)
            if (rows && rows.length > 0) {
                const cardsHTML = rows.map((produto, index) => createCardHTML(produto, index)).join('');
                htmlContent = htmlContent + cardsHTML;
            }
        } catch (error) {
            handleDatabaseError(error);
        }

        htmlContent =  htmlContent + "</tr></table></body></html>";

        if (htmlContent.trim() !== '') {
            const pdfOptions = {
                path: 'Catalogo.pdf',
                preferCSSPageSize: true,
                printBackground: true
            };
            
            await page.setContent(htmlContent);
            await page.pdf(pdfOptions);

            await browser.close();
            console.log('PDF gerado com sucesso');
        } else {
            console.error('O conteúdo HTML está vazio. Nenhum PDF será gerado.');
        }
            });
    `);
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

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
          <button style="background-color: #23561b; width: 100px; height: 25px; border: none; color: #FFFFFF; margin-bottom: 5px; border-radius: 5px;">R$ ${produto.preco}</button>
          <img src="${imageSrc}" width="175" height="150">
      </div>
  </td>
  `;

  if ((index + 1) % 3 === 0) {
      cardHTML += '</tr><tr>';
  }

  return cardHTML;
}
