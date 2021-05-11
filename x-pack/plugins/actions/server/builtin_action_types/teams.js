"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionType = getActionType;
exports.ActionTypeId = void 0;

var _url = require("url");

var _lodash = require("lodash");

var _axios = _interopRequireDefault(require("axios"));

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _pipeable = require("fp-ts/lib/pipeable");

var _Option = require("fp-ts/lib/Option");

var _http_rersponse_retry_header = require("./lib/http_rersponse_retry_header");

var _result_type = require("./lib/result_type");

var _axios_utils = require("./lib/axios_utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const secretsSchemaProps = {
  webhookUrl: _configSchema.schema.string()
};

const SecretsSchema = _configSchema.schema.object(secretsSchemaProps); // params definition


const ParamsSchema = _configSchema.schema.object({
  message: _configSchema.schema.string({
    minLength: 1
  })
});

const ActionTypeId = '.teams'; // action type definition

exports.ActionTypeId = ActionTypeId;

function getActionType({
  logger,
  configurationUtilities
}) {
  return {
    id: ActionTypeId,
    minimumLicenseRequired: 'gold',
    name: _i18n.i18n.translate('xpack.actions.builtin.teamsTitle', {
      defaultMessage: 'Microsoft Teams'
    }),
    validate: {
      secrets: _configSchema.schema.object(secretsSchemaProps, {
        validate: (0, _lodash.curry)(validateActionTypeConfig)(configurationUtilities)
      }),
      params: ParamsSchema
    },
    executor: (0, _lodash.curry)(teamsExecutor)({
      logger,
      configurationUtilities
    })
  };
}

function validateActionTypeConfig(configurationUtilities, secretsObject) {
  const configuredUrl = secretsObject.webhookUrl;

  try {
    new _url.URL(configuredUrl);
  } catch (err) {
    return _i18n.i18n.translate('xpack.actions.builtin.teams.teamsConfigurationErrorNoHostname', {
      defaultMessage: 'error configuring teams action: unable to parse host name from webhookUrl'
    });
  }

  try {
    configurationUtilities.ensureUriAllowed(configuredUrl);
  } catch (allowListError) {
    return _i18n.i18n.translate('xpack.actions.builtin.teams.teamsConfigurationError', {
      defaultMessage: 'error configuring teams action: {message}',
      values: {
        message: allowListError.message
      }
    });
  }
} // action executor


async function teamsExecutor({
  logger,
  configurationUtilities
}, execOptions) {
  const actionId = execOptions.actionId;
  const secrets = execOptions.secrets;
  const params = execOptions.params;
  const {
    webhookUrl
  } = secrets;
  const {
    message
  } = params;
  const data = {
    text: message
  };

  const axiosInstance = _axios.default.create();

  const result = await (0, _result_type.promiseResult)((0, _axios_utils.request)({
    axios: axiosInstance,
    method: 'post',
    url: webhookUrl,
    logger,
    data,
    configurationUtilities
  }));

  if ((0, _result_type.isOk)(result)) {
    const {
      value: {
        status,
        statusText,
        data: responseData,
        headers: responseHeaders
      }
    } = result; // Microsoft Teams connectors do not throw 429s. Rather they will return a 200 response
    // with a 429 message in the response body when the rate limit is hit
    // https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using#rate-limiting-for-connectors

    if ((0, _lodash.isString)(responseData) && responseData.includes('ErrorCode:ApplicationThrottled')) {
      return (0, _pipeable.pipe)((0, _http_rersponse_retry_header.getRetryAfterIntervalFromHeaders)(responseHeaders), (0, _Option.map)(retry => retryResultSeconds(actionId, message, retry)), (0, _Option.getOrElse)(() => retryResult(actionId, message)));
    }

    logger.debug(`response from teams action "${actionId}": [HTTP ${status}] ${statusText}`);
    return successResult(actionId, data);
  } else {
    const {
      error
    } = result;

    if (error.response) {
      const {
        status,
        statusText
      } = error.response;
      const serviceMessage = `[${status}] ${statusText}`;
      logger.error(`error on ${actionId} Microsoft Teams event: ${serviceMessage}`); // special handling for 5xx

      if (status >= 500) {
        return retryResult(actionId, serviceMessage);
      }

      return errorResultInvalid(actionId, serviceMessage);
    }

    logger.debug(`error on ${actionId} Microsoft Teams action: unexpected error`);
    return errorResultUnexpectedError(actionId);
  }
}

function successResult(actionId, data) {
  return {
    status: 'ok',
    data,
    actionId
  };
}

function errorResultUnexpectedError(actionId) {
  const errMessage = _i18n.i18n.translate('xpack.actions.builtin.teams.unreachableErrorMessage', {
    defaultMessage: 'error posting to Microsoft Teams, unexpected error'
  });

  return {
    status: 'error',
    message: errMessage,
    actionId
  };
}

function errorResultInvalid(actionId, serviceMessage) {
  const errMessage = _i18n.i18n.translate('xpack.actions.builtin.teams.invalidResponseErrorMessage', {
    defaultMessage: 'error posting to Microsoft Teams, invalid response'
  });

  return {
    status: 'error',
    message: errMessage,
    actionId,
    serviceMessage
  };
}

function retryResult(actionId, message) {
  const errMessage = _i18n.i18n.translate('xpack.actions.builtin.teams.errorPostingRetryLaterErrorMessage', {
    defaultMessage: 'error posting a Microsoft Teams message, retry later'
  });

  return {
    status: 'error',
    message: errMessage,
    retry: true,
    actionId
  };
}

function retryResultSeconds(actionId, message, retryAfter) {
  const retryEpoch = Date.now() + retryAfter * 1000;
  const retry = new Date(retryEpoch);
  const retryString = retry.toISOString();

  const errMessage = _i18n.i18n.translate('xpack.actions.builtin.teams.errorPostingRetryDateErrorMessage', {
    defaultMessage: 'error posting a Microsoft Teams message, retry at {retryString}',
    values: {
      retryString
    }
  });

  return {
    status: 'error',
    message: errMessage,
    retry,
    actionId,
    serviceMessage: message
  };
}