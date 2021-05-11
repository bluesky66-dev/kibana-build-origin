"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Authenticator = void 0;

var _server = require("../../../../../src/core/server");

var _constants = require("../../common/constants");

var _model = require("../../common/model");

var _audit = require("../audit");

var _errors = require("../errors");

var _providers = require("./providers");

var _authentication_result = require("./authentication_result");

var _deauthentication_result = require("./deauthentication_result");

var _tokens = require("./tokens");

var _can_redirect_request = require("./can_redirect_request");

var _http_authentication = require("./http_authentication");

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
} // Mapping between provider key defined in the config and authentication
// provider class that can handle specific authentication mechanism.


const providerMap = new Map([[_providers.BasicAuthenticationProvider.type, _providers.BasicAuthenticationProvider], [_providers.KerberosAuthenticationProvider.type, _providers.KerberosAuthenticationProvider], [_providers.SAMLAuthenticationProvider.type, _providers.SAMLAuthenticationProvider], [_providers.TokenAuthenticationProvider.type, _providers.TokenAuthenticationProvider], [_providers.OIDCAuthenticationProvider.type, _providers.OIDCAuthenticationProvider], [_providers.PKIAuthenticationProvider.type, _providers.PKIAuthenticationProvider], [_providers.AnonymousAuthenticationProvider.type, _providers.AnonymousAuthenticationProvider]]);
/**
 * The route to the access agreement UI.
 */

const ACCESS_AGREEMENT_ROUTE = '/security/access_agreement';
/**
 * The route to the overwritten session UI.
 */

const OVERWRITTEN_SESSION_ROUTE = '/security/overwritten_session';

function assertRequest(request) {
  if (!(request instanceof _server.KibanaRequest)) {
    throw new Error(`Request should be a valid "KibanaRequest" instance, was [${typeof request}].`);
  }
}

function assertLoginAttempt(attempt) {
  if (!isLoginAttemptWithProviderType(attempt) && !isLoginAttemptWithProviderName(attempt)) {
    throw new Error('Login attempt should be an object with non-empty "provider.type" or "provider.name" property.');
  }
}

function isLoginAttemptWithProviderName(attempt) {
  var _provider, _provider2;

  return typeof attempt === 'object' && (attempt === null || attempt === void 0 ? void 0 : (_provider = attempt.provider) === null || _provider === void 0 ? void 0 : _provider.name) && typeof (attempt === null || attempt === void 0 ? void 0 : (_provider2 = attempt.provider) === null || _provider2 === void 0 ? void 0 : _provider2.name) === 'string';
}

function isLoginAttemptWithProviderType(attempt) {
  var _provider3, _provider4;

  return typeof attempt === 'object' && (attempt === null || attempt === void 0 ? void 0 : (_provider3 = attempt.provider) === null || _provider3 === void 0 ? void 0 : _provider3.type) && typeof (attempt === null || attempt === void 0 ? void 0 : (_provider4 = attempt.provider) === null || _provider4 === void 0 ? void 0 : _provider4.type) === 'string';
}

function isSessionAuthenticated(sessionValue) {
  return !!(sessionValue !== null && sessionValue !== void 0 && sessionValue.username);
}
/**
 * Instantiates authentication provider based on the provider key from config.
 * @param providerType Provider type key.
 * @param options Options to pass to provider's constructor.
 * @param providerSpecificOptions Options that are specific to {@param providerType}.
 */


function instantiateProvider(providerType, options, providerSpecificOptions) {
  const ProviderClassName = providerMap.get(providerType);

  if (!ProviderClassName) {
    throw new Error(`Unsupported authentication provider name: ${providerType}.`);
  }

  return new ProviderClassName(options, providerSpecificOptions);
}
/**
 * Authenticator is responsible for authentication of the request using chain of
 * authentication providers. The chain is essentially a prioritized list of configured
 * providers (typically of various types). The order of the list determines the order in
 * which the providers will be consulted. During the authentication process, Authenticator
 * will try to authenticate the request via one provider at a time. Once one of the
 * providers successfully authenticates the request, the authentication is considered
 * to be successful and the authenticated user will be associated with the request.
 * If provider cannot authenticate the request, the next in line provider in the chain
 * will be used. If all providers in the chain could not authenticate the request,
 * the authentication is then considered to be unsuccessful and an authentication error
 * will be returned.
 */


