import { ipcRenderer } from "electron";
import { EventPayloadMapping } from "../../shared/types/statistics.js";

export function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key],
) {
  ipcRenderer.send(key, payload);
}
