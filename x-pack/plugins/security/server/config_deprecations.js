"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.securityConfigDeprecationProvider = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const securityConfigDeprecationProvider = ({
  rename,
  unused
}) => [rename('sessionTimeout', 'session.idleTimeout'), rename('authProviders', 'authc.providers'), rename('audit.appender.kind', 'audit.appender.type'), rename('audit.appender.layout.kind', 'audit.appender.layout.type'), rename('audit.appender.policy.kind', 'audit.appender.policy.type'), rename('audit.appender.strategy.kind', 'audit.appender.strategy.type'), rename('audit.appender.path', 'audit.appender.fileName'), unused('authorization.legacyFallback.enabled'), unused('authc.saml.maxRedirectURLSize'), // Deprecation warning for the old array-based format of `xpack.security.authc.providers`.
(settings, fromPath, log) => {
  var _settings$xpack, _settings$xpack$secur, _settings$xpack$secur2;

  if (Array.isArray(settings === null || settings === void 0 ? void 0 : (_settings$xpack = settings.xpack) === null || _settings$xpack === void 0 ? void 0 : (_settings$xpack$secur = _settings$xpack.security) === null || _settings$xpack$secur === void 0 ? void 0 : (_settings$xpack$secur2 = _settings$xpack$secur.authc) === null || _settings$xpack$secur2 === void 0 ? void 0 : _settings$xpack$secur2.providers)) {
    log('Defining `xpack.security.authc.providers` as an array of provider types is deprecated. Use extended `object` format instead.');
  }

  return settings;
}, (settings, fromPath, log) => {
  const hasProviderType = providerType => {
    var _settings$xpack2, _settings$xpack2$secu, _settings$xpack2$secu2;

    const providers = settings === null || settings === void 0 ? void 0 : (_settings$xpack2 = settings.xpack) === null || _settings$xpack2 === void 0 ? void 0 : (_settings$xpack2$secu = _settings$xpack2.security) === null || _settings$xpack2$secu === void 0 ? void 0 : (_settings$xpack2$secu2 = _settings$xpack2$secu.authc) === null || _settings$xpack2$secu2 === void 0 ? void 0 : _settings$xpack2$secu2.providers;

    if (Array.isArray(providers)) {
      return providers.includes(providerType);
    }

    return Object.values((providers === null || providers === void 0 ? void 0 : providers[providerType]) || {}).some(provider => (provider === null || provider === void 0 ? void 0 : provider.enabled) !== false);
  };

  if (hasProviderType('basic') && hasProviderType('token')) {
    log('Enabling both `basic` and `token` authentication providers in `xpack.security.authc.providers` is deprecated. Login page will only use `token` provider.');
  }

  return settings;
}, (settings, fromPath, log) => {
  var _settings$xpack$secur3, _settings$xpack3, _settings$xpack3$secu, _settings$xpack3$secu2, _settings$xpack3$secu3;

  const samlProviders = (_settings$xpack$secur3 = settings === null || settings === void 0 ? void 0 : (_settings$xpack3 = settings.xpack) === null || _settings$xpack3 === void 0 ? void 0 : (_settings$xpack3$secu = _settings$xpack3.security) === null || _settings$xpack3$secu === void 0 ? void 0 : (_settings$xpack3$secu2 = _settings$xpack3$secu.authc) === null || _settings$xpack3$secu2 === void 0 ? void 0 : (_settings$xpack3$secu3 = _settings$xpack3$secu2.providers) === null || _settings$xpack3$secu3 === void 0 ? void 0 : _settings$xpack3$secu3.saml) !== null && _settings$xpack$secur3 !== void 0 ? _settings$xpack$secur3 : {};

  if (Object.values(samlProviders).find(provider => !!provider.maxRedirectURLSize)) {
    log('`xpack.security.authc.providers.saml.<provider-name>.maxRedirectURLSize` is deprecated and is no longer used');
  }

  return settings;
}, (settings, fromPath, log) => {
  var _settings$xpack4, _settings$xpack4$secu;

  if ((settings === null || settings === void 0 ? void 0 : (_settings$xpack4 = settings.xpack) === null || _settings$xpack4 === void 0 ? void 0 : (_settings$xpack4$secu = _settings$xpack4.security) === null || _settings$xpack4$secu === void 0 ? void 0 : _settings$xpack4$secu.enabled) === false) {
    log('Disabling the security plugin (`xpack.security.enabled`) will not be supported in the next major version (8.0). ' + 'To turn off security features, disable them in Elasticsearch instead.');
  }

  return settings;
}];

exports.securityConfigDeprecationProvider = securityConfigDeprecationProvider;