class Authenticator {
  /**
   * List of configured and instantiated authentication providers.
   */

  /**
   * Session instance.
   */

  /**
   * Internal authenticator logger.
   */

  /**
   * Instantiates Authenticator and bootstrap configured providers.
   * @param options Authenticator options.
   */
  constructor(options) {
    this.options = options;

    _defineProperty(this, "providers", void 0);

    _defineProperty(this, "session", this.options.session);

    _defineProperty(this, "logger", this.options.loggers.get('authenticator'));

    const providerCommonOptions = {
      client: this.options.clusterClient,
      basePath: this.options.basePath,
      tokens: new _tokens.Tokens({
        client: this.options.clusterClient.asInternalUser,
        logger: this.options.loggers.get('tokens')
      }),
      getServerBaseURL: this.options.getServerBaseURL
    };
    this.providers = new Map(this.options.config.authc.sortedProviders.map(({
      type,
      name
    }) => {
      var _this$options$config$;

      this.logger.debug(`Enabling "${name}" (${type}) authentication provider.`);
      return [name, instantiateProvider(type, Object.freeze({ ...providerCommonOptions,
        name,
        logger: options.loggers.get(type, name),
        urls: {
          loggedOut: request => this.getLoggedOutURL(request, type)
        }
      }), (_this$options$config$ = this.options.config.authc.providers[type]) === null || _this$options$config$ === void 0 ? void 0 : _this$options$config$[name])];
    })); // For the BWC reasons we always include HTTP authentication provider unless it's explicitly disabled.

    if (this.options.config.authc.http.enabled) {
      this.setupHTTPAuthenticationProvider(Object.freeze({ ...providerCommonOptions,
        name: '__http__',
        logger: options.loggers.get(_providers.HTTPAuthenticationProvider.type),
        urls: {
          loggedOut: request => this.getLoggedOutURL(request, _providers.HTTPAuthenticationProvider.type)
        }
      }));
    }

    if (this.providers.size === 0) {
      throw new Error('No authentication provider is configured. Verify `xpack.security.authc.*` config value.');
    }
  }
  /**
   * Performs the initial login request using the provider login attempt description.
   * @param request Request instance.
   * @param attempt Login attempt description.
   */


