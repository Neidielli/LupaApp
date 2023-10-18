const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  exportPdf: () => {
    ipcRenderer.send('exportPdf');
  }
});

ipcRenderer.on('pdf-exported', (event, status, error) => {
  if (status === 'success') {
    console.log('PDF gerado com sucesso');
  } else if (status === 'error') {
    console.error('Erro ao gerar PDF:', error);
  }
});