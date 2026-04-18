const isDev = import.meta.env.DEV;
export const log = isDev ? console.log : () => {};

export const API_URL = "";
export const UPLOAD_URL = "/uploads";