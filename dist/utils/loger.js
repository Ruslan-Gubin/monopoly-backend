import { chalks } from "../utils/index.js";
export const logger = {
    info: (message) => {
        console.log(chalks.InfoDev(`[INFO] ${message}`));
    },
    error: (message, error) => {
        console.error(chalks.warning(`[ERROR] ${message}`));
        console.error(chalks.warning(error));
    },
    connectSuccess: (message) => {
        console.log(chalks.success(message));
    },
    errrorDB: (message) => {
        console.log(chalks.errorDB(message));
    },
};
