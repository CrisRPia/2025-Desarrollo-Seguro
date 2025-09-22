Antes de implementar las soluciones, este es el resultado de ejecutar los pocs.

```bash
2025-Desarrollo-Seguro on  practico-2 [?] via 🐳 colima on ☁️   took 34s
❮ ./test.sh
[+] Running 8/8
 ✔ Container frontend                           Removed                                                                                                                                                                                                                          0.2s
 ✔ Container visa                               Removed                                                                                                                                                                                                                         10.2s
 ✔ Container master                             Removed                                                                                                                                                                                                                         10.2s
 ✔ Container mailhog                            Removed                                                                                                                                                                                                                          0.2s
 ✔ Container backend                            Removed                                                                                                                                                                                                                         10.1s
 ✔ Container postgres                           Removed                                                                                                                                                                                                                          0.1s
 ✔ Volume 2025-desarrollo-seguro_postgres_data  Removed                                                                                                                                                                                                                          0.0s
 ✔ Network 2025-desarrollo-seguro_default       Removed                                                                                                                                                                                                                          0.1s
WARN[0000] Docker Compose is configured to build using Bake, but buildx isn't installed
[+] Building 9.6s (46/49)                                                                                                                                                                                                                                               docker:colima
 => [master internal] load build definition from DockerFile                                                                                                                                                                                                                      0.0s
 => => transferring dockerfile: 197B                                                                                                                                                                                                                                             0.0s
 => [visa internal] load build definition from DockerFile                                                                                                                                                                                                                        0.0s
 => => transferring dockerfile: 197B                                                                                                                                                                                                                                             0.0s
 => [backend internal] load build definition from DockerFile                                                                                                                                                                                                                     0.0s
 => => transferring dockerfile: 266B                                                                                                                                                                                                                                             0.0s
 => [visa internal] load metadata for docker.io/library/python:3.11-slim                                                                                                                                                                                                         0.5s
 => [frontend internal] load metadata for docker.io/library/node:lts                                                                                                                                                                                                             0.7s
 => [backend internal] load .dockerignore                                                                                                                                                                                                                                        0.0s
 => => transferring context: 87B                                                                                                                                                                                                                                                 0.0s
 => [frontend builder 1/6] FROM docker.io/library/node:lts@sha256:afff6d8c97964a438d2e6a9c96509367e45d8bf93f790ad561a1eaea926303d9                                                                                                                                               0.0s
 => => resolve docker.io/library/node:lts@sha256:afff6d8c97964a438d2e6a9c96509367e45d8bf93f790ad561a1eaea926303d9                                                                                                                                                                0.0s
 => [backend internal] load build context                                                                                                                                                                                                                                        0.0s
 => => transferring context: 5.94kB                                                                                                                                                                                                                                              0.0s
 => [visa internal] load .dockerignore                                                                                                                                                                                                                                           0.0s
 => => transferring context: 2B                                                                                                                                                                                                                                                  0.0s
 => [master internal] load .dockerignore                                                                                                                                                                                                                                         0.0s
 => => transferring context: 2B                                                                                                                                                                                                                                                  0.0s
 => CACHED [frontend builder 2/6] WORKDIR /app                                                                                                                                                                                                                                   0.0s
 => CACHED [backend  3/10] COPY health.sh .                                                                                                                                                                                                                                      0.0s
 => CACHED [backend  4/10] RUN chmod +x health.sh                                                                                                                                                                                                                                0.0s
 => CACHED [backend  5/10] RUN  mkdir /invoices/                                                                                                                                                                                                                                 0.0s
 => CACHED [backend  6/10] COPY resources/ /invoices/                                                                                                                                                                                                                            0.0s
 => CACHED [backend  7/10] COPY package*.json .                                                                                                                                                                                                                                  0.0s
 => CACHED [backend  8/10] RUN npm ci                                                                                                                                                                                                                                            0.0s
 => [backend  9/10] COPY . .                                                                                                                                                                                                                                                     0.0s
 => [visa 1/5] FROM docker.io/library/python:3.11-slim@sha256:a0939570b38cddeb861b8e75d20b1c8218b21562b18f301171904b544e8cf228                                                                                                                                                   0.0s
 => => resolve docker.io/library/python:3.11-slim@sha256:a0939570b38cddeb861b8e75d20b1c8218b21562b18f301171904b544e8cf228                                                                                                                                                        0.0s
 => [visa internal] load build context                                                                                                                                                                                                                                           0.0s
 => => transferring context: 96B                                                                                                                                                                                                                                                 0.0s
 => [master internal] load build context                                                                                                                                                                                                                                         0.0s
 => => transferring context: 96B                                                                                                                                                                                                                                                 0.0s
 => CACHED [master 2/5] WORKDIR /app                                                                                                                                                                                                                                             0.0s
 => CACHED [master 3/5] COPY requirements.txt .                                                                                                                                                                                                                                  0.0s
 => CACHED [master 4/5] RUN pip install --no-cache-dir -r requirements.txt                                                                                                                                                                                                       0.0s
 => CACHED [master 5/5] COPY . .                                                                                                                                                                                                                                                 0.0s
 => [master] exporting to image                                                                                                                                                                                                                                                  0.1s
 => => exporting layers                                                                                                                                                                                                                                                          0.0s
 => => exporting manifest sha256:d24e1c3717d9d26f44f3a7ccbe0da4f424ec74b80609ff245a7a9b0de4c6aecf                                                                                                                                                                                0.0s
 => => exporting config sha256:1b8c4cc3ccbb3c12b49a3c0f4cac069524983128cbec5cfc4b2c19c97beadd36                                                                                                                                                                                  0.0s
 => => exporting attestation manifest sha256:82843976ffa61e4e288e622faa2627a65a469e1684a457c603231ba2da922886                                                                                                                                                                    0.0s
 => => exporting manifest list sha256:a33f07ba5422d4d37c80b26cdb6a5efe456c56731b12474edefabeee53c39598                                                                                                                                                                           0.0s
 => => naming to docker.io/library/2025-desarrollo-seguro-master:latest                                                                                                                                                                                                          0.0s
 => => unpacking to docker.io/library/2025-desarrollo-seguro-master:latest                                                                                                                                                                                                       0.0s
 => [visa] exporting to image                                                                                                                                                                                                                                                    0.1s
 => => exporting layers                                                                                                                                                                                                                                                          0.0s
 => => exporting manifest sha256:f9aab429a29e1cc8c114e1c834af50dd249f45addc25bca7abd0103d43fcf3d8                                                                                                                                                                                0.0s
 => => exporting config sha256:8a26bb9b4256c0f3af8e3d90c846c6d020fadd5aeca5540c408e47d9ddee1f52                                                                                                                                                                                  0.0s
 => => exporting attestation manifest sha256:3a73adaa6c8373445cf41c1820ce69d7d8d235fac212fd88ea60e5dbf5a0e0ad                                                                                                                                                                    0.0s
 => => exporting manifest list sha256:9dfd35de2d2b8ae68ddeda7120955ef3b186c6b073741bc9881b15c0ec604ef4                                                                                                                                                                           0.0s
 => => naming to docker.io/library/2025-desarrollo-seguro-visa:latest                                                                                                                                                                                                            0.0s
 => => unpacking to docker.io/library/2025-desarrollo-seguro-visa:latest                                                                                                                                                                                                         0.0s
 => [backend 10/10] RUN npx tsc --build                                                                                                                                                                                                                                          8.1s
 => [master] resolving provenance for metadata file                                                                                                                                                                                                                              0.0s
 => [visa] resolving provenance for metadata file                                                                                                                                                                                                                                0.0s
 => [backend] exporting to image                                                                                                                                                                                                                                                 0.2s
 => => exporting layers                                                                                                                                                                                                                                                          0.1s
 => => exporting manifest sha256:77c2c7ba761937c49327dd665b7792e327e31910a388876fb88677807e5c0735                                                                                                                                                                                0.0s
 => => exporting config sha256:c8ba695158e5b5d52e87a613550d498362413d0667ec2a5cbe2a69a66ab7e763                                                                                                                                                                                  0.0s
 => => exporting attestation manifest sha256:540d1a814aa39379c9c08f3314a96f65ff88b578f2899574da08a3d0822004dc                                                                                                                                                                    0.0s
 => => exporting manifest list sha256:7673d827f2d536269d7571e41da1308ce42d07a16f7528f8c161551c350ed998                                                                                                                                                                           0.0s
 => => naming to docker.io/library/2025-desarrollo-seguro-backend:latest                                                                                                                                                                                                         0.0s
 => => unpacking to docker.io/library/2025-desarrollo-seguro-backend:latest                                                                                                                                                                                                      0.1s
 => [backend] resolving provenance for metadata file                                                                                                                                                                                                                             0.0s
 => [frontend internal] load build definition from DockerFile                                                                                                                                                                                                                    0.0s
 => => transferring dockerfile: 429B                                                                                                                                                                                                                                             0.0s
 => [frontend internal] load metadata for docker.io/library/nginx:alpine                                                                                                                                                                                                         0.5s
 => [frontend internal] load .dockerignore                                                                                                                                                                                                                                       0.0s
 => => transferring context: 2B                                                                                                                                                                                                                                                  0.0s
 => [frontend internal] load build context                                                                                                                                                                                                                                       0.0s
 => => transferring context: 1.54kB                                                                                                                                                                                                                                              0.0s
 => [frontend stage-1 1/4] FROM docker.io/library/nginx:alpine@sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98605ba5e3b26ab8                                                                                                                                           0.0s
 => => resolve docker.io/library/nginx:alpine@sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98605ba5e3b26ab8                                                                                                                                                            0.0s
 => CACHED [frontend stage-1 2/4] RUN rm /etc/nginx/conf.d/default.conf                                                                                                                                                                                                          0.0s
 => CACHED [frontend stage-1 3/4] COPY docker/nginx.conf /etc/nginx/conf.d/                                                                                                                                                                                                      0.0s
 => CACHED [frontend builder 3/6] COPY package.json package-lock.json ./                                                                                                                                                                                                         0.0s
 => CACHED [frontend builder 4/6] RUN npm ci                                                                                                                                                                                                                                     0.0s
 => CACHED [frontend builder 5/6] COPY . .                                                                                                                                                                                                                                       0.0s
 => CACHED [frontend builder 6/6] RUN npm run build                                                                                                                                                                                                                              0.0s
 => CACHED [frontend stage-1 4/4] COPY --from=builder /app/dist /usr/share/nginx/html                                                                                                                                                                                            0.0s
 => [frontend] exporting to image                                                                                                                                                                                                                                                0.0s
 => => exporting layers                                                                                                                                                                                                                                                          0.0s
 => => exporting manifest sha256:195447f87026449e87674a5a2cf879f1989c6d22aebe1d31217304311fce4376                                                                                                                                                                                0.0s
 => => exporting config sha256:bf0d869eb20bb08881128664778e866343ebb5028df211931ed664b5afdcd825                                                                                                                                                                                  0.0s
 => => exporting attestation manifest sha256:4077be1060f46640735f2ccfb2597b45932ab249d2f515d4fd8da00f6bb4ec18                                                                                                                                                                    0.0s
 => => exporting manifest list sha256:42b2078024c478e42004399c627b60b6a6c7acb6d4ed668d80244bed821dc72d                                                                                                                                                                           0.0s
 => => naming to docker.io/library/2025-desarrollo-seguro-frontend:latest                                                                                                                                                                                                        0.0s
 => => unpacking to docker.io/library/2025-desarrollo-seguro-frontend:latest                                                                                                                                                                                                     0.0s
 => [frontend] resolving provenance for metadata file                                                                                                                                                                                                                            0.0s
[+] Running 13/13
 ✔ backend                                                                                                                                                Built                                                                                                                  0.0s
 ✔ frontend                                                                                                                                               Built                                                                                                                  0.0s
 ✔ master                                                                                                                                                 Built                                                                                                                  0.0s
 ✔ visa                                                                                                                                                   Built                                                                                                                  0.0s
 ✔ Network 2025-desarrollo-seguro_default                                                                                                                 Created                                                                                                                0.0s
 ✔ Volume 2025-desarrollo-seguro_postgres_data                                                                                                            Created                                                                                                                0.0s
 ✔ Container visa                                                                                                                                         Healthy                                                                                                               17.2s
 ✔ Container mailhog                                                                                                                                      Healthy                                                                                                               17.2s
 ✔ Container master                                                                                                                                       Healthy                                                                                                               17.2s
 ✔ Container postgres                                                                                                                                     Healthy                                                                                                               17.2s
 ! mailhog The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested                                                                                                                        0.0s
 ✔ Container backend                                                                                                                                      Healthy                                                                                                               17.2s
 ✔ Container frontend                                                                                                                                     Healthy                                                                                                               17.1s

> backend@1.0.0 test:pocs
> jest test/pocs

 FAIL  test/pocs/sqli.poc.test.ts
  ● Console

    console.log
      [dotenv@17.2.0] injecting env (0) from .env (tip: ⚙️  override existing env vars with { override: true })

      at _log (node_modules/dotenv/lib/main.js:136:11)

  ● SQL Injection PoC › should NOT retrieve all invoices via SQL injection

    expect(received).toBe(expected) // Object.is equality

    Expected: 3
    Received: 4

      78 |
      79 |     // Since we are injecting to get all users, this fails.
    > 80 |     expect(response.body.length).toBe(3);
         |                                  ^
      81 |
      82 |     const invoiceIds = response.body.map((inv: Invoice) => inv.id);
      83 |     expect(invoiceIds).not.toContain(4);

      at Object.<anonymous> (test/pocs/sqli.poc.test.ts:80:34)

 FAIL  test/pocs/ssrf.poc.test.ts
  ● Console

    console.log
      [dotenv@17.2.0] injecting env (0) from .env (tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`)

      at _log (node_modules/dotenv/lib/main.js:136:11)

    console.error
      AxiosError {
        message: 'Request failed with status code 400',
        name: 'AxiosError',
        code: 'ERR_BAD_REQUEST',
        config: {
          transitional: {
            silentJSONParsing: true,
            forcedJSONParsing: true,
            clarifyTimeoutError: false
          },
          adapter: [ 'xhr', 'http', 'fetch' ],
          transformRequest: [ [Function: transformRequest] ],
          transformResponse: [ [Function: transformResponse] ],
          timeout: 0,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          maxContentLength: -1,
          maxBodyLength: -1,
          env: { FormData: [Function [FormData]], Blob: [class Blob] },
          validateStatus: [Function: validateStatus],
          headers: Object [AxiosHeaders] {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'User-Agent': 'axios/1.10.0',
            'Content-Length': '68',
            'Accept-Encoding': 'gzip, compress, deflate, br'
          },
          method: 'post',
          url: 'http://master/payments',
          data: '{"ccNumber":"1234567890123456","ccv":"123","expirationDate":"12/25"}',
          allowAbsoluteUrls: true
        },
        request: <ref *1> ClientRequest {
          _events: [Object: null prototype] {
            abort: [Function (anonymous)],
            aborted: [Function (anonymous)],
            connect: [Function (anonymous)],
            error: [Function (anonymous)],
            socket: [Function (anonymous)],
            timeout: [Function (anonymous)],
            finish: [Function: requestOnFinish]
          },
          _eventsCount: 7,
          _maxListeners: undefined,
          outputData: [],
          outputSize: 0,
          writable: true,
          destroyed: false,
          _last: false,
          chunkedEncoding: false,
          shouldKeepAlive: false,
          maxRequestsOnConnectionReached: false,
          _defaultKeepAlive: true,
          useChunkedEncodingByDefault: true,
          sendDate: false,
          _removedConnection: false,
          _removedContLen: false,
          _removedTE: false,
          strictContentLength: false,
          _contentLength: 68,
          _hasBody: true,
          _trailer: '',
          finished: true,
          _headerSent: true,
          _closed: false,
          _header: 'POST /payments HTTP/1.1\r\n' +
            'Accept: application/json, text/plain, */*\r\n' +
            'Content-Type: application/json\r\n' +
            'User-Agent: axios/1.10.0\r\n' +
            'Content-Length: 68\r\n' +
            'Accept-Encoding: gzip, compress, deflate, br\r\n' +
            'Host: master\r\n' +
            'Connection: keep-alive\r\n' +
            '\r\n',
          _keepAliveTimeout: 0,
          _onPendingData: [Function: nop],
          agent: Agent {
            _events: [Object: null prototype],
            _eventsCount: 2,
            _maxListeners: undefined,
            defaultPort: 80,
            protocol: 'http:',
            options: [Object: null prototype],
            requests: [Object: null prototype] {},
            sockets: [Object: null prototype],
            freeSockets: [Object: null prototype] {},
            keepAliveMsecs: 1000,
            keepAlive: true,
            maxSockets: Infinity,
            maxFreeSockets: 256,
            scheduling: 'lifo',
            maxTotalSockets: Infinity,
            totalSocketCount: 1,
            [Symbol(shapeMode)]: false,
            [Symbol(kCapture)]: false
          },
          socketPath: undefined,
          method: 'POST',
          maxHeaderSize: undefined,
          insecureHTTPParser: undefined,
          joinDuplicateHeaders: undefined,
          path: '/payments',
          _ended: true,
          res: IncomingMessage {
            _events: [Object],
            _readableState: [ReadableState],
            _maxListeners: undefined,
            socket: [Socket],
            httpVersionMajor: 1,
            httpVersionMinor: 1,
            httpVersion: '1.1',
            complete: true,
            rawHeaders: [Array],
            rawTrailers: [],
            joinDuplicateHeaders: undefined,
            aborted: false,
            upgrade: false,
            url: '',
            method: null,
            statusCode: 400,
            statusMessage: 'BAD REQUEST',
            client: [Socket],
            _consuming: false,
            _dumped: false,
            req: [Circular *1],
            _eventsCount: 4,
            responseUrl: 'http://master/payments',
            redirects: [],
            [Symbol(shapeMode)]: true,
            [Symbol(kCapture)]: false,
            [Symbol(kHeaders)]: [Object],
            [Symbol(kHeadersCount)]: 10,
            [Symbol(kTrailers)]: null,
            [Symbol(kTrailersCount)]: 0
          },
          aborted: false,
          timeoutCb: [Function: emitRequestTimeout],
          upgradeOrConnect: false,
          parser: null,
          maxHeadersCount: null,
          reusedSocket: false,
          host: 'master',
          protocol: 'http:',
          _redirectable: Writable {
            _events: [Object],
            _writableState: [WritableState],
            _maxListeners: undefined,
            _options: [Object],
            _ended: true,
            _ending: true,
            _redirectCount: 0,
            _redirects: [],
            _requestBodyLength: 68,
            _requestBodyBuffers: [],
            _eventsCount: 3,
            _onNativeResponse: [Function (anonymous)],
            _currentRequest: [Circular *1],
            _currentUrl: 'http://master/payments',
            [Symbol(shapeMode)]: true,
            [Symbol(kCapture)]: false
          },
          [Symbol(shapeMode)]: false,
          [Symbol(kCapture)]: false,
          [Symbol(kBytesWritten)]: 0,
          [Symbol(kNeedDrain)]: false,
          [Symbol(corked)]: 0,
          [Symbol(kChunkedBuffer)]: [],
          [Symbol(kChunkedLength)]: 0,
          [Symbol(kSocket)]: Socket {
            connecting: false,
            _hadError: false,
            _parent: null,
            _host: 'master',
            _closeAfterHandlingError: false,
            _events: [Object],
            _readableState: [ReadableState],
            _writableState: [WritableState],
            allowHalfOpen: false,
            _maxListeners: undefined,
            _eventsCount: 7,
            _sockname: null,
            _pendingData: null,
            _pendingEncoding: '',
            server: null,
            _server: null,
            timeout: 5000,
            parser: null,
            _httpMessage: [Circular *1],
            [Symbol(async_id_symbol)]: 607,
            [Symbol(kHandle)]: [TCP],
            [Symbol(lastWriteQueueSize)]: 0,
            [Symbol(timeout)]: Timeout {
              _idleTimeout: 5000,
              _idlePrev: [TimersList],
              _idleNext: [Timeout],
              _idleStart: 3480,
              _onTimeout: [Function: bound ],
              _timerArgs: undefined,
              _repeat: null,
              _destroyed: false,
              [Symbol(refed)]: false,
              [Symbol(kHasPrimitive)]: false,
              [Symbol(asyncId)]: 606,
              [Symbol(triggerId)]: 603,
              [Symbol(kAsyncContextFrame)]: undefined
            },
            [Symbol(kBuffer)]: null,
            [Symbol(kBufferCb)]: null,
            [Symbol(kBufferGen)]: null,
            [Symbol(shapeMode)]: true,
            [Symbol(kCapture)]: false,
            [Symbol(kSetNoDelay)]: true,
            [Symbol(kSetKeepAlive)]: true,
            [Symbol(kSetKeepAliveInitialDelay)]: 60,
            [Symbol(kBytesRead)]: 0,
            [Symbol(kBytesWritten)]: 0
          },
          [Symbol(kOutHeaders)]: [Object: null prototype] {
            accept: [Array],
            'content-type': [Array],
            'user-agent': [Array],
            'content-length': [Array],
            'accept-encoding': [Array],
            host: [Array]
          },
          [Symbol(errored)]: null,
          [Symbol(kHighWaterMark)]: 65536,
          [Symbol(kRejectNonStandardBodyWrites)]: false,
          [Symbol(kUniqueHeaders)]: null
        },
        response: {
          status: 400,
          statusText: 'BAD REQUEST',
          headers: Object [AxiosHeaders] {
            server: 'Werkzeug/3.1.3 Python/3.11.13',
            date: 'Sun, 21 Sep 2025 23:44:34 GMT',
            'content-type': 'application/json',
            'content-length': '57',
            connection: 'close'
          },
          config: {
            transitional: [Object],
            adapter: [Array],
            transformRequest: [Array],
            transformResponse: [Array],
            timeout: 0,
            xsrfCookieName: 'XSRF-TOKEN',
            xsrfHeaderName: 'X-XSRF-TOKEN',
            maxContentLength: -1,
            maxBodyLength: -1,
            env: [Object],
            validateStatus: [Function: validateStatus],
            headers: [Object [AxiosHeaders]],
            method: 'post',
            url: 'http://master/payments',
            data: '{"ccNumber":"1234567890123456","ccv":"123","expirationDate":"12/25"}',
            allowAbsoluteUrls: true
          },
          request: <ref *1> ClientRequest {
            _events: [Object: null prototype],
            _eventsCount: 7,
            _maxListeners: undefined,
            outputData: [],
            outputSize: 0,
            writable: true,
            destroyed: false,
            _last: false,
            chunkedEncoding: false,
            shouldKeepAlive: false,
            maxRequestsOnConnectionReached: false,
            _defaultKeepAlive: true,
            useChunkedEncodingByDefault: true,
            sendDate: false,
            _removedConnection: false,
            _removedContLen: false,
            _removedTE: false,
            strictContentLength: false,
            _contentLength: 68,
            _hasBody: true,
            _trailer: '',
            finished: true,
            _headerSent: true,
            _closed: false,
            _header: 'POST /payments HTTP/1.1\r\n' +
              'Accept: application/json, text/plain, */*\r\n' +
              'Content-Type: application/json\r\n' +
              'User-Agent: axios/1.10.0\r\n' +
              'Content-Length: 68\r\n' +
              'Accept-Encoding: gzip, compress, deflate, br\r\n' +
              'Host: master\r\n' +
              'Connection: keep-alive\r\n' +
              '\r\n',
            _keepAliveTimeout: 0,
            _onPendingData: [Function: nop],
            agent: [Agent],
            socketPath: undefined,
            method: 'POST',
            maxHeaderSize: undefined,
            insecureHTTPParser: undefined,
            joinDuplicateHeaders: undefined,
            path: '/payments',
            _ended: true,
            res: [IncomingMessage],
            aborted: false,
            timeoutCb: [Function: emitRequestTimeout],
            upgradeOrConnect: false,
            parser: null,
            maxHeadersCount: null,
            reusedSocket: false,
            host: 'master',
            protocol: 'http:',
            _redirectable: [Writable],
            [Symbol(shapeMode)]: false,
            [Symbol(kCapture)]: false,
            [Symbol(kBytesWritten)]: 0,
            [Symbol(kNeedDrain)]: false,
            [Symbol(corked)]: 0,
            [Symbol(kChunkedBuffer)]: [],
            [Symbol(kChunkedLength)]: 0,
            [Symbol(kSocket)]: [Socket],
            [Symbol(kOutHeaders)]: [Object: null prototype],
            [Symbol(errored)]: null,
            [Symbol(kHighWaterMark)]: 65536,
            [Symbol(kRejectNonStandardBodyWrites)]: false,
            [Symbol(kUniqueHeaders)]: null
          },
          data: { Reason: 'No hay fondos suficientes', Result: 'Failed' }
        },
        status: 400
      }

      3 |
      4 | const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    > 5 |   console.error(err);
        |           ^
      6 |   const status = err.status ?? 500;
      7 |   const message = err.message ?? 'Something went wrong';
      8 |   res.status(status).json({ message });

      at error (src/middleware/errorHandler.ts:5:11)
      at Layer.handle_error (node_modules/express/lib/router/layer.js:71:5)
      at trim_prefix (node_modules/express/lib/router/index.js:326:13)
      at node_modules/express/lib/router/index.js:286:9
      at Function.process_params (node_modules/express/lib/router/index.js:346:12)
      at next (node_modules/express/lib/router/index.js:280:10)
      at node_modules/express/lib/router/index.js:646:15
      at next (node_modules/express/lib/router/index.js:265:14)
      at next (node_modules/express/lib/router/route.js:141:14)
      at next (src/controllers/invoiceController.ts:40:5)

  ● SSRF PoC › should NOT allow payment through an unauthorized payment provider

    expect(received).toBe(expected) // Object.is equality

    Expected: 500
    Received: 400

      64 |     // A secure system should not even attempt the request to an untrusted paymentBrand.
      65 |     // It should fail before making the external call.
    > 66 |     expect(response.status).toBe(500);
         |                             ^
      67 |     expect(response.body.message).not.toContain(
      68 |       "Request failed with status code 400",
      69 |     );

      at Object.<anonymous> (test/pocs/ssrf.poc.test.ts:66:29)

 FAIL  test/pocs/traversal.poc.test.ts
  ● Console

    console.log
      [dotenv@17.2.0] injecting env (0) from .env (tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`)

      at _log (node_modules/dotenv/lib/main.js:136:11)

  ● Path Traversal PoC › should read /etc/passwd through path traversal

    expect(received).toBeGreaterThanOrEqual(expected)

    Expected: >= 400
    Received:    200

      67 |     );
      68 |
    > 69 |     expect(response.status).toBeGreaterThanOrEqual(400);
         |                             ^
      70 |   });
      71 | });
      72 |

      at Object.<anonymous> (test/pocs/traversal.poc.test.ts:69:29)

 FAIL  test/pocs/auth.poc.test.ts
  ● Console

    console.log
      [dotenv@17.2.0] injecting env (0) from .env (tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild)

      at _log (node_modules/dotenv/lib/main.js:136:11)

  ● Missing Authorization PoC › should FAIL to update a user via PUT /users/:id without authentication

    expect(received).toBe(expected) // Object.is equality

    Expected: 401
    Received: 500

      41 |     // This test asserts the SECURE behavior.
      42 |     // A secure system should prevent access and return a 401 or 403 status.
    > 43 |     expect(response.status).toBe(401);
         |                             ^
      44 |
      45 |     // The test will FAIL because the current vulnerable code allows the update
      46 |     // and returns a 200 status, proving that authorization is missing.

      at Object.<anonymous> (test/pocs/auth.poc.test.ts:43:29)

 FAIL  test/pocs/template-injection.poc.test.ts
  ● Console

    console.log
      [dotenv@17.2.0] injecting env (0) from .env (tip: ⚙️  suppress all logs with { quiet: true })

      at _log (node_modules/dotenv/lib/main.js:136:11)

  ● Template Injection PoC › should NOT execute injected code in the email template

    expect(received).not.toContain(expected) // indexOf

    Expected substring: not "49"
    Received string:        "
          <html>
            <body>
              <h1>Hello 49 User</h1>
              <p>Click <a href=\"undefined/activate-user?token=cd2371d34206&username=testuser\">here</a> to activate your account.</p>
            </body>
          </html>"

      46 |     expect(sendMailMock).toHaveBeenCalled();
      47 |     const emailHtml = sendMailMock.mock.calls[0][0].html;
    > 48 |     expect(emailHtml).not.toContain("49");
         |                           ^
      49 |   });
      50 | });
      51 |

      at Object.<anonymous> (test/pocs/template-injection.poc.test.ts:48:27)

-----------------------|---------|----------|---------|---------|------------------------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|------------------------------------
All files              |   53.57 |     32.6 |   38.46 |   55.08 |
 src                   |     100 |       50 |     100 |     100 |
  db.ts                |     100 |      100 |     100 |     100 |
  knexfile.ts          |     100 |       50 |     100 |     100 | 11-15
 src/controllers       |   41.86 |     62.5 |   27.27 |   41.86 |
  authController.ts    |   42.55 |      100 |   28.57 |   42.55 | 7-11,16-22,27-33,38-43,48-53,70,86
  invoiceController.ts |   41.02 |     62.5 |      25 |   41.02 | 6-13,26,38,45-58,63-69
 src/middleware        |     100 |       50 |     100 |     100 |
  errorHandler.ts      |     100 |       50 |     100 |     100 | 6-7
 src/routes            |     100 |      100 |     100 |     100 |
  invoices.routes.ts   |     100 |      100 |     100 |     100 |
  user.routes.ts       |     100 |      100 |     100 |     100 |
 src/services          |   48.68 |     12.5 |      50 |   52.23 |
  authService.ts       |   39.58 |     6.25 |   28.57 |   46.34 | 67-159
  invoiceService.ts    |   64.28 |       25 |      80 |   61.53 | 47-61,72,80-81
 src/utils             |   66.66 |      100 |       0 |   66.66 |
  jwt.ts               |   66.66 |      100 |       0 |   66.66 | 4,12
-----------------------|---------|----------|---------|---------|------------------------------------
Test Suites: 5 failed, 5 total
Tests:       5 failed, 5 total
Snapshots:   0 total
Time:        4.63 s
Ran all test suites matching test/pocs.

2025-Desarrollo-Seguro on  practico-2 [?] via 🐳 colima on ☁️   took 43s
❮
```
