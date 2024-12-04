import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electron', {
    sendFile: (config: any, sep: string) => ipcRenderer.invoke('send-file', config, sep),
});


ipcRenderer.on('main-process-message', (event, message) => {
    console.log('Сообщение от основного процесса:', message);
    // Вы можете обновить UI или выполнить другие действия с полученными данными
});