  async login(request, attempt) {
    assertRequest(request);
    assertLoginAttempt(attempt);
    const existingSessionValue = await this.getSessionValue(request); // Login attempt can target specific provider by its name (e.g. chosen at the Login Selector UI)
    // or a group of providers with the specified type (e.g. in case of 3rd-party initiated login
    // attempts we may not know what provider exactly can handle that attempt and we have to try
    // every enabled provider of the specified type).

    const providers = isLoginAttemptWithProviderName(attempt) && this.providers.has(attempt.provider.name) ? [[attempt.provider.name, this.providers.get(attempt.provider.name)]] : isLoginAttemptWithProviderType(attempt) ? [...this.providerIterator(existingSessionValue === null || existingSessionValue === void 0 ? void 0 : existingSessionValue.provider.name)].filter(([, {
      type
    }]) => type === attempt.provider.type) : [];

    if (providers.length === 0) {
      this.logger.debug(`Login attempt for provider with ${isLoginAttemptWithProviderName(attempt) ? `name ${attempt.provider.name}` : `type "${attempt.provider.type}"`} is detected, but it isn't enabled.`);
      return _authentication_result.AuthenticationResult.notHandled();
    }

    for (const [providerName, provider] of providers) {
      // Check if current session has been set by this provider.
      const ownsSession = (existingSessionValue === null || existingSessionValue === void 0 ? void 0 : existingSessionValue.provider.name) === providerName && (existingSessionValue === null || existingSessionValue === void 0 ? void 0 : existingSessionValue.provider.type) === provider.type;
      const authenticationResult = await provider.login(request, attempt.value, ownsSession ? existingSessionValue.state : null);

      if (!authenticationResult.notHandled()) {
        const sessionUpdateResult = await this.updateSessionValue(request, {
          provider: {
            type: provider.type,
            name: providerName
          },
          authenticationResult,
          existingSessionValue
        }); // Checking for presence of `user` object to determine success state rather than
        // `success()` method since that indicates a successful authentication and `redirect()`
        // could also (but does not always) authenticate a user successfully (e.g. SAML flow)

        if (authenticationResult.user || authenticationResult.failed()) {
          const auditLogger = this.options.audit.asScoped(request);
          auditLogger.log((0, _audit.userLoginEvent)({
            authenticationResult,
            authenticationProvider: providerName,
            authenticationType: provider.type
          }));
        }

        return this.handlePreAccessRedirects(request, authenticationResult, sessionUpdateResult, attempt.redirectURL);
      }
    }

    return _authentication_result.AuthenticationResult.notHandled();
  }
  /**
   * Performs request authentication using configured chain of authentication providers.
   * @param request Request instance.
   */


  async authenticate(request) {
    var _existingSessionValue;

    assertRequest(request);
    const existingSessionValue = await this.getSessionValue(request);
    const suggestedProviderName = (_existingSessionValue = existingSessionValue === null || existingSessionValue === void 0 ? void 0 : existingSessionValue.provider.name) !== null && _existingSessionValue !== void 0 ? _existingSessionValue : request.url.searchParams.get(_constants.AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER);

    if (this.shouldRedirectToLoginSelector(request, existingSessionValue)) {
      this.logger.debug('Redirecting request to Login Selector.');
      return _authentication_result.AuthenticationResult.redirectTo(`${this.options.basePath.serverBasePath}/login?${_constants.NEXT_URL_QUERY_STRING_PARAMETER}=${encodeURIComponent(`${this.options.basePath.get(request)}${request.url.pathname}${request.url.search}`)}${suggestedProviderName && !existingSessionValue ? `&${_constants.AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER}=${encodeURIComponent(suggestedProviderName)}` : ''}`);
    }

    for (const [providerName, provider] of this.providerIterator(suggestedProviderName)) {
      // Check if current session has been set by this provider.
      const ownsSession = (existingSessionValue === null || existingSessionValue === void 0 ? void 0 : existingSessionValue.provider.name) === providerName && (existingSessionValue === null || existingSessionValue === void 0 ? void 0 : existingSessionValue.provider.type) === provider.type;
      const authenticationResult = await provider.authenticate(request, ownsSession ? existingSessionValue.state : null);

      if (!authenticationResult.notHandled()) {
        const sessionUpdateResult = await this.updateSessionValue(request, {
          provider: {
            type: provider.type,
            name: providerName
          },
          authenticationResult,
          existingSessionValue
        });
        return (0, _can_redirect_request.canRedirectRequest)(request) ? this.handlePreAccessRedirects(request, authenticationResult, sessionUpdateResult) : authenticationResult;
      }
    }

    return _authentication_result.AuthenticationResult.notHandled();
  }
  /**
   * Deauthenticates current request.
   * @param request Request instance.
   */


