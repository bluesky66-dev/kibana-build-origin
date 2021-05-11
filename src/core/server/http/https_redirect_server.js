"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpsRedirectServer = void 0;

var _url = require("url");

var _http_tools = require("./http_tools");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HttpsRedirectServer {
  constructor(log) {
    this.log = log;

    _defineProperty(this, "server", void 0);
  }

  async start(config) {
    this.log.debug('starting http --> https redirect server');

    if (!config.ssl.enabled || config.ssl.redirectHttpFromPort === undefined) {
      throw new Error('Redirect server cannot be started when [ssl.enabled] is set to `false`' + ' or [ssl.redirectHttpFromPort] is not specified.');
    } // Redirect server is configured in the same way as any other HTTP server
    // within the platform with the only exception that it should always be a
    // plain HTTP server, so we just ignore `tls` part of options.


    this.server = (0, _http_tools.createServer)({ ...(0, _http_tools.getServerOptions)(config, {
        configureTLS: false
      }),
      port: config.ssl.redirectHttpFromPort
    }, (0, _http_tools.getListenerOptions)(config));
    this.server.ext('onRequest', (request, responseToolkit) => {
      return responseToolkit.redirect((0, _url.format)({
        hostname: config.host,
        pathname: request.url.pathname,
        port: config.port,
        protocol: 'https',
        search: request.url.search
      })).takeover();
    });

    try {
      await this.server.start();
      this.log.debug(`http --> https redirect server running at ${this.server.info.uri}`);
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        throw new Error('The redirect server failed to start up because port ' + `${config.ssl.redirectHttpFromPort} is already in use. Ensure the port specified ` + 'in `server.ssl.redirectHttpFromPort` is available.');
      } else {
        throw err;
      }
    }
  }

  async stop() {
    if (this.server === undefined) {
      return;
    }

    this.log.debug('stopping http --> https redirect server');
    await this.server.stop();
    this.server = undefined;
  }

}

exports.HttpsRedirectServer = HttpsRedirectServer;