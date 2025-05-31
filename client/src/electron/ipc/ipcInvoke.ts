import { ipcRenderer } from "electron";
import { EventPayloadMapping } from "../../shared/types/statistics.js";

export function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key,
): Promise<EventPayloadMapping[Key]> {
  return ipcRenderer.invoke(key);
}
