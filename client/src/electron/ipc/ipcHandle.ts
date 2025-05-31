import { ipcMain } from "electron";
import { EventPayloadMapping } from "../../shared/types/statistics.js";

export function ipcHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key],
) {
  ipcMain.handle(key, handler);
}
