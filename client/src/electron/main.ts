import { app, BrowserWindow } from "electron";
import path from "node:path";
import { getStaticData, pollResources } from "./resourceManager.js";
import { getPreloadPath } from "./getPreloadPath.js";
import { ipcHandle } from "./ipc/ipcHandle.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    alwaysOnTop: true,
  });
  switch (process.env.NODE_ENV) {
    case "development":
      mainWindow.loadURL("http://localhost:5123");
      console.log("Started");
      break;
    default:
      mainWindow.loadFile(
        path.join(app.getAppPath(), "dist", "web", "index.html"),
      );
  }
  pollResources(mainWindow);
  ipcHandle("getStaticData", () => getStaticData());
});
