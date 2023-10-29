const { app, BrowserWindow } = require('electron');
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
        const puppeteer = require('puppeteer-core');

        try {
          const produtos = await getAllProducts();
          console.log(produtos)
          if(produtos.length > 0){
            const browser = await puppeteer.launch({ executablePath: path.join(__dirname, 'chrome-win64', 'chrome.exe') });
            const page = await browser.newPage();
  
            let htmlContent = readFile("html") + '<style>' + readFile("css") + '</style>';
            htmlContent = fillCards(htmlContent, produtos);
            await page.setContent(htmlContent + "</tr></table></body></html>");
            await page.pdf({
              path: path.join(__dirname, '..', '..', '..', '..', '..', '..', 'Catalogo.pdf'),
              preferCSSPageSize: true,
              printBackground: true});
            await browser.close();
            console.log('PDF gerado com sucesso');
          }
        } catch (error) {
            handleDatabaseError(error);
        }
       });
    `);
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

function createCardHTML(produto, index) {
  let cardHTML = `
    <td>
        <div class="itemProdutos">
            <h1 id="nomeProduto">${produto.produto}</h1>
            <h4 id="marcaProduto">${produto.marca}</h4>
            <img id="imgProduto" src="${getImageSrc(produto)}" width="175" height="150">
        </div>
    </td>`;
  if ((index + 1) % 2 === 0) {
    cardHTML += '</tr><tr>';
  }

  return cardHTML;
}

function fillCards(htmlContent, rows) {
  if (rows && rows.length > 0) {
    return htmlContent + rows.map((produto, index) => createCardHTML(produto, index)).join('');
  }
}

function getImageSrc(produto) {
  return produto.imagem ? `data:image/png;base64,${Buffer.from(produto.imagem).toString('base64')}` : 'path/to/default-image.png';
}

function readFile(tipo) {
  return fs.readFileSync(path.join(__dirname, './template.' + tipo), 'utf-8');
}