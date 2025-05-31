import { WebContents } from "electron";
import { EventPayloadMapping } from "../../shared/types/statistics.js";

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key],
) {
  webContents.send(key, payload);
}
