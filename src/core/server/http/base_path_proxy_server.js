"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasePathProxyServer = void 0;

var _url = _interopRequireDefault(require("url"));

var _https = require("https");

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _configSchema = require("@kbn/config-schema");

var _h2o = _interopRequireDefault(require("@hapi/h2o2"));

var _lodash = require("lodash");

var _operators = require("rxjs/operators");

var _http_tools = require("./http_tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const alphabet = 'abcdefghijklmnopqrztuvwxyz'.split('');

class BasePathProxyServer {
  get basePath() {
    return this.httpConfig.basePath;
  }

  get targetPort() {
    return this.devConfig.basePathProxyTargetPort;
  }

  get host() {
    return this.httpConfig.host;
  }

  get port() {
    return this.httpConfig.port;
  }

  constructor(log, httpConfig, devConfig) {
    this.log = log;
    this.httpConfig = httpConfig;
    this.devConfig = devConfig;

    _defineProperty(this, "server", void 0);

    _defineProperty(this, "httpsAgent", void 0);

    const ONE_GIGABYTE = 1024 * 1024 * 1024;
    httpConfig.maxPayload = new _configSchema.ByteSizeValue(ONE_GIGABYTE);

    if (!httpConfig.basePath) {
      httpConfig.basePath = `/${(0, _lodash.sampleSize)(alphabet, 3).join('')}`;
    }
  }

  async start(options) {
    this.log.debug('starting basepath proxy server');
    const serverOptions = (0, _http_tools.getServerOptions)(this.httpConfig);
    const listenerOptions = (0, _http_tools.getListenerOptions)(this.httpConfig);
    this.server = (0, _http_tools.createServer)(serverOptions, listenerOptions); // Register hapi plugin that adds proxying functionality. It can be configured
    // through the route configuration object (see { handler: { proxy: ... } }).

    await this.server.register([_h2o.default]);

    if (this.httpConfig.ssl.enabled) {
      const tlsOptions = serverOptions.tls;
      this.httpsAgent = new _https.Agent({
        ca: tlsOptions.ca,
        cert: tlsOptions.cert,
        key: tlsOptions.key,
        passphrase: tlsOptions.passphrase,
        rejectUnauthorized: false
      });
    }

    this.setupRoutes(options);
    await this.server.start();
    this.log.info(`basepath proxy server running at ${_url.default.format({
      host: this.server.info.uri,
      pathname: this.httpConfig.basePath
    })}`);
  }

  async stop() {
    if (this.server === undefined) {
      return;
    }

    this.log.debug('stopping basepath proxy server');
    await this.server.stop();
    this.server = undefined;

    if (this.httpsAgent !== undefined) {
      this.httpsAgent.destroy();
      this.httpsAgent = undefined;
    }
  }

  setupRoutes({
    delayUntil,
    shouldRedirectFromOldBasePath
  }) {
    if (this.server === undefined) {
      throw new Error(`Routes cannot be set up since server is not initialized.`);
    } // Always redirect from root URL to the URL with basepath.


    this.server.route({
      handler: (request, responseToolkit) => {
        return responseToolkit.redirect(this.httpConfig.basePath);
      },
      method: 'GET',
      path: '/'
    });
    this.server.route({
      handler: {
        proxy: {
          agent: this.httpsAgent,
          passThrough: true,
          xforward: true,
          mapUri: async request => {
            return {
              // Passing in this header to merge it is a workaround until this is fixed:
              // https://github.com/hapijs/h2o2/issues/124
              headers: request.headers['content-length'] != null ? {
                'content-length': request.headers['content-length']
              } : undefined,
              uri: _url.default.format({
                hostname: request.server.info.host,
                port: this.devConfig.basePathProxyTargetPort,
                protocol: request.server.info.protocol,
                pathname: request.path,
                query: request.query
              })
            };
          }
        }
      },
      method: '*',
      options: {
        pre: [// Before we proxy request to a target port we may want to wait until some
        // condition is met (e.g. until target listener is ready).
        async (request, responseToolkit) => {
          _elasticApmNode.default.setTransactionName(`${request.method.toUpperCase()} /{basePath}/{kbnPath*}`);

          await delayUntil().pipe((0, _operators.take)(1)).toPromise();
          return responseToolkit.continue;
        }],
        validate: {
          payload: true
        }
      },
      path: `${this.httpConfig.basePath}/{kbnPath*}`
    });
    this.server.route({
      handler: {
        proxy: {
          agent: this.httpsAgent,
          passThrough: true,
          xforward: true,
          mapUri: async request => ({
            uri: _url.default.format({
              hostname: request.server.info.host,
              port: this.devConfig.basePathProxyTargetPort,
              protocol: request.server.info.protocol,
              pathname: `${this.httpConfig.basePath}/${request.params.kbnPath}`,
              query: request.query
            }),
            headers: request.headers
          })
        }
      },
      method: '*',
      options: {
        pre: [// Before we proxy request to a target port we may want to wait until some
        // condition is met (e.g. until target listener is ready).
        async (request, responseToolkit) => {
          await delayUntil().pipe((0, _operators.take)(1)).toPromise();
          return responseToolkit.continue;
        }],
        validate: {
          payload: true
        }
      },
      path: `/__UNSAFE_bypassBasePath/{kbnPath*}`
    }); // It may happen that basepath has changed, but user still uses the old one,
    // so we can try to check if that's the case and just redirect user to the
    // same URL, but with valid basepath.

    this.server.route({
      handler: (request, responseToolkit) => {
        const {
          oldBasePath,
          kbnPath = ''
        } = request.params;
        const isGet = request.method === 'get';
        const isBasepathLike = oldBasePath.length === 3;

        const newUrl = _url.default.format({
          pathname: `${this.httpConfig.basePath}/${kbnPath}`,
          query: request.query
        });

        return isGet && isBasepathLike && shouldRedirectFromOldBasePath(kbnPath) ? responseToolkit.redirect(newUrl) : responseToolkit.response('Not Found').code(404);
      },
      method: '*',
      path: `/{oldBasePath}/{kbnPath*}`
    });
  }

}

exports.BasePathProxyServer = BasePathProxyServer;