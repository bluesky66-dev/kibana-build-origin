"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isApiKeyDisabledError = isApiKeyDisabledError;
exports.isSecurityPluginDisabledError = isSecurityPluginDisabledError;
exports.handleDisabledApiKeysError = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const handleDisabledApiKeysError = handler => {
  return async (context, request, response) => {
    try {
      return await handler(context, request, response);
    } catch (e) {
      if (isApiKeyDisabledError(e)) {
        return response.badRequest({
          body: new Error(_i18n.i18n.translate('xpack.alerts.api.error.disabledApiKeys', {
            defaultMessage: 'Alerting relies upon API keys which appear to be disabled'
          }))
        });
      }

      throw e;
    }
  };
};

exports.handleDisabledApiKeysError = handleDisabledApiKeysError;

function isApiKeyDisabledError(e) {
  var _e$message$includes, _e$message;

  return (_e$message$includes = e === null || e === void 0 ? void 0 : (_e$message = e.message) === null || _e$message === void 0 ? void 0 : _e$message.includes('api keys are not enabled')) !== null && _e$message$includes !== void 0 ? _e$message$includes : false;
}

function isSecurityPluginDisabledError(e) {
  var _e$message$includes2, _e$message2;

  return (_e$message$includes2 = e === null || e === void 0 ? void 0 : (_e$message2 = e.message) === null || _e$message2 === void 0 ? void 0 : _e$message2.includes('no handler found')) !== null && _e$message$includes2 !== void 0 ? _e$message$includes2 : false;
}