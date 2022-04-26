import { Request, Response, NextFunction, Send } from "express";
import { randomUUID } from "crypto";
/* TYPES */
type Body = { [key: string]: string | Body } | string;
type Params = { [key: string]: string };
type Headers = { [key: string]: string | number | string[] };
export interface RequestInfo {
  requestId: string | string[];
  method: string;
  url: string;
  params: Params;
  headers: Headers;
  body: string | Body;
}

function interceptControllers(
  beforeController: (requestInfo: RequestInfo) => void,
  afterController: (requestInfo: RequestInfo) => void
): (req: Request, res: Response, next: NextFunction) => void {
  const deviceId: string = randomUUID().slice(0, 6);
  return (req: Request, res: Response, next: NextFunction) => {
    const requestId = `${deviceId}-${randomUUID()
      .replaceAll("-", "")
      .slice(0, 16)}`;
    req.headers.requestId = requestId;
    const requestInfo: RequestInfo = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      params: { ...req.params },
      headers: { ...req.headers },
      body: { ...req.body },
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
      });
    });
    next();
  };
}

export default interceptControllers;
