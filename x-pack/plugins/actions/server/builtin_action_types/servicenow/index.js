"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceNowITSMActionType = getServiceNowITSMActionType;
exports.getServiceNowSIRActionType = getServiceNowSIRActionType;
exports.ServiceNowSIRActionTypeId = exports.ServiceNowITSMActionTypeId = void 0;

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


const serviceNowITSMTable = 'incident';
const serviceNowSIRTable = 'sn_si_incident';
const ServiceNowITSMActionTypeId = '.servicenow';
exports.ServiceNowITSMActionTypeId = ServiceNowITSMActionTypeId;
const ServiceNowSIRActionTypeId = '.servicenow-sir';
exports.ServiceNowSIRActionTypeId = ServiceNowSIRActionTypeId; // action type definition

function getServiceNowITSMActionType(params) {
  const {
    logger,
    configurationUtilities
  } = params;
  return {
    id: ServiceNowITSMActionTypeId,
    minimumLicenseRequired: 'platinum',
    name: i18n.SERVICENOW_ITSM,
    validate: {
      config: _configSchema.schema.object(_schema.ExternalIncidentServiceConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.config)(configurationUtilities)
      }),
      secrets: _configSchema.schema.object(_schema.ExternalIncidentServiceSecretConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.secrets)(configurationUtilities)
      }),
      params: _schema.ExecutorParamsSchemaITSM
    },
    executor: (0, _lodash.curry)(executor)({
      logger,
      configurationUtilities,
      table: serviceNowITSMTable,
      commentFieldKey: 'work_notes'
    })
  };
}

function getServiceNowSIRActionType(params) {
  const {
    logger,
    configurationUtilities
  } = params;
  return {
    id: ServiceNowSIRActionTypeId,
    minimumLicenseRequired: 'platinum',
    name: i18n.SERVICENOW_SIR,
    validate: {
      config: _configSchema.schema.object(_schema.ExternalIncidentServiceConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.config)(configurationUtilities)
      }),
      secrets: _configSchema.schema.object(_schema.ExternalIncidentServiceSecretConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.secrets)(configurationUtilities)
      }),
      params: _schema.ExecutorParamsSchemaSIR
    },
    executor: (0, _lodash.curry)(executor)({
      logger,
      configurationUtilities,
      table: serviceNowSIRTable,
      commentFieldKey: 'work_notes'
    })
  };
} // action executor


const supportedSubActions = ['getFields', 'pushToService', 'getChoices', 'getIncident'];

async function executor({
  logger,
  configurationUtilities,
  table,
  commentFieldKey = 'comments'
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
  const externalService = (0, _service.createExternalService)(table, {
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
      secrets,
      logger,
      commentFieldKey
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

  if (subAction === 'getChoices') {
    const getChoicesParams = subActionParams;
    data = await _api.api.getChoices({
      externalService,
      params: getChoicesParams
    });
  }

  return {
    status: 'ok',
    data: (_data = data) !== null && _data !== void 0 ? _data : {},
    actionId
  };
}