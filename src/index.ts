import { Request, Response, NextFunction, Send } from "express";
import { randomUUID } from "crypto";
/* TYPES */
type Body = { [key: string]: string | Body } | string;
type Params = { [key: string]: string };
import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http2";
export interface RequestInfo {
  requestId: string | string[];
  method: string;
  url: string;
  params: Params;
  headers: IncomingHttpHeaders | OutgoingHttpHeaders;
  status: number;
  body: string | Body;
}
export interface Options {
  instanceIdLength?: number;
  requestIdLength?: number;
}

function interceptControllers(
  beforeController: (requestInfo: RequestInfo) => void,
  afterController: (requestInfo: RequestInfo) => void,
  options: Options = { instanceIdLength: 6, requestIdLength: 16 }
): (req: Request, res: Response, next: NextFunction) => void {
  const deviceId: string = randomUUID().slice(0, options.instanceIdLength);
  return (req: Request, res: Response, next: NextFunction) => {
    const requestId = `${deviceId}-${randomUUID()
      .split("-")
      .join("")
      .slice(0, options.requestIdLength)}`;
    req.headers["X-Trace-Id"] = requestId;
    const requestInfo: RequestInfo = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      params: { ...req.params },
      headers: { ...req.headers },
      body: { ...req.body },
      status: 200,
    };
    beforeController(requestInfo);
    const selfSend: Send = res.send;
    let outgoingBody: Body;
    res.send = (body: Body) => {
      outgoingBody = body;
      return selfSend.apply(res, [body]);
    };
    res.on("finish", () => {
      const outgoingHeaders = { ...res.getHeaders() };
      afterController({
        ...requestInfo,
        body: outgoingBody,
        headers: outgoingHeaders,
        status: res.statusCode,
      });
    });
    next();
  };
}

export default interceptControllers;
