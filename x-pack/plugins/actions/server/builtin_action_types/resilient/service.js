"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExternalService = exports.formatUpdateRequest = exports.getValueTextContent = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _fp = require("lodash/fp");

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


const VIEW_INCIDENT_URL = `#incidents`;

const getValueTextContent = (field, value) => {
  if (field === 'description') {
    return {
      textarea: {
        format: 'html',
        content: value
      }
    };
  }

  if (field === 'incidentTypes') {
    return {
      ids: value
    };
  }

  if (field === 'severityCode') {
    return {
      id: value
    };
  }

  return {
    text: value
  };
};

exports.getValueTextContent = getValueTextContent;

const formatUpdateRequest = ({
  oldIncident,
  newIncident
}) => {
  return {
    changes: Object.keys(newIncident).map(key => {
      let name = key;

      if (key === 'incidentTypes') {
        name = 'incident_type_ids';
      }

      if (key === 'severityCode') {
        name = 'severity_code';
      }

      return {
        field: {
          name
        },
        // TODO: Fix ugly casting
        old_value: getValueTextContent(key, oldIncident[name]),
        new_value: getValueTextContent(key, newIncident[key])
      };
    })
  };
};

exports.formatUpdateRequest = formatUpdateRequest;

const createExternalService = ({
  config,
  secrets
}, logger, configurationUtilities) => {
  const {
    apiUrl: url,
    orgId
  } = config;
  const {
    apiKeyId,
    apiKeySecret
  } = secrets;

  if (!url || !orgId || !apiKeyId || !apiKeySecret) {
    throw Error(`[Action]${i18n.NAME}: Wrong configuration.`);
  }

  const urlWithoutTrailingSlash = url.endsWith('/') ? url.slice(0, -1) : url;
  const orgUrl = `${urlWithoutTrailingSlash}/rest/orgs/${orgId}`;
  const incidentUrl = `${orgUrl}/incidents`;
  const commentUrl = `${incidentUrl}/{inc_id}/comments`;
  const incidentFieldsUrl = `${orgUrl}/types/incident/fields`;
  const incidentTypesUrl = `${incidentFieldsUrl}/incident_type_ids`;
  const severityUrl = `${incidentFieldsUrl}/severity_code`;

  const axiosInstance = _axios.default.create({
    auth: {
      username: apiKeyId,
      password: apiKeySecret
    }
  });

  const getIncidentViewURL = key => {
    return `${urlWithoutTrailingSlash}/${VIEW_INCIDENT_URL}/${key}`;
  };

  const getCommentsURL = incidentId => {
    return commentUrl.replace('{inc_id}', incidentId);
  };

  const getIncident = async id => {
    try {
      var _res$data$description, _res$data$description2;

      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: `${incidentUrl}/${id}`,
        logger,
        params: {
          text_content_output_format: 'objects_convert'
        },
        configurationUtilities
      });
      return { ...res.data,
        description: (_res$data$description = (_res$data$description2 = res.data.description) === null || _res$data$description2 === void 0 ? void 0 : _res$data$description2.content) !== null && _res$data$description !== void 0 ? _res$data$description : ''
      };
    } catch (error) {
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to get incident with id ${id}. Error: ${error.message}.`));
    }
  };

  const createIncident = async ({
    incident
  }) => {
    let data = {
      name: incident.name,
      discovered_date: Date.now()
    };

    if (incident.description) {
      var _incident$description;

      data = { ...data,
        description: {
          format: 'html',
          content: (_incident$description = incident.description) !== null && _incident$description !== void 0 ? _incident$description : ''
        }
      };
    }

    if (incident.incidentTypes) {
      data = { ...data,
        incident_type_ids: incident.incidentTypes.map(id => ({
          id
        }))
      };
    }

    if (incident.severityCode) {
      data = { ...data,
        severity_code: {
          id: incident.severityCode
        }
      };
    }

    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: `${incidentUrl}?text_content_output_format=objects_convert`,
        method: 'post',
        logger,
        data,
        configurationUtilities
      });
      return {
        title: `${res.data.id}`,
        id: `${res.data.id}`,
        pushedDate: new Date(res.data.create_date).toISOString(),
        url: getIncidentViewURL(res.data.id)
      };
    } catch (error) {
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to create incident. Error: ${error.message}.`));
    }
  };

  const updateIncident = async ({
    incidentId,
    incident
  }) => {
    try {
      const latestIncident = await getIncident(incidentId); // Remove null or undefined values. Allowing null values sets the field in IBM Resilient to empty.

      const newIncident = (0, _fp.omitBy)(_fp.isNil, incident);
      const data = formatUpdateRequest({
        oldIncident: latestIncident,
        newIncident
      });
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        method: 'patch',
        url: `${incidentUrl}/${incidentId}`,
        logger,
        data,
        configurationUtilities
      });

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      const updatedIncident = await getIncident(incidentId);
      return {
        title: `${updatedIncident.id}`,
        id: `${updatedIncident.id}`,
        pushedDate: new Date(updatedIncident.inc_last_modified_date).toISOString(),
        url: getIncidentViewURL(updatedIncident.id)
      };
    } catch (error) {
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to update incident with id ${incidentId}. Error: ${error.message}`));
    }
  };

  const createComment = async ({
    incidentId,
    comment
  }) => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        method: 'post',
        url: getCommentsURL(incidentId),
        logger,
        data: {
          text: {
            format: 'text',
            content: comment.comment
          }
        },
        configurationUtilities
      });
      return {
        commentId: comment.commentId,
        externalCommentId: res.data.id,
        pushedDate: new Date(res.data.create_date).toISOString()
      };
    } catch (error) {
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to create comment at incident with id ${incidentId}. Error: ${error.message}.`));
    }
  };

  const getIncidentTypes = async () => {
    try {
      var _res$data$values, _res$data;

      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        method: 'get',
        url: incidentTypesUrl,
        logger,
        configurationUtilities
      });
      const incidentTypes = (_res$data$values = (_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.values) !== null && _res$data$values !== void 0 ? _res$data$values : [];
      return incidentTypes.map(type => ({
        id: type.value,
        name: type.label
      }));
    } catch (error) {
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to get incident types. Error: ${error.message}.`));
    }
  };

  const getSeverity = async () => {
    try {
      var _res$data$values2, _res$data2;

      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        method: 'get',
        url: severityUrl,
        logger,
        configurationUtilities
      });
      const incidentTypes = (_res$data$values2 = (_res$data2 = res.data) === null || _res$data2 === void 0 ? void 0 : _res$data2.values) !== null && _res$data$values2 !== void 0 ? _res$data$values2 : [];
      return incidentTypes.map(type => ({
        id: type.value,
        name: type.label
      }));
    } catch (error) {
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to get severity. Error: ${error.message}.`));
    }
  };

  const getFields = async () => {
    try {
      var _res$data3;

      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: incidentFieldsUrl,
        logger,
        configurationUtilities
      });
      return (_res$data3 = res.data) !== null && _res$data3 !== void 0 ? _res$data3 : [];
    } catch (error) {
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to get fields. Error: ${error.message}.`));
    }
  };

  return {
    createComment,
    createIncident,
    getFields,
    getIncident,
    getIncidentTypes,
    getSeverity,
    updateIncident
  };
};

exports.createExternalService = createExternalService;