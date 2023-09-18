const { app, BrowserWindow } = require('electron');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('frontend/screens/index/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

app.on('ready', () => {
  const mainWindow = createMainWindow();

});

app.on('window-all-closed', () => {
  
  app.quit();
});