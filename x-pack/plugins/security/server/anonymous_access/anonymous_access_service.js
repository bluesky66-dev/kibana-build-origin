"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnonymousAccessService = void 0;

var _server = require("../../../../../src/core/server");

var _common = require("../../../spaces/common");

var _constants = require("../../common/constants");

var _authentication = require("../authentication");

var _errors = require("../errors");

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
/**
 * Service that manages various aspects of the anonymous access.
 */


class AnonymousAccessService {
  /**
   * Indicates whether anonymous access is enabled.
   */

  /**
   * Defines HTTP authorization header that should be used to authenticate request.
   */
  constructor(logger, getConfig) {
    this.logger = logger;
    this.getConfig = getConfig;

    _defineProperty(this, "isAnonymousAccessEnabled", false);

    _defineProperty(this, "httpAuthorizationHeader", null);
  }

  setup() {
    const config = this.getConfig();
    const anonymousProvider = config.authc.sortedProviders.find(({
      type
    }) => type === _authentication.AnonymousAuthenticationProvider.type);
    this.isAnonymousAccessEnabled = !!anonymousProvider;
    this.httpAuthorizationHeader = anonymousProvider ? _authentication.AnonymousAuthenticationProvider.createHTTPAuthorizationHeader(config.authc.providers.anonymous[anonymousProvider.name].credentials) : null;
  }

  start({
    basePath,
    capabilities,
    clusterClient,
    spaces
  }) {
    const config = this.getConfig();
    const anonymousProvider = config.authc.sortedProviders.find(({
      type
    }) => type === _authentication.AnonymousAuthenticationProvider.type); // We don't need to add any special parameters to the URL if any of the following is true:
    // * anonymous provider isn't enabled
    // * anonymous provider is enabled, but it's a default authentication mechanism

    const anonymousIsDefault = !config.authc.selector.enabled && anonymousProvider === config.authc.sortedProviders[0];
    return {
      isAnonymousAccessEnabled: this.isAnonymousAccessEnabled,
      accessURLParameters: anonymousProvider && !anonymousIsDefault ? Object.freeze(new Map([[_constants.AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER, anonymousProvider.name]])) : null,
      getCapabilities: async request => {
        this.logger.debug('Retrieving capabilities of the anonymous service account.');
        let useDefaultCapabilities = false;

        if (!this.isAnonymousAccessEnabled) {
          this.logger.warn('Default capabilities will be returned since anonymous access is not enabled.');
          useDefaultCapabilities = true;
        } else if (!(await this.canAuthenticateAnonymousServiceAccount(clusterClient))) {
          this.logger.warn(`Default capabilities will be returned since anonymous service account cannot authenticate.`);
          useDefaultCapabilities = true;
        } // We should use credentials of the anonymous service account instead of credentials of the
        // current user to get capabilities relevant to the anonymous access itself.


        const fakeAnonymousRequest = this.createFakeAnonymousRequest({
          authenticateRequest: !useDefaultCapabilities
        });
        const spaceId = spaces === null || spaces === void 0 ? void 0 : spaces.getSpaceId(request);

        if (spaceId) {
          basePath.set(fakeAnonymousRequest, (0, _common.addSpaceIdToPath)('/', spaceId));
        }

        try {
          return await capabilities.resolveCapabilities(fakeAnonymousRequest, {
            useDefaultCapabilities
          });
        } catch (err) {
          this.logger.error(`Failed to retrieve anonymous service account capabilities: ${(0, _errors.getDetailedErrorMessage)(err)}`);
          throw err;
        }
      }
    };
  }
  /**
   * Checks if anonymous service account can authenticate to Elasticsearch using currently configured credentials.
   * @param clusterClient
   */


  async canAuthenticateAnonymousServiceAccount(clusterClient) {
    try {
      await clusterClient.asScoped(this.createFakeAnonymousRequest({
        authenticateRequest: true
      })).asCurrentUser.security.authenticate();
    } catch (err) {
      this.logger.warn(`Failed to authenticate anonymous service account: ${(0, _errors.getDetailedErrorMessage)(err)}`);

      if ((0, _errors.getErrorStatusCode)(err) === 401) {
        return false;
      }

      throw err;
    }

    return true;
  }
  /**
   * Creates a fake Kibana request optionally attributed with the anonymous service account
   * credentials to get the list of capabilities.
   * @param authenticateRequest Indicates whether or not we should include authorization header with
   * anonymous service account credentials.
   */


  createFakeAnonymousRequest({
    authenticateRequest
  }) {
    return _server.KibanaRequest.from({
      headers: authenticateRequest && this.httpAuthorizationHeader ? {
        authorization: this.httpAuthorizationHeader.toString()
      } : {},
      // This flag is essential for the security capability switcher that relies on it to decide if
      // it should perform a privileges check or automatically disable all capabilities.
      auth: {
        isAuthenticated: authenticateRequest
      },
      path: '/',
      route: {
        settings: {}
      },
      url: {
        href: '/'
      },
      raw: {
        req: {
          url: '/'
        }
      }
    });
  }

}

exports.AnonymousAccessService = AnonymousAccessService;