"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function interceptControllers(beforeController, afterController) {
    const deviceId = (0, crypto_1.randomUUID)().slice(0, 6);
    return (req, res, next) => {
        const requestId = `${deviceId}-${(0, crypto_1.randomUUID)()
            .replaceAll("-", "")
            .slice(0, 16)}`;
        req.headers.requestId = requestId;
        const requestInfo = {
            requestId,
            method: req.method,
            url: req.originalUrl,
            params: { ...req.params },
            headers: { ...req.headers },
            body: { ...req.body },
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
            });
        });
        next();
    };
}
exports.default = interceptControllers;