  async logout(request) {
    var _sessionValue$provide;

    assertRequest(request);
    const sessionValue = await this.getSessionValue(request);
    const suggestedProviderName = (_sessionValue$provide = sessionValue === null || sessionValue === void 0 ? void 0 : sessionValue.provider.name) !== null && _sessionValue$provide !== void 0 ? _sessionValue$provide : request.url.searchParams.get(_constants.LOGOUT_PROVIDER_QUERY_STRING_PARAMETER);

    if (suggestedProviderName) {
      await this.session.clear(request); // Provider name may be passed in a query param and sourced from the browser's local storage;
      // hence, we can't assume that this provider exists, so we have to check it.

      const provider = this.providers.get(suggestedProviderName);

      if (provider) {
        var _sessionValue$state;

        return provider.logout(request, (_sessionValue$state = sessionValue === null || sessionValue === void 0 ? void 0 : sessionValue.state) !== null && _sessionValue$state !== void 0 ? _sessionValue$state : null);
      }
    } else {
      // In case logout is called and we cannot figure out what provider is supposed to handle it,
      // we should iterate through all providers and let them decide if they can perform a logout.
      // This can be necessary if some 3rd-party initiates logout. And even if user doesn't have an
      // active session already some providers can still properly respond to the 3rd-party logout
      // request. For example SAML provider can process logout request encoded in `SAMLRequest`
      // query string parameter.
      for (const [, provider] of this.providerIterator()) {
        const deauthenticationResult = await provider.logout(request);

        if (!deauthenticationResult.notHandled()) {
          return deauthenticationResult;
        }
      }
    }

    return _deauthentication_result.DeauthenticationResult.notHandled();
  }
  /**
   * Acknowledges access agreement on behalf of the currently authenticated user.
   * @param request Request instance.
   */


  async acknowledgeAccessAgreement(request) {
    assertRequest(request);
    const existingSessionValue = await this.getSessionValue(request);
    const currentUser = this.options.getCurrentUser(request);

    if (!existingSessionValue || !currentUser) {
      throw new Error('Cannot acknowledge access agreement for unauthenticated user.');
    }

    if (!this.options.license.getFeatures().allowAccessAgreement) {
      throw new Error('Current license does not allow access agreement acknowledgement.');
    }

    await this.session.update(request, { ...existingSessionValue,
      accessAgreementAcknowledged: true
    });
    this.options.legacyAuditLogger.accessAgreementAcknowledged(currentUser.username, existingSessionValue.provider);
    this.options.featureUsageService.recordPreAccessAgreementUsage();
  }
  /**
   * Initializes HTTP Authentication provider and appends it to the end of the list of enabled
   * authentication providers.
   * @param options Common provider options.
   */


  setupHTTPAuthenticationProvider(options) {
    const supportedSchemes = new Set(this.options.config.authc.http.schemes.map(scheme => scheme.toLowerCase())); // If `autoSchemesEnabled` is set we should allow schemes that other providers use to
    // authenticate requests with Elasticsearch.

    if (this.options.config.authc.http.autoSchemesEnabled) {
      for (const provider of this.providers.values()) {
        const supportedScheme = provider.getHTTPAuthenticationScheme();

        if (supportedScheme) {
          supportedSchemes.add(supportedScheme.toLowerCase());
        }
      }
    }

    if (this.providers.has(options.name)) {
      throw new Error(`Provider name "${options.name}" is reserved.`);
    }

    this.providers.set(options.name, new _providers.HTTPAuthenticationProvider(options, {
      supportedSchemes
    }));
  }
  /**
   * Returns provider iterator starting from the suggested provider if any.
   * @param suggestedProviderName Optional name of the provider to return first.
   */


  *providerIterator(suggestedProviderName) {
    // If there is no provider suggested or suggested provider isn't configured, let's use the order
    // providers are configured in. Otherwise return suggested provider first, and only then the rest
    // of providers.
    if (!suggestedProviderName || !this.providers.has(suggestedProviderName)) {
      yield* this.providers;
    } else {
      yield [suggestedProviderName, this.providers.get(suggestedProviderName)];

      for (const [providerName, provider] of this.providers) {
        if (providerName !== suggestedProviderName) {
          yield [providerName, provider];
        }
      }
    }
  }
  /**
   * Extracts session value for the specified request. Under the hood it can clear session if it
   * belongs to the provider that is not available.
   * @param request Request instance.
   */


