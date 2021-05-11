"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFields = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _utils = require("./utils");

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


const getFields = async ({
  actionsClient,
  connectorType,
  connectorId
}) => {
  const results = await actionsClient.execute({
    actionId: connectorId,
    params: {
      subAction: 'getFields',
      subActionParams: {}
    }
  });

  if (results.status === 'error') {
    throw _boom.default.failedDependency(results.serviceMessage);
  }

  const fields = (0, _utils.formatFields)(results.data, connectorType);
  return {
    fields,
    defaultMappings: (0, _utils.createDefaultMapping)(fields, connectorType)
  };
};

exports.getFields = getFields;