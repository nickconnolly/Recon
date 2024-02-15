const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    sendPassword: (password) => ipcRenderer.send('send-password', password),
    onCommandOutput: (callback) => {
        ipcRenderer.on('command-output', (_, data) => callback(data));
    }
});
