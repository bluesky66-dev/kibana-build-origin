"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthenticationService = void 0;

var _errors = require("../errors");

var _api_keys = require("./api_keys");

var _authenticator = require("./authenticator");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class AuthenticationService {
  constructor(logger) {
    this.logger = logger;

    _defineProperty(this, "license", void 0);

    _defineProperty(this, "authenticator", void 0);
  }

  setup({
    http,
    license
  }) {
    this.license = license;
    http.registerAuth(async (request, response, t) => {
      if (!license.isLicenseAvailable()) {
        this.logger.error('License is not available, authentication is not possible.');
        return response.customError({
          body: 'License is not available.',
          statusCode: 503,
          headers: {
            'Retry-After': '30'
          }
        });
      } // If security is disabled, then continue with no user credentials.


      if (!license.isEnabled()) {
        this.logger.debug('Current license does not support any security features, authentication is not needed.');
        return t.authenticated();
      }

      if (!this.authenticator) {
        this.logger.error('Authentication sub-system is not fully initialized yet.');
        return response.customError({
          body: 'Authentication sub-system is not fully initialized yet.',
          statusCode: 503,
          headers: {
            'Retry-After': '30'
          }
        });
      }

      let authenticationResult;

      try {
        authenticationResult = await this.authenticator.authenticate(request);
      } catch (err) {
        this.logger.error(err);
        return response.internalError();
      }

      if (authenticationResult.succeeded()) {
        return t.authenticated({
          state: authenticationResult.user,
          requestHeaders: authenticationResult.authHeaders,
          responseHeaders: authenticationResult.authResponseHeaders
        });
      }

      if (authenticationResult.redirected()) {
        // Some authentication mechanisms may require user to be redirected to another location to
        // initiate or complete authentication flow. It can be Kibana own login page for basic
        // authentication (username and password) or arbitrary external page managed by 3rd party
        // Identity Provider for SSO authentication mechanisms. Authentication provider is the one who
        // decides what location user should be redirected to.
        return t.redirected({
          location: authenticationResult.redirectURL,
          ...(authenticationResult.authResponseHeaders || {})
        });
      }

      if (authenticationResult.failed()) {
        this.logger.info(`Authentication attempt failed: ${authenticationResult.error.message}`);
        const error = authenticationResult.error; // proxy Elasticsearch "native" errors

        const statusCode = (0, _errors.getErrorStatusCode)(error);

        if (typeof statusCode === 'number') {
          return response.customError({
            body: error,
            statusCode,
            headers: authenticationResult.authResponseHeaders
          });
        }

        return response.unauthorized({
          headers: authenticationResult.authResponseHeaders
        });
      }

      this.logger.debug('Could not handle authentication attempt');
      return t.notHandled();
    });
    this.logger.debug('Successfully registered core authentication handler.');
  }

  start({
    audit,
    config,
    clusterClient,
    featureUsageService,
    http,
    legacyAuditLogger,
    loggers,
    session
  }) {
    const apiKeys = new _api_keys.APIKeys({
      clusterClient,
      logger: this.logger.get('api-key'),
      license: this.license
    });
    /**
     * Retrieves server protocol name/host name/port and merges it with `xpack.security.public` config
     * to construct a server base URL (deprecated, used by the SAML provider only).
     */

    const getServerBaseURL = () => {
      const {
        protocol,
        hostname,
        port
      } = http.getServerInfo();
      const serverConfig = {
        protocol,
        hostname,
        port,
        ...config.public
      };
      return `${serverConfig.protocol}://${serverConfig.hostname}:${serverConfig.port}`;
    };

    const getCurrentUser = request => {
      var _http$auth$get$state;

      return (_http$auth$get$state = http.auth.get(request).state) !== null && _http$auth$get$state !== void 0 ? _http$auth$get$state : null;
    };

    this.authenticator = new _authenticator.Authenticator({
      legacyAuditLogger,
      audit,
      loggers,
      clusterClient,
      basePath: http.basePath,
      config: {
        authc: config.authc
      },
      getCurrentUser,
      featureUsageService,
      getServerBaseURL,
      license: this.license,
      session
    });
    return {
      apiKeys: {
        areAPIKeysEnabled: apiKeys.areAPIKeysEnabled.bind(apiKeys),
        create: apiKeys.create.bind(apiKeys),
        grantAsInternalUser: apiKeys.grantAsInternalUser.bind(apiKeys),
        invalidate: apiKeys.invalidate.bind(apiKeys),
        invalidateAsInternalUser: apiKeys.invalidateAsInternalUser.bind(apiKeys)
      },
      login: this.authenticator.login.bind(this.authenticator),
      logout: this.authenticator.logout.bind(this.authenticator),
      acknowledgeAccessAgreement: this.authenticator.acknowledgeAccessAgreement.bind(this.authenticator),

      /**
       * Retrieves currently authenticated user associated with the specified request.
       * @param request
       */
      getCurrentUser
    };
  }

}

exports.AuthenticationService = AuthenticationService;