  async getSessionValue(request) {
    var _this$providers$get;

    const existingSessionValue = await this.session.get(request); // If we detect that for some reason we have a session stored for the provider that is not
    // available anymore (e.g. when user was logged in with one provider, but then configuration has
    // changed and that provider is no longer available), then we should clear session entirely.

    if (existingSessionValue && ((_this$providers$get = this.providers.get(existingSessionValue.provider.name)) === null || _this$providers$get === void 0 ? void 0 : _this$providers$get.type) !== existingSessionValue.provider.type) {
      this.logger.warn(`Attempted to retrieve session for the "${existingSessionValue.provider.type}/${existingSessionValue.provider.name}" provider, but it is not configured.`);
      await this.session.clear(request);
      return null;
    }

    return existingSessionValue;
  }
  /**
   * Updates, creates, extends or clears session value based on the received authentication result.
   * @param request Request instance.
   * @param provider Provider that produced provided authentication result.
   * @param authenticationResult Result of the authentication or login attempt.
   * @param existingSessionValue Value of the existing session if any.
   */


  async updateSessionValue(request, {
    provider,
    authenticationResult,
    existingSessionValue
  }) {
    var _existingSessionValue2, _existingSessionValue3;

    if (!existingSessionValue && !authenticationResult.shouldUpdateState()) {
      return null;
    } // Provider can specifically ask to clear session by setting it to `null` even if authentication
    // attempt didn't fail.


    if (authenticationResult.shouldClearState()) {
      this.logger.debug('Authentication provider requested to invalidate existing session.');
      await this.session.clear(request);
      return null;
    }

    const ownsSession = ((_existingSessionValue2 = existingSessionValue) === null || _existingSessionValue2 === void 0 ? void 0 : _existingSessionValue2.provider.name) === provider.name && ((_existingSessionValue3 = existingSessionValue) === null || _existingSessionValue3 === void 0 ? void 0 : _existingSessionValue3.provider.type) === provider.type; // If provider owned the session, but failed to authenticate anyway, that likely means that
    // session is not valid and we should clear it. Unexpected errors should not cause session
    // invalidation (e.g. when Elasticsearch is temporarily unavailable).

    if (authenticationResult.failed()) {
      if (ownsSession && (0, _errors.getErrorStatusCode)(authenticationResult.error) === 401) {
        this.logger.debug('Authentication attempt failed, existing session will be invalidated.');
        await this.session.clear(request);
      }

      return null;
    } // If authentication succeeds or requires redirect we should automatically extend existing user session,
    // unless authentication has been triggered by a system API request. In case provider explicitly returns new
    // state we should store it in the session regardless of whether it's a system API request or not.


    const sessionShouldBeUpdatedOrExtended = (authenticationResult.succeeded() || authenticationResult.redirected()) && (authenticationResult.shouldUpdateState() || !request.isSystemRequest && ownsSession);

    if (!sessionShouldBeUpdatedOrExtended) {
      return ownsSession ? {
        value: existingSessionValue,
        overwritten: false
      } : null;
    }

    const isExistingSessionAuthenticated = isSessionAuthenticated(existingSessionValue);
    const isNewSessionAuthenticated = !!authenticationResult.user;
    const providerHasChanged = !!existingSessionValue && !ownsSession;
    const sessionHasBeenAuthenticated = !!existingSessionValue && !isExistingSessionAuthenticated && isNewSessionAuthenticated;
    const usernameHasChanged = isExistingSessionAuthenticated && isNewSessionAuthenticated && authenticationResult.user.username !== existingSessionValue.username; // There are 3 cases when we SHOULD invalidate existing session and create a new one with
    // regenerated SID/AAD:
    // 1. If a new session must be created while existing is still valid (e.g. IdP initiated login
    // for the user with active session created by another provider).
    // 2. If the existing session was unauthenticated (e.g. intermediate session used during SSO
    // handshake) and can now be turned into an authenticated one.
    // 3. If we re-authenticated user with another username (e.g. during IdP initiated SSO login or
    // when client certificate changes and PKI provider needs to re-authenticate user).

    if (providerHasChanged) {
      this.logger.debug('Authentication provider has changed, existing session will be invalidated.');
      await this.session.clear(request);
      existingSessionValue = null;
    } else if (sessionHasBeenAuthenticated) {
      this.logger.debug('Session is authenticated, existing unauthenticated session will be invalidated.');
      await this.session.clear(request);
      existingSessionValue = null;
    } else if (usernameHasChanged) {
      this.logger.debug('Username has changed, existing session will be invalidated.');
      await this.session.clear(request);
      existingSessionValue = null;
    }

    let newSessionValue;

    if (!existingSessionValue) {
      var _authenticationResult;

      newSessionValue = await this.session.create(request, {
        username: (_authenticationResult = authenticationResult.user) === null || _authenticationResult === void 0 ? void 0 : _authenticationResult.username,
        provider,
        state: authenticationResult.shouldUpdateState() ? authenticationResult.state : null
      });
    } else if (authenticationResult.shouldUpdateState()) {
      newSessionValue = await this.session.update(request, { ...existingSessionValue,
        state: authenticationResult.shouldUpdateState() ? authenticationResult.state : existingSessionValue.state
      });
    } else {
      newSessionValue = await this.session.extend(request, existingSessionValue);
    }

    return {
      value: newSessionValue,
      // We care only about cases when one authenticated session has been overwritten by another
      // authenticated session that belongs to a different user (different name or provider/realm).
      overwritten: isExistingSessionAuthenticated && isNewSessionAuthenticated && (providerHasChanged || usernameHasChanged)
    };
  }
  /**
   * Checks whether request should be redirected to the Login Selector UI.
   * @param request Request instance.
   * @param sessionValue Current session value if any.
   */


