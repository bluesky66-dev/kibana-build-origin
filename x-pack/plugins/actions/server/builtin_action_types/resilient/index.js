"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionType = getActionType;
exports.ActionTypeId = void 0;

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _validators = require("./validators");

var _schema = require("./schema");

var _service = require("./service");

var _api = require("./api");

var i18n = _interopRequireWildcard(require("./translations"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const supportedSubActions = ['getFields', 'pushToService', 'incidentTypes', 'severity'];
const ActionTypeId = '.resilient'; // action type definition

exports.ActionTypeId = ActionTypeId;

function getActionType(params) {
  const {
    logger,
    configurationUtilities
  } = params;
  return {
    id: ActionTypeId,
    minimumLicenseRequired: 'platinum',
    name: i18n.NAME,
    validate: {
      config: _configSchema.schema.object(_schema.ExternalIncidentServiceConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.config)(configurationUtilities)
      }),
      secrets: _configSchema.schema.object(_schema.ExternalIncidentServiceSecretConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.secrets)(configurationUtilities)
      }),
      params: _schema.ExecutorParamsSchema
    },
    executor: (0, _lodash.curry)(executor)({
      logger,
      configurationUtilities
    })
  };
} // action executor


async function executor({
  logger,
  configurationUtilities
}, execOptions) {
  var _data;

  const {
    actionId,
    config,
    params,
    secrets
  } = execOptions;
  const {
    subAction,
    subActionParams
  } = params;
  let data = null;
  const externalService = (0, _service.createExternalService)({
    config,
    secrets
  }, logger, configurationUtilities);

  if (!_api.api[subAction]) {
    const errorMessage = `[Action][ExternalService] Unsupported subAction type ${subAction}.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (!supportedSubActions.includes(subAction)) {
    const errorMessage = `[Action][ExternalService] subAction ${subAction} not implemented.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (subAction === 'pushToService') {
    const pushToServiceParams = subActionParams;
    data = await _api.api.pushToService({
      externalService,
      params: pushToServiceParams,
      logger
    });
    logger.debug(`response push to service for incident id: ${data.id}`);
  }

  if (subAction === 'getFields') {
    const getFieldsParams = subActionParams;
    data = await _api.api.getFields({
      externalService,
      params: getFieldsParams
    });
  }

  if (subAction === 'incidentTypes') {
    const incidentTypesParams = subActionParams;
    data = await _api.api.incidentTypes({
      externalService,
      params: incidentTypesParams
    });
  }

  if (subAction === 'severity') {
    const severityParams = subActionParams;
    data = await _api.api.severity({
      externalService,
      params: severityParams
    });
  }

  return {
    status: 'ok',
    data: (_data = data) !== null && _data !== void 0 ? _data : {},
    actionId
  };
}