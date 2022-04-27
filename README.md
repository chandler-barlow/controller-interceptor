# Controller Interceptor

_Written in Typescript_

Controller Interceptor is a small Typescript package that allows you to intercept requests to an ExpressJS service and log the request info. Controller interceptor also attaches a trace id to the request headers. The trace id is implemented synchronously and does **not** use async-storage to avoid the performance impact created by other tracing libraries.

# Usage

To install

```bash
$ npm i controller-interceptor
```

Create your interceptor

```javascript
const interceptor = require("controller-interceptor");

function beforeController(requestInfo) {
  let { requestId, method, url, params, headers, body } = requestInfo;
  console.log("RequestId " + requestId);
  console.log("Request Type " + method);
  console.log("Request Url " + url);
  console.log("Request Params " + params);
  console.log("Request Headers " + headers);
  console.log("Request Body" + body);
}

function afterController(requestInfo) {
  let { requestId, method, url, params, headers, body } = requestInfo;
  console.log("RequestId " + requestId);
  console.log("Request Type " + method);
  console.log("Request Url " + url);
  console.log("Request Params " + params);
  console.log("Request Headers " + headers);
  console.log("Request Body" + body);
}

module.exports.default = interceptor(beforeController, afterController);
```

Attach interceptor as middleware in ExpressJS

```javascript
const express = require("express");
const interceptor = require("../path/to/interceptor");

const app = express();

app.use(interceptor);

app.listen(3000);
```

# API

### Tracing

The trace ids are of the format `instanceId-requestId`. The instanceId is generated when the server starts, and the requestId is generated when the route is called. This allows for tracaing calls to specific routes as well as tracing requests to a specific instance of a service.

### requestInfo

This is the logging object with the request info that the handler functions have access to.

```javascript
RequestInfo = {
  requestId: string; // The trace Id of the request
  method: string; // The http method of the request
  url: string; // The url that the request was made to
  params: Object; // The params passed to the request
  headers: Object; // The header object of the incoming/outgoing request
  body: Body; // The body of the incoming/outgoing request
}
```

### beforeController/afterController

These functions are not passed the actual body or headers objects, just copies of them. You are **not** able to mutate these fields in the handler functions.

### Options

You can pass options to the interceptor to change the way the trace ids are generated.

```javascript
const options = {
  instanceIdLength: 6,
  requestIdLength: 16,
};
// This will cause the interceptor to generate a trace id with 6 digits for for the instance id and 16 digits for the request id length

module.exports.default = interceptor(
  beforeController,
  afterController,
  options
);
```

# Author

[Chandler Barlow](https://github.com/chandler-barlow)

# Collaborators

[Steven Paulino](https://github.com/Stevenpaulino1) [Charlie Albright](https://github.com/charliealbright)

# License

[MIT](https://github.com/chandler-barlow/controller-interceptor/blob/main/LICENSE)
