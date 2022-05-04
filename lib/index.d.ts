/// <reference types="node" />
import { Request, Response, NextFunction } from "express";
declare type Body = {
    [key: string]: string | Body;
} | string;
declare type Params = {
    [key: string]: string;
};
import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http2";
export interface RequestInfo {
    requestId: string | string[];
    method: string;
    url: string;
    params: Params;
    headers: IncomingHttpHeaders | OutgoingHttpHeaders;
    body: string | Body;
}
export interface Options {
    instanceIdLength?: number;
    requestIdLength?: number;
}
declare function interceptControllers(beforeController: (requestInfo: RequestInfo) => void, afterController: (requestInfo: RequestInfo) => void, options?: Options): (req: Request, res: Response, next: NextFunction) => void;
export default interceptControllers;
