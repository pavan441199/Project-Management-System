import { AxiosError } from "axios";

export type CustomError = AxiosError & {
    errorCode?: string;
};