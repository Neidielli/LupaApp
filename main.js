const { app, BrowserWindow, Menu } = require('electron');

var mainWindow = null;
// Principal Window
async function createWindow() {
    mainWindow = new BrowserWindow({
        width:800,
        height:800,
    });

    await mainWindow.loadFile('src/index.html')
}

// Template Menu
const templateMenu = [

];
// Menu
const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);

// On Ready
app.whenReady().then(createWindow);

// Activate on MacOs
app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow();
    }
})
