"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExternalService = void 0;

var _axios = _interopRequireDefault(require("axios"));

var i18n = _interopRequireWildcard(require("./translations"));

var _axios_utils = require("../lib/axios_utils");

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


const API_VERSION = 'v2';
const SYS_DICTIONARY = `api/now/${API_VERSION}/table/sys_dictionary`;

const createExternalService = (table, {
  config,
  secrets
}, logger, configurationUtilities) => {
  const {
    apiUrl: url
  } = config;
  const {
    username,
    password
  } = secrets;

  if (!url || !username || !password) {
    throw Error(`[Action]${i18n.SERVICENOW}: Wrong configuration.`);
  }

  const urlWithoutTrailingSlash = url.endsWith('/') ? url.slice(0, -1) : url;
  const incidentUrl = `${urlWithoutTrailingSlash}/api/now/${API_VERSION}/table/${table}`;
  const fieldsUrl = `${urlWithoutTrailingSlash}/${SYS_DICTIONARY}?sysparm_query=name=task^ORname=${table}^internal_type=string&active=true&array=false&read_only=false&sysparm_fields=max_length,element,column_label,mandatory`;
  const choicesUrl = `${urlWithoutTrailingSlash}/api/now/${API_VERSION}/table/sys_choice`;

  const axiosInstance = _axios.default.create({
    auth: {
      username,
      password
    }
  });

  const getIncidentViewURL = id => {
    // Based on: https://docs.servicenow.com/bundle/orlando-platform-user-interface/page/use/navigation/reference/r_NavigatingByURLExamples.html
    return `${urlWithoutTrailingSlash}/nav_to.do?uri=${table}.do?sys_id=${id}`;
  };

  const getChoicesURL = fields => {
    const elements = fields.slice(1).reduce((acc, field) => `${acc}^ORelement=${field}`, `element=${fields[0]}`);
    return `${choicesUrl}?sysparm_query=name=task^ORname=${table}^${elements}&sysparm_fields=label,value,dependent_value,element`;
  };

  const checkInstance = res => {
    if (res.status === 200 && res.data.result == null) {
      var _res$request$connecti, _res$request, _res$request$connecti2;

      throw new Error(`There is an issue with your Service Now Instance. Please check ${(_res$request$connecti = (_res$request = res.request) === null || _res$request === void 0 ? void 0 : (_res$request$connecti2 = _res$request.connection) === null || _res$request$connecti2 === void 0 ? void 0 : _res$request$connecti2.servername) !== null && _res$request$connecti !== void 0 ? _res$request$connecti : ''}.`);
    }
  };

  const createErrorMessage = errorResponse => {
    if (errorResponse == null) {
      return '';
    }

    const {
      error
    } = errorResponse;
    return error != null ? `${error === null || error === void 0 ? void 0 : error.message}: ${error === null || error === void 0 ? void 0 : error.detail}` : '';
  };

  const getIncident = async id => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: `${incidentUrl}/${id}`,
        logger,
        configurationUtilities
      });
      checkInstance(res);
      return { ...res.data.result
      };
    } catch (error) {
      var _error$response;

      throw new Error((0, _axios_utils.getErrorMessage)(i18n.SERVICENOW, `Unable to get incident with id ${id}. Error: ${error.message} Reason: ${createErrorMessage((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.data)}`));
    }
  };

  const findIncidents = async params => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: incidentUrl,
        logger,
        params,
        configurationUtilities
      });
      checkInstance(res);
      return res.data.result.length > 0 ? { ...res.data.result
      } : undefined;
    } catch (error) {
      var _error$response2;

      throw new Error((0, _axios_utils.getErrorMessage)(i18n.SERVICENOW, `Unable to find incidents by query. Error: ${error.message} Reason: ${createErrorMessage((_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.data)}`));
    }
  };

  const createIncident = async ({
    incident
  }) => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: `${incidentUrl}`,
        logger,
        method: 'post',
        data: { ...incident
        },
        configurationUtilities
      });
      checkInstance(res);
      return {
        title: res.data.result.number,
        id: res.data.result.sys_id,
        pushedDate: new Date((0, _axios_utils.addTimeZoneToDate)(res.data.result.sys_created_on)).toISOString(),
        url: getIncidentViewURL(res.data.result.sys_id)
      };
    } catch (error) {
      var _error$response3;

      throw new Error((0, _axios_utils.getErrorMessage)(i18n.SERVICENOW, `Unable to create incident. Error: ${error.message} Reason: ${createErrorMessage((_error$response3 = error.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.data)}`));
    }
  };

  const updateIncident = async ({
    incidentId,
    incident
  }) => {
    try {
      const res = await (0, _axios_utils.patch)({
        axios: axiosInstance,
        url: `${incidentUrl}/${incidentId}`,
        logger,
        data: { ...incident
        },
        configurationUtilities
      });
      checkInstance(res);
      return {
        title: res.data.result.number,
        id: res.data.result.sys_id,
        pushedDate: new Date((0, _axios_utils.addTimeZoneToDate)(res.data.result.sys_updated_on)).toISOString(),
        url: getIncidentViewURL(res.data.result.sys_id)
      };
    } catch (error) {
      var _error$response4;

      throw new Error((0, _axios_utils.getErrorMessage)(i18n.SERVICENOW, `Unable to update incident with id ${incidentId}. Error: ${error.message} Reason: ${createErrorMessage((_error$response4 = error.response) === null || _error$response4 === void 0 ? void 0 : _error$response4.data)}`));
    }
  };

  const getFields = async () => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: fieldsUrl,
        logger,
        configurationUtilities
      });
      checkInstance(res);
      return res.data.result.length > 0 ? res.data.result : [];
    } catch (error) {
      var _error$response5;

      throw new Error((0, _axios_utils.getErrorMessage)(i18n.SERVICENOW, `Unable to get fields. Error: ${error.message} Reason: ${createErrorMessage((_error$response5 = error.response) === null || _error$response5 === void 0 ? void 0 : _error$response5.data)}`));
    }
  };

  const getChoices = async fields => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: getChoicesURL(fields),
        logger,
        configurationUtilities
      });
      checkInstance(res);
      return res.data.result;
    } catch (error) {
      var _error$response6;

      throw new Error((0, _axios_utils.getErrorMessage)(i18n.SERVICENOW, `Unable to get choices. Error: ${error.message} Reason: ${createErrorMessage((_error$response6 = error.response) === null || _error$response6 === void 0 ? void 0 : _error$response6.data)}`));
    }
  };

  return {
    createIncident,
    findIncidents,
    getFields,
    getIncident,
    updateIncident,
    getChoices
  };
};

exports.createExternalService = createExternalService;