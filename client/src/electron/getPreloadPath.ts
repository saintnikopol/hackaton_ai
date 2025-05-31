import path from "path";
import { app } from "electron";

export const getPreloadPath = () =>
  path.join(
    app.getAppPath(),
    process.env.NODE_ENV === "development" ? "." : "..",
    "dist",
    "electron",
    "preload.cjs",
  );
