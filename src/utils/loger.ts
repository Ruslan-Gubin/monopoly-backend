import { chalks } from "../utils/index.js";

export const logger = {
  info: (message: string) => {
    console.log(chalks.InfoDev(`[INFO] ${message}`));
  },
  error: (message: string, error: unknown) => {
    console.error(chalks.warning(`[ERROR] ${message}`));
    console.error(chalks.warning(error));
  },
  connectSuccess: (message: string) => {
    console.log(chalks.success(message));
  },
  errrorDB: (message: string) => {
    console.log(chalks.errorDB(message));
  },
};