  shouldRedirectToLoginSelector(request, sessionValue) {
    // Request should be redirected to Login Selector UI only if all following conditions are met:
    //  1. Request can be redirected (not API call)
    //  2. Request is not authenticated yet
    //  3. Login Selector UI is enabled
    //  4. Request isn't attributed with HTTP Authorization header
    return (0, _can_redirect_request.canRedirectRequest)(request) && !isSessionAuthenticated(sessionValue) && this.options.config.authc.selector.enabled && _http_authentication.HTTPAuthorizationHeader.parseFromRequest(request) == null;
  }
  /**
   * Checks whether request should be redirected to the Access Agreement UI.
   * @param sessionValue Current session value if any.
   */


  shouldRedirectToAccessAgreement(sessionValue) {
    var _sessionValue$provide2, _sessionValue$provide3; // Request should be redirected to Access Agreement UI only if all following conditions are met:
    //  1. Request can be redirected (not API call)
    //  2. Request is authenticated, but user hasn't acknowledged access agreement in the current
    //     session yet (based on the flag we store in the session)
    //  3. Request is authenticated by the provider that has `accessAgreement` configured
    //  4. Current license allows access agreement
    //  5. And it's not a request to the Access Agreement UI itself


    return sessionValue != null && !sessionValue.accessAgreementAcknowledged && ((_sessionValue$provide2 = this.options.config.authc.providers[sessionValue.provider.type]) === null || _sessionValue$provide2 === void 0 ? void 0 : (_sessionValue$provide3 = _sessionValue$provide2[sessionValue.provider.name]) === null || _sessionValue$provide3 === void 0 ? void 0 : _sessionValue$provide3.accessAgreement) && this.options.license.getFeatures().allowAccessAgreement;
  }
  /**
   * In some cases we'd like to redirect user to another page right after successful authentication
   * before they can access anything else in Kibana. This method makes sure we do a proper redirect
   * that would eventually lead user to a initially requested Kibana URL.
   * @param request Request instance.
   * @param authenticationResult Result of the authentication.
   * @param sessionUpdateResult Result of the session update.
   * @param redirectURL
   */


