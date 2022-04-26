import { Request, Response, NextFunction } from "express";
declare type Body = {
    [key: string]: string | Body;
} | string;
declare type Params = {
    [key: string]: string;
};
declare type Headers = {
    [key: string]: string | number | string[];
};
export interface RequestInfo {
    requestId: string | string[];
    method: string;
    url: string;
    params: Params;
    headers: Headers;
    body: string | Body;
}
declare function interceptControllers(beforeController: (requestInfo: RequestInfo) => void, afterController: (requestInfo: RequestInfo) => void): (req: Request, res: Response, next: NextFunction) => void;
export default interceptControllers;
