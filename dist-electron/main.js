import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import "path";
import "fs/promises";
function check(pattern, value) {
  const correctPattern = pattern.split(" ").join("").toLowerCase();
  if (correctPattern === "*") {
    return true;
  }
  if (correctPattern === "num") {
    let typeC = +value;
    if (typeC && typeC === typeC) {
      return true;
    }
    return false;
  } else {
    return pattern === value;
  }
}
function computeLengthStr(str) {
  if (str.split(" ").join("").toLowerCase() === "num") return 1;
  return str.length;
}
async function readFileC(file, separator) {
  try {
    const [startSep, endSep] = separator.split(",").map((el) => el.trim());
    if (!startSep || !endSep) return file.split("\n");
    return file.split("\n").filter((chunk) => {
      const correctChunk = chunk.split(" ").join("");
      let startChar = correctChunk.slice(0, computeLengthStr(startSep));
      let endChar = correctChunk.slice(correctChunk.length - computeLengthStr(endSep));
      if (check(startSep, startChar) && check(endSep, endChar)) {
        return true;
      } else return false;
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  ipcMain.handle("send-file", async (event, config, sep) => {
    return await readFileC(config, sep);
  });
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
