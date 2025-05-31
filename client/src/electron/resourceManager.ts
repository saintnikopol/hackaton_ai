import { BrowserWindow } from "electron";
import osUtils from "os-utils";
import os from "node:os";
import fs from "node:fs";
import { ipcWebContentsSend } from "./ipc/ipcWebContentsSend.js";

function getCpuUsage() {
  return new Promise<number>((resolve) => osUtils.cpuUsage(resolve));
}

function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

const POLLING_INTERVAL = 500;
export function pollResources(window: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    ipcWebContentsSend("statistics", window.webContents, {
      cpuUsage,
      ramUsage,
      storageUsage: storageData.usage,
    });
  }, POLLING_INTERVAL);
}

export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024);

  return {
    totalStorage,
    cpuModel,
    totalMemoryGB,
  };
}

function getStorageData() {
  // requires node 18
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}
