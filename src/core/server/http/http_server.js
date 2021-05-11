"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpServer = void 0;

var _inert = _interopRequireDefault(require("@hapi/inert"));

var _url = _interopRequireDefault(require("url"));

var _uuid = _interopRequireDefault(require("uuid"));

var _http_tools = require("./http_tools");

var _auth = require("./lifecycle/auth");

var _on_pre_auth = require("./lifecycle/on_pre_auth");

var _on_post_auth = require("./lifecycle/on_post_auth");

var _on_pre_routing = require("./lifecycle/on_pre_routing");

var _on_pre_response = require("./lifecycle/on_pre_response");

var _router = require("./router");

var _cookie_session_storage = require("./cookie_session_storage");

var _auth_state_storage = require("./auth_state_storage");

var _auth_headers_storage = require("./auth_headers_storage");

var _base_path_service = require("./base_path_service");

var _logging = require("./logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HttpServer {
  constructor(logger, name) {
    this.logger = logger;
    this.name = name;

    _defineProperty(this, "server", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "registeredRouters", new Set());

    _defineProperty(this, "authRegistered", false);

    _defineProperty(this, "cookieSessionStorageCreated", false);

    _defineProperty(this, "handleServerResponseEvent", void 0);

    _defineProperty(this, "stopped", false);

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "authState", void 0);

    _defineProperty(this, "authRequestHeaders", void 0);

    _defineProperty(this, "authResponseHeaders", void 0);

    this.authState = new _auth_state_storage.AuthStateStorage(() => this.authRegistered);
    this.authRequestHeaders = new _auth_headers_storage.AuthHeadersStorage();
    this.authResponseHeaders = new _auth_headers_storage.AuthHeadersStorage();
    this.log = logger.get('http', 'server', name);
  }

  isListening() {
    return this.server !== undefined && this.server.listener.listening;
  }

  registerRouter(router) {
    if (this.isListening()) {
      throw new Error('Routers can be registered only when HTTP server is stopped.');
    }

    this.registeredRouters.add(router);
  }

  async setup(config) {
    const serverOptions = (0, _http_tools.getServerOptions)(config);
    const listenerOptions = (0, _http_tools.getListenerOptions)(config);
    this.server = (0, _http_tools.createServer)(serverOptions, listenerOptions);
    await this.server.register([_inert.default]);
    this.config = config;
    const basePathService = new _base_path_service.BasePath(config.basePath, config.publicBaseUrl);
    this.setupBasePathRewrite(config, basePathService);
    this.setupConditionalCompression(config);
    this.setupResponseLogging();
    this.setupRequestStateAssignment(config);
    return {
      registerRouter: this.registerRouter.bind(this),
      registerStaticDir: this.registerStaticDir.bind(this),
      registerOnPreRouting: this.registerOnPreRouting.bind(this),
      registerOnPreAuth: this.registerOnPreAuth.bind(this),
      registerAuth: this.registerAuth.bind(this),
      registerOnPostAuth: this.registerOnPostAuth.bind(this),
      registerOnPreResponse: this.registerOnPreResponse.bind(this),
      createCookieSessionStorageFactory: cookieOptions => this.createCookieSessionStorageFactory(cookieOptions, config.basePath),
      basePath: basePathService,
      csp: config.csp,
      auth: {
        get: this.authState.get,
        isAuthenticated: this.authState.isAuthenticated
      },
      getAuthHeaders: this.authRequestHeaders.get,
      getServerInfo: () => ({
        name: config.name,
        hostname: config.host,
        port: config.port,
        protocol: this.server.info.protocol
      }),
      // Return server instance with the connection options so that we can properly
      // bridge core and the "legacy" Kibana internally. Once this bridge isn't
      // needed anymore we shouldn't return the instance from this method.
      server: this.server
    };
  }

  async start() {
    if (this.server === undefined) {
      throw new Error('Http server is not setup up yet');
    }

    if (this.stopped) {
      this.log.warn(`start called after stop`);
      return;
    }

    this.log.debug('starting http server');

    for (const router of this.registeredRouters) {
      for (const route of router.getRoutes()) {
        var _route$options$xsrfRe, _timeout$idleSocket;

        this.log.debug(`registering route handler for [${route.path}]`); // Hapi does not allow payload validation to be specified for 'head' or 'get' requests

        const validate = (0, _router.isSafeMethod)(route.method) ? undefined : {
          payload: true
        };
        const {
          authRequired,
          tags,
          body = {},
          timeout
        } = route.options;
        const {
          accepts: allow,
          maxBytes,
          output,
          parse
        } = body;
        const kibanaRouteOptions = {
          xsrfRequired: (_route$options$xsrfRe = route.options.xsrfRequired) !== null && _route$options$xsrfRe !== void 0 ? _route$options$xsrfRe : !(0, _router.isSafeMethod)(route.method)
        };
        this.server.route({
          handler: route.handler,
          method: route.method,
          path: route.path,
          options: {
            auth: this.getAuthOption(authRequired),
            app: kibanaRouteOptions,
            tags: tags ? Array.from(tags) : undefined,
            // TODO: This 'validate' section can be removed once the legacy platform is completely removed.
            // We are telling Hapi that NP routes can accept any payload, so that it can bypass the default
            // validation applied in ./http_tools#getServerOptions
            // (All NP routes are already required to specify their own validation in order to access the payload)
            validate,
            // @ts-expect-error Types are outdated and doesn't allow `payload.multipart` to be `true`
            payload: [allow, maxBytes, output, parse, timeout === null || timeout === void 0 ? void 0 : timeout.payload].some(x => x !== undefined) ? {
              allow,
              maxBytes,
              output,
              parse,
              timeout: timeout === null || timeout === void 0 ? void 0 : timeout.payload,
              multipart: true
            } : undefined,
            timeout: {
              socket: (_timeout$idleSocket = timeout === null || timeout === void 0 ? void 0 : timeout.idleSocket) !== null && _timeout$idleSocket !== void 0 ? _timeout$idleSocket : this.config.socketTimeout
            }
          }
        });
      }
    }

    await this.server.start();
    const serverPath = this.config && this.config.rewriteBasePath && this.config.basePath !== undefined ? this.config.basePath : '';
    this.log.info(`http server running at ${this.server.info.uri}${serverPath}`);
  }

  async stop() {
    this.stopped = true;

    if (this.server === undefined) {
      return;
    }

    const hasStarted = this.server.info.started > 0;

    if (hasStarted) {
      this.log.debug('stopping http server');

      if (this.handleServerResponseEvent) {
        this.server.events.removeListener('response', this.handleServerResponseEvent);
      }

      await this.server.stop();
    }
  }

  getAuthOption(authRequired = true) {
    if (this.authRegistered === false) return undefined;

    if (authRequired === true) {
      return {
        mode: 'required'
      };
    }

    if (authRequired === 'optional') {
      return {
        mode: 'optional'
      };
    }

    if (authRequired === false) {
      return false;
    }
  }

  setupBasePathRewrite(config, basePathService) {
    if (config.basePath === undefined || !config.rewriteBasePath) {
      return;
    }

    this.registerOnPreRouting((request, response, toolkit) => {
      const oldUrl = request.url.pathname + request.url.search;
      const newURL = basePathService.remove(oldUrl);
      const shouldRedirect = newURL !== oldUrl;

      if (shouldRedirect) {
        return toolkit.rewriteUrl(newURL);
      }

      return response.notFound();
    });
  }

  setupConditionalCompression(config) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopped) {
      this.log.warn(`setupConditionalCompression called after stop`);
    }

    const {
      enabled,
      referrerWhitelist: list
    } = config.compression;

    if (!enabled) {
      this.log.debug('HTTP compression is disabled');
      this.server.ext('onRequest', (request, h) => {
        request.info.acceptEncoding = '';
        return h.continue;
      });
    } else if (list) {
      this.log.debug(`HTTP compression is only enabled for any referrer in the following: ${list}`);
      this.server.ext('onRequest', (request, h) => {
        const {
          referrer
        } = request.info;

        if (referrer !== '') {
          const {
            hostname
          } = _url.default.parse(referrer);

          if (!hostname || !list.includes(hostname)) {
            request.info.acceptEncoding = '';
          }
        }

        return h.continue;
      });
    }
  }

  setupResponseLogging() {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopped) {
      this.log.warn(`setupResponseLogging called after stop`);
    }

    const log = this.logger.get('http', 'server', 'response');

    this.handleServerResponseEvent = request => {
      const {
        message,
        ...meta
      } = (0, _logging.getEcsResponseLog)(request, this.log);
      log.debug(message, meta);
    };

    this.server.events.on('response', this.handleServerResponseEvent);
  }

  setupRequestStateAssignment(config) {
    this.server.ext('onRequest', (request, responseToolkit) => {
      var _request$app;

      request.app = { ...((_request$app = request.app) !== null && _request$app !== void 0 ? _request$app : {}),
        requestId: (0, _http_tools.getRequestId)(request, config.requestId),
        requestUuid: _uuid.default.v4()
      };
      return responseToolkit.continue;
    });
  }

  registerOnPreAuth(fn) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopped) {
      this.log.warn(`registerOnPreAuth called after stop`);
    }

    this.server.ext('onPreAuth', (0, _on_pre_auth.adoptToHapiOnPreAuth)(fn, this.log));
  }

  registerOnPostAuth(fn) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopped) {
      this.log.warn(`registerOnPostAuth called after stop`);
    }

    this.server.ext('onPostAuth', (0, _on_post_auth.adoptToHapiOnPostAuthFormat)(fn, this.log));
  }

  registerOnPreRouting(fn) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopped) {
      this.log.warn(`registerOnPreRouting called after stop`);
    }

    this.server.ext('onRequest', (0, _on_pre_routing.adoptToHapiOnRequest)(fn, this.log));
  }

  registerOnPreResponse(fn) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopped) {
      this.log.warn(`registerOnPreResponse called after stop`);
    }

    this.server.ext('onPreResponse', (0, _on_pre_response.adoptToHapiOnPreResponseFormat)(fn, this.log));
  }

  async createCookieSessionStorageFactory(cookieOptions, basePath) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopped) {
      this.log.warn(`createCookieSessionStorageFactory called after stop`);
    }

    if (this.cookieSessionStorageCreated) {
      throw new Error('A cookieSessionStorageFactory was already created');
    }

    this.cookieSessionStorageCreated = true;
    const sessionStorageFactory = await (0, _cookie_session_storage.createCookieSessionStorageFactory)(this.logger.get('http', 'server', this.name, 'cookie-session-storage'), this.server, cookieOptions, basePath);
    return sessionStorageFactory;
  }

  registerAuth(fn) {
    if (this.server === undefined) {
      throw new Error('Server is not created yet');
    }

    if (this.stopped) {
      this.log.warn(`registerAuth called after stop`);
    }

    if (this.authRegistered) {
      throw new Error('Auth interceptor was already registered');
    }

    this.authRegistered = true;
    this.server.auth.scheme('login', () => ({
      authenticate: (0, _auth.adoptToHapiAuthFormat)(fn, this.log, (req, {
        state,
        requestHeaders,
        responseHeaders
      }) => {
        this.authState.set(req, state);

        if (responseHeaders) {
          this.authResponseHeaders.set(req, responseHeaders);
        }

        if (requestHeaders) {
          this.authRequestHeaders.set(req, requestHeaders); // we mutate headers only for the backward compatibility with the legacy platform.
          // where some plugin read directly from headers to identify whether a user is authenticated.

          Object.assign(req.headers, requestHeaders);
        }
      })
    }));
    this.server.auth.strategy('session', 'login'); // The default means that the `session` strategy that is based on `login` schema defined above will be
    // automatically assigned to all routes that don't contain an auth config.
    // should be applied for all routes if they don't specify auth strategy in route declaration
    // https://github.com/hapijs/hapi/blob/master/API.md#-serverauthdefaultoptions

    this.server.auth.default('session');
    this.registerOnPreResponse((request, preResponseInfo, t) => {
      const authResponseHeaders = this.authResponseHeaders.get(request);
      return t.next({
        headers: authResponseHeaders
      });
    });
  }

  registerStaticDir(path, dirPath) {
    if (this.server === undefined) {
      throw new Error('Http server is not setup up yet');
    }

    if (this.stopped) {
      this.log.warn(`registerStaticDir called after stop`);
    }

    this.server.route({
      path,
      method: 'GET',
      handler: {
        directory: {
          path: dirPath,
          listing: false,
          lookupCompressed: true
        }
      },
      options: {
        auth: false
      }
    });
  }

}

exports.HttpServer = HttpServer;