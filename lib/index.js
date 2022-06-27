"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function interceptControllers(beforeController, afterController, options = { instanceIdLength: 6, requestIdLength: 16 }) {
    const deviceId = (0, crypto_1.randomUUID)().slice(0, options.instanceIdLength);
    return (req, res, next) => {
        const requestId = `${deviceId}-${(0, crypto_1.randomUUID)()
            .replaceAll("-", "")
            .slice(0, options.requestIdLength)}`;
        req.headers["X-Trace-Id"] = requestId;
        const requestInfo = {
            requestId,
            method: req.method,
            url: req.originalUrl,
            params: { ...req.params },
            headers: { ...req.headers },
            body: { ...req.body },
            status: 200,
        };
        beforeController(requestInfo);
        const selfSend = res.send;
        let outgoingBody;
        res.send = (body) => {
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
exports.default = interceptControllers;