  handlePreAccessRedirects(request, authenticationResult, sessionUpdateResult, redirectURL) {
    var _sessionUpdateResult$;

    if (authenticationResult.failed() || request.url.pathname === ACCESS_AGREEMENT_ROUTE || request.url.pathname === OVERWRITTEN_SESSION_ROUTE) {
      return authenticationResult;
    }

    const isUpdatedSessionAuthenticated = isSessionAuthenticated(sessionUpdateResult === null || sessionUpdateResult === void 0 ? void 0 : sessionUpdateResult.value);
    let preAccessRedirectURL;

    if (isUpdatedSessionAuthenticated && sessionUpdateResult !== null && sessionUpdateResult !== void 0 && sessionUpdateResult.overwritten) {
      this.logger.debug('Redirecting user to the overwritten session UI.');
      preAccessRedirectURL = `${this.options.basePath.serverBasePath}${OVERWRITTEN_SESSION_ROUTE}`;
    } else if (isUpdatedSessionAuthenticated && this.shouldRedirectToAccessAgreement((_sessionUpdateResult$ = sessionUpdateResult === null || sessionUpdateResult === void 0 ? void 0 : sessionUpdateResult.value) !== null && _sessionUpdateResult$ !== void 0 ? _sessionUpdateResult$ : null)) {
      this.logger.debug('Redirecting user to the access agreement UI.');
      preAccessRedirectURL = `${this.options.basePath.serverBasePath}${ACCESS_AGREEMENT_ROUTE}`;
    } // If we need to redirect user to anywhere else before they can access Kibana we should remember
    // redirect URL in the `next` parameter. Redirect URL provided in authentication result, if any,
    // always takes precedence over what is specified in `redirectURL` parameter.


    if (preAccessRedirectURL) {
      preAccessRedirectURL = `${preAccessRedirectURL}?${_constants.NEXT_URL_QUERY_STRING_PARAMETER}=${encodeURIComponent(authenticationResult.redirectURL || redirectURL || `${this.options.basePath.get(request)}${request.url.pathname}${request.url.search}`)}`;
    } else if (redirectURL && !authenticationResult.redirectURL) {
      preAccessRedirectURL = redirectURL;
    }

    return preAccessRedirectURL ? _authentication_result.AuthenticationResult.redirectTo(preAccessRedirectURL, {
      state: authenticationResult.state,
      user: authenticationResult.user,
      authResponseHeaders: authenticationResult.authResponseHeaders
    }) : authenticationResult;
  }
  /**
   * Creates a logged out URL for the specified request and provider.
   * @param request Request that initiated logout.
   * @param providerType Type of the provider that handles logout.
   */


  getLoggedOutURL(request, providerType) {
    // The app that handles logout needs to know the reason of the logout and the URL we may need to
    // redirect user to once they log in again (e.g. when session expires).
    const searchParams = new URLSearchParams();

    for (const [key, defaultValue] of [[_constants.NEXT_URL_QUERY_STRING_PARAMETER, null], [_constants.LOGOUT_REASON_QUERY_STRING_PARAMETER, 'LOGGED_OUT']]) {
      const value = request.url.searchParams.get(key) || defaultValue;

      if (value) {
        searchParams.append(key, value);
      }
    } // Query string may contain the path where logout has been called or
    // logout reason that login page may need to know.


    return this.options.config.authc.selector.enabled || (0, _model.shouldProviderUseLoginForm)(providerType) ? `${this.options.basePath.serverBasePath}/login?${searchParams.toString()}` : `${this.options.basePath.serverBasePath}/security/logged_out?${searchParams.toString()}`;
  }

}

exports.Authenticator = Authenticator;