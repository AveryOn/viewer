"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  sendFile: (config, sep) => electron.ipcRenderer.invoke("send-file", config, sep)
});
electron.ipcRenderer.on("main-process-message", (event, message) => {
  console.log("Сообщение от основного процесса:", message);
});
